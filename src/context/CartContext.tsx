'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { CartItem as ServerCartItem } from '@/types/cartItem';
import { useAuth } from './AuthContext';
import { cartService } from '@/services/cart.service';
import toast from 'react-hot-toast';

interface CartItemClient {
  product: Product;
  quantity: number;
  selectedSize: number;
}

interface CartItemServer {
  _id: string;
  cartId: string;
  product: Product;
  quantity: number;
  size: number;
}

interface CartContextType {
  items: CartItemClient[];
  addToCart: (product: Product, quantity: number, size: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  loadUserCart: (userId: string) => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemClient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  // Load user's cart when they log in
  useEffect(() => {
    if (user?.id) {
      loadUserCart(user.id);
    }
  }, [user]);

  const loadUserCart = async (userId: string) => {
    setIsLoading(true);
    try {
      const data = await cartService.getUserCart(userId);
      if (data && typeof data === 'object' && Array.isArray((data as any).items)) {
        setItems((data as { items: CartItemServer[] }).items.map((item: CartItemServer) => ({
          product: item.product,
          quantity: item.quantity,
          selectedSize: item.size
        })));
      } else {
        setItems([]);
        toast.error('Invalid cart data received');
      }
    } catch (error) {
      console.error('Error loading user cart:', error);
      toast.error('Failed to load your cart');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number, size: number) => {
    try {
      const loadingToast = toast.loading('Adding to cart...');
      await cartService.addToCart(product._id, quantity, size);
      
      // Update local state
      const updatedItems = [...items];
      const existingItemIndex = items.findIndex(
        item => item.product._id === product._id && item.selectedSize === size
      );

      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        updatedItems.push({ product, quantity, selectedSize: size });
      }
      setItems(updatedItems);

      toast.success('Added to cart!', { id: loadingToast });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const loadingToast = toast.loading('Removing from cart...');
      await cartService.removeFromCart(productId);
      
      // Update local state
      const updatedItems = items.filter(item => item.product._id !== productId);
      setItems(updatedItems);

      toast.success('Removed from cart!', { id: loadingToast });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      const loadingToast = toast.loading('Updating cart...');
      await cartService.updateCartItem(productId, quantity);
      
      // Update local state
      const updatedItems = items.map(item =>
        item.product._id === productId ? { ...item, quantity } : item
      );
      setItems(updatedItems);

      toast.success('Cart updated!', { id: loadingToast });
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  };

  const clearCart = async () => {
    try {
      const loadingToast = toast.loading('Clearing cart...');
      await cartService.clearCart();
      setItems([]);
      toast.success('Cart cleared!', { id: loadingToast });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loadUserCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

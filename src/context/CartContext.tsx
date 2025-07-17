'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { Product } from '@/types/product';
import { Cart } from '@/types/cartItem';
import { useAuth } from './AuthContext';
import { cartService } from '@/services/cart.service';

interface CartContextType {
  cart: Cart | null;
  addToCart: (product: Product, quantity: number, size: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);

  const loadUserCart = async () => {
    try {
      if (!user) {
        setCart(null);
        return;
      }
      const userCart = await cartService.getUserCart();
      setCart(userCart);
    } catch (error) {
      console.error('Error loading user cart:', error);
      toast.error('Failed to load cart');
    }
  };

  useEffect(() => {
    loadUserCart();
  }, [user]);

  const addToCart = async (product: Product, quantity: number, size: number) => {
    try {
      if (!user) {
        toast.error('Please login to add items to cart');
        return;
      }

      const loadingToast = toast.loading('Adding to cart...');
      
      await cartService.addToCart({
        productId: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        size,
        quantity,
      });
      
      await loadUserCart();
      toast.success('Added to cart!', { id: loadingToast });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      if (!user) {
        toast.error('Please login to manage cart');
        return;
      }

      const loadingToast = toast.loading('Removing from cart...');
      await cartService.removeFromCart(productId);
      await loadUserCart();
      toast.success('Removed from cart!', { id: loadingToast });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (!user) {
        toast.error('Please login to manage cart');
        return;
      }

      if (quantity < 1) return;

      const loadingToast = toast.loading('Updating cart...');
      await cartService.updateCartItem(productId, { quantity });
      await loadUserCart();
      toast.success('Cart updated!', { id: loadingToast });
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  };

  const clearCart = async () => {
    try {
      if (!user) {
        toast.error('Please login to manage cart');
        return;
      }

      const loadingToast = toast.loading('Clearing cart...');
      await cartService.clearCart();
      await loadUserCart();
      toast.success('Cart cleared!', { id: loadingToast });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart, 
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

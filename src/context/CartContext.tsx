'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { Product } from '@/types/product';
import { Cart } from '@/types/cartItem';
import { useAuth } from './AuthContext';
import { cartService } from '@/services/cart.service';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (product: Product, quantity: number, size: number) => Promise<boolean | undefined>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  restoreCartItem: (productId: string) => Promise<void>;
  getCartItemCount: () => Promise<number>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadUserCart = async () => {
    try {
      setIsLoading(true);
      if (!user) {
        setCart(null);
        return;
      }
      const userCart = await cartService.getUserCart();
      setCart(userCart);
    } catch (error) {
      console.error('Error loading user cart:', error);
      toast.error('Không thể tải giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserCart();
  }, [user]);

  const addToCart = async (product: Product, quantity: number, size: number) => {
    try {
      if (!user) {
        toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        return;
      }

      const loadingToast = toast.loading('Đang thêm vào giỏ hàng...');
      
      console.log('Adding to cart with data:', {
        productId: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        size,
        quantity,
      });
      
      await cartService.addToCart({
        productId: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        size,
        quantity,
      });
      
      await loadUserCart();
      toast.success('Đã thêm vào giỏ hàng!', { id: loadingToast });
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.');
      return false;
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
        toast.error('Vui lòng đăng nhập để quản lý giỏ hàng');
        return;
      }

      const loadingToast = toast.loading('Đang xóa giỏ hàng...');
      await cartService.clearCart();
      await loadUserCart();
      toast.success('Đã xóa toàn bộ giỏ hàng!', { id: loadingToast });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Không thể xóa giỏ hàng');
    }
  };

  const restoreCartItem = async (productId: string) => {
    try {
      if (!user) {
        toast.error('Vui lòng đăng nhập để quản lý giỏ hàng');
        return;
      }

      const loadingToast = toast.loading('Đang khôi phục sản phẩm...');
      await cartService.restoreCartItem(productId);
      await loadUserCart();
      toast.success('Đã khôi phục sản phẩm!', { id: loadingToast });
    } catch (error) {
      console.error('Error restoring cart item:', error);
      toast.error('Không thể khôi phục sản phẩm');
    }
  };

  const getCartItemCount = async (): Promise<number> => {
    try {
      if (!user) return 0;
      
      const response = await cartService.getCartItemCount();
      return response.count;
    } catch (error) {
      console.error('Error getting cart item count:', error);
      return 0;
    }
  };

  const value: CartContextType = {
    cart,
    isLoading,
    addToCart,
    removeFromCart, 
    updateQuantity,
    clearCart,
    restoreCartItem,
    getCartItemCount
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

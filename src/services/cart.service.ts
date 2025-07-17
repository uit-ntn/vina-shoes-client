import { api } from '@/lib/api/http';
import { CART } from '@/lib/api/endpoints';
import { Cart, AddCartItemDto, UpdateCartItemDto, CartItemCountResponse } from '@/types/cartItem';
import { AxiosError } from 'axios';

export const cartService = {
  getUserCart: async (): Promise<Cart> => {
    try {
      const response = await api.get<Cart>(CART.GET);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch cart');
      }
      throw error;
    }
  },

  addToCart: async (data: AddCartItemDto): Promise<Cart> => {
    try {
      const response = await api.post<Cart>(CART.ADD, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to add item to cart');
      }
      throw error;
    }
  },

  updateCartItem: async (productId: string, data: UpdateCartItemDto): Promise<Cart> => {
    try {
      const response = await api.put<Cart>(`${CART.UPDATE}/${productId}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update cart item');
      }
      throw error;
    }
  },

  removeFromCart: async (productId: string): Promise<void> => {
    try {
      await api.delete(`${CART.REMOVE}/${productId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
      }
      throw error;
    }
  },

  clearCart: async (): Promise<void> => {
    try {
      await api.delete(CART.CLEAR);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to clear cart');
      }
      throw error;
    }
  },

  getCartItemCount: async (): Promise<number> => {
    try {
      const response = await api.get<CartItemCountResponse>(CART.COUNT);
      return response.data.count;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to get cart count');
      }
      throw error;
    }
  }
};

export default cartService;

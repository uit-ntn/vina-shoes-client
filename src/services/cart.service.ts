import { api } from '@/lib/api/http';
import { CART } from '@/lib/api/endpoints';
import { CartItem } from '@/types/cartItem';
import { AxiosError } from 'axios';

export const cartService = {
  getUserCart: async (userId: string) => {
    try {
      const response = await api.get(CART.GET);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch cart');
      }
      throw error;
    }
  },

  addToCart: async (productId: string, quantity: number, size: number) => {
    try {
      const response = await api.post(CART.ADD, { productId, quantity, size });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to add item to cart');
      }
      throw error;
    }
  },

  updateCartItem: async (cartItemId: string, quantity: number) => {
    try {
      const response = await api.put(CART.UPDATE, { cartItemId, quantity });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update cart item');
      }
      throw error;
    }
  },

  removeFromCart: async (cartItemId: string) => {
    try {
      await api.delete(`${CART.REMOVE}/${cartItemId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
      }
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await api.delete(CART.CLEAR);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to clear cart');
      }
      throw error;
    }
  }
};

export default cartService;

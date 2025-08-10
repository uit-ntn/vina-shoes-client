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
        throw new Error(error.response?.data?.message || 'Không thể tải giỏ hàng');
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
        throw new Error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
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
        throw new Error(error.response?.data?.message || 'Không thể cập nhật giỏ hàng');
      }
      throw error;
    }
  },

  removeFromCart: async (productId: string): Promise<void> => {
    try {
      await api.delete(`${CART.REMOVE}/${productId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Không thể xóa sản phẩm');
      }
      throw error;
    }
  },

  clearCart: async (): Promise<void> => {
    try {
      await api.delete(CART.CLEAR);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Không thể xóa giỏ hàng');
      }
      throw error;
    }
  },

  getCartItemCount: async (): Promise<{ count: number }> => {
    try {
      const response = await api.get<CartItemCountResponse>(CART.COUNT);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Không thể lấy số lượng sản phẩm');
      }
      throw error;
    }
  },

  restoreCartItem: async (productId: string): Promise<void> => {
    try {
      await api.post(`${CART.RESTORE}/${productId}/restore`);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Không thể khôi phục sản phẩm');
      }
      throw error;
    }
  }
};

export default cartService;

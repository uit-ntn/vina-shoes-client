import { api } from "@/lib/api/http";
import { Product } from "@/types/product";
import { WISHLIST } from "@/lib/api/endpoints";

export interface WishlistItem {
  productId: string;
  addedAt: string;
  product?: Product;
}

export interface WishlistResponse {
  id: string;
  userId: string;
  products: WishlistItem[];
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface CheckWishlistResponse {
  isInWishlist: boolean;
  addedAt?: string;
}

export const wishlistService = {
  // Get user's wishlist
  getWishlist: async (populate: boolean = true): Promise<WishlistResponse | null> => {
    try {
      const response = await api.get<WishlistResponse>(`${WISHLIST.GET}?populate=${populate}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return null;
    }
  },

  // Add product to wishlist
  addToWishlist: async (productId: string) => {
    try {
      const response = await api.post(WISHLIST.ADD, { productId });
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId: string) => {
    try {
      const response = await api.delete(WISHLIST.REMOVE(productId));
      return response.data;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  // Check if product is in wishlist
  checkInWishlist: async (productId: string): Promise<CheckWishlistResponse> => {
    try {
      const response = await api.get<CheckWishlistResponse>(WISHLIST.CHECK(productId));
      return response.data;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return { isInWishlist: false };
    }
  },

  // Clear entire wishlist
  clearWishlist: async () => {
    try {
      const response = await api.delete(WISHLIST.CLEAR);
      return response.data;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  },

  // Get wishlist statistics
  getWishlistStats: async () => {
    try {
      const response = await api.get(WISHLIST.STATS);
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist stats:', error);
      return { totalItems: 0, lastUpdated: null };
    }
  },

  // Remove multiple products from wishlist
  removeMultipleFromWishlist: async (productIds: string[]) => {
    try {
      const response = await api.delete(WISHLIST.REMOVE_MULTIPLE, {
        data: { productIds }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing multiple items from wishlist:', error);
      throw error;
    }
  }
};

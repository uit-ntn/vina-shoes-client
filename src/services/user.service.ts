import { api } from "@/lib/api/http";
import { User, Address, UpdateProfileData, ChangePasswordData, OrderHistoryResponse, NotificationResponse } from "@/types/user";

// API Endpoints
const USER_API = {
  PROFILE: '/api/users/profile',
  UPDATE_PROFILE: '/api/users/profile',
  CHANGE_PASSWORD: '/api/users/change-password',
  ADDRESSES: '/api/users/addresses',
  ORDERS: '/api/users/orders',
  WISHLIST: '/api/users/wishlist',
  NOTIFICATIONS: '/api/users/notifications'
};

export const userService = {
  // Get user profile
  getProfile: async (): Promise<User | null> => {
    try {
      const response = await api.get<User>(USER_API.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<User | null> => {
    try {
      const response = await api.put<User>(USER_API.UPDATE_PROFILE, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  },

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<boolean> => {
    try {
      await api.post(USER_API.CHANGE_PASSWORD, data);
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  },

  // Get user addresses
  getAddresses: async (): Promise<Address[]> => {
    try {
      const response = await api.get<Address[]>(USER_API.ADDRESSES);
      return response.data;
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      return [];
    }
  },

  // Add new address
  addAddress: async (address: Address): Promise<Address | null> => {
    try {
      const response = await api.post<Address>(USER_API.ADDRESSES, address);
      return response.data;
    } catch (error) {
      console.error('Error adding address:', error);
      return null;
    }
  },

  // Update address
  updateAddress: async (addressId: string, address: Address): Promise<Address | null> => {
    try {
      const response = await api.put<Address>(`${USER_API.ADDRESSES}/${addressId}`, address);
      return response.data;
    } catch (error) {
      console.error('Error updating address:', error);
      return null;
    }
  },

  // Delete address
  deleteAddress: async (addressId: string): Promise<boolean> => {
    try {
      await api.delete(`${USER_API.ADDRESSES}/${addressId}`);
      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      return false;
    }
  },

  // Get order history
  getOrderHistory: async (): Promise<OrderHistoryResponse['orders']> => {
    try {
      const response = await api.get<OrderHistoryResponse>(USER_API.ORDERS);
      return response.data.orders;
    } catch (error) {
      console.error('Error fetching order history:', error);
      return [];
    }
  },

  // Get wishlist
  getWishlist: async (): Promise<string[]> => {
    try {
      const response = await api.get<{ wishlist: string[] }>(USER_API.WISHLIST);
      return response.data.wishlist;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
  },

  // Add item to wishlist
  addToWishlist: async (productId: string): Promise<boolean> => {
    try {
      await api.post(USER_API.WISHLIST, { productId });
      return true;
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      return false;
    }
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId: string): Promise<boolean> => {
    try {
      await api.delete(`${USER_API.WISHLIST}/${productId}`);
      return true;
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      return false;
    }
  },

  // Get notifications
  getNotifications: async (): Promise<NotificationResponse['notifications']> => {
    try {
      const response = await api.get<NotificationResponse>(USER_API.NOTIFICATIONS);
      return response.data.notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId: string): Promise<boolean> => {
    try {
      await api.put(`${USER_API.NOTIFICATIONS}/${notificationId}`);
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }
};

export default userService;

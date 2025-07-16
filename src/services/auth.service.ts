import { api } from '@/lib/api/http';
import { User, LoginCredentials, RegisterData, AuthResponse, PasswordResetRequest, PasswordResetConfirm } from '@/types/user';
import { AUTH } from '@/lib/api/endpoints';
import { AxiosError } from 'axios';

// Constants
const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const TOKEN_EXPIRY_KEY = 'token_expiry';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(AUTH.LOGIN, credentials);
      if (typeof window !== 'undefined') {
        const { access_token, user } = response.data;
        authService.setAuthData(access_token, user);
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(AUTH.REGISTER, data);
      if (typeof window !== 'undefined') {
        const { access_token, user } = response.data;
        authService.setAuthData(access_token, user);
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post(AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.clearAuthData();
    }
  },

  refreshToken: async (): Promise<string> => {
    try {
      const response = await api.post<{ token: string }>(AUTH.REFRESH_TOKEN);
      if (typeof window !== 'undefined') {
        const { token } = response.data;
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        // Update token expiry
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1); // Token expires in 1 hour
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toISOString());
      }
      return response.data.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      authService.clearAuthData();
      throw error;
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (!token || !expiryStr) return false;
    
    const expiry = new Date(expiryStr);
    if (expiry <= new Date()) {
      authService.clearAuthData();
      return false;
    }
    
    return true;
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  updateStoredUser: (user: User): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  setAuthData: (token: string, user: User | { id: string; email: string; name: string; role: string }): void => {
    if (typeof window !== 'undefined') {
      // First store user data and expiry
      const userData = 'role' in user ? {
        _id: user.id,
        email: user.email,
        name: user.name,
        role: user.role === 'user' ? 'customer' : user.role,
        createdAt: new Date(),
        updatedAt: new Date()
      } : user;
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24); // Token expires in 24 hours
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toISOString());

      // Set token last to trigger storage event
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      // Dispatch storage event for the current window since localStorage events
      // don't trigger in the same window that made the change
      window.dispatchEvent(new StorageEvent('storage', {
        key: AUTH_TOKEN_KEY,
        newValue: token
      }));
    }
  },

  clearAuthData: (): void => {
    if (typeof window !== 'undefined') {
      // Remove user data and expiry first
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      
      // Remove token last to trigger storage event
      localStorage.removeItem(AUTH_TOKEN_KEY);

      // Dispatch storage event for the current window
      window.dispatchEvent(new StorageEvent('storage', {
        key: AUTH_TOKEN_KEY,
        oldValue: localStorage.getItem(AUTH_TOKEN_KEY),
        newValue: null
      }));
    }
  },

  requestPasswordReset: async (data: PasswordResetRequest): Promise<void> => {
    try {
      await api.post(AUTH.FORGOT_PASSWORD, data);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Password reset request failed');
      }
      throw error;
    }
  },

  resetPassword: async (data: PasswordResetConfirm): Promise<void> => {
    try {
      await api.post(AUTH.RESET_PASSWORD, data);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Password reset failed');
      }
      throw error;
    }
  },

  verifyEmail: async (token: string): Promise<void> => {
    try {
      await api.post(AUTH.VERIFY_EMAIL, { token });
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Email verification failed');
      }
      throw error;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.post(AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Password change failed');
      }
      throw error;
    }
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    try {
      const response = await api.patch<{ user: User }>(AUTH.UPDATE_PROFILE, data);
      const updatedUser = response.data.user;
      authService.updateStoredUser(updatedUser);
      return updatedUser;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Profile update failed');
      }
      throw error;
    }
  }
};

export default authService;
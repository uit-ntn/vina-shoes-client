import { api } from '@/lib/api/http';
import { User, LoginCredentials, RegisterData, AuthResponse, PasswordResetRequest, PasswordResetConfirm } from '@/types/user';

// Constants
const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const authAPI = {
  LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
    VERIFY_EMAIL: '/auth/verify-email',
    CHANGE_PASSWORD: '/auth/change-password',
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(authAPI.LOGIN, credentials);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(authAPI.REGISTER, data);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post(authAPI.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  },

  requestPasswordReset: async (data: PasswordResetRequest): Promise<void> => {
    try {
      await api.post(authAPI.FORGOT_PASSWORD, data);
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  },

  confirmPasswordReset: async (data: PasswordResetConfirm): Promise<void> => {
    try {
      await api.post(authAPI.RESET_PASSWORD, data);
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      throw error;
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
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

  refreshToken: async (): Promise<string> => {
    try {
      const response = await api.post<{ token: string }>(authAPI.REFRESH_TOKEN);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
      }
      return response.data.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  verifyEmail: async (token: string): Promise<void> => {
    try {
      await api.post(authAPI.VERIFY_EMAIL, { token });
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.post(authAPI.CHANGE_PASSWORD, {
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }
};

export default authService;
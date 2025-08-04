import { api } from '@/lib/api/http';
import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  TokenResponse,
  OtpResponse,
  VerifyEmailData,
  ResetPasswordWithOtpData,
  ForgotPasswordDto
} from '@/types/user';
import { AUTH } from '@/lib/api/endpoints';
import { AxiosError } from 'axios';

// Constants
const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';
const TOKEN_EXPIRY_KEY = 'token_expiry';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    try {
      console.log('Sending login request with credentials:', { 
        email: credentials.email, 
        passwordLength: credentials.password?.length || 0 
      });
      
      const response = await api.post<any>(AUTH.LOGIN, credentials);
      
      // Get response data
      const { data } = response;
      console.log('Login response:', JSON.stringify(data));
      
      // Handle NestJS JWT format based on your backend:
      // Backend format: { access_token: string } with JWT payload { sub: userId, email: string }
      const normalizedData: TokenResponse = {
        // Get access_token from the response
        access_token: data.access_token || data.accessToken || '',
        
        // Always ensure user object exists with default values
        user: {
          id: data.user?.id || data.userId || data.sub || '',
          email: data.user?.email || credentials.email, // Fall back to the email used for login
          name: data.user?.name || data.name || data.fullName || credentials.email.split('@')[0],
          role: data.user?.role || data.role || 'user'
        }
      };
      
      console.log('Normalized data:', normalizedData);
      
      // Validate we have the access token
      if (!normalizedData.access_token) {
        console.error('Invalid login response format: no access_token', data);
        throw new Error('Không thể đăng nhập: Token không hợp lệ');
      }
      
      // Ensure user object has minimum required data
      if (!normalizedData.user?.email) {
        normalizedData.user = normalizedData.user || {};
        normalizedData.user.email = credentials.email;
        console.log('Added email to user object:', normalizedData.user);
      }

      // Store auth data - even with minimal user info
      const { access_token, user } = normalizedData;
      const refreshToken = data.refreshToken || '';
      
      console.log('Storing auth data with token and user:', { 
        tokenPrefix: access_token.substring(0, 10) + '...', 
        user 
      });
      
      authService.setAuthData(access_token, refreshToken, user);
      
      return normalizedData;
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide user-friendly error messages based on the error type
      if (error instanceof AxiosError) {
        // Server returned an error response
        const statusCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        
        if (statusCode === 401 || statusCode === 403) {
          throw new Error('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
        } else if (statusCode === 404) {
          throw new Error('Tài khoản không tồn tại. Vui lòng đăng ký.');
        } else if (serverMessage) {
          throw new Error(`Lỗi: ${serverMessage}`);
        } else {
          throw new Error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
        }
      } else if (error instanceof Error) {
        // Rethrow with more user-friendly message if possible
        const errorMessage = error.message.includes('Invalid response format') 
          ? 'Phản hồi không hợp lệ từ máy chủ. Vui lòng thử lại sau.'
          : error.message;
        throw new Error(errorMessage);
      } else {
        throw new Error('Đã xảy ra lỗi không xác định khi đăng nhập. Vui lòng thử lại sau.');
      }
    }
  },

  register: async (data: RegisterData): Promise<OtpResponse> => {
    try {
      const response = await api.post<OtpResponse>(AUTH.REGISTER, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw error;
    }
  },
  
  verifyEmail: async (data: VerifyEmailData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(AUTH.VERIFY_EMAIL, data);
      if (response.data && response.data.token) {
        // After verification, save auth data
        const { id, fullName, email, token } = response.data;
        // Pass empty string as refresh token since it might not be provided
        authService.setAuthData(token, '', { id, fullName, email, role: 'user' });
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Email verification failed');
      }
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      await api.post(AUTH.LOGOUT);
    } catch (error) {
      // Log but don't throw error since we want to clear auth data anyway
      console.error('Logout error:', error);
    } finally {
      // Always clear local auth data
      authService.clearAuthData();
    }
  },
  
  logoutFromDevice: async (refreshToken: string): Promise<void> => {
    try {
      await api.post(AUTH.LOGOUT_DEVICE, { refreshToken });
    } catch (error) {
      console.error('Logout from device error:', error);
      throw error;
    }
  },

  refreshToken: async (): Promise<TokenResponse> => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }
      
      console.log('Refreshing token...');
      const response = await api.post<any>(AUTH.REFRESH_TOKEN, { refreshToken });
      
      // Get response data
      const { data } = response;
      console.log('Refresh token response:', JSON.stringify(data));
      
      // Get current user data for fallback
      const currentUserData = localStorage.getItem(USER_KEY);
      const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
      
      // Handle NestJS JWT format
      const normalizedData: TokenResponse = {
        access_token: data.access_token || data.accessToken || '',
        // Always provide a properly structured user object
        user: {
          id: data.user?.id || currentUser?._id || currentUser?.id || '',
          email: data.user?.email || currentUser?.email || '',
          name: data.user?.name || currentUser?.name || '',
          role: data.user?.role || currentUser?.role || 'customer'
        }
      };
      
      if (typeof window !== 'undefined') {
        const { access_token } = normalizedData;
        
        // Update tokens
        localStorage.setItem(AUTH_TOKEN_KEY, access_token);
        
        // Update token expiry
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1); // Token expires in 1 hour
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toISOString());
        
        // If response doesn't include user data, keep the existing user data
        if (!data.user) {
          const currentUserData = localStorage.getItem(USER_KEY);
          if (currentUserData) {
            normalizedData.user = JSON.parse(currentUserData);
          }
        } else {
          localStorage.setItem(USER_KEY, JSON.stringify(normalizedData.user));
        }
      }
      
      console.log('Normalized refresh response:', normalizedData);
      return normalizedData;
    } catch (error) {
      console.error('Token refresh error:', error);
      
      // Always clear auth data on refresh token error to force re-login
      authService.clearAuthData();
      
      // Show user-friendly error
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        } else {
          const serverMessage = error.response?.data?.message;
          throw new Error(serverMessage || 'Lỗi làm mới token. Vui lòng đăng nhập lại.');
        }
      } else if (error instanceof Error) {
        throw new Error(error.message || 'Lỗi làm mới token. Vui lòng đăng nhập lại.');
      } else {
        throw new Error('Lỗi làm mới token. Vui lòng đăng nhập lại.');
      }
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
    const userData = localStorage.getItem(USER_KEY);
    
    // Kiểm tra cả token, expiry và user data
    if (!token || !expiryStr || !userData) {
      console.log('Authentication check failed: Missing token, expiry or user data');
      authService.clearAuthData();
      return false;
    }
    
    try {
      // Kiểm tra ngày hết hạn
      const expiry = new Date(expiryStr);
      if (expiry <= new Date()) {
        console.log('Authentication check failed: Token expired');
        authService.clearAuthData();
        return false;
      }
      
      // Đảm bảo user data hợp lệ
      const user = JSON.parse(userData);
      if (!user || !user.email) {
        console.log('Authentication check failed: Invalid user data');
        authService.clearAuthData();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error during authentication check:', error);
      authService.clearAuthData();
      return false;
    }
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

  setAuthData: (accessToken: string, refreshToken: string, user?: User | { id?: string; email?: string; fullName?: string; name?: string; role?: string } | null): void => {
    if (typeof window !== 'undefined') {
      try {
        console.log('Setting auth data with token:', accessToken.substring(0, 10) + '...');
        console.log('Setting auth data for user:', user);
        
        // If user data is missing or incomplete, try to get existing data
        const currentUserData = localStorage.getItem(USER_KEY);
        const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
        
        // First store user data and expiry
        let userData: Record<string, any>;
        
        if (!user && currentUser) {
          // If no new user data but we have existing user data, keep it
          userData = currentUser;
        } else if (user) {
          // Extract user properties safely
          const userId = 'id' in user ? user.id : null;
          const userEmail = 'email' in user ? user.email : null;
          const userName = 'name' in user ? user.name : null;
          const userFullName = 'fullName' in user ? user.fullName : null;
          const userRole = 'role' in user ? user.role : null;
          
          // We have new user data - create a safe merged object
          userData = {
            _id: userId || currentUser?._id || '',
            id: userId || currentUser?.id || '',
            email: userEmail || currentUser?.email || '',
            // Use name as the primary field (backend standard)
            name: userName || userFullName || currentUser?.name || '',
            // Keep fullName for any components that might still reference it
            fullName: userName || userFullName || currentUser?.fullName || '',
            role: (userRole === 'user' ? 'customer' : userRole) || currentUser?.role || 'customer',
            createdAt: new Date(),
            updatedAt: new Date()
          };
        } else {
          // Complete fallback with minimal data
          userData = {
            _id: '',
            id: '',
            email: '',
            name: '',
            fullName: '',
            role: 'customer',
            createdAt: new Date(),
            updatedAt: new Date()
          };
        }

        // Set tokens
        localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
        if (refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
        
        // Then set user data
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        
        // Set expiry last
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1); // Token expires in 1 hour
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toISOString());
        
        // Also set a cookie for middleware detection (helps with SSR)
        document.cookie = `${AUTH_TOKEN_KEY}=${accessToken}; path=/; max-age=${60*60}; SameSite=Lax`;

        console.log('Auth data successfully set in localStorage and cookies');

        // Notify other tabs/windows
        window.dispatchEvent(new StorageEvent('storage', {
          key: AUTH_TOKEN_KEY,
          newValue: accessToken
        }));
      } catch (error) {
        console.error('Error setting auth data:', error);
        // If anything fails, clear all auth data to ensure consistency
        authService.clearAuthData();
        throw error;
      }
    }
  },

  clearAuthData: (): void => {
    if (typeof window !== 'undefined') {
      console.log('Clearing auth data...');
      
      // Remove user data and expiry first
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      
      // Remove refresh token
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      
      // Remove token last to trigger storage event
      localStorage.removeItem(AUTH_TOKEN_KEY);
      
      // Also clear the cookie
      document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;

      console.log('Auth data successfully cleared from localStorage and cookies');

      // Dispatch storage event for the current window
      window.dispatchEvent(new StorageEvent('storage', {
        key: AUTH_TOKEN_KEY,
        oldValue: localStorage.getItem(AUTH_TOKEN_KEY),
        newValue: null
      }));
    }
  },

  requestPasswordReset: async (data: ForgotPasswordDto): Promise<OtpResponse> => {
    try {
      const response = await api.post<OtpResponse>(AUTH.FORGOT_PASSWORD, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Password reset request failed');
      }
      throw error;
    }
  },

  resetPassword: async (data: ResetPasswordWithOtpData): Promise<{ message: string }> => {
    try {
      const response = await api.post<{ message: string }>(AUTH.RESET_PASSWORD, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Password reset failed');
      }
      throw error;
    }
  },

  verifyOtp: async (data: { email: string, otp: string }): Promise<{ message: string, valid: boolean }> => {
    try {
      const response = await api.post<{ message: string, valid: boolean }>(AUTH.VERIFY_OTP, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'OTP verification failed');
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
      
      // Make sure to merge with existing user data, not replace it entirely
      const currentUser = authService.getCurrentUser();
      const mergedUser = { ...currentUser, ...updatedUser };
      
      authService.updateStoredUser(mergedUser);
      return mergedUser;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Profile update failed');
      }
      throw error;
    }
  }
};

export default authService;
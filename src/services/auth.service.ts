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
  ForgotPasswordDto,
  Address,
  UserPreferences
} from '@/types/user';
import { AUTH } from '@/lib/api/endpoints';
import { AxiosError } from 'axios';

// Constants
const ACCESS_TOKEN_KEY = 'access_token';
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
      
      // JWT backend structure: { access_token: string, refreshToken: string, user: {...} }
      const normalizedData: TokenResponse = {
        // Get access_token from the response
        access_token: data.access_token || '',
        // Get refreshToken
        refreshToken: data.refreshToken || '',
        
        // Ensure user object matches our expected structure
        user: {
          _id: data.user?._id || data.user?.id || '',
          id: data.user?._id || data.user?.id || '',
          email: data.user?.email || credentials.email,
          name: data.user?.name || data.user?.fullName || credentials.email.split('@')[0],
          role: data.user?.role || 'user',
          avatarUrl: data.user?.avatarUrl || '',
          phone: data.user?.phone || '',
          addresses: data.user?.addresses || [],
          emailVerified: data.user?.emailVerified || false,
          preferences: data.user?.preferences || { language: 'vi', newsletter: true }
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

      // Store auth data - with all token info
      const { access_token, user } = normalizedData;
      const refreshToken = normalizedData.refreshToken || '';
      
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
      console.log('Calling register API with:', { email: data.email, name: data.name });
      
      // Update register request to match backend expectations
      const registerData = {
        email: data.email,
        fullName: data.name, // Using fullName as per backend DTO
        password: data.password
      };
      
      const response = await api.post<OtpResponse>(AUTH.REGISTER, registerData);
      
      // The backend will send an OTP to the user's email for verification
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        
        if (statusCode === 409 || serverMessage?.includes('already in use')) {
          throw new Error('Email đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập.');
        } else if (serverMessage) {
          throw new Error(serverMessage);
        }
      }
      throw new Error('Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.');
    }
  },
  
  verifyEmail: async (data: VerifyEmailData): Promise<TokenResponse> => {
    try {
      console.log('Calling verify email API with:', data);
      const response = await api.post<any>(AUTH.VERIFY_EMAIL, data);
      console.log('Verify email response:', response.data);
      
      // JWT backend returns access_token, refreshToken, and user
      if (response.data) {
        const { access_token, refreshToken, user } = response.data;
        
        if (!access_token) {
          throw new Error('Invalid verification response: missing access_token');
        }
        
        // Create normalized user data
        const userData = {
          _id: user?._id || user?.id || '',
          id: user?._id || user?.id || '',
          email: user?.email || data.email,
          name: user?.name || user?.fullName || '',
          role: user?.role || 'user',
          avatarUrl: user?.avatarUrl || '',
          phone: user?.phone || '',
          addresses: user?.addresses || [],
          emailVerified: true // Since we just verified the email
        };
        
        // Save the auth data
        authService.setAuthData(access_token, refreshToken || '', userData);
        
        return {
          access_token,
          refreshToken,
          user: userData
        };
      }
      
      throw new Error('Invalid verification response format');
    } catch (error) {
      console.error('Email verification error:', error);
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        
        if (statusCode === 400 && serverMessage?.includes('Invalid OTP')) {
          throw new Error('Mã OTP không hợp lệ. Vui lòng kiểm tra lại.');
        } else if (statusCode === 400 && serverMessage?.includes('expired')) {
          throw new Error('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.');
        } else if (serverMessage) {
          throw new Error(serverMessage);
        }
      }
      throw new Error('Xác thực email thất bại. Vui lòng thử lại.');
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
      
      // JWT backend returns access_token and refreshToken
      const normalizedData: TokenResponse = {
        access_token: data.access_token || '',
        refreshToken: data.refreshToken || '',
        // Merge with existing user data
        user: {
          id: data.user?.id || currentUser?._id || currentUser?.id || '',
          _id: data.user?.id || currentUser?._id || currentUser?.id || '',
          email: data.user?.email || currentUser?.email || '',
          name: data.user?.name || currentUser?.name || '',
          role: data.user?.role || currentUser?.role || 'customer',
          avatarUrl: data.user?.avatarUrl || currentUser?.avatarUrl || '',
          phone: data.user?.phone || currentUser?.phone || '',
          addresses: data.user?.addresses || currentUser?.addresses || [],
          emailVerified: data.user?.emailVerified !== undefined ? data.user.emailVerified : currentUser?.emailVerified || false,
          preferences: data.user?.preferences || currentUser?.preferences || { language: 'vi', newsletter: true }
        }
      };
      
      if (typeof window !== 'undefined') {
        const { access_token } = normalizedData;
        
        // Update tokens
        localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
        if (normalizedData.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, normalizedData.refreshToken);
        }
        
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
    
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
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
    return localStorage.getItem(ACCESS_TOKEN_KEY);
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

  setAuthData: (accessToken: string, refreshToken: string, user?: User | { _id?: string; id?: string; email?: string; name?: string; role?: string; avatarUrl?: string; phone?: string; addresses?: Address[]; emailVerified?: boolean; preferences?: UserPreferences } | null): void => {
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
          const userId = ('id' in user && user.id) || ('_id' in user && user._id) || null;
          const userEmail = 'email' in user ? user.email : null;
          const userName = 'name' in user ? user.name : null;
          const userRole = 'role' in user ? user.role : null;
          const userAvatarUrl = 'avatarUrl' in user ? user.avatarUrl : null;
          const userPhone = 'phone' in user ? user.phone : null;
          const userAddresses = 'addresses' in user ? user.addresses : null;
          const userEmailVerified = 'emailVerified' in user ? user.emailVerified : null;
          const userPreferences = 'preferences' in user ? user.preferences : null;
          
          // We have new user data - create a safe merged object
          userData = {
            _id: userId || currentUser?._id || '',
            id: userId || currentUser?.id || '',
            email: userEmail || currentUser?.email || '',
            name: userName || currentUser?.name || '',
            role: (userRole === 'user' ? 'customer' : userRole) || currentUser?.role || 'customer',
            avatarUrl: userAvatarUrl || currentUser?.avatarUrl || '',
            phone: userPhone || currentUser?.phone || '',
            addresses: userAddresses || currentUser?.addresses || [],
            emailVerified: userEmailVerified !== null ? userEmailVerified : currentUser?.emailVerified || false,
            preferences: userPreferences || currentUser?.preferences || { language: 'vi', newsletter: true },
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
            role: 'customer',
            avatarUrl: '',
            phone: '',
            addresses: [],
            emailVerified: false,
            preferences: { language: 'vi', newsletter: true },
            createdAt: new Date(),
            updatedAt: new Date()
          };
        }

        // Set tokens
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
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
        document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken}; path=/; max-age=${60*60}; SameSite=Lax`;

        console.log('Auth data successfully set in localStorage and cookies');

        // Notify other tabs/windows
        window.dispatchEvent(new StorageEvent('storage', {
          key: ACCESS_TOKEN_KEY,
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
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      
      // Also clear the cookie
      document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;

      console.log('Auth data successfully cleared from localStorage and cookies');

      // Dispatch storage event for the current window
      window.dispatchEvent(new StorageEvent('storage', {
        key: ACCESS_TOKEN_KEY,
        oldValue: localStorage.getItem(ACCESS_TOKEN_KEY),
        newValue: null
      }));
    }
  },

  requestPasswordReset: async (data: ForgotPasswordDto): Promise<OtpResponse> => {
    try {
      console.log('Requesting password reset for:', data.email);
      
      // With JWT backend, we request an OTP using the forgot-password endpoint
      const response = await api.post<OtpResponse>(AUTH.FORGOT_PASSWORD, { email: data.email });
      return response.data;
    } catch (error) {
      console.error('Password reset request error:', error);
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        
        if (statusCode === 404) {
          throw new Error('Không tìm thấy email này trong hệ thống.');
        } else if (serverMessage) {
          throw new Error(serverMessage);
        }
      }
      throw new Error('Yêu cầu đặt lại mật khẩu thất bại. Vui lòng thử lại.');
    }
  },

  resetPassword: async (data: ResetPasswordWithOtpData): Promise<{ message: string }> => {
    try {
      console.log('Resetting password with OTP for:', data.email);
      
      // Match the backend DTO format for reset password with JWT backend
      const resetData = {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword
      };
      
      const response = await api.post<{ message: string }>(AUTH.RESET_PASSWORD, resetData);
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        
        if (statusCode === 400 && serverMessage?.includes('Invalid OTP')) {
          throw new Error('Mã OTP không hợp lệ. Vui lòng kiểm tra lại.');
        } else if (statusCode === 400 && serverMessage?.includes('expired')) {
          throw new Error('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.');
        } else if (serverMessage) {
          throw new Error(serverMessage);
        }
      }
      throw new Error('Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
    }
  },

  verifyOtp: async (data: { email: string, otp: string }): Promise<{ message: string, valid: boolean }> => {
    try {
      console.log('Verifying OTP for:', data.email);
      const response = await api.post<{ message: string, valid: boolean }>(AUTH.VERIFY_OTP, data);
      return response.data;
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        
        if (statusCode === 400 && serverMessage?.includes('Invalid OTP')) {
          throw new Error('Mã OTP không hợp lệ. Vui lòng kiểm tra lại.');
        } else if (statusCode === 400 && serverMessage?.includes('expired')) {
          throw new Error('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.');
        } else if (serverMessage) {
          throw new Error(serverMessage);
        }
      }
      throw new Error('Xác thực OTP thất bại. Vui lòng thử lại.');
    }
  },

  requestOtp: async (email: string): Promise<OtpResponse> => {
    try {
      console.log('Requesting new OTP for:', email);
      const response = await api.post<OtpResponse>(AUTH.REQUEST_OTP, { email });
      return response.data;
    } catch (error) {
      console.error('OTP request error:', error);
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        
        if (statusCode === 404) {
          throw new Error('Email không tồn tại trong hệ thống.');
        } else if (statusCode === 429) {
          throw new Error('Yêu cầu quá nhiều lần. Vui lòng đợi một lát và thử lại.');
        } else if (serverMessage) {
          throw new Error(serverMessage);
        }
      }
      throw new Error('Không thể gửi mã OTP. Vui lòng thử lại sau.');
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
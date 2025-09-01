'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthContextType, Address } from '@/types/user';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  console.log('Auth context accessed:', context);
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication state...');
        const currentUser = authService.getCurrentUser();
        console.log('Current user from storage:', currentUser);
        
        const isAuth = authService.isAuthenticated();
        console.log('Is authenticated:', isAuth);
        
        if (currentUser && isAuth) {
          console.log('Setting authenticated user in context:', currentUser);
          setUser(currentUser);
        } else {
          console.log('No authenticated user found');
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes to sync auth state across tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'access_token') {
        checkAuth();
      }
    };

    // Also listen for custom auth events
    const handleAuthLogout = () => {
      setUser(null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth:logout', handleAuthLogout);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const loadingToast = toast.loading('Đang đăng nhập...');
    try {
      setError(null);
      console.log('Đang đăng nhập với email:', email);
      
      // Thực hiện đăng nhập
      console.log('Calling auth service login');
      const response = await authService.login({ email, password });
      
      // Double-check response format
      if (!response) {
        console.error('No response received from login');
        throw new Error('Không nhận được phản hồi từ máy chủ');
      }
      
      console.log('Đăng nhập thành công, response:', JSON.stringify(response));
      
      // Verify that we have an access token
      if (!response.access_token) {
        console.error('Login response missing access_token:', response);
        throw new Error('Không nhận được token xác thực từ máy chủ');
      }
      
      console.log('Access token received successfully');
      
      // Fetch user profile after getting the token
      console.log('Fetching user profile data from API...');
      import('@/services/user.service').then(async (module) => {
        try {
          const userService = module.userService;
          const userProfileResponse = await userService.getProfile();
          
          console.log('User profile fetched:', userProfileResponse);
          
          if (userProfileResponse) {
            // The API returns { user: {...} } format in the response
            // TypeScript doesn't know about .user property, so we need to handle it safely
            const profileData = 'user' in userProfileResponse && userProfileResponse.user 
              ? userProfileResponse.user as User
              : userProfileResponse as User;
            
            // Create a normalized user object with all fields from the API response
            const userObject: User = {
              _id: profileData._id || profileData.id || '',
              id: profileData._id || profileData.id || '',
              name: profileData.name || email.split('@')[0],
              email: profileData.email || email,
              role: profileData.role || 'customer',
              avatarUrl: profileData.avatarUrl || '',
              phone: profileData.phone || '',
              
              // Include all additional fields from the backend
              status: profileData.status || 'active',
              emailVerified: profileData.emailVerified || false,
              lastLoginAt: profileData.lastLoginAt,
              passwordChangedAt: profileData.passwordChangedAt,
              twoFactorEnabled: profileData.twoFactorEnabled || false,
              
              // Handle complex objects
              addresses: Array.isArray(profileData.addresses) 
                ? profileData.addresses.map((addr: Address) => ({
                    street: addr.street,
                    city: addr.city,
                    state: addr.state,
                    country: addr.country,
                    postalCode: addr.postalCode,
                    isDefault: addr.isDefault,
                    label: addr.label || '',
                    phone: addr.phone || '',
                    recipientName: addr.recipientName || ''
                  }))
                : [],
              
              preferences: profileData.preferences || { language: 'vi', newsletter: true },
              
              // Include timestamps
              createdAt: profileData.createdAt,
              updatedAt: profileData.updatedAt
            };
            
            console.log('Setting user state with complete profile data:', userObject);
            
            // Update user in context and localStorage
            setUser(userObject);
            authService.updateStoredUser(userObject);
          } else {
            // Fallback to minimal user data if API fetch failed
            console.warn('Failed to fetch user profile, using minimal data');
            
            // Get current user from localStorage if available for additional data
            const currentUser = authService.getCurrentUser();
            
            // Use minimal data from login response
            const userData = response.user || {};
            const rawUserData = userData as Record<string, unknown>;
            
            const userObject = {
              _id: userData._id || userData.id || currentUser?._id || '',
              id: userData._id || userData.id || currentUser?.id || '',
              name: (userData.name as string) || (rawUserData.fullName as string) || currentUser?.name || email.split('@')[0],
              email: userData.email || email,
              role: userData.role || currentUser?.role || 'customer',
              avatarUrl: (userData.avatarUrl as string) || (rawUserData.avatar as string) || currentUser?.avatarUrl || '',
              phone: userData.phone || currentUser?.phone || '',
              
              // Default values for required fields
              status: currentUser?.status || 'active',
              emailVerified: userData.emailVerified !== undefined 
                ? userData.emailVerified 
                : currentUser?.emailVerified || false,
              
              // Include existing data for complex objects if available
              addresses: userData.addresses || currentUser?.addresses || [],
              preferences: userData.preferences || currentUser?.preferences || { language: 'vi', newsletter: true },
              
              // Default timestamps
              createdAt: currentUser?.createdAt || new Date().toISOString(),
              updatedAt: currentUser?.updatedAt || new Date().toISOString()
            };
            
            console.log('Setting user state with minimal data:', userObject);
            setUser(userObject);
          }
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
          
          // Fallback to basic data from login response if API call fails
          const userData = response.user || {};
          const currentUser = authService.getCurrentUser();
          const rawUserData = userData as Record<string, unknown>;
          
          const userObject = {
            _id: userData._id || userData.id || currentUser?._id || '',
            id: userData._id || userData.id || currentUser?.id || '',
            name: (userData.name as string) || (rawUserData.fullName as string) || currentUser?.name || email.split('@')[0],
            email: userData.email || email,
            role: userData.role || currentUser?.role || 'customer',
            avatarUrl: (userData.avatarUrl as string) || (rawUserData.avatar as string) || currentUser?.avatarUrl || '',
            phone: userData.phone || currentUser?.phone || '',
            addresses: userData.addresses || currentUser?.addresses || [],
            emailVerified: userData.emailVerified !== undefined ? userData.emailVerified : currentUser?.emailVerified || false,
            preferences: userData.preferences || currentUser?.preferences || { language: 'vi', newsletter: true }
          };
          
          console.log('Setting user state with fallback data:', userObject);
          setUser(userObject);
        }
      });
      
      // Hiển thị thông báo thành công
      toast.success('Đăng nhập thành công!', {
        id: loadingToast,
      });
      
      // Lấy URL chuyển hướng từ query params nếu có
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('redirect') || '/';
      console.log('Chuyển hướng sau đăng nhập đến:', redirectUrl);
      
      // Thêm delay nhỏ để đảm bảo token được lưu đúng cách trong localStorage
      // Và để user có thời gian thấy thông báo thành công
      setTimeout(() => {
        // Kiểm tra lại xác thực trước khi chuyển hướng
        if (authService.isAuthenticated()) {
          router.push(redirectUrl);
        } else {
          console.error('Lỗi xác thực sau khi đăng nhập');
          toast.error('Lỗi xác thực, vui lòng đăng nhập lại');
        }
      }, 300);
    } catch (err: unknown) {
      console.error('Chi tiết lỗi đăng nhập:', err);
      
      // Ensure loading toast is dismissed
      const errorMessage = (err as Error).message || 'Đã xảy ra lỗi khi đăng nhập';
      setError(errorMessage);
      
      // Show error message to user
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 5000, // Show error for 5 seconds so user can read it
      });
      
      // Allow the user to try again after a brief pause
      setTimeout(() => {
        setError(null); // Clear error to allow retry
      }, 1000);
    }
  };

  const logout = async () => {
    try {
      const loadingToast = toast.loading('Logging out...');
      console.log("User logged out:", user);
      await authService.logout();
      setUser(null);
      toast.success('Successfully logged out!', {
        id: loadingToast,
      });
      router.push('/login');
    } catch (err: unknown) {
      console.error('Logout error:', err);
      toast.error('Error logging out. Please try again.');
      // Still clear local state even if server logout fails
      setUser(null);
      router.push('/login');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const loadingToast = toast.loading('Creating your account...');
      const response = await authService.register({
        email,
        password,
        name // Use name to match backend RegisterDto
      });
      
      toast.success(response.message || 'OTP sent to your email. Please verify your account!', {
        id: loadingToast,
      });
      
      // The backend now handles creating the user and sending OTP
      // User will be set after email verification
      return response;
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'An error occurred during registration';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const loadingToast = toast.loading('Sending OTP to your email...');
      const response = await authService.requestPasswordReset({ email });
      toast.success(response.message || 'OTP sent to your email for password reset!', {
        id: loadingToast,
      });
      return response;
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to send OTP for password reset';
      toast.error(errorMessage);
      throw err;
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      const loadingToast = toast.loading('Resetting password...');
      const response = await authService.resetPassword({
        email,
        otp,
        newPassword,
      });
      toast.success(response.message || 'Password reset successfully! Please login with your new password.', {
        id: loadingToast,
      });
      router.push('/login');
      return response;
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to reset password';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      // If the user is updating their name, make sure it's using the property expected by the backend
      const formattedData = { ...data };
      
      // Backend only uses name field, no need to delete fullName as it doesn't exist anymore
      
      const updatedUser = await authService.updateProfile(formattedData);
      setUser(updatedUser);
    } catch (err: unknown) {
      const errorMessage = (err as any)?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin';
      toast.error(errorMessage);
      throw err;
    }
  };
  
  const verifyEmail = async (email: string, otp: string) => {
    try {
      const loadingToast = toast.loading('Verifying your email...');
      const response = await authService.verifyEmail({ email, otp });
      
      if (response && response.user) {
        // After successful verification, update user state with the JWT response
        setUser({
          _id: response.user._id || response.user.id || '',
          id: response.user._id || response.user.id || '',
          name: response.user.name || email.split('@')[0],
          email: response.user.email || email,
          role: response.user.role || 'customer',
          avatarUrl: response.user.avatarUrl || '',
          phone: response.user.phone || '',
          addresses: response.user.addresses || [],
          emailVerified: true, // Since we just verified the email
          preferences: response.user.preferences || { language: 'vi', newsletter: true }
        });
        
        toast.success('Email verified successfully!', {
          id: loadingToast,
        });
        
        router.push('/');
      }
      
      return response;
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to verify email';
      toast.error(errorMessage);
      throw err;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await authService.verifyOtp({ email, otp });
      return response;
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to verify OTP';
      toast.error(errorMessage);
      throw err;
    }
  };

  const logoutFromDevice = async (refreshToken: string) => {
    try {
      const loadingToast = toast.loading('Logging out from device...');
      await authService.logoutFromDevice(refreshToken);
      toast.success('Successfully logged out from device!', {
        id: loadingToast,
      });
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to logout from device';
      toast.error(errorMessage);
      throw err;
    }
  };
  
  const requestOtp = async (email: string) => {
    try {
      const loadingToast = toast.loading('Sending OTP to your email...');
      const response = await authService.requestOtp(email);
      toast.success(response.message || 'OTP sent to your email!', {
        id: loadingToast,
      });
      return response;
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to send OTP';
      toast.error(errorMessage);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        updateProfile,
        verifyEmail,
        verifyOtp,
        logoutFromDevice,
        requestOtp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

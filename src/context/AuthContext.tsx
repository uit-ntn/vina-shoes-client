'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthContextType } from '@/types/user';
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
      if (event.key === 'auth_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    const loadingToast = toast.loading('Đang đăng nhập...');
    try {
      setError(null);
      console.log('Đang đăng nhập với email:', email);
      
      // Thực hiện đăng nhập
      const response = await authService.login({ email, password });
      
      if (!response || !response.user || !response.access_token) {
        throw new Error('Phản hồi không hợp lệ từ máy chủ');
      }

      console.log('Đăng nhập thành công:', response);
      
      // Cập nhật state user trong context
      setUser(response.user);
      
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
    } catch (err: any) {
      console.error('Chi tiết lỗi đăng nhập:', err);
      const errorMessage = err.message || 'Đã xảy ra lỗi khi đăng nhập';
      setError(errorMessage);
      toast.error(errorMessage, {
        id: loadingToast,
      });
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
    } catch (err: any) {
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
        name,
        confirmPassword: password
      });
      setUser(response.user);
      toast.success('Account created successfully!', {
        id: loadingToast,
      });
      router.push('/'); // Redirect to home page after registration
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred during registration';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const loadingToast = toast.loading('Sending reset instructions...');
      await authService.requestPasswordReset({ email });
      toast.success('Password reset instructions sent to your email!', {
        id: loadingToast,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset instructions';
      toast.error(errorMessage);
      throw err;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const loadingToast = toast.loading('Resetting password...');
      await authService.resetPassword({
        token,
        newPassword,
        confirmPassword: newPassword,
      });
      toast.success('Password reset successfully! Please login with your new password.', {
        id: loadingToast,
      });
      router.push('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin';
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
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { ChangePasswordData } from '@/types/user';


interface UserPreferences {
  language: string;
  newsletter: boolean;
}

export default function SecurityPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'vi',
    newsletter: true
  });
  
  // Load user preferences when user data is available
  useEffect(() => {
    if (user) {
      setTwoFactorEnabled(user.twoFactorEnabled || false);
      
      if (user.preferences) {
        setPreferences({
          language: user.preferences.language || 'vi',
          newsletter: user.preferences.newsletter !== undefined ? user.preferences.newsletter : true
        });
      }
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitLoading(true);
    setSuccess('');
    
    try {
      // Password change logic would go here
      // For example: await authService.changePassword(data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Mật khẩu đã được thay đổi thành công!');
      toast.success('Mật khẩu đã được thay đổi thành công!');
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (_error: unknown) {
      setErrors({ 
        submit: (_error as Error)?.message || 'Có lỗi xảy ra khi thay đổi mật khẩu. Vui lòng thử lại sau.'
      });
      toast.error('Không thể thay đổi mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleToggleTwoFactor = async () => {
    try {
      setLoading(true);
      // In a real app, this would call an API to toggle 2FA
      // await userService.updateTwoFactorStatus(!twoFactorEnabled);
      
      // For demo, just toggle the state
      setTwoFactorEnabled(!twoFactorEnabled);
      toast.success(`Xác thực hai yếu tố đã được ${!twoFactorEnabled ? 'bật' : 'tắt'}`);
    } catch {
      toast.error('Không thể cập nhật trạng thái xác thực hai yếu tố.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleNewsletter = async () => {
    try {
      setLoading(true);
      // In a real app, this would call an API to update preferences
      // await userService.updatePreferences({ ...preferences, newsletter: !preferences.newsletter });
      
      // For demo, just update the state
      setPreferences({
        ...preferences,
        newsletter: !preferences.newsletter
      });
      
      toast.success(`Đã ${!preferences.newsletter ? 'đăng ký' : 'hủy đăng ký'} nhận bản tin.`);
    } catch {
      toast.error('Không thể cập nhật thiết lập.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    try {
      setLoading(true);
      // In a real app, this would call an API to update preferences
      // await userService.updatePreferences({ ...preferences, language: newLanguage });
      
      // For demo, just update the state
      setPreferences({
        ...preferences,
        language: newLanguage
      });
      
      toast.success(`Đã thay đổi ngôn ngữ thành ${newLanguage === 'vi' ? 'Tiếng Việt' : 'English'}.`);
    } catch {
      toast.error('Không thể cập nhật thiết lập ngôn ngữ.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogoutAllDevices = async () => {
    try {
      setLoading(true);
      // In a real app, this would call an API to logout from all devices
      // await authService.logoutAllDevices();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Đã đăng xuất khỏi tất cả các thiết bị khác.');
    } catch {
      toast.error('Không thể đăng xuất khỏi các thiết bị. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Thay đổi mật khẩu</h3>
        <p className="text-gray-600">
          Để đảm bảo an toàn tài khoản, hãy sử dụng mật khẩu mạnh và không sử dụng lại ở các dịch vụ khác.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleInputChange}
              disabled={loading || submitLoading}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.currentPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleInputChange}
              disabled={loading || submitLoading}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleInputChange}
              disabled={loading || submitLoading}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* General error message */}
        {errors.submit && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {errors.submit}
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
            disabled={loading || submitLoading}
          >
            {submitLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>
        </div>
      </form>
      
      <div className="mt-10 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-medium text-gray-800 mb-4">Tính năng bảo mật khác</h4>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="font-medium">Xác thực hai yếu tố</h5>
              <p className="text-sm text-gray-600">
                Tăng cường bảo mật cho tài khoản bằng cách yêu cầu mã xác thực.
              </p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                name="toggle2FA"
                id="toggle2FA" 
                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none right-0 checked:right-4 transition-all duration-200"
                checked={twoFactorEnabled}
                onChange={handleToggleTwoFactor}
                disabled={loading}
              />
              <label 
                htmlFor="toggle2FA" 
                className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h5 className="font-medium">Nhận bản tin</h5>
              <p className="text-sm text-gray-600">
                Nhận thông tin về khuyến mãi và sản phẩm mới.
              </p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                name="toggleNewsletter"
                id="toggleNewsletter" 
                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none right-0 checked:right-4 transition-all duration-200"
                checked={preferences.newsletter}
                onChange={handleToggleNewsletter}
                disabled={loading}
              />
              <label 
                htmlFor="toggleNewsletter" 
                className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h5 className="font-medium">Ngôn ngữ</h5>
              <p className="text-sm text-gray-600">
                Chọn ngôn ngữ hiển thị cho tài khoản của bạn.
              </p>
            </div>
            <select 
              value={preferences.language} 
              onChange={handleLanguageChange}
              disabled={loading}
              className="bg-white border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            className="text-red-600 hover:text-red-800 font-medium transition-colors disabled:opacity-70"
            type="button"
            onClick={handleLogoutAllDevices}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng xuất khỏi tất cả các thiết bị khác'}
          </button>
        </div>
      </div>
    </div>
  );
}

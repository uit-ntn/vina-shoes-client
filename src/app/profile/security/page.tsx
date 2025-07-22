'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { ChangePasswordData } from '@/types/user';
import Link from 'next/link';

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
  
  // Tab types for navigation
  type TabType = 'profile' | 'addresses' | 'orders' | 'wishlist' | 'security';
  
  // Define all tabs with their properties
  const tabs = [
    {
      id: 'profile' as TabType,
      label: 'Thông tin tài khoản',
      href: '/profile',
    },
    {
      id: 'addresses' as TabType,
      label: 'Địa chỉ giao hàng',
      href: '/profile/addresses',
    },
    {
      id: 'orders' as TabType,
      label: 'Đơn hàng của tôi',
      href: '/profile/orders',
    },
    {
      id: 'wishlist' as TabType,
      label: 'Danh sách yêu thích',
      href: '/profile/wishlist',
    },
    {
      id: 'security' as TabType,
      label: 'Bảo mật tài khoản',
      href: '/profile/security',
    },
  ];
  
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
    } catch (error: any) {
      setErrors({ 
        submit: error?.message || 'Có lỗi xảy ra khi thay đổi mật khẩu. Vui lòng thử lại sau.'
      });
      toast.error('Không thể thay đổi mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center">
            <div className="relative w-16 h-16 mr-4">
              <img
                src={user?.avatar || '/images/avatar-placeholder.jpg'}
                alt="Avatar"
                className="rounded-full object-cover border-2 border-white w-full h-full"
              />
            </div>
            <div>
              <div className="text-sm font-light">Xin chào,</div>
              <h1 className="text-2xl font-bold">
                {user ? user.name : 'Khách hàng'}
              </h1>
              <div className="text-sm opacity-80">{user?.email}</div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="text-xl font-semibold">Bảo mật tài khoản</h2>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Profile Navigation */}
          <div className="md:w-1/4">
            <nav className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <Link href={tab.href}>
                      <div
                        className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                          tab.id === 'security' ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <span
                          className={`${
                            tab.id === 'security'
                              ? 'font-medium text-blue-800'
                              : 'text-gray-700'
                          }`}
                        >
                          {tab.label}
                        </span>
                        {tab.id === 'security' && (
                          <div className="ml-auto">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          {/* Security Tab Content */}
          <div className="md:w-3/4">
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
                      />
                      <label 
                        htmlFor="toggle2FA" 
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium">Thông báo đăng nhập</h5>
                      <p className="text-sm text-gray-600">
                        Nhận thông báo khi có đăng nhập mới vào tài khoản của bạn.
                      </p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        name="toggleLoginAlert"
                        id="toggleLoginAlert" 
                        className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none right-0 checked:right-4 transition-all duration-200"
                        defaultChecked
                      />
                      <label 
                        htmlFor="toggleLoginAlert" 
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button 
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                    type="button"
                  >
                    Đăng xuất khỏi tất cả các thiết bị khác
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiUser, FiShoppingBag, FiHeart, FiMapPin, FiLock, FiLogOut } from 'react-icons/fi';
import { BiHistory } from 'react-icons/bi';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { Address } from '@/types/user';

// Using the Address interface from types/user.ts

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Handle URL query parameter for tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['profile', 'orders', 'wishlist', 'addresses', 'password'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    addresses: []
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra xác thực phía client
    if (!user) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    // Initialize form with user data
    if (user) {
      console.log('User authenticated, initializing profile data', user);
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        addresses: user.addresses || []
      });
    }
  }, [user, router]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        addresses: profileData.addresses
      });
      
      toast.success('Thông tin cá nhân đã được cập nhật!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Không thể cập nhật thông tin. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp!');
      return;
    }
    
    try {
      setLoading(true);
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      toast.success('Mật khẩu đã được thay đổi thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Không thể thay đổi mật khẩu. Vui lòng kiểm tra lại thông tin!');
    } finally {
      setLoading(false);
    }
  };

  const addAddress = () => {
    setProfileData(prev => ({
      ...prev,
      addresses: [...prev.addresses, {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Vietnam',
        isDefault: prev.addresses.length === 0
      }]
    }));
  };

  const removeAddress = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  const updateAddress = (index: number, field: keyof Address, value: string | boolean) => {
    setProfileData(prev => {
      const newAddresses = [...prev.addresses];
      newAddresses[index] = {
        ...newAddresses[index],
        [field]: value
      };
      return {
        ...prev,
        addresses: newAddresses
      };
    });
  };

  const setDefaultAddress = (index: number) => {
    setProfileData(prev => {
      const newAddresses = prev.addresses.map((address, i) => ({
        ...address,
        isDefault: i === index
      }));
      return {
        ...prev,
        addresses: newAddresses
      };
    });
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Trang cá nhân</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <FiUser className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-medium text-blue-900">{user.name}</h3>
              <p className="text-sm text-blue-600">{user.email}</p>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'profile' 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'text-blue-700 hover:bg-blue-50'
                }`}
              >
                <FiUser className="mr-3 h-4 w-4 text-blue-500" />
                Thông tin cá nhân
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'orders' 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'text-blue-700 hover:bg-blue-50'
                }`}
              >
                <FiShoppingBag className="mr-3 h-4 w-4 text-blue-500" />
                Đơn hàng của tôi
              </button>
              
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'wishlist' 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'text-blue-700 hover:bg-blue-50'
                }`}
              >
                <FiHeart className="mr-3 h-4 w-4 text-blue-500" />
                Sản phẩm yêu thích
              </button>
              
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'addresses' 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'text-blue-700 hover:bg-blue-50'
                }`}
              >
                <FiMapPin className="mr-3 h-4 w-4 text-blue-500" />
                Địa chỉ của tôi
              </button>
              
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'password' 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'text-blue-700 hover:bg-blue-50'
                }`}
              >
                <FiLock className="mr-3 h-4 w-4 text-blue-500" />
                Đổi mật khẩu
              </button>
              
              <button
                onClick={() => logout()}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
              >
                <FiLogOut className="mr-3 h-4 w-4" />
                Đăng xuất
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-blue-900">Thông tin cá nhân</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 text-sm rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                  >
                    {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                  </button>
                </div>
                
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">Họ và tên</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-blue-50 disabled:text-blue-800"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled={true}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50 text-blue-800"
                      />
                      <p className="mt-1 text-xs text-blue-600">Email không thể thay đổi</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-blue-50 disabled:text-blue-800"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">Ngày tham gia</label>
                      <input
                        type="text"
                        value={new Date(user.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                        disabled={true}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50 text-blue-800"
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition ${
                          loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                    </div>
                  )}
                </form>
              </>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-blue-900">Đơn hàng của tôi</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-blue-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Mã đơn hàng
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Ngày đặt
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Tổng tiền
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-100">
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-blue-500">
                          <div className="flex flex-col items-center">
                            <BiHistory className="w-12 h-12 text-blue-300 mb-2" />
                            <p>Bạn chưa có đơn hàng nào</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
            
            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-blue-900">Sản phẩm yêu thích</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center h-48 bg-blue-50 rounded-md p-4 text-center">
                    <FiHeart className="w-10 h-10 text-blue-300 mb-3" />
                    <p className="text-blue-500">Bạn chưa có sản phẩm yêu thích nào</p>
                    <button 
                      onClick={() => router.push('/shop')}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Đi mua sắm ngay
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-blue-900">Địa chỉ của tôi</h2>
                  <button
                    onClick={addAddress}
                    className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Thêm địa chỉ
                  </button>
                </div>
                
                {profileData.addresses.length === 0 ? (
                  <div className="bg-blue-50 rounded-md p-6 text-center">
                    <FiMapPin className="w-10 h-10 text-blue-300 mx-auto mb-3" />
                    <p className="text-blue-700">Bạn chưa có địa chỉ nào</p>
                    <p className="text-blue-500 text-sm mt-1">Thêm địa chỉ để tiện cho việc giao hàng</p>
                  </div>
                ) : (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    {profileData.addresses.map((address, index) => (
                      <div key={index} className="border border-blue-100 rounded-lg p-4 relative">
                        {address.isDefault && (
                          <span className="absolute top-2 right-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            Mặc định
                          </span>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Địa chỉ</label>
                            <input
                              type="text"
                              value={address.street}
                              onChange={(e) => updateAddress(index, 'street', e.target.value)}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Thành phố</label>
                            <input
                              type="text"
                              value={address.city}
                              onChange={(e) => updateAddress(index, 'city', e.target.value)}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Tỉnh/Thành</label>
                            <input
                              type="text"
                              value={address.state}
                              onChange={(e) => updateAddress(index, 'state', e.target.value)}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Mã bưu điện</label>
                            <input
                              type="text"
                              value={address.zipCode}
                              onChange={(e) => updateAddress(index, 'zipCode', e.target.value)}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`default-${index}`}
                              checked={address.isDefault}
                              onChange={() => setDefaultAddress(index)}
                              className="h-4 w-4 text-blue-600 border-blue-300 rounded"
                            />
                            <label htmlFor={`default-${index}`} className="ml-2 text-sm text-blue-700">
                              Đặt làm địa chỉ mặc định
                            </label>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeAddress(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition ${
                          loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? 'Đang lưu...' : 'Lưu địa chỉ'}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
            
            {/* Password Tab */}
            {activeTab === 'password' && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-blue-900">Đổi mật khẩu</h2>
                  <p className="text-blue-600 text-sm mt-1">Đổi mật khẩu định kỳ để bảo vệ tài khoản của bạn</p>
                </div>
                
                <form onSubmit={handlePasswordChange} className="max-w-md">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">Mật khẩu mới</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                      <p className="mt-1 text-xs text-blue-600">Mật khẩu phải có ít nhất 8 ký tự</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">Xác nhận mật khẩu</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition ${
                          loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
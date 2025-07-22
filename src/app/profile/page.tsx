'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { User } from '@/types/user';
import { userService } from '@/services/user.service';
import Link from 'next/link';

type TabType = 'profile' | 'addresses' | 'orders' | 'wishlist' | 'security';

// ProfileTabs component
const ProfileTabs = ({ activeTab }: { activeTab: TabType }) => {
  const tabs = [
    { id: 'profile' as TabType, label: 'Thông tin tài khoản', href: '/profile' },
    { id: 'addresses' as TabType, label: 'Địa chỉ giao hàng', href: '/profile/addresses' },
    { id: 'orders' as TabType, label: 'Đơn hàng của tôi', href: '/profile/orders' },
    { id: 'wishlist' as TabType, label: 'Danh sách yêu thích', href: '/profile/wishlist' },
    { id: 'security' as TabType, label: 'Bảo mật tài khoản', href: '/profile/security' },
  ];
  
  return (
    <div className="md:w-1/4">
      <nav className="bg-white rounded-lg shadow-md overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <Link href={tab.href}>
                <div
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                    activeTab === tab.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <span
                    className={`${
                      activeTab === tab.id
                        ? 'font-medium text-blue-800'
                        : 'text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
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
  );
};

// ProfileForm component
const ProfileForm = ({ 
  profileData, 
  handleProfileChange, 
  handleUpdateProfile, 
  handleAvatarChange 
}: { 
  profileData: any, 
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  handleUpdateProfile: (e: React.FormEvent) => Promise<void>,
  handleAvatarChange: (file: File) => Promise<void>
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Thông tin tài khoản</h3>
      <p className="mb-8 text-gray-600">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      
      <form onSubmit={handleUpdateProfile} className="bg-white p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
            <p className="mt-1 text-xs text-gray-500">Email không thể thay đổi</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[1] || '',
    lastName: user?.name?.split(' ')[0] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Combine first and last name for the API
      const name = `${profileData.lastName} ${profileData.firstName}`.trim();
      await userService.updateProfile({
        name,
        phone: profileData.phone || '',
      });
      toast.success('Hồ sơ đã được cập nhật thành công!');
    } catch (error) {
      toast.error('Không thể cập nhật hồ sơ. Vui lòng thử lại sau.');
    }
  };

  // Handle avatar update
  const handleAvatarChange = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Update avatar via profile update with special FormData handling
      // In a real implementation, you would have a specific avatar upload endpoint
      // For now, we'll just simulate a successful upload
      const avatarUrl = URL.createObjectURL(file);
      setProfileData({
        ...profileData,
        avatar: avatarUrl
      });
      toast.success('Ảnh đại diện đã được cập nhật!');
    } catch (error) {
      toast.error('Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.');
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-xl font-semibold">Thông tin tài khoản</h2>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <ProfileTabs
            activeTab={activeTab}
          />
          
          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeTab === 'profile' && (
                <ProfileForm
                  profileData={profileData}
                  handleProfileChange={handleProfileChange}
                  handleUpdateProfile={handleUpdateProfile}
                  handleAvatarChange={handleAvatarChange}
                />
              )}
              {activeTab === 'security' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Bảo mật tài khoản</h3>
                  <p className="mb-8 text-gray-600">Cài đặt thông tin bảo mật cho tài khoản của bạn</p>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <p>Vui lòng truy cập trang <Link href="/profile/security" className="text-blue-600 hover:underline">Bảo mật</Link> để quản lý thông tin bảo mật tài khoản.</p>
                  </div>
                </div>
              )}
              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Đơn hàng của tôi</h3>
                  <p className="mb-8 text-gray-600">Theo dõi và quản lý đơn hàng của bạn</p>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <p>Vui lòng truy cập trang <Link href="/profile/orders" className="text-blue-600 hover:underline">Đơn hàng</Link> để xem lịch sử đơn hàng của bạn.</p>
                  </div>
                </div>
              )}
              {activeTab === 'addresses' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Địa chỉ giao hàng</h3>
                  <p className="mb-8 text-gray-600">Quản lý địa chỉ giao hàng của bạn</p>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <p>Vui lòng truy cập trang <Link href="/profile/addresses" className="text-blue-600 hover:underline">Địa chỉ</Link> để quản lý địa chỉ giao hàng của bạn.</p>
                  </div>
                </div>
              )}
              {activeTab === 'wishlist' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Danh sách yêu thích</h3>
                  <p className="mb-8 text-gray-600">Quản lý sản phẩm yêu thích của bạn</p>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <p>Vui lòng truy cập trang <Link href="/profile/wishlist" className="text-blue-600 hover:underline">Yêu thích</Link> để xem danh sách sản phẩm yêu thích của bạn.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

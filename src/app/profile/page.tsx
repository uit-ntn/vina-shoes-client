'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { User } from '@/types/user';
import { userService } from '@/services/user.service';
import Link from 'next/link';

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
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Thông tin tài khoản</h3>
      <p className="mb-8 text-gray-800">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      
      <form onSubmit={handleUpdateProfile} className="bg-white p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Họ</label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Tên</label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
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
            <label className="block text-sm font-medium text-gray-900 mb-1">Số điện thoại</label>
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <ProfileForm
        profileData={profileData}
        handleProfileChange={handleProfileChange}
        handleUpdateProfile={handleUpdateProfile}
        handleAvatarChange={handleAvatarChange}
      />
    </div>
  );
}

'use client';

import { useState, useRef } from 'react';
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
  // Reference for file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleAvatarChange(e.target.files[0]);
    }
  };
  
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Thông tin tài khoản</h3>
      <p className="mb-8 text-gray-800">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      
      <form onSubmit={handleUpdateProfile} className="bg-white p-4 rounded-lg">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
              {profileData.avatar ? (
                <img 
                  src={profileData.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <button 
              type="button"
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 shadow-md hover:bg-blue-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <p className="text-sm text-gray-600 mt-2">Nhấn vào ảnh để thay đổi ảnh đại diện</p>
        </div>
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
  const { user, updateProfile: authUpdateProfile } = useAuth();
  
  // Parse name properly - Vietnamese names typically have last name first
  // Get last word as first name, everything else as last name
  const nameParts = user?.name ? user.name.split(' ') : ['', ''];
  const firstName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  const lastName = nameParts.length > 1 ? nameParts.slice(0, nameParts.length - 1).join(' ') : nameParts[0] || '';

  const [profileData, setProfileData] = useState({
    firstName: firstName,
    lastName: lastName,
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || user?.avatarUrl || '',
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
      // Combine first and last name for the API - Vietnamese name format with last name first
      const name = `${profileData.lastName} ${profileData.firstName}`.trim();
      
      // Update both in userService and AuthContext
      const updatedUser = await userService.updateProfile({
        name: name,
        phone: profileData.phone || '',
      });
      
      if (updatedUser) {
        // Also update in AuthContext to ensure state consistency
        await authUpdateProfile({
          name: name,
          phone: profileData.phone || '',
        });
        toast.success('Hồ sơ đã được cập nhật thành công!');
      } else {
        throw new Error('Không thể cập nhật hồ sơ');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Không thể cập nhật hồ sơ. Vui lòng thử lại sau.');
    }
  };

  // Handle avatar update
  const handleAvatarChange = async (file: File) => {
    try {
      // Create loading toast
      const loadingToast = toast.loading('Đang tải ảnh lên...');
      
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Upload the avatar using the API
      // In a real implementation, you would have an upload endpoint
      // Create temporary URL for preview
      const avatarUrl = URL.createObjectURL(file);
      
      try {
        // Attempt to make the API call with FormData
        // If your API supports direct avatar uploads:
        // const response = await api.post('/user/avatar', formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // });
        
        // Update the user profile with the avatarUrl from the API response
        // const avatarUrlFromServer = response.data.avatarUrl;
        
        // For now, since we don't have a specific endpoint, update with local URL
        // and send a request to update profile with avatarUrl
        await userService.updateProfile({
          avatarUrl: avatarUrl, // In a real scenario, this should be the URL returned from the server
        });
        
        // Update the local state
        setProfileData({
          ...profileData,
          avatar: avatarUrl
        });
        
        // Update the toast
        toast.success('Ảnh đại diện đã được cập nhật!', {
          id: loadingToast
        });
      } catch (uploadError) {
        console.error('Avatar upload error:', uploadError);
        toast.error('Không thể tải ảnh lên. Vui lòng thử lại sau.', {
          id: loadingToast
        });
      }
    } catch (error) {
      console.error('Avatar change error:', error);
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

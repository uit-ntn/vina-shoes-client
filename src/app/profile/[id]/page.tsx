'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { User } from '@/types/user';
import { userService } from '@/services/user.service';
import Image from '@/components/ui/Image';
import React from 'react';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function UserProfilePage({ params }: ProfilePageProps) {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Since we don't have a specific API for getting user by ID,
        // we'll only show the current user's profile
        if (currentUser && (params.id === currentUser.id || params.id === currentUser._id)) {
          setUser(currentUser);
          setError(null);
        } else {
          // In a real application, we would fetch the user by ID
          // Since we don't have that API, we'll show an error
          setError('Không thể tải thông tin người dùng. Người dùng không tồn tại hoặc bạn không có quyền truy cập.');
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Không thể tải thông tin người dùng. Người dùng không tồn tại hoặc bạn không có quyền truy cập.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [params.id, currentUser]);

  // Format date string
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-semibold text-red-600 mt-4">Lỗi</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">Không tìm thấy người dùng</h2>
          <p className="mt-2 text-gray-600">Người dùng không tồn tại hoặc đã bị xóa.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative w-32 h-32 mb-4 md:mb-0 md:mr-8">
                <Image
                  src={user?.avatar || '/images/avatar-placeholder.jpg'}
                  alt="Avatar"
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-blue-100 mt-1">{user.email}</p>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                  <div className="bg-blue-700 bg-opacity-30 px-4 py-1 rounded-full text-sm">
                    {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                  </div>
                  {user.emailVerified && (
                    <div className="bg-green-700 bg-opacity-30 px-4 py-1 rounded-full text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Email đã xác thực
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* User Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cá nhân</h2>
                <dl className="space-y-3">
                  <div className="flex">
                    <dt className="w-32 text-gray-600">Họ và tên:</dt>
                    <dd className="flex-1 font-medium">{user.name}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 text-gray-600">Email:</dt>
                    <dd className="flex-1 font-medium">{user.email}</dd>
                  </div>
                  {user.phone && (
                    <div className="flex">
                      <dt className="w-32 text-gray-600">Số điện thoại:</dt>
                      <dd className="flex-1 font-medium">{user.phone}</dd>
                    </div>
                  )}
                  <div className="flex">
                    <dt className="w-32 text-gray-600">Vai trò:</dt>
                    <dd className="flex-1 font-medium">
                      {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 text-gray-600">Ngày tham gia:</dt>
                    <dd className="flex-1 font-medium">{formatDate(user.createdAt)}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 text-gray-600">Lần cuối đăng nhập:</dt>
                    <dd className="flex-1 font-medium">{formatDate(user.lastLogin)}</dd>
                  </div>
                </dl>
              </div>

              {/* Address Information if available */}
              {user.address && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Địa chỉ mặc định</h2>
                  <address className="not-italic space-y-1 text-gray-800">
                    <p>{user.address.street}</p>
                    <p>{user.address.city}, {user.address.zipCode || ''}</p>
                    <p>{user.address.country}</p>
                  </address>
                </div>
              )}
            </div>
            
            {/* Action buttons for admin or self */}
            {currentUser && (currentUser.role === 'admin' || currentUser.id === user.id || currentUser._id === user._id) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {currentUser.id === user.id && (
                  <a 
                    href="/profile" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Chỉnh sửa hồ sơ
                  </a>
                )}
                {currentUser.role === 'admin' && currentUser.id !== user.id && (
                  <>
                    <button 
                      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                      onClick={() => toast.success('Chức năng này sẽ được cập nhật trong tương lai')}
                    >
                      Cấp quyền
                    </button>
                    <button 
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      onClick={() => {
                        if (window.confirm('Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?')) {
                          toast.success('Chức năng này sẽ được cập nhật trong tương lai');
                        }
                      }}
                    >
                      Vô hiệu hóa tài khoản
                    </button>
                  </>
                )}
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Quay lại
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const { user: _user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('vi');
  
  const handleLogoutAllDevices = () => {
    // In a real app, you would call an API to invalidate all tokens except the current one
    toast.success('Đã đăng xuất khỏi tất cả các thiết bị khác.');
  };
  
  const handleSaveSettings = () => {
    // In a real app, you would save these settings to a user preferences API
    toast.success('Đã lưu cài đặt thành công!');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-8">
            {/* Security Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Tính năng bảo mật</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Xác thực hai yếu tố</p>
                    <p className="text-sm text-gray-700">Tăng cường bảo mật cho tài khoản bằng cách yêu cầu mã xác thực.</p>
                  </div>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      id="twofa" 
                      className="sr-only peer"
                      checked={twoFactorEnabled}
                      onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Thông báo đăng nhập</p>
                    <p className="text-sm text-gray-700">Nhận thông báo khi có đăng nhập mới vào tài khoản của bạn.</p>
                  </div>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      id="loginNotif" 
                      className="sr-only peer"
                      checked={notificationsEnabled}
                      onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Đăng xuất khỏi tất cả các thiết bị khác</p>
                    <p className="text-sm text-gray-700">Đăng xuất tài khoản của bạn trên tất cả các thiết bị ngoại trừ thiết bị hiện tại.</p>
                  </div>
                  <button 
                    onClick={handleLogoutAllDevices}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
            
            {/* Appearance Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Giao diện</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Chế độ tối</p>
                    <p className="text-sm text-gray-700">Sử dụng giao diện tối để giảm ánh sáng xanh và tiết kiệm pin.</p>
                  </div>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      id="darkMode" 
                      className="sr-only peer"
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="language" className="block font-medium text-gray-900 mb-1">Ngôn ngữ</label>
                  <select 
                    id="language" 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Privacy Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quyền riêng tư</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Hồ sơ công khai</p>
                    <p className="text-sm text-gray-700">Cho phép người dùng khác xem thông tin hồ sơ của bạn.</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" id="publicProfile" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <button 
                onClick={handleSaveSettings}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
    </div>
  );
}

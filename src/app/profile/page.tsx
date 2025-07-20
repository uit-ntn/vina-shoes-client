'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Address, OrderHistoryResponse } from '@/types/user';
import { userService } from '@/services/user.service';
import Link from 'next/link';
import Image from '@/components/ui/Image';

type TabType = 'profile' | 'addresses' | 'orders' | 'wishlist' | 'security';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    addresses: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<OrderHistoryResponse['orders']>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        addresses: user.addresses || []
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const loadingToast = toast.loading('Đang cập nhật thông tin...');
      await updateProfile(formData);
      toast.success('Cập nhật thông tin thành công!', {
        id: loadingToast
      });
      setIsEditing(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  // Load user data
  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        try {
          // Sử dụng addresses từ user nếu có, nếu không thì dùng mảng rỗng
          if (user.addresses) {
            setAddresses(user.addresses);
          }
          
          // Chỉ gọi API cho orders và wishlist
          const [ordersData, wishlistData] = await Promise.all([
            userService.getOrderHistory(),
            userService.getWishlist()
          ]);
          setOrders(ordersData);
          setWishlist(wishlistData);
        } catch (error) {
          console.error('Error loading user data:', error);
          toast.error('Có lỗi khi tải dữ liệu');
        }
      };
      loadUserData();
    }
  }, [user]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }
    try {
      const loadingToast = toast.loading('Đang cập nhật mật khẩu...');
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });
      toast.success('Cập nhật mật khẩu thành công!', { id: loadingToast });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật mật khẩu');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Vui lòng đăng nhập để xem thông tin</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8">Tài khoản của tôi</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-72 shrink-0">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            <div className="bg-primary text-white p-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-white mb-4 border-4 border-white shadow-md overflow-hidden">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    width={96}
                    height={96}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-light text-primary text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold mb-1">{user.name}</h2>
              <p className="text-primary-light">{user.email}</p>
            </div>
            
            <nav className="p-4">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-6 py-3 rounded-lg flex items-center ${
                    activeTab === 'profile' 
                      ? 'bg-primary text-white font-medium' 
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Thông tin cá nhân
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left px-6 py-3 rounded-lg flex items-center ${
                    activeTab === 'addresses' 
                      ? 'bg-primary text-white font-medium' 
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Địa chỉ
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-6 py-3 rounded-lg flex items-center ${
                    activeTab === 'orders' 
                      ? 'bg-primary text-white font-medium' 
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Đơn hàng
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full text-left px-6 py-3 rounded-lg flex items-center ${
                    activeTab === 'wishlist' 
                      ? 'bg-primary text-white font-medium' 
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Danh sách yêu thích
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-6 py-3 rounded-lg flex items-center ${
                    activeTab === 'security' 
                      ? 'bg-primary text-white font-medium' 
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Bảo mật
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
            {activeTab === 'profile' && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-5 py-2.5 rounded-lg flex items-center font-medium transition ${
                      isEditing
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Hủy
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Chỉnh sửa
                      </>
                    )}
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <label htmlFor="name" className="block text-base font-medium text-black mb-2">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="block w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 disabled:bg-gray-50 text-black"
                      />
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <label htmlFor="email" className="block text-base font-medium text-black mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        disabled
                        className="block w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-black"
                      />
                      <p className="mt-2 text-sm text-black">Email không thể thay đổi</p>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <label htmlFor="phone" className="block text-base font-medium text-black mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="block w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 disabled:bg-gray-50 text-black"
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Lưu thay đổi
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </>
            )}

            {activeTab === 'addresses' && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Địa chỉ của tôi</h2>
                  <button
                    onClick={() => {/* TODO: Add new address */}}
                    className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Thêm địa chỉ mới
                  </button>
                </div>
                
                {addresses.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-black mb-2">Chưa có địa chỉ nào</h3>
                    <p className="text-black mb-4">Thêm địa chỉ mới để thuận tiện cho việc giao hàng</p>
                    <button
                      onClick={() => {/* TODO: Add new address */}}
                      className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Thêm địa chỉ
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {addresses.map((address: any, index) => (
                      <div key={address._id || index} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold text-black mb-2">{address.street}</h3>
                              <p className="text-black mb-1">{address.city}</p>
                              <p className="text-black mb-1">{address.country}</p>
                              {address.postalCode && (
                                <p className="text-black">Mã bưu điện: {address.postalCode}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {/* TODO: Edit address */}}
                                className="p-2 text-primary hover:bg-primary/10 rounded-full transition"
                                title="Sửa địa chỉ"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {/* TODO: Delete address */}}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                                title="Xóa địa chỉ"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          {address.isDefault && (
                            <span className="inline-flex items-center px-3 py-1 mt-3 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Mặc định
                            </span>
                          )}
                        </div>
                        
                        {!address.isDefault && (
                          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                            <button 
                              className="text-primary font-medium hover:text-primary/80 transition text-sm flex items-center"
                              onClick={() => {/* TODO: Set as default */}}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Đặt làm địa chỉ mặc định
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'orders' && (
              <>
                <h2 className="text-2xl font-bold mb-8">Đơn hàng của tôi</h2>
                
                {orders.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-black mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-black mb-4">Bạn chưa đặt đơn hàng nào</p>
                    <Link
                      href="/shop"
                      className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Mua sắm ngay
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order: any) => (
                      <div key={order._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-lg font-bold text-black">Đơn hàng #{order._id.substring(0, 8).toUpperCase()}</h3>
                                <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {order.status === 'pending' && 'Chờ xử lý'}
                                  {order.status === 'processing' && 'Đang xử lý'}
                                  {order.status === 'shipped' && 'Đang giao'}
                                  {order.status === 'delivered' && 'Đã giao'}
                                  {order.status === 'cancelled' && 'Đã hủy'}
                                </span>
                              </div>
                              <p className="text-black mt-1">
                                <span className="font-medium">Ngày đặt:</span> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                              <span className="text-xl font-bold text-primary">
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                                }).format(order.total)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 border-t border-dashed pt-4">
                            <div className="flex items-center text-black">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                              <span>{order.products.length} sản phẩm</span>
                            </div>
                            
                            <div className="flex flex-wrap items-center mt-4 gap-2">
                              <Link
                                href={`/orders/${order._id}`}
                                className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Xem chi tiết
                              </Link>
                              
                              {(order.status === 'pending' || order.status === 'processing') && (
                                <button 
                                  className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition"
                                  onClick={() => {/* TODO: Cancel order */}}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Hủy đơn hàng
                                </button>
                              )}
                              
                              {order.status === 'delivered' && (
                                <button 
                                  className="inline-flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition"
                                  onClick={() => {/* TODO: Review order */}}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                  Đánh giá
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'wishlist' && (
              <>
                <h2 className="text-2xl font-bold mb-8">Danh sách yêu thích</h2>
                
                {wishlist.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-black mb-2">Danh sách yêu thích trống</h3>
                    <p className="text-black mb-4">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích</p>
                    <Link
                      href="/shop"
                      className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Mua sắm ngay
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((product: any) => (
                      <div key={product._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
                        <div className="relative">
                          <div className="aspect-w-1 aspect-h-1 w-full">
                            <Image
                              src={product.image || '/images/placeholder-shoe.jpg'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              width={400}
                              height={400}
                            />
                          </div>
                          <button
                            onClick={() => {/* TODO: Remove from wishlist */}}
                            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-red-600 hover:text-red-700 transition transform hover:scale-105"
                            title="Xóa khỏi yêu thích"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-black text-lg mb-2 line-clamp-2 h-14">{product.name}</h3>
                          <p className="text-primary font-bold text-xl mb-4">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(product.price)}
                          </p>
                          <div className="flex space-x-2">
                            <Link
                              href={`/shop/${product._id}`}
                              className="flex-1 py-2.5 px-4 bg-primary text-white text-center rounded-lg font-medium hover:bg-primary/90 transition"
                            >
                              Xem chi tiết
                            </Link>
                            <button
                              onClick={() => {/* TODO: Add to cart */}}
                              className="p-2.5 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition"
                              title="Thêm vào giỏ hàng"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'security' && (
              <>
                <h2 className="text-2xl font-bold mb-8">Bảo mật tài khoản</h2>
                
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm mb-6">
                    <h3 className="text-xl font-bold text-black mb-6 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Thay đổi mật khẩu
                    </h3>
                    
                    <form onSubmit={handleChangePassword} className="space-y-6">
                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <label htmlFor="currentPassword" className="block text-base font-medium text-black mb-2">
                          Mật khẩu hiện tại
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({
                            ...prev,
                            currentPassword: e.target.value
                          }))}
                          className="block w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20"
                          required
                        />
                      </div>
                      
                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <label htmlFor="newPassword" className="block text-base font-medium text-black mb-2">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({
                            ...prev,
                            newPassword: e.target.value
                          }))}
                          className="block w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20"
                          required
                          minLength={6}
                        />
                        <p className="mt-2 text-sm text-black">Mật khẩu phải có ít nhất 6 ký tự</p>
                      </div>
                      
                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <label htmlFor="confirmPassword" className="block text-base font-medium text-black mb-2">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({
                            ...prev,
                            confirmPassword: e.target.value
                          }))}
                          className="block w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20"
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Cập nhật mật khẩu
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-black mb-6 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Cài đặt bảo mật
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b">
                        <div>
                          <h4 className="font-medium text-black">Xác thực hai yếu tố</h4>
                          <p className="text-black mt-1">Tăng cường bảo mật cho tài khoản của bạn</p>
                        </div>
                        <button className="px-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition">
                          Thiết lập
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b">
                        <div>
                          <h4 className="font-medium text-black">Phiên đăng nhập</h4>
                          <p className="text-black mt-1">Quản lý các thiết bị đã đăng nhập</p>
                        </div>
                        <button className="px-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition">
                          Xem
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <h4 className="font-medium text-red-600">Xóa tài khoản</h4>
                          <p className="text-black mt-1">Xóa vĩnh viễn tài khoản và dữ liệu của bạn</p>
                        </div>
                        <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition">
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

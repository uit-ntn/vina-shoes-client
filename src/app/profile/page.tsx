'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { toast } from 'react-hot-toast';
import { User, Address } from '@/types/user';
import { userService } from '@/services/user.service';
import Link from 'next/link';
import Image from '@/components/ui/Image';

type TabType = 'profile' | 'addresses' | 'orders' | 'wishlist' | 'security';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { orders, loading: ordersLoading, fetchUserOrders } = useOrder();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    addresses: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    country: 'Việt Nam',
    postalCode: '',
    isDefault: false
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        addresses: user.addresses || []
      });
      if (user.addresses) {
        setAddresses(user.addresses);
      }
    }
  }, [user]);

  // Load orders when switching to orders tab
  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchUserOrders();
    }
  }, [activeTab, user, fetchUserOrders]);

  // Load wishlist when switching to wishlist tab
  useEffect(() => {
    if (activeTab === 'wishlist' && user) {
      loadWishlist();
    }
  }, [activeTab, user]);

  const loadWishlist = async () => {
    try {
      const wishlistData = await userService.getWishlist();
      setWishlist(wishlistData);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast.error('Có lỗi khi tải danh sách yêu thích');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const loadingToast = toast.loading('Đang thêm địa chỉ...');
      
      // Update user addresses in formData
      const newAddress = { ...addressForm };
      const updatedAddresses = [...addresses, newAddress];
      
      // If this is the first address or marked as default, set it as default
      if (updatedAddresses.length === 1 || newAddress.isDefault) {
        updatedAddresses.forEach((addr, index) => {
          addr.isDefault = index === updatedAddresses.length - 1;
        });
      }
      
      setAddresses(updatedAddresses);
      
      // Update user profile with new addresses
      await updateProfile({
        ...formData,
        addresses: updatedAddresses
      });
      
      toast.success('Thêm địa chỉ thành công!', { id: loadingToast });
      setShowAddressForm(false);
      setAddressForm({
        street: '',
        city: '',
        state: '',
        country: 'Việt Nam',
        postalCode: '',
        isDefault: false
      });
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm địa chỉ');
    }
  };

  const handleDeleteAddress = async (index: number) => {
    try {
      const loadingToast = toast.loading('Đang xóa địa chỉ...');
      const updatedAddresses = addresses.filter((_, i) => i !== index);
      
      // If deleted address was default and there are other addresses, set first one as default
      if (addresses[index].isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      
      setAddresses(updatedAddresses);
      await updateProfile({
        ...formData,
        addresses: updatedAddresses
      });
      
      toast.success('Xóa địa chỉ thành công!', { id: loadingToast });
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa địa chỉ');
    }
  };

  const handleSetDefaultAddress = async (index: number) => {
    try {
      const updatedAddresses = addresses.map((addr, i) => ({
        ...addr,
        isDefault: i === index
      }));
      
      setAddresses(updatedAddresses);
      await updateProfile({
        ...formData,
        addresses: updatedAddresses
      });
      
      toast.success('Đã đặt làm địa chỉ mặc định!');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await userService.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(item => item._id !== productId));
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-blue-100">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-3">Cần đăng nhập</h1>
          <p className="text-black mb-6">Vui lòng đăng nhập để xem thông tin cá nhân</p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">Tài khoản của tôi</h1>
          <p className="text-black/70">Quản lý thông tin cá nhân và đơn hàng</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-blue-100">
              {/* User Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
                <div className="w-28 h-28 mx-auto rounded-full bg-white mb-4 border-4 border-white shadow-lg overflow-hidden">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      width={112}
                      height={112}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                <p className="text-blue-100">{user.email}</p>
                <div className="mt-4 inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Đang hoạt động
                </div>
                </div>
              
              {/* Navigation */}
              <nav className="p-6">
                <div className="space-y-2">
                  {[
                    { id: 'profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Thông tin cá nhân' },
                    { id: 'addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Địa chỉ giao hàng' },
                    { id: 'orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', label: 'Đơn hàng của tôi' },
                    { id: 'wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', label: 'Sản phẩm yêu thích' },
                    { id: 'security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: 'Bảo mật tài khoản' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as TabType)}
                      className={`w-full text-left px-6 py-4 rounded-xl flex items-center transition-all duration-200 ${
                        activeTab === item.id 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                          : 'text-black hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white shadow-xl rounded-3xl border border-blue-100 overflow-hidden">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-black mb-2">Thông tin cá nhân</h2>
                      <p className="text-black/70">Quản lý thông tin tài khoản của bạn</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-6 py-3 rounded-xl flex items-center font-medium transition-all ${
                        isEditing
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d={isEditing ? "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" : "M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"} />
                      </svg>
                      {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                        <label htmlFor="name" className="block text-lg font-semibold text-black mb-3">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="block w-full h-14 px-4 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-0 disabled:bg-blue-50 text-black font-medium placeholder-black/50"
                          placeholder="Nhập họ và tên"
                        />
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                        <label htmlFor="email" className="block text-lg font-semibold text-black mb-3">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          disabled
                          className="block w-full h-14 px-4 rounded-xl border-2 border-purple-200 bg-purple-50 text-black font-medium"
                        />
                        <p className="mt-3 text-sm text-black/70 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Email không thể thay đổi
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                        <label htmlFor="phone" className="block text-lg font-semibold text-black mb-3">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="block w-full h-14 px-4 rounded-xl border-2 border-green-200 focus:border-green-500 focus:ring-0 disabled:bg-green-50 text-black font-medium placeholder-black/50"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                        <label className="block text-lg font-semibold text-black mb-3">
                          Vai trò
                        </label>
                        <div className="flex items-center h-14">
                          <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-800 border border-red-200' 
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {user.role === 'admin' ? '👑 Quản trị viên' : '👤 Khách hàng'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-8 text-center">
                        <button
                          type="submit"
                          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Lưu thay đổi
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-black mb-2">Địa chỉ giao hàng</h2>
                      <p className="text-black/70">Quản lý địa chỉ giao hàng của bạn</p>
                    </div>
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Thêm địa chỉ mới
                    </button>
                  </div>

                  {/* Add Address Form */}
                  {showAddressForm && (
                    <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                      <h3 className="text-xl font-bold text-black mb-4">Thêm địa chỉ mới</h3>
                      <form onSubmit={handleAddAddress}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">Địa chỉ</label>
                            <input
                              type="text"
                              name="street"
                              value={addressForm.street}
                              onChange={handleAddressChange}
                              className="w-full h-12 px-4 rounded-lg border-2 border-blue-200 focus:border-blue-500 text-black"
                              placeholder="Số nhà, tên đường"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">Thành phố</label>
                            <input
                              type="text"
                              name="city"
                              value={addressForm.city}
                              onChange={handleAddressChange}
                              className="w-full h-12 px-4 rounded-lg border-2 border-blue-200 focus:border-blue-500 text-black"
                              placeholder="Thành phố"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">Tỉnh/Thành</label>
                            <input
                              type="text"
                              name="state"
                              value={addressForm.state}
                              onChange={handleAddressChange}
                              className="w-full h-12 px-4 rounded-lg border-2 border-blue-200 focus:border-blue-500 text-black"
                              placeholder="Tỉnh/Thành phố"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">Mã bưu điện</label>
                            <input
                              type="text"
                              name="postalCode"
                              value={addressForm.postalCode}
                              onChange={handleAddressChange}
                              className="w-full h-12 px-4 rounded-lg border-2 border-blue-200 focus:border-blue-500 text-black"
                              placeholder="Mã bưu điện"
                            />
                          </div>
                        </div>
                        <div className="flex items-center mb-4">
                          <input
                            type="checkbox"
                            name="isDefault"
                            checked={addressForm.isDefault}
                            onChange={handleAddressChange}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label className="ml-2 text-sm font-medium text-black">Đặt làm địa chỉ mặc định</label>
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
                          >
                            Lưu địa chỉ
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="px-6 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition"
                          >
                            Hủy
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  {addresses.length === 0 ? (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 text-center border border-blue-200">
                      <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-black mb-3">Chưa có địa chỉ nào</h3>
                      <p className="text-black/70 mb-6">Thêm địa chỉ giao hàng để tiện lợi hơn khi mua sắm</p>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all inline-flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Thêm địa chỉ đầu tiên
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {addresses.map((address, index) => (
                        <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 overflow-hidden shadow-lg">
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-black mb-2">{address.street}</h3>
                                <p className="text-black mb-1">{address.city}</p>
                                {address.state && <p className="text-black mb-1">{address.state}</p>}
                                <p className="text-black mb-1">{address.country}</p>
                                {address.postalCode && (
                                  <p className="text-black">Mã bưu điện: {address.postalCode}</p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDeleteAddress(index)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-full transition"
                                  title="Xóa địa chỉ"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            {address.isDefault && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Địa chỉ mặc định
                              </span>
                            )}
                          </div>
                          
                          {!address.isDefault && (
                            <div className="px-6 py-3 bg-blue-100 border-t border-blue-200">
                              <button 
                                className="text-blue-600 font-medium hover:text-blue-800 transition text-sm flex items-center"
                                onClick={() => handleSetDefaultAddress(index)}
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
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-black mb-2">Đơn hàng của tôi</h2>
                    <p className="text-black/70">Theo dõi trạng thái đơn hàng và lịch sử mua sắm</p>
                  </div>
                  
                  {ordersLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-4 text-black">Đang tải đơn hàng...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 text-center border border-blue-200">
                      <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-black mb-3">Chưa có đơn hàng nào</h3>
                      <p className="text-black/70 mb-6">Bạn chưa thực hiện đơn hàng nào. Hãy khám phá cửa hàng!</p>
                      <Link
                        href="/shop"
                        className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all inline-flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Mua sắm ngay
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 overflow-hidden shadow-lg">
                          <div className="p-6">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                              <div>
                                <div className="flex items-center mb-2">
                                  <h3 className="text-xl font-bold text-black">Đơn hàng #{order.id.substring(0, 8).toUpperCase()}</h3>
                                  <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800 border border-green-200' :
                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                    'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                  }`}>
                                    {order.status === 'pending' && '⏳ Chờ xử lý'}
                                    {order.status === 'processing' && '🔄 Đang xử lý'}
                                    {order.status === 'shipped' && '🚚 Đang giao'}
                                    {order.status === 'delivered' && '✅ Đã giao'}
                                    {order.status === 'cancelled' && '❌ Đã hủy'}
                                  </span>
                                </div>
                                <div className="flex items-center text-black/70 text-sm mb-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
                                  </svg>
                                  <span>Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex items-center text-black/70 text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                  </svg>
                                  <span>{order.items.length} sản phẩm</span>
                                </div>
                              </div>
                              <div className="mt-4 lg:mt-0 text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                  {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                  }).format(order.totalAmount)}
                                </div>
                                <div className="text-sm text-black/70 mt-1">
                                  {order.isPaid ? '✅ Đã thanh toán' : '⏳ Chưa thanh toán'}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                              <Link
                                href={`/orders/${order.id}`}
                                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Xem chi tiết
                              </Link>
                              
                              {(order.status === 'pending' || order.status === 'processing') && (
                                <button 
                                  className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition"
                                  onClick={() => {/* TODO: Cancel order */}}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Hủy đơn hàng
                                </button>
                              )}
                              
                              {order.status === 'delivered' && (
                                <button 
                                  className="inline-flex items-center px-4 py-2 bg-green-100 text-green-600 rounded-lg font-medium hover:bg-green-200 transition"
                                  onClick={() => {/* TODO: Review order */}}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                  Đánh giá
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-black mb-2">Sản phẩm yêu thích</h2>
                    <p className="text-black/70">Danh sách sản phẩm bạn đã lưu</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-12 text-center border border-pink-200">
                    <div className="w-20 h-20 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3">Chưa có sản phẩm yêu thích</h3>
                    <p className="text-black/70 mb-6">Thêm sản phẩm vào danh sách yêu thích để dễ dàng tìm kiếm sau này</p>
                    <Link
                      href="/shop"
                      className="px-6 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-all inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Khám phá sản phẩm
                    </Link>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-black mb-2">Bảo mật tài khoản</h2>
                    <p className="text-black/70">Quản lý mật khẩu và cài đặt bảo mật</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Change Password */}
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 p-6">
                      <h3 className="text-xl font-bold text-black mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Đổi mật khẩu
                      </h3>
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Mật khẩu hiện tại</label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-red-200 focus:border-red-500 focus:ring-0 text-black"
                            placeholder="Nhập mật khẩu hiện tại"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Mật khẩu mới</label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-red-200 focus:border-red-500 focus:ring-0 text-black"
                            placeholder="Nhập mật khẩu mới"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Xác nhận mật khẩu mới</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-red-200 focus:border-red-500 focus:ring-0 text-black"
                            placeholder="Xác nhận mật khẩu mới"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
                        >
                          Đổi mật khẩu
                        </button>
                      </form>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
                      <h3 className="text-xl font-bold text-black mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Cài đặt bảo mật
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
                          <div>
                            <h4 className="font-medium text-black">Xác thực hai yếu tố</h4>
                            <p className="text-sm text-black/70">Tăng cường bảo mật tài khoản</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
                          <div>
                            <h4 className="font-medium text-black">Thông báo email</h4>
                            <p className="text-sm text-black/70">Nhận thông báo về hoạt động tài khoản</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
                          <div>
                            <h4 className="font-medium text-black">Thông báo SMS</h4>
                            <p className="text-sm text-black/70">Nhận thông báo qua tin nhắn</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
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

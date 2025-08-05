'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

// Enhance Address type with properties we need
interface ExtendedAddress {
  _id?: string;
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  zipCode?: string;
  isDefault?: boolean;
  // Additional fields
  fullName?: string;
  phone?: string;
  ward?: string;
  district?: string;
}

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<ExtendedAddress[]>(user?.addresses || []);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<ExtendedAddress>({
    street: '',
    city: '',
    country: 'Vietnam',
    fullName: '',
    phone: '',
    ward: '',
    district: '',
    isDefault: false,
  });

  // Handle address form change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (isEditingAddress) {
      // Updating existing address
      const updatedAddress = addresses.map(addr => 
        addr._id === isEditingAddress ? { ...addr, [name]: value } : addr
      );
      setAddresses(updatedAddress);
    } else {
      // Adding new address
      setNewAddress({
        ...newAddress,
        [name]: value
      });
    }
  };

  // Handle adding address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, this would call an API
      // For now, we'll add the address to our local state
      const mockId = `addr_${Date.now()}`;
      const newAddrWithId = { ...newAddress, _id: mockId };
      setAddresses([...addresses, newAddrWithId]);
      toast.success('Thêm địa chỉ mới thành công!');
      setIsAddingAddress(false);
      setNewAddress({
        street: '',
        city: '',
        country: 'Vietnam',
        fullName: '',
        phone: '',
        ward: '',
        district: '',
        isDefault: false,
      });
    } catch (error) {
      toast.error('Không thể thêm địa chỉ. Vui lòng thử lại sau.');
    }
  };

  // Handle editing address
  const handleEditAddress = async (addressId: string) => {
    try {
      // In a real app, this would call an API
      // For now, we'll just update the local state
      toast.success('Cập nhật địa chỉ thành công!');
      setIsEditingAddress(null);
    } catch (error) {
      toast.error('Không thể cập nhật địa chỉ. Vui lòng thử lại sau.');
    }
  };

  // Handle removing address
  const handleRemoveAddress = async (addressId: string) => {
    try {
      // In a real app, this would call an API
      setAddresses(addresses.filter(a => a._id !== addressId));
      toast.success('Xóa địa chỉ thành công!');
    } catch (error) {
      toast.error('Không thể xóa địa chỉ. Vui lòng thử lại sau.');
    }
  };

  // Handle setting default address
  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      // In a real app, this would call an API
      setAddresses(addresses.map(a => ({
        ...a,
        isDefault: a._id === addressId
      })));
      toast.success('Đã cập nhật địa chỉ mặc định!');
    } catch (error) {
      toast.error('Không thể cập nhật địa chỉ mặc định. Vui lòng thử lại sau.');
    }
  };

  // Addresses page component logic

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Địa chỉ giao hàng</h3>
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Thêm địa chỉ mới
                </button>
              </div>
              
              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="mb-8 bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-lg text-blue-800 mb-4">Thêm địa chỉ mới</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                      <input
                        type="text"
                        name="fullName"
                        value={newAddress.fullName || ''}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        name="phone"
                        value={newAddress.phone || ''}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                      <input
                        type="text"
                        name="street"
                        value={newAddress.street}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                      <input
                        type="text"
                        name="ward"
                        value={newAddress.ward || ''}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                      <input
                        type="text"
                        name="district"
                        value={newAddress.district || ''}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                      <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="col-span-2 mt-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={!!newAddress.isDefault}
                          onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Đặt làm địa chỉ mặc định</span>
                      </label>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Lưu địa chỉ
                    </button>
                  </div>
                </form>
              )}
              
              {addresses.length === 0 ? (
                <div className="text-center py-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h4 className="mt-3 text-lg font-medium text-gray-800">Chưa có địa chỉ giao hàng</h4>
                  <p className="mt-1 text-gray-600">Thêm địa chỉ để tiện lợi hơn khi mua sắm.</p>
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Thêm địa chỉ mới
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`border rounded-lg p-4 ${
                        address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-1">
                            <h4 className="font-medium text-gray-900">{address.fullName}</h4>
                            {address.isDefault && (
                              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600">{address.phone}</p>
                          <p className="text-gray-600 mt-1">
                            {address.street}, {address.ward}, {address.district}, {address.city}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setIsEditingAddress(address._id || null)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleRemoveAddress(address._id || '')}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(address._id || '')}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          Đặt làm địa chỉ mặc định
                        </button>
                      )}
                      
                      {isEditingAddress === address._id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-3">Chỉnh sửa địa chỉ</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                              <input
                                type="text"
                                name="fullName"
                                value={address.fullName || ''}
                                onChange={handleAddressChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                              <input
                                type="tel"
                                name="phone"
                                value={address.phone || ''}
                                onChange={handleAddressChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                              <input
                                type="text"
                                name="street"
                                value={address.street}
                                onChange={handleAddressChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                              <input
                                type="text"
                                name="ward"
                                value={address.ward || ''}
                                onChange={handleAddressChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                              <input
                                type="text"
                                name="district"
                                value={address.district || ''}
                                onChange={handleAddressChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                              <input
                                type="text"
                                name="city"
                                value={address.city}
                                onChange={handleAddressChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setIsEditingAddress(null)}
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditAddress(address._id || '')}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                              Lưu thay đổi
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
  );
}

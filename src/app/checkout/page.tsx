'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  image: string;
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrder();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [orderProcessed, setOrderProcessed] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  // Shipping information state
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: '',
  });

  // Available payment methods
  const paymentMethods: PaymentMethod[] = [
    { id: 'visa', name: 'Visa', image: '/payment-visa.svg' },
    { id: 'mastercard', name: 'Mastercard', image: '/payment-mastercard.svg' },
    { id: 'paypal', name: 'PayPal', image: '/payment-paypal.svg' },
    { id: 'amex', name: 'American Express', image: '/payment-amex.svg' },
    { id: 'cod', name: 'Thanh toán khi nhận hàng', image: '/payment-cod.svg' },
  ];

  // Calculate order summary
  const subtotal = cart?.items.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  const shipping = subtotal > 0 ? 30000 : 0; // Phí vận chuyển 30,000 VND
  const total = subtotal + shipping;

  // Pre-fill user information if available
  useEffect(() => {
    if (user) {
      // Get the default address if available
      const defaultAddress = user.addresses?.find(addr => addr.isDefault) || user.addresses?.[0];
      
      setShippingInfo(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: defaultAddress?.street || '',
        city: defaultAddress?.city || '',
        zipCode: defaultAddress?.postalCode || '',
      }));
    }
  }, [user]);

  // Check if cart is empty and redirect to cart page if it is
  useEffect(() => {
    if (cart && (!cart.items || cart.items.length === 0) && !orderProcessed) {
      toast.error('Giỏ hàng của bạn trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
      router.push('/cart');
    }
  }, [cart, router, orderProcessed]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPaymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error('Giỏ hàng của bạn trống');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create the order object
      const order = {
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          size: item.size,
          image: item.image
        })),
        shippingInfo,
        paymentMethod: selectedPaymentMethod,
        subtotal,
        shipping,
        total,
        status: selectedPaymentMethod === 'cod' ? 'pending' : 'processing',
        isPaid: selectedPaymentMethod !== 'cod'
      };

      // Use the OrderContext createOrder function
      const newOrder = await createOrder({
        items: order.items,
        shippingInfo: order.shippingInfo,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        status: order.status,
        isPaid: order.isPaid
      });
      
      setOrderId(newOrder.id);
      
      // Clear the cart after successful order
      await clearCart();
      
      // Show success message
      toast.success('Đặt hàng thành công!');
      setOrderProcessed(true);

      // If payment method is not COD, redirect to payment gateway
      if (selectedPaymentMethod !== 'cod') {
        // Simulate payment processing for this example
        setTimeout(() => {
          router.push(`/account/orders/${orderId}`);
        }, 2000);
      } else {
        // For COD, redirect to order confirmation
        setTimeout(() => {
          router.push(`/account/orders/${orderId}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message when order is processed
  if (orderProcessed) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h2>
          <p className="text-gray-600 mb-6">Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là: <span className="font-medium text-blue-600">{orderId}</span></p>
          
          {selectedPaymentMethod === 'cod' ? (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">Đơn hàng của bạn sẽ được giao trong 3-5 ngày làm việc. Bạn sẽ thanh toán khi nhận hàng.</p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">Đơn hàng của bạn đang được xử lý sau khi thanh toán thành công. Bạn sẽ nhận được email xác nhận trong thời gian ngắn.</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/account/orders">
              <div className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Xem đơn hàng
              </div>
            </Link>
            <Link href="/shop">
              <div className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                Tiếp tục mua sắm
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">Trang chủ</Link>
        <span className="px-2">/</span>
        <Link href="/cart" className="hover:text-gray-700">Giỏ hàng</Link>
        <span className="px-2">/</span>
        <span className="text-gray-900 font-medium">Thanh toán</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Summary */}
        <div className="space-y-6 lg:order-2">
          <h2 className="text-2xl font-bold text-gray-800">Thông tin đơn hàng</h2>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            {/* Order Items */}
            {cart && cart.items && cart.items.length > 0 ? (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex items-center space-x-4 border-b pb-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image || '/images/placeholder-shoe.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                      <p className="text-gray-600">Size: {item.size}</p>
                      <p className="text-gray-600">SL: {item.quantity} x {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</p>
                    </div>
                    <p className="font-semibold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">Không có sản phẩm nào trong giỏ hàng</p>
              </div>
            )}

            {/* Order Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Tổng tiền:</span>
                <span className="text-blue-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Phương thức thanh toán</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                  className={`border rounded-lg p-4 flex flex-col items-center justify-center hover:border-blue-500 cursor-pointer transition-all ${
                    selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50 shadow-sm' : ''
                  }`}
                >
                  {method.id === 'cod' ? (
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mb-2">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    </div>
                  ) : (
                    <Image
                      src={method.image}
                      alt={method.name}
                      width={60}
                      height={40}
                      className="object-contain mb-2"
                    />
                  )}
                  <span className="text-xs text-center">{method.name}</span>
                </div>
              ))}
            </div>
            
            {selectedPaymentMethod && selectedPaymentMethod !== 'cod' && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Lưu ý:</span> Đối với thanh toán bằng thẻ, bạn sẽ được chuyển đến trang thanh toán an toàn sau khi đặt hàng.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Shipping Information */}
        <div className="space-y-6 lg:order-1">
          <h2 className="text-2xl font-bold text-gray-800">Thông tin giao hàng</h2>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Thành phố</label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mã bưu điện</label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
              <textarea
                name="notes"
                value={shippingInfo.notes}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                placeholder="Thông tin bổ sung về đơn hàng của bạn"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !selectedPaymentMethod || !cart || !cart.items || cart.items.length === 0}
              className={`w-full py-3 px-4 rounded-md transition-colors flex items-center justify-center ${
                isLoading || !selectedPaymentMethod || !cart || !cart.items || cart.items.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                'Đặt hàng'
              )}
            </button>
          </form>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 text-sm text-blue-700">
                Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng và hỗ trợ trải nghiệm của bạn trên trang web này.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

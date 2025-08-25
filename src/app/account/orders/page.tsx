'use client';

import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { toast } from 'react-hot-toast';
import { OrderStatus, PaymentStatus, OrderItem } from '@/types/order';
import Link from 'next/link';
import Image from 'next/image';

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { orders, loading, cancelOrder, fetchUserOrders } = useOrder();
  const fetchedRef = useRef(false);
  
  useEffect(() => {
    if (user && !fetchedRef.current) {
      console.log('Fetching orders...');
      fetchUserOrders();
      fetchedRef.current = true;
    }
    
    // Reset fetch flag when component unmounts
    return () => {
      fetchedRef.current = false;
    };
  }, [user, fetchUserOrders]);

  // Format date string
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get status badge color based on order status
  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-black bg-opacity-5 text-black font-medium';
      case 'processing':
        return 'bg-black bg-opacity-10 text-black font-medium';
      case 'shipped':
        return 'bg-black bg-opacity-15 text-black font-medium';
      case 'delivered':
        return 'bg-black bg-opacity-20 text-black font-semibold';
      case 'cancelled':
        return 'bg-black bg-opacity-10 text-black font-medium';
      default:
        return 'bg-black bg-opacity-5 text-black';
    }
  };
  
  // Get payment status badge color
  const getPaymentBadgeColor = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return 'bg-black bg-opacity-20 text-black font-semibold';
      case 'pending':
        return 'bg-black bg-opacity-5 text-black font-medium';
      case 'failed':
        return 'bg-black bg-opacity-10 text-black font-medium';
      case 'refunded':
        return 'bg-black bg-opacity-15 text-black font-medium';
      default:
        return 'bg-black bg-opacity-5 text-black';
    }
  };

  // Get status text in Vietnamese
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  // Get payment status text in Vietnamese
  const getPaymentStatusText = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'failed':
        return 'Thanh toán thất bại';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      try {
        await cancelOrder(orderId);
        toast.success('Đơn hàng đã được hủy thành công');
      } catch (error) {
        console.error('Error cancelling order:', error);
        toast.error('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
      }
    }
  };
  
  // Orders page component logic

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Đơn hàng của tôi</h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-3 text-gray-600">Đang tải đơn hàng...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h4 className="mt-3 text-lg font-medium text-gray-800">Chưa có đơn hàng</h4>
                  <p className="mt-1 text-gray-600">Bạn chưa đặt đơn hàng nào.</p>
                  <Link href="/shop">
                    <div className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Khám phá sản phẩm
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                          <div className="flex items-center">
                            <span className="text-black font-medium text-sm">Mã đơn hàng:</span>
                            <span className="ml-2 font-semibold">{order.id}</span>
                          </div>
                          <div className="text-black text-sm mt-1 font-medium">
                            Ngày đặt: {formatDate(order.createdAt)}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadgeColor(order.isPaid ? 'paid' : 'pending')}`}>
                            {getPaymentStatusText(order.isPaid ? 'paid' : 'pending')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="px-6 py-4 border-t border-gray-200">
                        {/* Order items summary */}
                        <div className="space-y-3">
                          {order.items.slice(0, 2).map((item: OrderItem) => (
                            <div key={item.productId} className="flex items-center">
                              <div className="w-12 h-12 bg-black bg-opacity-5 rounded flex-shrink-0 mr-3">
                                {/* Display product image if available */}
                                {item.image ? (
                                  <Image 
                                    src={item.image} 
                                    alt={item.name}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-12 h-12 flex items-center justify-center bg-black bg-opacity-10 rounded">
                                    <span className="text-xs font-medium text-black">No img</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-semibold line-clamp-1">{item.name}</div>
                                <div className="text-sm text-black font-medium">
                                  {item.quantity} x {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Show how many more items if there are more than 2 */}
                          {order.items.length > 2 && (
                            <div className="text-sm text-black font-medium">
                              + {order.items.length - 2} sản phẩm khác
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="px-6 py-4 border-t border-black border-opacity-10 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="font-semibold">
                          Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                        </div>
                        
                        <div className="flex gap-2 mt-3 sm:mt-0">
                          <Link href={`/account/orders/${order.id}`}>
                            <div className="px-4 py-2 text-black font-medium border border-black rounded-md hover:bg-black hover:bg-opacity-5 transition-colors">
                              Chi tiết
                            </div>
                          </Link>
                          
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-4 py-2 text-black font-medium border border-black rounded-md hover:bg-black hover:text-white hover:bg-opacity-90 transition-colors"
                            >
                              Hủy đơn
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
  );
}

export default OrdersPage;

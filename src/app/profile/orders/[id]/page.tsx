'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrder } from '@/context/OrderContext';
import Link from 'next/link';
import Image from '@/components/ui/Image';
import React from 'react';
import { Order, OrderStatus, PaymentStatus } from '@/types/order';
import { toast } from 'react-hot-toast';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  // Get the ID from params, with a comment about future React.use() requirement
  // In a future Next.js version, this should be: const orderId = React.use(params).id;
  const orderId = params.id as string;
  const { fetchOrderById, cancelOrder, currentOrder: orderFromContext } = useOrder();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        await fetchOrderById(orderId);
      } catch (error) {
        console.error("Failed to load order details:", error);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId, fetchOrderById]);
  
  // Set our local order state from the context whenever it changes
  useEffect(() => {
    if (orderFromContext) {
      setOrder(orderFromContext);
    }
  }, [orderFromContext]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-black">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-700 mb-4">Đơn hàng này không tồn tại hoặc bạn không có quyền truy cập.</p>
          <Link href="/profile/orders" className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-black">Chi tiết đơn hàng</h1>
        <Link href="/profile/orders" className="text-blue-600 hover:text-blue-800 flex items-center transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại
        </Link>
      </div>

      {/* Order summary will go here - you can expand this later */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <div className="flex items-center mb-2">
                <h3 className="text-xl font-bold text-black">Đơn hàng #{order.id.substring(0, 8).toUpperCase()}</h3>
                <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800 border border-green-200' :
                  order.status === 'processing' || order.status === 'confirmed' || order.status === 'preparing' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                  order.status === 'shipped' || order.status === 'ready_to_ship' || order.status === 'picked_up' || order.status === 'in_transit' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                  order.status === 'returned' || order.status === 'refunded' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                  'bg-yellow-100 text-yellow-800 border border-yellow-200'
                }`}>
                  {order.status === 'pending' && '⏳ Chờ xác nhận'}
                  {order.status === 'processing' && '🔄 Đang xử lý'}
                  {order.status === 'confirmed' && '✓ Đã xác nhận'}
                  {order.status === 'preparing' && '📦 Đang chuẩn bị hàng'}
                  {order.status === 'ready_to_ship' && '📦 Sẵn sàng giao hàng'}
                  {order.status === 'picked_up' && '🚚 Đã lấy hàng'}
                  {order.status === 'in_transit' && '🚚 Đang vận chuyển'}
                  {order.status === 'shipped' && '🚚 Đang giao'}
                  {order.status === 'delivered' && '✅ Đã giao'}
                  {order.status === 'cancelled' && '❌ Đã hủy'}
                  {order.status === 'returned' && '↩️ Đã trả hàng'}
                  {order.status === 'refunded' && '💰 Đã hoàn tiền'}
                </span>
              </div>
              <div className="text-black/70 text-sm">
                Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div className="mt-4 lg:mt-0">
              <span className="text-sm font-medium text-black/70">Tổng tiền:</span>
              <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(order.totalAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-medium text-black mb-4">Sản phẩm đã đặt</h4>
          <div className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <div key={item.productId} className="py-4 flex items-start">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <Image
                    src={item.image || '/images/placeholder-shoe.jpg'}
                    alt={item.name}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div className="flex justify-between text-base font-medium text-black">
                    <h3>{item.name}</h3>
                    <p className="ml-4">{new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(item.price)}</p>
                  </div>
                  <div className="flex items-end justify-between text-sm">
                    <p className="text-black/70">Size: {item.size}</p>
                    <p className="text-black/70">Số lượng: {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Information */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-medium text-black mb-4">Thông tin giao hàng</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-black/70 mb-2">Địa chỉ giao hàng</h5>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-black">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.addressLine}</p>
                <p>{order.shippingAddress.ward}, {order.shippingAddress.district}</p>
                <p>{order.shippingAddress.city}</p>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-black/70 mb-2">Phương thức thanh toán</h5>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-black">{order.paymentMethod}</p>
                <p className={`mt-2 ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.isPaid ? '✓ Đã thanh toán' : '⏳ Chưa thanh toán'}
                </p>
                {order.isPaid && order.paidAt && (
                  <p className="text-sm text-black/70 mt-1">
                    Ngày thanh toán: {new Date(order.paidAt).toLocaleDateString('vi-VN')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-medium text-black mb-4">Tổng quan đơn hàng</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between py-2">
              <span className="text-black/70">Tổng giá trị sản phẩm:</span>
              <span className="font-medium text-black">{new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(order.totalAmount)}</span>
            </div>
            {order.shippingFee && (
              <div className="flex justify-between py-2">
                <span className="text-black/70">Phí vận chuyển:</span>
                <span className="font-medium text-black">{new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(order.shippingFee)}</span>
              </div>
            )}
            {order.tax && order.tax > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-black/70">Thuế:</span>
                <span className="font-medium text-black">{new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(order.tax)}</span>
              </div>
            )}
            {order.discount && order.discount > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-black/70">Giảm giá:</span>
                <span className="font-medium text-green-600">-{new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-2">
              <span className="font-medium text-black">Tổng thanh toán:</span>
              <span className="font-bold text-blue-600">{new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(order.totalAmount + (order.shippingFee || 0) + (order.tax || 0) - (order.discount || 0))}</span>
            </div>
          </div>
        </div>

        {/* Order Actions */}
        <div className="p-6">
          <div className="flex flex-wrap gap-4">
            <Link href="/profile/orders" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors">
              Quay lại danh sách
            </Link>
            
            {(order.status === 'pending' || order.status === 'processing') && (
              <button 
                onClick={() => setShowCancelModal(true)}
                className="inline-flex items-center justify-center px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Hủy đơn hàng
              </button>
            )}
            
            {order.status === 'delivered' && (
              <Link href={`/profile/orders/${order.id}/review`} className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Đánh giá đơn hàng
              </Link>
            )}
            
            {order.status === 'shipped' && (
              <Link href={`/profile/orders/${order.id}/tracking`} className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Theo dõi đơn hàng
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium">Xác nhận hủy đơn hàng</h3>
            </div>
            <div className="p-6">
              <p className="mb-4">Vui lòng cho biết lý do bạn muốn hủy đơn hàng:</p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy đơn hàng..."
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              ></textarea>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={() => setShowCancelModal(false)}
              >
                Đóng
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={async () => {
                  if (!cancelReason.trim()) {
                    toast.error('Vui lòng nhập lý do hủy đơn hàng');
                    return;
                  }
                  
                  try {
                    await cancelOrder(order.id, { reason: cancelReason });
                    toast.success('Đơn hàng đã được hủy thành công');
                    setShowCancelModal(false);
                    
                    // Refresh order data
                    await fetchOrderById(orderId);
                  } catch (error) {
                    console.error('Failed to cancel order:', error);
                    toast.error('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
                  }
                }}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

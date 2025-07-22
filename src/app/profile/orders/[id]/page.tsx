'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useOrder } from '@/context/OrderContext';
import Link from 'next/link';
import Image from '@/components/ui/Image';

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { getOrderById, cancelOrder } = useOrder();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error("Failed to load order details:", error);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId, getOrderById]);

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
              <div className="text-black/70 text-sm">
                Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
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

        {/* Order details content will go here */}
      </div>
    </div>
  );
}

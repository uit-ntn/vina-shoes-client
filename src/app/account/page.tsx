'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineStar,
  AiOutlineTag,
  AiOutlineGift,
  AiOutlineBell,
  AiOutlineCalendar,
} from 'react-icons/ai';
import * as orderService from '@/services/order.service';
import { wishlistService, WishlistItem } from '@/services/wishlist.service';
import { Order } from '@/types/order';
import { NotificationType } from '@/types/user';

// One-file component, minimal + tasteful color accents (blue/indigo/amber/violet)
// Fixed: inner tiles now use subtle tinted backgrounds so they don't blend into parent cards
export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'recommendations'>('overview');

  // real data
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [orderStats, setOrderStats] = useState({ totalOrders: 0, totalSpent: 0, reviewsLeft: 0, pointsEarned: 0 });
  const [dataLoading, setDataLoading] = useState({ orders: true });

  // mock
  const notifications = [
    { id: 1, type: 'order' as NotificationType, message: 'Đơn hàng gần đây của bạn đã được xử lý', time: '2 ngày trước' },
    { id: 2, type: 'promotion' as NotificationType, message: 'Giảm giá 25% cho tất cả sản phẩm mới trong tuần này', time: '5 ngày trước' },
    { id: 3, type: 'system' as NotificationType, message: 'Cập nhật thành công thông tin cá nhân của bạn', time: '1 tuần trước' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Khuyến mãi mùa hè', date: '15/08/2025', description: 'Giảm giá lên đến 40% cho các sản phẩm mùa hè' },
    { id: 2, title: 'Ra mắt bộ sưu tập mới', date: '01/09/2025', description: 'Bộ sưu tập Thu-Đông 2025 sẽ được ra mắt' },
  ];

  useEffect(() => {
    if (user && !loading) {
      const fetchOrders = async () => {
        try {
          setDataLoading((p) => ({ ...p, orders: true }));
          const response = await orderService.getUserOrders();
          if (response?.orders) {
            setOrders(response.orders);
            const totalSpent = response.orders.reduce((sum: number, o: Order) => sum + o.finalAmount, 0);
            setOrderStats((prev) => ({ ...prev, totalOrders: response.orders.length, totalSpent }));
          }
        } catch (e) {
          console.error('Error fetching orders:', e);
        } finally {
          setDataLoading((p) => ({ ...p, orders: false }));
        }
      };

      const fetchWishlist = async () => {
        try {
          const response = await wishlistService.getWishlist(true);
          if (response?.products) setWishlistItems(response.products);
        } catch (e) {
          console.error('Error fetching wishlist:', e);
        }
      };

      setOrderStats((prev) => ({ ...prev, reviewsLeft: 0, pointsEarned: 100 }));
      fetchOrders();
      fetchWishlist();
    }
  }, [user, loading]);

  useEffect(() => {
    if (!loading && !user) router.replace('/login?redirect=/account');
  }, [user, router, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-600" />
          <p className="text-neutral-700">Đang tải thông tin tài khoản...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // helpers (kept inside this function)
  const formatDate = (dateString?: Date | string) => (dateString ? new Date(dateString).toLocaleDateString('vi-VN') : 'N/A');
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const statusBadge = (status: Order['status']) => {
    const label =
      status === 'delivered'
        ? 'Đã giao'
        : status === 'processing'
        ? 'Đang xử lý'
        : status === 'shipped'
        ? 'Đang giao'
        : status === 'pending'
        ? 'Chờ xác nhận'
        : status === 'cancelled'
        ? 'Đã hủy'
        : 'Đang xử lý';
    const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset';
    const tone =
      status === 'delivered'
        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
        : status === 'processing'
        ? 'bg-blue-50 text-blue-700 ring-blue-200'
        : status === 'shipped'
        ? 'bg-amber-50 text-amber-700 ring-amber-200'
        : status === 'pending'
        ? 'bg-neutral-50 text-neutral-700 ring-neutral-200'
        : 'bg-rose-50 text-rose-700 ring-rose-200';
    return <span className={`${base} ${tone}`}>{label}</span>;
  };

  // color-accented stat metadata
  const statMeta = [
    { key: 'orders', label: 'Đơn hàng', value: String(orderStats.totalOrders), icon: <AiOutlineShoppingCart className="h-5 w-5" />, top: 'border-t-sky-400', chip: 'bg-sky-100 text-sky-700' },
    { key: 'spent', label: 'Đã chi tiêu', value: formatPrice(orderStats.totalSpent), icon: <AiOutlineTag className="h-5 w-5" />, top: 'border-t-indigo-400', chip: 'bg-indigo-100 text-indigo-700' },
    { key: 'reviews', label: 'Đánh giá', value: String(orderStats.reviewsLeft), icon: <AiOutlineStar className="h-5 w-5" />, top: 'border-t-amber-400', chip: 'bg-amber-100 text-amber-700' },
    { key: 'points', label: 'Điểm tích lũy', value: String(orderStats.pointsEarned), icon: <AiOutlineGift className="h-5 w-5" />, top: 'border-t-violet-400', chip: 'bg-violet-100 text-violet-700' },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 bg-neutral-50">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(600px_300px_at_100%_0%,_rgba(59,130,246,0.10),_transparent)]" />
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Xin chào, {user.name || 'Quý khách'}!</h1>
            <p className="mt-1 text-neutral-600">Chào mừng quay trở lại với Vina Shoes</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 ring-1 ring-inset ring-blue-200">
              <AiOutlineGift className="h-4 w-4" />
              <span>Thành viên • {orderStats.pointsEarned} điểm</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/account/orders')}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <AiOutlineShoppingCart className="h-4 w-4" /> Đơn hàng
            </button>
            <button
              onClick={() => router.push('/account/wishlist')}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <AiOutlineHeart className="h-4 w-4" /> Yêu thích
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {statMeta.map((s) => (
          <div key={s.key} className={`rounded-xl border border-neutral-200 bg-white p-4 shadow-sm border-t-2 ${s.top}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${s.chip}`}>{s.icon}</div>
                <p className="text-sm text-neutral-600">{s.label}</p>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-neutral-900">{s.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Tabs container */}
      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200">
          <div className="flex w-full items-center gap-1 overflow-x-auto px-2">
            {[
              { key: 'overview', label: 'Tổng quan', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              ) },
              { key: 'orders', label: 'Đơn hàng gần đây', icon: <AiOutlineShoppingCart className="h-4 w-4" /> },
              { key: 'recommendations', label: 'Đề xuất cho bạn', icon: <AiOutlineStar className="h-4 w-4" /> },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as typeof activeTab)}
                aria-current={activeTab === t.key ? 'page' : undefined}
                className={`relative -mb-px inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  activeTab === t.key ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {t.icon}
                {t.label}
                {activeTab === t.key && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Personal info */}
              <div>
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-neutral-900">Thông tin cá nhân</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    { label: 'Họ tên', value: user.name || 'Chưa cập nhật', verified: false },
                    { label: 'Email', value: user.email, verified: !!user.emailVerified },
                    { label: 'Số điện thoại', value: user.phone || 'Chưa cập nhật', verified: false },
                    { label: 'Ngày tham gia', value: formatDate(user.createdAt), verified: false },
                  ].map((f, idx) => (
                    <div key={idx} className="rounded-xl border border-neutral-200 bg-neutral-100 p-4 shadow-sm ring-1 ring-neutral-200">
                      <p className="text-sm text-neutral-600">{f.label}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="font-medium text-neutral-900">{f.value}</p>
                        {f.verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Đã xác thực
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
                    <AiOutlineBell className="h-5 w-5 text-blue-600" /> Thông báo mới
                  </h3>
                  <Link href="/account/notifications" className="text-sm font-medium text-blue-700 hover:underline">
                    Xem tất cả
                  </Link>
                </div>
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-lg border border-neutral-200 bg-neutral-100 p-3 shadow-sm ring-1 ring-neutral-200 hover:shadow-md ${
                        n.type === 'order' ? 'border-l-4 border-l-blue-400' : n.type === 'promotion' ? 'border-l-4 border-l-emerald-400' : 'border-l-4 border-l-purple-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">{n.message}</p>
                          <p className="text-sm text-neutral-500">{n.time}</p>
                        </div>
                        <span className={`mt-1 h-2 w-2 rounded-full ${n.type === 'order' ? 'bg-blue-500' : n.type === 'promotion' ? 'bg-emerald-500' : 'bg-purple-500'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Events */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
                    <AiOutlineCalendar className="h-5 w-5 text-amber-600" /> Sự kiện sắp diễn ra
                  </h3>
                </div>
                <div className="space-y-3">
                  {upcomingEvents.map((e) => (
                    <div key={e.id} className="rounded-lg border border-neutral-200 bg-neutral-100 p-4 shadow-sm ring-1 ring-neutral-200 hover:shadow-md">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-amber-50 to-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200">
                          <div className="text-center leading-tight">
                            <div className="text-[10px] uppercase tracking-wide text-amber-600">{e.date.split('/')[1]}</div>
                            <div className="text-lg font-semibold">{e.date.split('/')[0]}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-neutral-900">{e.title}</h4>
                          <p className="text-sm text-neutral-600">{e.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight text-neutral-900">Đơn hàng gần đây</h2>
                <Link href="/account/orders" className="text-sm font-medium text-blue-700 hover:underline">
                  Xem tất cả đơn hàng
                </Link>
              </div>

              {dataLoading.orders ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 animate-pulse rounded-lg border border-neutral-200 bg-neutral-200" />
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-neutral-900">{order.orderNumber}</span>
                            {statusBadge(order.status)}
                          </div>
                          <p className="mt-1 text-sm text-neutral-600">Ngày đặt: {formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-lg font-semibold text-neutral-900">{formatPrice(order.finalAmount)}</p>
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          >
                            Chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-neutral-600">Bạn chưa có đơn hàng nào</p>
                  <Link href="/shop" className="mt-3 inline-flex items-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
                    Mua sắm ngay
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight text-neutral-900">Đề xuất cho bạn</h2>
                <Link href="/shop" className="text-sm font-medium text-blue-700 hover:underline">
                  Khám phá thêm
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {wishlistItems.slice(0, 4).map((item) => (
                  <div key={item.productId} className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.product?.images?.[0] || '/images/placeholder-shoe.jpg'}
                        alt={item.product?.name || 'Product Image'}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {item.product?.oldPrice && item.product.oldPrice > item.product.price && (
                        <div className="absolute left-2 top-2 rounded-md bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200">
                          -{Math.round((1 - item.product.price / item.product.oldPrice) * 100)}%
                        </div>
                      )}
                      <button
                        aria-label="Wishlist"
                        className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-neutral-500 shadow-sm ring-1 ring-inset ring-neutral-200 backdrop-blur hover:text-rose-500"
                      >
                        <AiOutlineHeart className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="mb-1 truncate font-medium text-neutral-900">{item.product?.name}</h3>
                      {item.product && (
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-neutral-900">{formatPrice(item.product.price)}</p>
                          {item.product.oldPrice && item.product.oldPrice > item.product.price && (
                            <p className="text-sm text-neutral-400 line-through">{formatPrice(item.product.oldPrice)}</p>
                          )}
                        </div>
                      )}
                      <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
                        <AiOutlineShoppingCart className="h-4 w-4" /> Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

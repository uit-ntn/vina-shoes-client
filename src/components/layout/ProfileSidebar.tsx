'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback, useMemo, useState, useEffect } from 'react';

type TabType =
  | 'profile'
  | 'addresses'
  | 'orders'
  | 'wishlist'
  | 'security'
  | 'settings'
  | 'cart';

interface ProfileSidebarProps {
  externalCollapsed?: boolean;
  onToggle?: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  externalCollapsed,
  onToggle,
}) => {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Auto collapse trên mobile lần đầu
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setInternalCollapsed(true);
    }
  }, []);

  const collapsed =
    externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const toggle = () =>
    onToggle ? onToggle() : setInternalCollapsed((s) => !s);

  // Active tab theo URL
  const getActiveTab = (): TabType => {
    if (pathname === '/account') return 'profile';
    if (pathname.includes('/account/addresses')) return 'addresses';
    if (pathname.includes('/account/orders')) return 'orders';
    if (pathname.includes('/account/wishlist')) return 'wishlist';
    if (pathname.includes('/account/security')) return 'security';
    if (pathname.includes('/account/settings')) return 'settings';
    if (pathname.includes('/account/cart')) return 'cart';
    return 'profile';
  };
  const activeTab = getActiveTab();

  const urlFor = useCallback(
    (t: TabType) => (t === 'profile' ? '/account' : `/account/${t}`),
    []
  );

  // Mỗi tab có bộ màu riêng (không dùng chuỗi dynamic để Tailwind build ổn định)
  const tabs = useMemo(
    () => [
      {
        id: 'profile' as TabType,
        label: 'Thông tin tài khoản',
        href: urlFor('profile'),
        colors: {
          itemActive: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
          itemIdle: 'text-neutral-700 hover:bg-neutral-100',
          iconIdle: 'bg-indigo-100 text-indigo-700',
          iconActive: 'bg-indigo-600 text-white',
        },
        icon: (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        id: 'addresses' as TabType,
        label: 'Địa chỉ giao hàng',
        href: urlFor('addresses'),
        colors: {
          itemActive: 'bg-sky-50 text-sky-800 border border-sky-200',
          itemIdle: 'text-neutral-700 hover:bg-neutral-100',
          iconIdle: 'bg-sky-100 text-sky-700',
          iconActive: 'bg-sky-600 text-white',
        },
        icon: (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        id: 'orders' as TabType,
        label: 'Đơn hàng của tôi',
        href: urlFor('orders'),
        colors: {
          itemActive: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
          itemIdle: 'text-neutral-700 hover:bg-neutral-100',
          iconIdle: 'bg-emerald-100 text-emerald-700',
          iconActive: 'bg-emerald-600 text-white',
        },
        icon: (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
          </svg>
        ),
      },
      {
        id: 'cart' as TabType,
        label: 'Giỏ hàng của tôi',
        href: urlFor('cart'),
        colors: {
          itemActive: 'bg-amber-50 text-amber-800 border border-amber-200',
          itemIdle: 'text-neutral-700 hover:bg-neutral-100',
          iconIdle: 'bg-amber-100 text-amber-700',
          iconActive: 'bg-amber-600 text-white',
        },
        icon: (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25z" />
          </svg>
        ),
      },
      {
        id: 'wishlist' as TabType,
        label: 'Danh sách yêu thích',
        href: urlFor('wishlist'),
        colors: {
          itemActive: 'bg-rose-50 text-rose-800 border border-rose-200',
          itemIdle: 'text-neutral-700 hover:bg-neutral-100',
          iconIdle: 'bg-rose-100 text-rose-700',
          iconActive: 'bg-rose-600 text-white',
        },
        icon: (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        ),
      },
      {
        id: 'security' as TabType,
        label: 'Bảo mật tài khoản',
        href: urlFor('security'),
        colors: {
          itemActive: 'bg-red-50 text-red-800 border border-red-200',
          itemIdle: 'text-neutral-700 hover:bg-neutral-100',
          iconIdle: 'bg-red-100 text-red-700',
          iconActive: 'bg-red-600 text-white',
        },
        icon: (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        id: 'settings' as TabType,
        label: 'Cài đặt',
        href: urlFor('settings'),
        colors: {
          itemActive: 'bg-violet-50 text-violet-800 border border-violet-200',
          itemIdle: 'text-neutral-700 hover:bg-neutral-100',
          iconIdle: 'bg-violet-100 text-violet-700',
          iconActive: 'bg-violet-600 text-white',
        },
        icon: (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.986.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.283.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
    ],
    [urlFor]
  );

  return (
    <aside
      className={`h-full ${collapsed ? 'w-16' : 'w-64'} shrink-0 transition-all duration-300`}
    >
      <nav className="relative h-full rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {/* Header + nút đóng ở TRÊN */}
        <div className="flex items-center justify-between px-3 py-3">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-neutral-900 text-xs font-bold text-white">
                VS
              </div>
              <span className="text-sm font-semibold text-neutral-900">
                Vina Shoes
              </span>
            </div>
          )}
          <button
            onClick={toggle}
            className="rounded-full border border-neutral-200 bg-white p-2 shadow-sm hover:bg-neutral-50"
            aria-label={collapsed ? 'Expand' : 'Collapse'}
          >
            <svg
              className="h-4 w-4 text-neutral-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              {collapsed ? (
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              ) : (
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Nội dung: KHÔNG SCROLL */}
        <div className="flex h-[calc(100%-52px)] flex-col overflow-hidden">
          <ul className="flex-1 space-y-1 px-2">
            {tabs.map((t) => {
              const active = activeTab === t.id;
              return (
                <li key={t.id} className="group relative">
                  <Link
                    href={t.href}
                    className={[
                      'flex items-center rounded-xl px-3 py-2 text-sm transition',
                      collapsed ? 'justify-center' : '',
                      active ? t.colors.itemActive : t.colors.itemIdle,
                    ].join(' ')}
                    title={collapsed ? t.label : undefined}
                  >
                    <span
                      className={[
                        'grid place-items-center rounded-md p-2',
                        active ? t.colors.iconActive : t.colors.iconIdle,
                        collapsed ? '' : 'mr-3',
                      ].join(' ')}
                    >
                      {t.icon}
                    </span>
                    {!collapsed && (
                      <span className="font-medium">{t.label}</span>
                    )}
                  </Link>

                  {/* Tooltip khi collapsed */}
                  {collapsed && (
                    <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      {t.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {!collapsed && (
            <div className="p-3">
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-center">
                <p className="text-xs text-neutral-600">Cần hỗ trợ?</p>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-neutral-900 hover:underline"
                >
                  Liên hệ hỗ trợ
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;

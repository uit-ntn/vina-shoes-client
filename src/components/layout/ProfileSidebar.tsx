'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type TabType = 'profile' | 'addresses' | 'orders' | 'wishlist' | 'security' | 'settings';

export default function ProfileSidebar() {
  const pathname = usePathname();
  
  // Determine active tab from current URL path
  const getActiveTab = (): TabType => {
    if (pathname === '/profile') return 'profile';
    if (pathname.includes('/profile/addresses')) return 'addresses';
    if (pathname.includes('/profile/orders')) return 'orders';
    if (pathname.includes('/profile/wishlist')) return 'wishlist';
    if (pathname.includes('/profile/security')) return 'security';
    if (pathname.includes('/profile/settings')) return 'settings';
    return 'profile'; // default
  };
  
  const activeTab = getActiveTab();

  // Define all tabs with their properties
  const tabs = [
    { id: 'profile' as TabType, label: 'Thông tin tài khoản', href: '/profile' },
    { id: 'addresses' as TabType, label: 'Địa chỉ giao hàng', href: '/profile/addresses' },
    { id: 'orders' as TabType, label: 'Đơn hàng của tôi', href: '/profile/orders' },
    { id: 'wishlist' as TabType, label: 'Danh sách yêu thích', href: '/profile/wishlist' },
    { id: 'security' as TabType, label: 'Bảo mật tài khoản', href: '/profile/security' },
    { id: 'settings' as TabType, label: 'Cài đặt', href: '/profile/settings' },
  ];
  
  return (
    <div className="md:w-1/4 w-full mb-6 md:mb-0">
      <nav className="bg-white rounded-lg shadow-md overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <Link href={tab.href}>
                <div
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                    activeTab === tab.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <span
                    className={`${
                      activeTab === tab.id
                        ? 'font-medium text-blue-800'
                        : 'text-gray-900 font-medium'
                    }`}
                  >
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <div className="ml-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

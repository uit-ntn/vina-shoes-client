'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

type TabType = 'profile' | 'addresses' | 'orders' | 'wishlist' | 'security' | 'settings' | 'cart';

interface ProfileSidebarProps {
  externalCollapsed?: boolean;
  onToggle?: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ externalCollapsed, onToggle }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse on mobile
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    // Check on mount
    checkIfMobile();
    
    // Set up resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Determine active tab from current URL path
  const getActiveTab = (): TabType => {
    if (pathname === '/account' || pathname.match(/\/account\/\w+$/)) return 'profile';
    if (pathname.includes('/account/addresses')) return 'addresses';
    if (pathname.includes('/account/orders')) return 'orders';
    if (pathname.includes('/account/wishlist')) return 'wishlist';
    if (pathname.includes('/account/security')) return 'security';
    if (pathname.includes('/account/settings')) return 'settings';
    if (pathname.includes('/account/cart')) return 'cart';
    return 'profile'; // default
  };
  
  const activeTab = getActiveTab();

  // Define all tabs with their properties and colorful icons
  const tabs = [
    { 
      id: 'profile' as TabType, 
      label: 'Thông tin tài khoản', 
      href: '/account',
      color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      textColor: 'text-purple-700',
      iconBg: 'bg-purple-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'addresses' as TabType, 
      label: 'Địa chỉ giao hàng', 
      href: '/account/addresses',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'orders' as TabType, 
      label: 'Đơn hàng của tôi', 
      href: '/account/orders',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      textColor: 'text-green-700',
      iconBg: 'bg-green-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
        </svg>
      )
    },
    { 
      id: 'cart' as TabType, 
      label: 'Giỏ hàng của tôi', 
      href: '/account/cart',
      color: 'bg-gradient-to-r from-orange-500 to-amber-500',
      textColor: 'text-orange-700',
      iconBg: 'bg-orange-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25z" />
        </svg>
      )
    },
    { 
      id: 'wishlist' as TabType, 
      label: 'Danh sách yêu thích', 
      href: '/account/wishlist',
      color: 'bg-gradient-to-r from-pink-500 to-rose-500',
      textColor: 'text-pink-700',
      iconBg: 'bg-pink-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      )
    },
    { 
      id: 'security' as TabType, 
      label: 'Bảo mật tài khoản', 
      href: '/account/security',
      color: 'bg-gradient-to-r from-red-500 to-rose-500',
      textColor: 'text-red-700',
      iconBg: 'bg-red-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'settings' as TabType, 
      label: 'Cài đặt', 
      href: '/account/settings',
      color: 'bg-gradient-to-r from-gray-500 to-slate-600',
      textColor: 'text-gray-700',
      iconBg: 'bg-gray-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.986.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
        </svg>
      )
    },
  ];

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    // If we have an external toggle function, use it
    if (onToggle) {
      onToggle();
    } else {
      // Otherwise manage state internally
      setIsCollapsed(!isCollapsed);
    }
  };
  
  // Use external collapsed state if provided
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : isCollapsed;
  
  return (
    <div className={`transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'md:w-1/4'} w-full mb-6 md:mb-0`}>
      <nav className="bg-white rounded-xl shadow-lg overflow-hidden h-full relative">
        {/* Mobile toggle button that appears at top of sidebar */}
        {isMobile && (
          <div className="w-full flex justify-between items-center p-3 border-b border-gray-100">
            <span className={`font-bold ${collapsed ? 'hidden' : 'block'}`}>Menu</span>
            <button 
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-700" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {collapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </button>
          </div>
        )}
        
        {/* Toggle button for desktop */}
        <button 
          onClick={toggleSidebar}
          className={`absolute ${collapsed ? 'right-0 top-0 m-2' : 'top-3 -right-3'} z-10 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all`}
          aria-label={collapsed ? "Expand sidebar" : "Hide sidebar"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-gray-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
        </button>

        {/* Sidebar Content */}
        <div className={`pt-4 ${isMobile && collapsed ? 'hidden' : 'block'} h-full`}>
          {!collapsed && (
            <div className="px-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <p className="text-sm text-gray-500">Quản lý tài khoản</p>
            </div>
          )}
          
          <ul className="space-y-2 px-3">
            {tabs.map((tab) => (
              <li key={tab.id} className={`${collapsed ? 'text-center' : ''}`}>
                <Link href={tab.href}>
                  <div
                    className={`flex items-center px-3 py-3 rounded-lg transition-all hover:bg-gray-50 
                      ${activeTab === tab.id ? 
                        `${collapsed ? '' : tab.color + ' text-white shadow-md hover:bg-opacity-90 hover:bg-gradient-to-r'}` : 
                        ''
                      } ${collapsed ? 'justify-center flex-col' : ''}`}
                  >
                    <div className={`${collapsed ? '' : 'mr-3'} ${
                      activeTab === tab.id ? 
                        'text-white' : 
                        `${tab.iconBg} ${tab.textColor}`
                      } p-2 rounded-lg`}
                    >
                      {tab.icon}
                    </div>
                    
                    {!collapsed && (
                      <span className={`${
                        activeTab === tab.id
                          ? 'font-medium'
                          : `${tab.textColor} font-medium`
                      } ${collapsed ? 'text-xs mt-1' : ''}`}
                      >
                        {tab.label}
                      </span>
                    )}
                    
                    {collapsed && (
                      <span className="text-xs mt-1 text-gray-500">
                        {tab.label.split(' ')[0]}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          
          {!collapsed && (
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Bạn cần giúp đỡ?</p>
                <Link href="/contact" className="text-sm font-medium text-gray-800 hover:underline">
                  Liên hệ hỗ trợ
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default ProfileSidebar;

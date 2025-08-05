'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProfileSidebar from '@/components/layout/ProfileSidebar';
import { useAuth } from '@/context/AuthContext';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  // Handler for toggling sidebar from the parent component
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Profile Header with Title and Toggle Button */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Trang cá nhân</h1>
                {user && (
                  <p className="text-gray-600">Xin chào, <span className="font-medium">{user.name}</span></p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleSidebar} 
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  aria-label={isSidebarCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-gray-700" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    {isSidebarCollapsed ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-2 h-1 w-20 bg-black rounded"></div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Sidebar Navigation */}
            <ProfileSidebar 
              externalCollapsed={isSidebarCollapsed} 
              onToggle={toggleSidebar} 
            />
            
            {/* Main Content Area */}
            <div className={`transition-all duration-300 w-full ${isSidebarCollapsed ? 'md:w-11/12' : 'md:w-3/4'}`}>
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

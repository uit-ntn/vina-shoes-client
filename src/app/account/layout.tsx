'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProfileSidebar from '@/components/layout/ProfileSidebar';
import { useAuth } from '@/context/AuthContext';

const AccountLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user: _user } = useAuth();

  // Handler for toggling sidebar from the parent component
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6 relative">
            {/* Profile Sidebar Navigation - always render but control visibility */}
            <div className={`transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:w-0 overflow-hidden' : 'md:block'}`}>
              <ProfileSidebar
                externalCollapsed={isSidebarCollapsed}
                onToggle={toggleSidebar}
              />
            </div>

            {/* Main Content Area - takes full width when sidebar is hidden */}
            <div className={`transition-all duration-300 w-full ${isSidebarCollapsed ? 'md:w-full' : 'md:flex-1'}`}>
              {/* Toggle button to show sidebar when it's hidden */}
              {isSidebarCollapsed && (
                <button 
                  onClick={toggleSidebar}
                  className="mb-4 p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm border border-purple-100"
                  aria-label="Show sidebar"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-purple-700" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="text-purple-800 font-medium">Hiện menu</span>
                </button>
              )}
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountLayout;

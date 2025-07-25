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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center">
              <div className="relative w-16 h-16 mr-4">
                <img
                  src={user?.avatar || '/images/avatar-placeholder.jpg'}
                  alt="Avatar"
                  className="rounded-full object-cover border-2 border-white w-full h-full"
                />
              </div>
              <div>
                <div className="text-sm font-light">Xin chào,</div>
                <h1 className="text-2xl font-bold">
                  {user ? user.name : 'Khách hàng'}
                </h1>
                <div className="text-sm opacity-80">{user?.email}</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Sidebar Navigation */}
            <ProfileSidebar />
            
            {/* Main Content Area */}
            <div className="md:w-3/4 w-full">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

'use client';

import React from 'react';
import { ProductProvider } from '@/context/ProductContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProductProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
          <div className="min-h-screen">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </ProductProvider>
  );
}

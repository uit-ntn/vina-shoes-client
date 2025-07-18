'use client';

import React from 'react';
import { ProductProvider } from '@/context/ProductContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
              <div className="min-h-screen px-12">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}

import React from 'react';
import Link from 'next/link';
import { ShopFilterProvider } from '@/context/ShopFilterContext';


export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShopFilterProvider>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Shop</span>
          </nav>
        </div>
        
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Shop All Products</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
       
          
          {/* Products Grid */}
          <div className="w-full lg:w-3/4 xl:w-4/5">
            {children}
          </div>
        </div>
      </div>
    </ShopFilterProvider>
  );
}
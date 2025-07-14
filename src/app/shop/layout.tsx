import React from 'react';
import Link from 'next/link';
import FilterSidebar from '@/components/shop/FilterSidebar';
import { ShopFilterProvider } from '@/context/ShopFilterContext';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShopFilterProvider>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-t border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center text-sm">
            <Link href="/" className="text-gray-500 hover:text-blue-600 transition">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Shop</span>
          </nav>
        </div>
      </div>

      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          {/* Page Title */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop All Products</h1>
            <p className="text-lg text-gray-600">
              Find your perfect pair of shoes from our carefully curated collection
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-6">
                <FilterSidebar />
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ShopFilterProvider>
  );
}
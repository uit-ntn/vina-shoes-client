'use client';

import React from 'react';
import { useProducts } from '@/context/ProductContext';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import ProductCard from '@/components/products/ProductCard';

export default function ShopPage() {
  const { 
    filteredProducts, 
    loading, 
    error,
    filters,
    sortBy,
    updateFilters,
    setSortBy,
    clearFilters
  } = useProducts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  const fallbackImageUrl = '/images/product-placeholder.jpg'; // Add a placeholder image to your public folder

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={(product) => {
              // Implement cart functionality
              console.log('Add to cart:', product);
            }}
            onToggleWishlist={(product) => {
              // Implement wishlist functionality
              console.log('Toggle wishlist:', product);
            }}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600 mb-4">
            No products found matching your criteria
          </h3>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
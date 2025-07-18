'use client';

import React, { useState } from 'react';
import { useProducts } from '@/context/ProductContext';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineHeart, AiFillHeart, AiOutlineFilter } from 'react-icons/ai';
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';
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
  
  // State for mobile filter visibility
  const [showFilters, setShowFilters] = useState(false);

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
        <p className="text-blue-700">{error}</p>
      </div>
    );
  }

  // Available categories for the filter
  const categories = ['Men', 'Women', 'Kids', 'Sport', 'Casual', 'Formal'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Shop Collection</h1>
        <div className="flex items-center">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-300 w-24 rounded"></div>
          <p className="ml-4 text-blue-700">Discover our premium collection of shoes</p>
        </div>
      </div>

      {/* Filters and Sort Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
          <select 
            className="border border-blue-200 text-blue-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
            <option value="name_desc">Name: Z-A</option>
          </select>
          
          <button
            onClick={clearFilters}
            className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition flex items-center"
          >
            <span>Reset Filters</span>
          </button>
        </div>
        
        <div className="text-blue-800">
          Showing <span className="font-semibold">{filteredProducts.length}</span> products
        </div>
        
        {/* Mobile Filters Button */}
        <button
          className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <AiOutlineFilter className="w-5 h-5 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className={`
          md:w-1/4 lg:w-1/5 bg-white rounded-lg shadow-sm p-4
          ${showFilters ? 'block' : 'hidden'} md:block
          fixed md:static z-10 top-24 left-4 right-4 md:top-auto md:left-auto md:right-auto
          max-h-[calc(100vh-120px)] md:max-h-full overflow-auto
        `}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 border-b border-blue-100 pb-2">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    onChange={() => {
                      const newCategories = filters.category.includes(category)
                        ? filters.category.filter(cat => cat !== category)
                        : [...filters.category, category];
                      updateFilters({ category: newCategories });
                    }}
                    checked={filters.category.includes(category)}
                  />
                  <span className="ml-2 text-blue-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 border-b border-blue-100 pb-2">Price Range</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm text-blue-900 font-semibold mb-1">Min</label>
                    <input
                    type="number"
                    className="w-full rounded-md border border-blue-400 px-3 py-2 text-blue-900 placeholder-blue-400 font-medium"
                    placeholder="0"
                    min="0"
                    onChange={(e) => {
                      const min = Number(e.target.value) || 0;
                      updateFilters({ 
                        priceRange: { 
                          ...filters.priceRange, 
                          min 
                        } 
                      });
                    }}
                    value={filters.priceRange.min || ''}
                  />
                </div>
                <div>
                    <label className="block text-sm text-blue-900 font-semibold mb-1">Max</label>
                    <input
                    type="number"
                    className="w-full rounded-md border border-blue-400 px-3 py-2 text-blue-900 placeholder-blue-400 font-medium"
                    placeholder="1000"
                    min="0"
                    onChange={(e) => {
                      const max = Number(e.target.value) || 0;
                      updateFilters({ 
                        priceRange: { 
                          ...filters.priceRange, 
                          max: max || Infinity
                        } 
                      });
                    }}
                    value={filters.priceRange.max === Infinity ? '' : filters.priceRange.max}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 border-b border-blue-100 pb-2">Sizes</h3>
            <div className="grid grid-cols-3 gap-2">
              {[35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46].map((size) => (
                <button
                  key={size}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium
                    ${filters.sizes.includes(size) 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}
                  `}
                  onClick={() => {
                    const newSizes = filters.sizes.includes(size)
                      ? filters.sizes.filter(s => s !== size)
                      : [...filters.sizes, size];
                    updateFilters({ sizes: newSizes });
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-blue-100">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:w-3/4 lg:w-4/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <div className="text-center py-12 bg-blue-50 rounded-lg border border-blue-100 my-8">
              <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                No products found matching your criteria
              </h3>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
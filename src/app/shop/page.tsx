'use client';

import React from 'react';
import { useProducts } from '@/context/ProductContext';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

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
      {/* Filters and Sort Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Brand Filter */}
          <select
            className="px-4 py-2 border rounded-md"
            value={filters.brand[0] || ''}
            onChange={(e) => updateFilters({ brand: e.target.value ? [e.target.value] : [] })}
          >
            <option value="">All Brands</option>
            <option value="Nike">Nike</option>
            <option value="Adidas">Adidas</option>
            <option value="Puma">Puma</option>
          </select>

          {/* Price Range Filter */}
          <select
            className="px-4 py-2 border rounded-md"
            onChange={(e) => {
              const [min, max] = e.target.value.split('-').map(Number);
              updateFilters({ priceRange: { min, max: max || Infinity } });
            }}
          >
            <option value="0-">All Prices</option>
            <option value="0-50">Under $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200-">$200+</option>
          </select>

          {/* Size Filter */}
          <select
            className="px-4 py-2 border rounded-md"
            value={filters.sizes[0] || ''}
            onChange={(e) => updateFilters({ sizes: e.target.value ? [Number(e.target.value)] : [] })}
          >
            <option value="">All Sizes</option>
            {[38, 39, 40, 41, 42, 43, 44].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Clear Filters
          </button>
        </div>

        {/* Sort */}
        <select
          className="px-4 py-2 border rounded-md"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product._id} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            {/* Product Image */}
            <Link href={`/shop/${product.slug}`}>
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={product.images[0] || fallbackImageUrl}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = fallbackImageUrl;
                  }}
                />
              </div>
            </Link>

            {/* Product Info */}
            <div className="p-4">
              <Link href={`/shop/${product.slug}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                  {product.name}
                </h3>
              </Link>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold text-blue-600">
                  ${product.price.toLocaleString()}
                </span>
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <AiOutlineHeart size={24} className="text-gray-500 hover:text-red-500" />
                </button>
              </div>

              {/* Size and Brand */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Sizes: {product.sizes?.join(', ')}</span>
                <span>{product.brand}</span>
              </div>

              {/* Add to Cart Button */}
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                Add to Cart
              </button>
            </div>

            {/* Tags and Rating */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {!product.inStock && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                  Out of Stock
                </span>
              )}
              {product.rating >= 4.5 && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm">
                  Top Rated
                </span>
              )}
            </div>
          </div>
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
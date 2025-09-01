'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/products/ProductCard';
import { AiOutlineFilter, AiOutlineArrowRight, AiOutlineFire } from 'react-icons/ai';
import { Product } from '@/types/product';

export default function NewArrivalsPage() {
  const { products, loading, error } = useProducts();
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [_filters, _setFilters] = useState({
    categories: [],
    priceRange: [0, 5000000], // VND
    sizes: [],
    brands: []
  });

  useEffect(() => {
    if (products && products.length > 0) {
      // Get the most recent products (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recent = products
        .filter(product => new Date(product.createdAt) >= thirtyDaysAgo)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setNewProducts(recent);

      // Get featured products (based on isNewArrival property)
      const featured = products
        .filter(product => product.isNewArrival)
        .slice(0, 4);
      
      setFeaturedProducts(featured);
    }
  }, [products]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <span className="inline-block bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">Just Arrived</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                New Season, New Style
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Discover our latest arrivals with exclusive designs and premium comfort for every occasion.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link 
                  href="#products" 
                  className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition duration-300"
                >
                  Shop Now
                </Link>
                <Link 
                  href="/shop" 
                  className="bg-transparent border border-white text-white hover:bg-white hover:bg-opacity-10 px-6 py-3 rounded-md font-medium transition duration-300"
                >
                  View Collection
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative h-96">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500 bg-opacity-20 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-blue-400 bg-opacity-20 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-80 h-80">
                  <Image
                    src="/images/placeholder-shoe.jpg"
                    alt="New Arrivals"
                    fill
                    className="object-contain drop-shadow-2xl transform -rotate-12"
                  />
                  <div className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12">
                    NEW
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start p-6 bg-white rounded-lg shadow-sm">
              <div className="mr-4 bg-blue-100 p-3 rounded-lg text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Free Shipping</h3>
                <p className="text-gray-600 text-sm">On all orders over 2,000,000₫</p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white rounded-lg shadow-sm">
              <div className="mr-4 bg-blue-100 p-3 rounded-lg text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Easy Returns</h3>
                <p className="text-gray-600 text-sm">30-day return policy</p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white rounded-lg shadow-sm">
              <div className="mr-4 bg-blue-100 p-3 rounded-lg text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Secure Payments</h3>
                <p className="text-gray-600 text-sm">Protected by industry leaders</p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white rounded-lg shadow-sm">
              <div className="mr-4 bg-blue-100 p-3 rounded-lg text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">24/7 Support</h3>
                <p className="text-gray-600 text-sm">Customer service excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                  <AiOutlineFire size={24} className="text-white mr-2" />
                  <span className="text-white font-medium">Trending Now</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Summer Collection 2025
                </h2>
                <p className="text-white/90 mb-6">
                  Beat the heat with our stylish and comfortable summer collection. Perfect for beach days and city nights.
                </p>
                <Link 
                  href="/shop/summer-collection" 
                  className="inline-flex items-center bg-white text-orange-500 hover:bg-orange-50 px-6 py-3 rounded-md font-medium transition duration-300 self-start"
                >
                  Shop Collection
                  <AiOutlineArrowRight size={16} className="ml-2" />
                </Link>
              </div>
              <div className="relative h-64 md:h-auto">
                <Image
                  src="/images/placeholder-shoe.jpg"
                  alt="Summer Collection"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-orange-500/30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
              <p className="text-gray-600">Our latest and greatest products just for you</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <AiOutlineFilter className="mr-1" />
                Filter Products
              </button>
              <div className="ml-4">
                <select 
                  className="border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="newest"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Panel - Hidden by default on mobile */}
          <div className={`bg-white border rounded-lg p-4 mb-8 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                  <span className="mx-2">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" />
                    <span className="text-sm">Sneakers</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" />
                    <span className="text-sm">Running Shoes</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" />
                    <span className="text-sm">Formal Shoes</span>
                  </label>
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="font-medium mb-2">Brands</h3>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" />
                    <span className="text-sm">Nike</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" />
                    <span className="text-sm">Adidas</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" />
                    <span className="text-sm">Puma</span>
                  </label>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="font-medium mb-2">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {[36, 37, 38, 39, 40, 41, 42, 43, 44].map(size => (
                    <button 
                      key={size}
                      className="min-w-[36px] h-9 border border-gray-300 rounded-md flex items-center justify-center text-sm hover:border-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 mr-4">
                Reset Filters
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600">Failed to load products. Please try again later.</p>
            </div>
          ) : newProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No new products found. Check back soon for new arrivals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {newProducts.map(product => (
                <div key={product._id} className="group">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
              <button className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-blue-50">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Featured Products</h2>
          <p className="text-gray-600 text-center mb-10">Handpicked by our experts</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? featuredProducts.map(product => (
              <div key={product._id}>
                <ProductCard product={product} />
              </div>
            )) : (
              // Skeleton loading for featured products
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="h-64 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse mt-4"></div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/shop" 
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
            >
              View All Products
              <AiOutlineArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-gray-600 mb-6">
              Subscribe to get special offers, free giveaways, and new arrival notifications.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-300"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Follow Us on Instagram</h2>
          <p className="text-gray-600 text-center mb-10">@vinashoes</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Array(6).fill(0).map((_, index) => (
              <Link key={index} href="https://www.instagram.com" className="group relative block h-48 sm:h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-300">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="https://www.instagram.com" 
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow Us
              <AiOutlineArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

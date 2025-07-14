'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useShopFilter } from '@/context/ShopFilterContext';
import { productService } from '@/services/product.service';
import { Product } from '@/types/product';

import ProductCard from '@/components/shop/ProductCard';
import ProductListItem from '@/components/shop/ProductListView';
import ProductSort from '@/components/shop/ProductSort';
import Pagination from '@/components/shop/Pagination';
import FilterSidebar from '@/components/shop/FilterSidebar';
import MobileFilterDrawer from '@/components/shop/MobileFilterDrawer';

export default function ShopPage() {
  // Get filter state from context
  const { 
    filters, 
    setFilter,
    clearFilters,
    sortOption, 
    setSortOption,
    viewMode, 
    setViewMode,
    favorites,
    toggleFavorite,
    currentPage,
    setCurrentPage,
    isMobileFilterOpen,
    setMobileFilterOpen
  } = useShopFilter();
  
  // Product data state
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Convert context filters to API params
        const apiParams = {
          ...filters,
          sort: sortOption,
          page: currentPage
        };
        
        const response = await productService.getProducts(apiParams);
        
        setProducts(response.data);
        setTotalProducts(response.total);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters, sortOption, currentPage]);
  
  // Add to cart handler
  const handleAddToCart = (productId: string) => {
    // Implement cart functionality
    console.log(`Add to cart: ${productId}`);
    // You can dispatch an action to a cart context/store here
  };
  
  return (
    <>

      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          {/* Page Introduction */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Our Collection
            </h2>
            <p className="text-lg text-gray-600">
              Browse through our carefully curated selection of premium footwear. From casual to formal, 
              we have the perfect pair for every occasion and style preference.
            </p>
          </div>

          {/* Mobile filter drawer - shown on small screens */}
          <MobileFilterDrawer
            isOpen={isMobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
          />
          
          {/* Product controls - sorting, view toggle, mobile filter button */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-gray-50 rounded-xl p-4">
            <div className="mb-4 w-full sm:mb-0 sm:w-auto">
              <div className="text-sm font-medium text-gray-500">
                Showing {loading ? '...' : `${(currentPage - 1) * 12 + 1}-${Math.min(currentPage * 12, totalProducts)}`} of {totalProducts} products
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <ProductSort 
                sortOption={sortOption}
                onSortChange={setSortOption}
                totalProducts={totalProducts}
                currentPage={currentPage}
                productsPerPage={12}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              
              <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 flex items-center gap-1.5 ${
                    viewMode === 'grid' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 flex items-center gap-1.5 ${
                    viewMode === 'list' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  List
                </button>
              </div>
              
              <button 
                className="sm:hidden px-4 py-2 border border-gray-200 rounded-lg text-gray-600 flex items-center gap-2"
                onClick={() => setMobileFilterOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filter
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar - visible on large screens */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-6 bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                <div className="p-5 bg-black text-white">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Filter Products
                  </h3>
                </div>
                <div className="p-5">
                  <FilterSidebar />
                </div>
              </div>

              {/* Quick Links Box */}
              <div className="mt-6 bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <h3 className="font-bold text-lg">Popular Brands</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {['Nike', 'Adidas', 'New Balance', 'Puma', 'Converse'].map(brand => (
                      <button 
                        key={brand} 
                        onClick={() => setFilter('brand', brand)}
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products section */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                      <div className="aspect-square bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                        <div className="h-10 bg-gray-200 rounded-md"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
                  <div className="text-red-500 mb-6">{error}</div>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    Try Again
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try changing your filter criteria or browse our entire collection</p>
                  <button 
                    onClick={clearFilters} 
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Active Filters */}
                  {Object.keys(filters).length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-2">
                      {Object.entries(filters).map(([key, value]) => (
                        value && (
                          <div key={key} className="bg-gray-100 rounded-full px-4 py-2 text-sm flex items-center gap-2">
                            <span className="font-medium capitalize">{key}:</span> 
                            <span>{value}</span>
                            <button 
                              onClick={() => setFilter(key as keyof typeof filters, '')} 
                              className="ml-1 text-gray-500 hover:text-gray-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        )
                      ))}
                      {Object.entries(filters).some(([_, value]) => Boolean(value)) && (
                        <button 
                          onClick={clearFilters}
                          className="bg-gray-200 hover:bg-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  )}

                  {viewMode === 'list' ? (
                    <div className="space-y-6">
                      {products.map(product => (
                        <ProductListItem
                          key={product.id}
                          product={product}
                          isFavorite={favorites.includes(product.id)}
                          onToggleFavorite={toggleFavorite}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {products.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isFavorite={favorites.includes(product.id)}
                          onToggleFavorite={toggleFavorite}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Pagination */}
                  {products.length > 0 && (
                    <div className="mt-12 flex justify-center">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}

                  {/* Subscribe Section */}
                  <div className="mt-16 bg-gray-900 rounded-xl p-8 text-center">
                    <h3 className="text-white text-2xl font-bold mb-2">Join Our VIP List</h3>
                    <p className="text-gray-300 mb-6">Get exclusive deals and early access to new releases</p>
                    <div className="flex max-w-md mx-auto">
                      <input 
                        type="email" 
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none"
                      />
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg font-medium">
                        Subscribe
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

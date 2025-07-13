'use client';

import React, { useState, useEffect } from 'react';
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
        console.error('Error fetching products:', err);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters, sortOption, currentPage]);
  
  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSortOption(sort);
    setCurrentPage(1); // Reset to first page when sorting changes
  };
  
  // Handle add to cart
  const handleAddToCart = async (productId: string) => {
    try {
      // TODO: Implement cart service integration
      console.log(`Adding product ${productId} to cart`);
      // Show success message
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Collection</h1>
          <p className="mt-2 text-gray-600">Discover our latest styles and classic favorites</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
            <FilterSidebar />
          </div>
          
          {/* Mobile Filter Drawer */}
          <MobileFilterDrawer
            isOpen={isMobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
          />
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filter Products
              </button>
            </div>
            
            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            {/* Error state */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                <div className="flex gap-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}
            
            {/* Products display */}
            {!loading && !error && (
              <>
                {/* Sort and display controls */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                  <ProductSort
                    sortOption={sortOption}
                    onSortChange={handleSortChange}
                    totalProducts={totalProducts}
                    currentPage={currentPage}
                    productsPerPage={filters.limit || 12}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />
                </div>
                
                {/* Active filters */}
                {Object.entries(filters).some(([key, value]) => value && !['page', 'limit'].includes(key)) && (
                  <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                      <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(filters).map(([key, value]) => {
                        if (value && key !== 'page' && key !== 'limit') {
                          return (
                            <button
                              key={key}
                              onClick={() => setFilter(key as keyof typeof filters, undefined)}
                              className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-100 transition"
                            >
                              <span className="capitalize">{key}</span>: {Array.isArray(value) ? value.join(', ') : value}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
                
                {/* No products message */}
                {products.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600">
                      Try adjusting your filters or search criteria.
                    </p>
                  </div>
                )}
                
                {/* Products Grid View */}
                {viewMode === 'grid' && products.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                
                {/* Products List View */}
                {viewMode === 'list' && products.length > 0 && (
                  <div className="space-y-4">
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
                )}
                
                {/* Pagination */}
                {products.length > 0 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

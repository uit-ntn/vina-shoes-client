'use client';

import React, { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductContext';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineHeart, AiFillHeart, AiOutlineFilter, AiOutlineArrowRight, AiOutlineTags, AiOutlinePercentage, AiOutlineShop } from 'react-icons/ai';
import { BsFire, BsStars, BsSearch } from 'react-icons/bs';
import { FiShoppingBag, FiTruck, FiRefreshCw } from 'react-icons/fi';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types/product';

// Extended Product interface to handle additional properties that may come from API
interface ExtendedProduct extends Product {
  salePrice?: number;
  isInWishlist?: boolean;
  numReviews?: number;
}

export default function ShopPage() {
  // Hooks from context
  const { 
    filteredProducts, 
    products,
    loading, 
    error,
    filters,
    sortBy,
    updateFilters,
    setSortBy,
    clearFilters
  } = useProducts();
  
  // State declarations - Luôn đặt tất cả các state ở đầu component
  const [showFilters, setShowFilters] = useState(false);
  const [featuredBrands, setFeaturedBrands] = useState<string[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<ExtendedProduct[]>([]);
  const [showHeroBanner, setShowHeroBanner] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Constants
  const productsPerPage = 8;
  const ageGroups = ['men', 'women', 'kids'];
  const categories = ['Sport', 'Casual', 'Formal', 'Running', 'Lifestyle'];
  const styleTags = ['casual', 'formal', 'running', 'training', 'sports', 'summer'];
  
  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Effect for extracting brands and trending products
  useEffect(() => {
    if (products && products.length > 0) {
      // Get featured brands (assuming products have brand property)
      const brands: Record<string, number> = {};
      products.forEach(product => {
        if (product.brand) {
          brands[product.brand] = (brands[product.brand] || 0) + 1;
        }
      });
      
      const topBrands = Object.entries(brands)
        .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
        .slice(0, 6)
        .map(entry => entry[0]);
      
      setFeaturedBrands(topBrands);
      
      // Get trending products (most viewed, highest rated, or newest)
      const trending = [...products]
        .sort((a, b) => {
          // Sort by some criteria (views, rating, date)
          if (a.rating && b.rating) return b.rating - a.rating;
          return 0;
        })
        .slice(0, 4);
      
      setTrendingProducts(trending);
    }
  }, [products]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
    
    // Update filters for search
    if (e.target.value.trim()) {
      // We'll implement search within the ProductContext
      console.log('Searching for:', e.target.value);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-transparent border-b-blue-300 rounded-full animate-ping absolute inset-0"></div>
        </div>
        <p className="mt-6 text-blue-800 font-medium animate-pulse">Đang tải bộ sưu tập...</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner - Show only on main shop page (no filters applied) */}
      {showHeroBanner && Object.values(filters).every(v => 
        Array.isArray(v) ? v.length === 0 : v === null || (typeof v === 'object' && Object.values(v).every(x => x === null || x === 0 || x === Infinity))
      ) && (
        <div className="relative mb-10 rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" 
               style={{backgroundImage: "url('/images/placeholder-shoe.jpg')"}}></div>
          <div className="relative z-10 px-8 py-16 md:px-16 md:w-3/5 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Bộ Sưu Tập Mới Nhất</h2>
            <p className="text-lg mb-8">Khám phá các mẫu giày mới nhất với thiết kế tinh tế và chất lượng hàng đầu.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop/new-arrivals" className="px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition font-semibold shadow-md">
                Xem bộ sưu tập mới
              </Link>
              <button onClick={() => {
                updateFilters({ isNewArrival: true });
                setShowHeroBanner(false);
              }} className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white hover:text-blue-600 transition font-semibold">
                Mua ngay
              </button>
            </div>
          </div>
          <div className="hidden md:block absolute bottom-0 right-0 w-2/5 h-full">
            <div className="relative h-full">
              <Image 
                src="/images/placeholder-shoe.jpg" 
                alt="Featured Shoe" 
                fill
                style={{objectFit: "cover"}}
                className="transform -rotate-12 scale-125 translate-x-8 translate-y-4"
              />
              <div className="absolute top-8 right-8 bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-bold animate-pulse">
                -25%
              </div>
            </div>
          </div>
          <button onClick={() => setShowHeroBanner(false)} className="absolute top-4 right-4 text-white hover:text-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Cửa hàng giày</h1>
        <div className="flex items-center">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-300 w-24 rounded"></div>
          <p className="ml-4 text-blue-700">Khám phá bộ sưu tập giày cao cấp của chúng tôi</p>
        </div>
      </div>
      
      {/* Featured Brands - Show if no filters applied */}
      {featuredBrands.length > 0 && Object.values(filters).every(v => 
        Array.isArray(v) ? v.length === 0 : v === null || (typeof v === 'object' && Object.values(v).every(x => x === null || x === 0 || x === Infinity))
      ) && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Thương hiệu nổi bật</h2>
            <Link href="/brands" className="text-blue-600 hover:underline flex items-center">
              <span>Xem tất cả</span>
              <AiOutlineArrowRight className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredBrands.map((brand) => (
              <button 
                key={brand}
                onClick={() => {
                  // Filter by this brand
                  console.log('Filter by brand:', brand);
                }}
                className="bg-white rounded-lg shadow-sm p-4 h-24 flex flex-col items-center justify-center transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                  <AiOutlineShop className="text-blue-600 text-xl" />
                </div>
                <span className="text-blue-900 font-medium text-sm">{brand}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Trending Products Section - Show if no filters applied */}
      {trendingProducts.length > 0 && showHeroBanner && Object.values(filters).every(v => 
        Array.isArray(v) ? v.length === 0 : v === null || (typeof v === 'object' && Object.values(v).every(x => x === null || x === 0 || x === Infinity))
      ) && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-900 flex items-center">
              <BsFire className="mr-2 text-red-500" />
              Sản phẩm xu hướng
            </h2>
            <button 
              onClick={() => setSortBy('newest')}
              className="text-blue-600 hover:underline flex items-center"
            >
              <span>Xem thêm</span>
              <AiOutlineArrowRight className="ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingProducts.map(product => (
              <div key={product._id} className="group">
                <Link href={`/shop/${product._id}`} className="block">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all group-hover:shadow-md group-hover:-translate-y-1 h-[360px] flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-blue-50">
                      <Image
                        src={product.images?.[0] || '/images/placeholder-shoe.jpg'}
                        alt={product.name}
                        fill
                        style={{objectFit: "cover"}}
                        className="group-hover:scale-110 transition-transform duration-300"
                      />
                      {(product as any).salePrice && product.price > (product as any).salePrice && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                          -{Math.round(((product.price - (product as any).salePrice) / product.price) * 100)}%
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-semibold text-blue-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 h-12">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        {Array.from({length: 5}).map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                               fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                        <span className="text-sm text-blue-600 ml-1">{product.rating?.toFixed(1) || "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-blue-900 font-bold">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </span>
                        {!product.inStock && (
                          <span className="text-xs text-red-500">Sắp hết hàng</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-2 text-blue-500">
            <BsSearch className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 py-3 px-4 focus:outline-none text-blue-900"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && (
            <button 
              className="px-4 text-blue-400 hover:text-blue-600"
              onClick={() => setSearchTerm('')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Search suggestions would appear here */}
        {searchTerm && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg z-30 mt-1 border border-blue-100">
            {/* This is a placeholder for search suggestions */}
          </div>
        )}
      </div>
      
      {/* Filters and Sort Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
          <div className="flex items-center border border-blue-200 text-blue-800 rounded-md overflow-hidden">
            <button 
              className={`px-3 py-2 flex items-center ${viewMode === 'grid' ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              className={`px-3 py-2 flex items-center ${viewMode === 'list' ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <select 
            className="border border-blue-200 text-blue-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc')}
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá: Thấp đến cao</option>
            <option value="price_desc">Giá: Cao đến thấp</option>
            <option value="name_asc">Tên: A-Z</option>
            <option value="name_desc">Tên: Z-A</option>
            <option value="popular">Phổ biến nhất</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
          
          <button
            onClick={clearFilters}
            className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Đặt lại bộ lọc</span>
          </button>
        </div>
        
        <div className="text-blue-800 flex items-center">
          <div className="mr-2 text-blue-500">
            <FiRefreshCw className={loading ? "animate-spin w-4 h-4" : "w-4 h-4"} />
          </div>
          Hiển thị <span className="font-semibold mx-1">{filteredProducts.length}</span> sản phẩm
        </div>
        
        {/* Mobile Filters Button */}
        <button
          className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <AiOutlineFilter className="w-5 h-5 mr-2" />
          {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
        </button>
      </div>
      
      {/* Filter tags display - show active filters */}
      {(filters.ageGroup.length > 0 || filters.category.length > 0 || filters.styleTag.length > 0 || filters.sizes.length > 0 || filters.isNewArrival === true) && (
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="text-blue-600 flex items-center">
            <AiOutlineTags className="mr-2" />
            <span>Đang lọc theo:</span>
          </div>
          
          {filters.ageGroup.map(group => (
            <button
              key={group}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center text-sm hover:bg-blue-100"
              onClick={() => updateFilters({ 
                ageGroup: filters.ageGroup.filter(ag => ag !== group) 
              })}
            >
              {group === 'men' ? 'Giày Nam' : group === 'women' ? 'Giày Nữ' : 'Giày Trẻ Em'}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
          
          {filters.category.map(cat => (
            <button
              key={cat}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center text-sm hover:bg-blue-100"
              onClick={() => updateFilters({ 
                category: filters.category.filter(c => c !== cat) 
              })}
            >
              {cat}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
          
          {filters.styleTag.map(tag => (
            <button
              key={tag}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center text-sm hover:bg-blue-100"
              onClick={() => updateFilters({ 
                styleTag: filters.styleTag.filter(st => st !== tag) 
              })}
            >
              {tag}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
          
          {filters.sizes.map(size => (
            <button
              key={size}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center text-sm hover:bg-blue-100"
              onClick={() => updateFilters({ 
                sizes: filters.sizes.filter(s => s !== size) 
              })}
            >
              Size {size}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
          
          {filters.isNewArrival === true && (
            <button
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center text-sm hover:bg-blue-100"
              onClick={() => updateFilters({ isNewArrival: null })}
            >
              Mới về
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <button 
            onClick={clearFilters}
            className="text-red-500 hover:text-red-700 text-sm flex items-center"
          >
            Xóa tất cả
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className={`
          md:w-1/4 lg:w-1/5 bg-white rounded-lg shadow-sm p-4
          ${showFilters ? 'block' : 'hidden'} md:block
          fixed md:static z-10 top-24 left-4 right-4 md:top-auto md:left-auto md:right-auto
          max-h-[calc(100vh-120px)] md:max-h-full overflow-auto
        `}>
          {/* Age Group Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 border-b border-blue-100 pb-2">Đối tượng</h3>
            <div className="space-y-2">
              {ageGroups.map((group) => (
                <label key={group} className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    onChange={() => {
                      const newAgeGroups = filters.ageGroup.includes(group)
                        ? filters.ageGroup.filter(ag => ag !== group)
                        : [...filters.ageGroup, group];
                      updateFilters({ ageGroup: newAgeGroups });
                    }}
                    checked={filters.ageGroup.includes(group)}
                  />
                  <span className="ml-2 text-blue-700">
                    {group === 'men' ? 'Giày Nam' : 
                     group === 'women' ? 'Giày Nữ' : 'Giày Trẻ Em'}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Categories Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 border-b border-blue-100 pb-2">Danh mục</h3>
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
          
          {/* Style Tags Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 border-b border-blue-100 pb-2">Phong cách</h3>
            <div className="space-y-2">
              {styleTags.map((style) => (
                <label key={style} className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    onChange={() => {
                      const newStyleTags = filters.styleTag.includes(style)
                        ? filters.styleTag.filter(st => st !== style)
                        : [...filters.styleTag, style];
                      updateFilters({ styleTag: newStyleTags });
                    }}
                    checked={filters.styleTag.includes(style)}
                  />
                  <span className="ml-2 text-blue-700">{style}</span>
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
            <h3 className="text-lg font-semibold text-blue-800 mb-3 border-b border-blue-100 pb-2">Kích cỡ</h3>
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
          
          {/* New Arrivals Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 border-b border-blue-100 pb-2">Trạng thái</h3>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  onChange={() => {
                    updateFilters({ isNewArrival: filters.isNewArrival === true ? null : true });
                  }}
                  checked={filters.isNewArrival === true}
                />
                <span className="ml-2 text-blue-700">Mới về</span>
              </label>
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
          {/* View mode: Grid or List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
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
          ) : (
            <div className="space-y-4">
              {currentProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/4 h-48 bg-blue-50">
                      <Image
                        src={product.images?.[0] || '/images/placeholder-shoe.jpg'}
                        alt={product.name}
                        fill
                        style={{objectFit: "cover"}}
                      />
                      {(product as any).salePrice && product.price > (product as any).salePrice && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                          -{Math.round(((product.price - (product as any).salePrice) / product.price) * 100)}%
                        </div>
                      )}
                    </div>
                    <div className="p-4 md:p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-blue-900">{product.name}</h3>
                        <button
                          onClick={() => console.log('Toggle wishlist:', product)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          {(product as ExtendedProduct).isInWishlist ? <AiFillHeart className="text-red-500 w-5 h-5" /> : <AiOutlineHeart className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        {Array.from({length: 5}).map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                               fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                        <span className="text-sm text-blue-600 ml-1">{product.rating?.toFixed(1) || "N/A"}</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-sm text-gray-500">
                          {(product as ExtendedProduct).numReviews || 0} đánh giá
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 flex-grow">
                        {product.description?.substring(0, 120)}...
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <span className="text-blue-900 font-bold text-lg">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                          </span>
                          {product.oldPrice && (
                            <span className="text-gray-400 line-through ml-2 text-sm">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.oldPrice)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Link href={`/shop/${product._id}`}
                            className="px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition"
                          >
                            Chi tiết
                          </Link>
                          <button
                            onClick={() => console.log('Add to cart:', product)}
                            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
                          >
                            <FiShoppingBag className="mr-1" />
                            Thêm vào giỏ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="mt-10 flex justify-center">
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-l-md border border-blue-300 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    // If 5 or fewer pages, show all
                    pageNum = idx + 1;
                  } else if (currentPage <= 3) {
                    // At the start
                    pageNum = idx + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // At the end
                    pageNum = totalPages - 4 + idx;
                  } else {
                    // In the middle
                    pageNum = currentPage - 2 + idx;
                  }
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 border-t border-b border-blue-300 ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-r-md border border-blue-300 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-blue-50 rounded-xl border border-blue-100 my-8">
              <svg className="w-20 h-20 text-blue-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Không tìm thấy sản phẩm phù hợp
              </h3>
              <p className="text-blue-600 mb-6 max-w-md mx-auto">
                Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại. Vui lòng thử lại với các tùy chọn khác.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Xóa bộ lọc
              </button>
            </div>
          )}
          
          {/* Promotion Section */}
          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md overflow-hidden">
                <div className="p-6 flex items-center">
                  <div className="mr-4 bg-white bg-opacity-20 p-3 rounded-full">
                    <FiTruck className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Miễn phí vận chuyển</h3>
                    <p className="text-blue-100 text-sm">Cho đơn hàng trên 500k</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-md overflow-hidden">
                <div className="p-6 flex items-center">
                  <div className="mr-4 bg-white bg-opacity-20 p-3 rounded-full">
                    <AiOutlinePercentage className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Ưu đãi độc quyền</h3>
                    <p className="text-purple-100 text-sm">Giảm 10% cho lần đầu mua hàng</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md overflow-hidden">
                <div className="p-6 flex items-center">
                  <div className="mr-4 bg-white bg-opacity-20 p-3 rounded-full">
                    <BsStars className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Hàng chính hãng</h3>
                    <p className="text-green-100 text-sm">100% hàng chính hãng từ các thương hiệu lớn</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Back to top button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      
      {/* Newsletter Subscription */}
      <div className="mt-16 bg-blue-50 rounded-xl p-8 shadow-inner">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">Đăng ký nhận thông tin</h3>
          <p className="text-blue-700 mb-6">Nhận thông tin về các bộ sưu tập mới và ưu đãi độc quyền</p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Email của bạn" 
              className="flex-1 px-4 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow whitespace-nowrap">
              Đăng ký ngay
            </button>
          </div>
          
          <p className="text-xs text-blue-500 mt-4">
            Bằng cách đăng ký, bạn đồng ý với Chính sách bảo mật của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useShopFilter } from '@/context/ShopFilterContext';
import { productService } from '@/services/product.service';

const FilterSidebar = () => {
  const { filters, setFilter, clearFilters } = useShopFilter();
  const [categories, setCategories] = useState<string[]>([]);
  const [brands] = useState<string[]>(['Nike', 'Adidas', 'New Balance', 'Puma']);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const categoriesData = await productService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        // Fallback categories are already handled in the service
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle price range submission
  const handlePriceSubmit = () => {
    setFilter('minPrice', minPrice ? Number(minPrice) : undefined);
    setFilter('maxPrice', maxPrice ? Number(maxPrice) : undefined);
  };
  
  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setFilter('category', filters.category === category ? undefined : category);
  };
  
  // Handle brand selection
  const handleBrandChange = (brand: string) => {
    const currentBrands = filters.brand || [];
    if (currentBrands.includes(brand)) {
      setFilter('brand', currentBrands.filter(b => b !== brand));
    } else {
      setFilter('brand', [...currentBrands, brand]);
    }
  };
  
  // Handle size selection
  const handleSizeSelect = (size: number) => {
    const currentSizes = filters.size || [];
    if (currentSizes.includes(size)) {
      setFilter('size', currentSizes.filter(s => s !== size));
    } else {
      setFilter('size', [...currentSizes, size]);
    }
  };
  
  // Reset all filters
  const handleClearFilters = () => {
    clearFilters();
    setMinPrice('');
    setMaxPrice('');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Clear All Filters */}
      {Object.entries(filters).some(([key, value]) => value && !['page', 'limit'].includes(key)) && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <button
            onClick={handleClearFilters}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Clear All Filters
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 text-lg mb-4">Categories</h3>
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-6 bg-gray-200 rounded w-3/4"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>
        ) : (
          <div className="space-y-2">
            <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <input 
                type="radio" 
                name="category"
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                checked={!filters.category}
                onChange={() => setFilter('category', undefined)}
              />
              <span className="ml-3 text-gray-700">All Products</span>
            </label>
            
            {categories.map((category) => (
              <label key={category} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <input 
                  type="radio"
                  name="category"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  checked={filters.category === category}
                  onChange={() => handleCategoryChange(category)}
                />
                <span className="ml-3 text-gray-700 capitalize">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 text-lg mb-4">Price Range</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Min Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Max Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="1000"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handlePriceSubmit}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Price
          </button>
        </div>
      </div>

      {/* Brands */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 text-lg mb-4">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <input 
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={(filters.brand || []).includes(brand)}
                onChange={() => handleBrandChange(brand)}
              />
              <span className="ml-3 text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 text-lg mb-4">Sizes</h3>
        <div className="grid grid-cols-3 gap-2">
          {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5].map((size) => (
            <button
              key={size}
              onClick={() => handleSizeSelect(size)}
              className={`
                py-2 px-3 rounded-lg text-sm font-medium
                ${(filters.size || []).includes(size)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                transition-colors
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-semibold text-gray-900 text-lg mb-4">Colors</h3>
        <div className="grid grid-cols-6 gap-2">
          {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#C0C0C0'].map((color) => (
            <button
              key={color}
              onClick={() => {
                const currentColors = filters.color || [];
                if (currentColors.includes(color)) {
                  setFilter('color', currentColors.filter(c => c !== color));
                } else {
                  setFilter('color', [...currentColors, color]);
                }
              }}
              className={`
                w-8 h-8 rounded-full border-2
                ${(filters.color || []).includes(color)
                  ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                  : 'border-gray-300 hover:border-blue-600'
                }
                transition-all duration-200
              `}
              style={{
                backgroundColor: color,
                ...(color === '#FFFFFF' && { border: '1px solid #e5e7eb' })
              }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
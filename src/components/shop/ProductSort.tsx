import React from 'react';

interface ProductSortProps {
  sortOption: string;
  onSortChange: (sort: string) => void;
  totalProducts: number;
  currentPage: number;
  productsPerPage: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ProductSort: React.FC<ProductSortProps> = ({
  sortOption,
  onSortChange,
  totalProducts,
  currentPage,
  productsPerPage,
  viewMode,
  onViewModeChange
}) => {
  const indexOfFirstProduct = (currentPage - 1) * productsPerPage + 1;
  const indexOfLastProduct = Math.min(currentPage * productsPerPage, totalProducts);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Products count */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-gray-600">Showing</span>
        <span className="font-medium text-gray-900">{indexOfFirstProduct}-{indexOfLastProduct}</span>
        <span className="text-gray-600">of</span>
        <span className="font-medium text-gray-900">{totalProducts}</span>
        <span className="text-gray-600">products</span>
      </div>
      
      <div className="flex flex-1 sm:flex-none items-center gap-4 w-full sm:w-auto">
        {/* View mode toggle */}
        <div className="hidden sm:flex p-1 bg-gray-100 rounded-lg">
          <button 
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="transform scale-90"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          <button 
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="transform scale-90"
            >
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Sort dropdown */}
        <div className="flex-1 sm:flex-none">
          <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 w-full">
            <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
            <select 
              id="sort"
              className="flex-1 text-sm text-gray-900 font-medium bg-transparent border-none focus:outline-none focus:ring-0 appearance-none cursor-pointer"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="newest">Newest First</option>
            </select>
            <svg 
              className="h-5 w-5 text-gray-400" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSort;
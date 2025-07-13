'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ProductFilter } from '@/types/product';

interface ShopFilterContextType {
  filters: ProductFilter;
  setFilter: (key: keyof ProductFilter, value: any) => void;
  clearFilters: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  sortOption: string;
  setSortOption: (sort: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  // Filter UI state
  isMobileFilterOpen: boolean;
  setMobileFilterOpen: (open: boolean) => void;
}

const ShopFilterContext = createContext<ShopFilterContextType | undefined>(undefined);

export const ShopFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Core filter state
  const [filters, setFilters] = useState<ProductFilter>({
    page: 1,
    limit: 12,
  });
  
  const [sortOption, setSortOption] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Initialize filters from URL params when component mounts
  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    const newFilters: ProductFilter = { page: 1, limit: 12 };
    
    // Parse search params into filters
    if (params.has('search')) newFilters.search = params.get('search') || undefined;
    if (params.has('category')) newFilters.category = params.get('category') || undefined;
    if (params.has('minPrice')) newFilters.minPrice = Number(params.get('minPrice')) || undefined;
    if (params.has('maxPrice')) newFilters.maxPrice = Number(params.get('maxPrice')) || undefined;
    if (params.has('page')) newFilters.page = Number(params.get('page')) || 1;
    if (params.has('sort')) setSortOption(params.get('sort') || 'featured');
    if (params.has('view')) setViewMode((params.get('view') === 'list' ? 'list' : 'grid') as 'grid' | 'list');
    
    // Handle multi-value params
    if (params.has('brand')) {
      newFilters.brand = params.getAll('brand');
    }
    
    if (params.has('size')) {
      newFilters.size = params.getAll('size').map(Number);
    }
    
    if (params.has('color')) {
      newFilters.color = params.getAll('color');
    }
    
    setFilters(newFilters);
    
    // Load favorites from localStorage
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (e) {
          console.error('Error parsing favorites from localStorage:', e);
        }
      }
    }
  }, [searchParams]);
  
  // Save favorites to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && favorites.length > 0) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);
  
  // Update URL when filters change
  useEffect(() => {
    if (!pathname) return;
    
    const params = new URLSearchParams();
    
    // Add all filters to URL params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(val => params.append(key, String(val)));
        } else {
          params.set(key, String(value));
        }
      }
    });
    
    // Add sort and view mode
    if (sortOption !== 'featured') {
      params.set('sort', sortOption);
    }
    
    if (viewMode === 'list') {
      params.set('view', 'list');
    }
    
    // Update URL without reload
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  }, [filters, sortOption, viewMode, router, pathname]);
  
  const setFilter = (key: keyof ProductFilter, value: any) => {
    // Reset to page 1 when filter changes (except when changing page)
    if (key !== 'page') {
      setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };
  
  const clearFilters = () => {
    setFilters({ page: 1, limit: 12 });
    setSortOption('featured');
  };
  
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };
  
  const setCurrentPage = (page: number) => {
    setFilter('page', page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <ShopFilterContext.Provider
      value={{
        filters,
        setFilter,
        clearFilters,
        currentPage: filters.page || 1,
        setCurrentPage,
        sortOption,
        setSortOption,
        viewMode,
        setViewMode,
        favorites,
        toggleFavorite,
        isMobileFilterOpen,
        setMobileFilterOpen,
      }}
    >
      {children}
    </ShopFilterContext.Provider>
  );
};

export const useShopFilter = () => {
  const context = useContext(ShopFilterContext);
  if (context === undefined) {
    throw new Error('useShopFilter must be used within a ShopFilterProvider');
  }
  return context;
}; 
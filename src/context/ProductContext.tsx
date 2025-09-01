'use client';
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Product } from '@/types/product';
import { productService } from '@/services/product.service';

interface ProductContextState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
  filters: {
    brand: string[];
    category: string[];
    ageGroup: string[];
    styleTag: string[];
    tag: string[];
    priceRange: { min: number; max: number };
    sizes: number[];
    isNewArrival: boolean | null;
  };
  sortBy: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
}

interface ProductContextValue extends ProductContextState {
  fetchProducts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  setSelectedProduct: (product: Product | null) => void;
  updateFilters: (filters: Partial<ProductContextState['filters']>) => void;
  setSortBy: (sort: ProductContextState['sortBy']) => void;
  filteredProducts: Product[];
  clearFilters: () => void;
  searchProducts: (query: string) => Product[];
}

const initialState: ProductContextState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
  filters: {
    brand: [],
    category: [],
    ageGroup: [],
    styleTag: [],
    tag: [],
    priceRange: { min: 0, max: Infinity },
    sizes: [],
    isNewArrival: null
  },
  sortBy: 'newest',
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ProductContextState>(initialState);

  const fetchProducts = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      console.log('Starting product fetch...');
      const data = await productService.getAllProducts();
      console.log('Products fetched successfully:', data);
      setState(prev => ({ ...prev, products: data, loading: false }));
    } catch (error) {
      console.error('Error fetching products:', {
        error,
        message: typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : undefined,
        response: typeof error === 'object' && error !== null && 'response' in error
          ? (error as Record<string, unknown>).response
          : undefined
      });
      setState(prev => ({
        ...prev,
        loading: false,
        error: typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message || 'Failed to fetch products'
          : 'Failed to fetch products'
      }));
    }
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  const setSelectedProduct = (product: Product | null) => {
    setState(prev => ({ ...prev, selectedProduct: product }));
  };

  const updateFilters = (newFilters: Partial<ProductContextState['filters']>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
  };

  const setSortBy = (sort: ProductContextState['sortBy']) => {
    setState(prev => ({ ...prev, sortBy: sort }));
  };

  const clearFilters = () => {
    setState(prev => ({
      ...prev,
      filters: initialState.filters,
      sortBy: initialState.sortBy
    }));
  };

  // Search products based on query
  const searchProducts = (query: string): Product[] => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase().trim();
    
    return state.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      (product.description && product.description.toLowerCase().includes(searchTerm)) ||
      product.ageGroup.toLowerCase().includes(searchTerm) ||
      (product.categories && product.categories.some(cat => cat.toLowerCase().includes(searchTerm))) ||
      (product.category && product.category.some(cat => cat.toLowerCase().includes(searchTerm))) ||
      (product.styleTags && product.styleTags.some(tag => tag.toLowerCase().includes(searchTerm))) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  };

  // Memoize filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...state.products];

    // Apply filters
    const { brand, category, ageGroup, styleTag, tag, priceRange, sizes, isNewArrival } = state.filters;

    if (brand.length) {
      result = result.filter(p => brand.includes(p.brand));
    }

    if (category.length) {
      result = result.filter(p => {
        // Check in both category and categories arrays
        const matchesCategory = p.category && p.category.some(cat => 
          category.some(selectedCat => 
            cat.toLowerCase() === selectedCat.toLowerCase()
          )
        );
        
        const matchesCategories = p.categories && p.categories.some(cat => 
          category.some(selectedCat => 
            cat.toLowerCase() === selectedCat.toLowerCase()
          )
        );
        
        // Also check if the ageGroup matches a category
        const matchesAgeGroup = category.some(cat => 
          p.ageGroup.toLowerCase() === cat.toLowerCase()
        );
        
        return matchesCategory || matchesCategories || matchesAgeGroup;
      });
    }

    if (ageGroup.length) {
      result = result.filter(p => 
        ageGroup.some(ag => 
          p.ageGroup.toLowerCase() === ag.toLowerCase()
        )
      );
    }

    if (styleTag.length) {
      result = result.filter(p => 
        p.styleTags && p.styleTags.some(style => 
          styleTag.some(selectedStyle => 
            style.toLowerCase() === selectedStyle.toLowerCase()
          )
        )
      );
    }

    if (tag.length) {
      result = result.filter(p => 
        p.tags && p.tags.some(t => 
          tag.some(selectedTag => 
            t.toLowerCase() === selectedTag.toLowerCase()
          )
        )
      );
    }

    if (sizes.length) {
      result = result.filter(p => p.sizes?.some(size => sizes.includes(size)));
    }

    if (isNewArrival !== null) {
      result = result.filter(p => p.isNewArrival === isNewArrival);
    }

    result = result.filter(p => 
      p.price >= priceRange.min && 
      p.price <= priceRange.max
    );

    // Apply sorting
    switch (state.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [state.products, state.filters, state.sortBy]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider 
      value={{
        ...state,
        fetchProducts,
        refreshProducts,
        setSelectedProduct,
        updateFilters,
        setSortBy,
        filteredProducts,
        clearFilters,
        searchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};


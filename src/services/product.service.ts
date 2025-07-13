import { api } from '@/lib/api/http';
import { PRODUCTS } from '@/lib/api/endpoints';
import { Product, ProductFilter, PaginatedResponse } from '@/types/product';

// Define more specific types for the API response
interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
}

interface CategoryResponse {
  categories?: Category[];
  data?: Category[];
  total?: number;
  page?: number;
  limit?: number;
}

// Default categories as fallback
const DEFAULT_CATEGORIES = ['running', 'casual', 'formal', 'sport'];


// Transform API product to match our interface
const transformProduct = (product: any): Product => {
  return {
    _id: product._id,
    id: product._id, // For backward compatibility
    name: product.name || '',
    slug: product.slug || '',
    description: product.description || '',
    price: Number(product.price) || 0,
    originalPrice: Number(product.originalPrice) || Number(product.price) * 1.2, // Fallback calculation
    images: Array.isArray(product.images) ? product.images : [],
    image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '', // Use first image as main image
    categoryId: product.categoryId || '',
    category: product.categoryName || 'Unknown', // Use category name if available
    brand: product.brand || '',
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    colors: Array.isArray(product.colors) ? product.colors : [],
    inStock: Boolean(product.inStock),
    isNew: product.createdAt ? new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 : false, // New if less than 7 days old
    rating: Number(product.rating) || 0,
    reviewCount: Number(product.reviewCount) || 0,
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString()
  };
};

export const productService = {
  getProducts: async (
    params: ProductFilter = {}
  ): Promise<PaginatedResponse<Product>> => {
    try {
      // Format params to match backend API
      const apiParams: {
        page: number;
        limit: number;
        search?: string;
        categoryId?: string;
      } = {
        page: Number(params.page) || 1,
        limit: Number(params.limit) || 10,
        search: params.search || undefined,
        categoryId: params.category || undefined // Backend expects categoryId, not category
      };

      // Remove undefined values
      const cleanParams = Object.fromEntries(
        Object.entries(apiParams).filter(([_, value]) => value !== undefined)
      );

      const response = await api.get<{ products: Product[]; total: number; page: number; limit: number }>(
        PRODUCTS.LIST,
        { params: cleanParams }
      );
      
      // Ensure we have valid products array
      const products = Array.isArray(response.products) ? response.products : [];
      
      return {
        data: products.map(transformProduct),
        total: response.total || 0,
        currentPage: response.page || 1,
        totalPages: Math.ceil((response.total || 0) / (response.limit || 10))
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { data: [], total: 0, currentPage: 1, totalPages: 1 };
    }
  },

  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const response = await api.get<Product>(PRODUCTS.DETAIL(id));
      return response ? transformProduct(response) : null;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  },

  getCategories: async (): Promise<string[]> => {
    try {
      const response = await api.get<CategoryResponse>(PRODUCTS.CATEGORIES);
      
      if (!response) {
        console.warn('No response from categories API');
        return DEFAULT_CATEGORIES;
      }

      // Case 1: Response has categories property
      if ('categories' in response && Array.isArray(response.categories)) {
        return response.categories.map(cat => cat.name);
      }

      // Case 2: Response has data property
      if ('data' in response && Array.isArray(response.data)) {
        return response.data.map(cat => cat.name);
      }

      // Case 3: Response is array directly
      if (Array.isArray(response)) {
        return response.map((cat: any) => {
          if (typeof cat === 'string') return cat;
          return cat.name || cat.toString();
        });
      }

      // Case 4: Response is an object with unknown structure
      if (typeof response === 'object') {
        const possibleArrays = Object.values(response).find(Array.isArray);
        if (possibleArrays) {
          return possibleArrays.map((cat: any) => {
            if (typeof cat === 'string') return cat;
            return cat.name || cat.toString();
          });
        }
      }

      console.warn('Unexpected categories response structure:', response);
      return DEFAULT_CATEGORIES;
    } catch (error) {
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error fetching categories:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      } else {
        console.error('Unknown error fetching categories:', error);
      }
      return DEFAULT_CATEGORIES;
    }
  },
  
  getFeaturedProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>(PRODUCTS.FEATURED);
      return response.map(transformProduct);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },
};

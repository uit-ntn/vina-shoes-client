import { api } from '../lib/api/http';
import { Product } from '../types/product';
import { PRODUCTS } from '../lib/api/endpoints';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      console.log('Fetching products...');
      const response = await api.get<Product[]>(PRODUCTS.LIST);
      return response.data;
    } catch (error) {
      console.error('Product service error:', error);
      throw error;
    }
  },

  getProductById: async (id: string): Promise<Product | null> => {
    try {
      console.log(`Fetching product with ID:`, id);
      const response = await api.get<Product>(PRODUCTS.DETAIL(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    try {
      console.log(`Fetching products for category:`, categoryId);
      const response = await api.get<Product[]>(PRODUCTS.BY_CATEGORY(categoryId));
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  getProductsByBrand: async (brand: string): Promise<Product[]> => {
    try {
      console.log(`Fetching products for brand:`, brand);
      const response = await api.get<Product[]>(PRODUCTS.BY_BRAND(brand));
      return response.data;
    } catch (error) {
      console.error('Error fetching products by brand:', error);
      throw error;
    }
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      console.log(`Searching products with query:`, query);
      const response = await api.get<Product[]>(PRODUCTS.SEARCH, { params: { q: query } });
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
};

export default productService;

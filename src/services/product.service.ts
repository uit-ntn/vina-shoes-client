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
  
  getSimilarProducts: async (productId: string, limit: number = 4): Promise<Product[]> => {
    try {
      console.log(`Fetching similar products for ID:`, productId);
      // If the backend has a dedicated endpoint, use that
      // Otherwise, we'll get products from the same age group and style
      const product = await productService.getProductById(productId);
      if (!product) return [];
      
      // Get products from the same age group first
      const ageGroupProducts = await productService.getProductsByAgeGroup(product.ageGroup);
      
      // Find products with similar style tags (if any)
      let similarStyleProducts: Product[] = [];
      if (product.styleTags && product.styleTags.length > 0) {
        const primaryStyle = product.styleTags[0]; // Use the first style tag as primary
        similarStyleProducts = await productService.getProductsByStyleTag(primaryStyle);
      }
      
      // Combine results, prioritize style matches
      let combined = [...similarStyleProducts, ...ageGroupProducts];
      
      // Remove duplicates (same product might be in both lists)
      const uniqueProducts = combined.filter((item, index, self) =>
        index === self.findIndex((p) => p._id === item._id)
      );
      
      // Filter out the current product and limit the results
      return uniqueProducts
        .filter(p => p._id !== productId)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching similar products:', error);
      return [];
    }
  },

  getProductsByCategory: async (categorySlug: string): Promise<Product[]> => {
    try {
      console.log(`Fetching products for category:`, categorySlug);
      // In the new schema, we need to handle array of categories
      // We assume the API endpoint can handle this with query parameter
      const response = await api.get<Product[]>(PRODUCTS.BY_CATEGORY(categorySlug));
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      // Return empty array instead of throwing to prevent cascading errors
      return [];
    }
  },
  
  getProductsByStyleTag: async (styleTag: string): Promise<Product[]> => {
    try {
      console.log(`Fetching products for style tag:`, styleTag);
      const response = await api.get<Product[]>(PRODUCTS.BY_STYLE(styleTag));
      return response.data;
    } catch (error) {
      console.error('Error fetching products by style tag:', error);
      return [];
    }
  },
  
  getProductsByAgeGroup: async (ageGroup: string): Promise<Product[]> => {
    try {
      console.log(`Fetching products for age group:`, ageGroup);
      const response = await api.get<Product[]>(PRODUCTS.BY_AGE_GROUP(ageGroup));
      return response.data;
    } catch (error) {
      console.error('Error fetching products by age group:', error);
      throw error;
    }
  },
  
  getNewArrivals: async (): Promise<Product[]> => {
    try {
      console.log('Fetching new arrival products');
      const response = await api.get<Product[]>(PRODUCTS.NEW_ARRIVALS);
      return response.data;
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
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

import { api } from '../lib/api/http';
import { Product } from '../types/product';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      console.log('Fetching products...');
      const response = await api.get<Product[]>('/products');
      return response.data;
    } catch (error) {
      console.error('Product service error:', error);
      throw error;
    }
  },

  getProductById: async (id: string): Promise<Product | null> => {
    try {
      console.log(`Fetching product with ID:`, id);
      const response = await api.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },
};

export default productService;

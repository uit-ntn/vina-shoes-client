import axios from 'axios';
import { api } from '../lib/api/http';
import { PRODUCTS } from '../lib/api/endpoints';
import { Product } from '../types/product';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      console.log('Fetching products...');
      const response = await api.get<{ data: Product[] }>(PRODUCTS.GET_ALL);
      console.log('Raw response:', response);
      
      // Handle different response structures
      if (Array.isArray(response)) {
        return response;
      } else if (response && 'data' in response) {
        return response.data;
      } else {
        console.error('Unexpected response structure:', response);
        return [];
      }
    } catch (error) {
      console.error('Product service error:', error);
      throw error;
    }
  },
};

export default productService;

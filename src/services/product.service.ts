import axios from 'axios';
import { api } from '@/lib/api/api';
import { PRODUCTS } from '@/lib/api/endpoints';
import { Product } from '@/types/product';

// Default categories as fallback
const DEFAULT_CATEGORIES = ['running', 'casual', 'formal', 'sport'];

export async function getAllProducts(): Promise<Product[]> {
  try {
    // Call the API to fetch products
    const res = await api.get(PRODUCTS.LIST) as unknown as { products: Product[] };
    if (res && Array.isArray(res.products)) {
      return res.products;
    }
    return [];
  } catch (error) {
    // Optionally log the error
    console.error('Error fetching products:', error);
    return [];
  }
}

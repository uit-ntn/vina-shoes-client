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
      console.log(`Finding similar products for ID:`, productId);
      // Get all products at once to avoid multiple API calls
      const allProducts = await productService.getAllProducts();
      const product = allProducts.find(p => p._id === productId);
      
      if (!product) return [];
      
      // Define a scoring system for similarity
      const scoredProducts = allProducts
        .filter(p => p._id !== productId) // Filter out the current product
        .map(p => {
          let score = 0;
          
          // Same age group is a strong indicator
          if (p.ageGroup === product.ageGroup) score += 3;
          
          // Matching style tags
          if (product.styleTags && p.styleTags) {
            const sharedStyles = product.styleTags.filter(tag => 
              p.styleTags.includes(tag)
            ).length;
            score += sharedStyles * 2;
          }
          
          // Matching categories
          if (product.categories && p.categories) {
            const sharedCategories = product.categories.filter(cat => 
              p.categories.includes(cat)
            ).length;
            score += sharedCategories;
          }
          
          // Matching tags
          if (product.tags && p.tags) {
            const sharedTags = product.tags.filter(tag => 
              p.tags.includes(tag)
            ).length;
            score += sharedTags;
          }
          
          // Same brand is a weak indicator
          if (p.brand === product.brand) score += 1;
          
          return { product: p, score };
        })
        .sort((a, b) => b.score - a.score) // Sort by highest score first
        .filter(item => item.score > 0) // Only include items with some similarity
        .slice(0, limit) // Limit the results
        .map(item => item.product); // Extract just the products
      
      return scoredProducts;
    } catch (error) {
      console.error('Error finding similar products:', error);
      return [];
    }
  },

  getProductsByCategory: async (categorySlug: string): Promise<Product[]> => {
    try {
      console.log(`Filtering products for category:`, categorySlug);
      // Fetch all products and filter locally
      const allProducts = await productService.getAllProducts();
      return allProducts.filter(product => 
        // Check in both category and categories arrays
        (product.category && product.category.some(cat => 
          cat.toLowerCase() === categorySlug.toLowerCase()
        )) || 
        (product.categories && product.categories.some(cat => 
          cat.toLowerCase() === categorySlug.toLowerCase()
        ))
      );
    } catch (error) {
      console.error('Error filtering products by category:', error);
      return [];
    }
  },
  
  getProductsByStyleTag: async (styleTag: string): Promise<Product[]> => {
    try {
      console.log(`Filtering products for style tag:`, styleTag);
      // Fetch all products and filter locally
      const allProducts = await productService.getAllProducts();
      return allProducts.filter(product => 
        product.styleTags && product.styleTags.some(tag => 
          tag.toLowerCase() === styleTag.toLowerCase()
        )
      );
    } catch (error) {
      console.error('Error filtering products by style tag:', error);
      return [];
    }
  },
  
  getProductsByAgeGroup: async (ageGroup: string): Promise<Product[]> => {
    try {
      console.log(`Filtering products for age group:`, ageGroup);
      // Fetch all products and filter locally
      const allProducts = await productService.getAllProducts();
      return allProducts.filter(product => 
        product.ageGroup === ageGroup
      );
    } catch (error) {
      console.error('Error filtering products by age group:', error);
      return [];
    }
  },
  
  getNewArrivals: async (): Promise<Product[]> => {
    try {
      console.log('Filtering new arrival products');
      // Fetch all products and filter locally
      const allProducts = await productService.getAllProducts();
      return allProducts.filter(product => product.isNewArrival === true);
    } catch (error) {
      console.error('Error filtering new arrivals:', error);
      return [];
    }
  },

  getProductsByBrand: async (brand: string): Promise<Product[]> => {
    try {
      console.log(`Filtering products for brand:`, brand);
      // Fetch all products and filter locally
      const allProducts = await productService.getAllProducts();
      return allProducts.filter(product => 
        product.brand.toLowerCase() === brand.toLowerCase()
      );
    } catch (error) {
      console.error('Error filtering products by brand:', error);
      return [];
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

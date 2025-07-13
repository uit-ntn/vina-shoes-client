export interface Product {
  _id: string;
  id: string; // For backward compatibility
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  image: string; // Main product image
  categoryId: string;
  category: string; // Category name
  brand: string;
  sizes: number[];
  colors?: string[];
  inStock: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string[];
  size?: number[];
  color?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

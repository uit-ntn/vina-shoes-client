export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  brand: string;
  categoryId: string;
  tags?: string[];
  sizes?: number[];
  colors?: string[];
  rating: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}
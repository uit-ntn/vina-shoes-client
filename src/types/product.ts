export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number; // Optional original price for discounts
  images: string[];
  categoryId: string;
  brand: string;
  sizes: number[];
  inStock: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  brand: string;
  sizes: number[];
  inStock: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}
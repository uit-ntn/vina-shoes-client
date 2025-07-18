export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number; // Optional original price for discounts
  images: string[];
  category: string[]; // Mảng slug dùng cho route/filter chính
  brand: string;
  sizes: number[];
  inStock: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
  ageGroup: 'men' | 'women' | 'kids'; // Nhóm đối tượng
  categories: string[]; // Gộp tags hiển thị sidebar
  isNewArrival: boolean; // Sản phẩm mới về?
  styleTags: string[]; // Phong cách chính
  tags: string[]; // Tag phụ thêm
}
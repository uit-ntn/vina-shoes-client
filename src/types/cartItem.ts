export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: number;
  quantity: number;
  isActive: boolean;
  addedAt: string;
  lastModifiedAt: string;
}

export interface Cart {
  id: string | null;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AddCartItemDto {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartItemCountResponse {
  count: number;
}

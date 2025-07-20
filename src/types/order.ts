export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  ward: string;
  district: string;
  city: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: number;
  price: number;
  quantity: number;
}

export interface OrderUser {
  id: string;
  name: string;
  email: string;
}

export interface Order {
  id: string;
  user: OrderUser;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  isPaid: boolean;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrdersResponse {
  orders: Order[];
}

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

export type OrderStatus = 
  | "pending"
  | "processing"
  | "confirmed"
  | "preparing"
  | "ready_to_ship"
  | "picked_up"
  | "in_transit"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type ReturnStatus = "none" | "requested" | "approved" | "rejected" | "returned" | "refunded";

export interface StatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  updatedBy?: string;
}

export interface DeliveryInfo {
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  deliveryNotes?: string;
}

export interface ReturnInfo {
  status: ReturnStatus;
  reason?: string;
  requestedAt?: Date;
  requestedBy?: string;
  approvedAt?: Date;
  approvedBy?: string;
  returnTrackingNumber?: string;
  refundAmount?: number;
  refundedAt?: Date;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  user: OrderUser;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  shippingFee: number;
  tax: number;
  discount: number;
  finalAmount: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  isPaid: boolean;
  paidAt?: Date;
  paymentTransactionId?: string;
  statusHistory?: StatusHistory[];
  deliveryInfo?: DeliveryInfo;
  returnInfo?: ReturnInfo;
  notes?: string;
  adminNotes?: string;
  cancelledAt?: Date;
  cancellationReason?: string;
  rating?: number;
  review?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrdersResponse {
  orders: Order[];
}

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
    size: string | number;
    image?: string;
  }>;
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode?: string;
    notes?: string;
  };
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  isPaid: boolean;
  userId?: string;
}

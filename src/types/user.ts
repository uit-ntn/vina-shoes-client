export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  zipCode?: string;
  isDefault?: boolean;
}

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  address?: Address;
  addresses?: Address[];
  phone?: string;
  avatar?: string;
  emailVerified?: boolean;
  lastLogin?: Date;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type UserRole = 'admin' | 'customer' | 'user';

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: Address;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface OrderHistoryResponse {
  orders: Array<{
    _id: string;
    products: Array<{
      productId: string;
      name: string;
      quantity: number;
      price: number;
      subtotal: number;
    }>;
    total: number;
    status: OrderStatus;
    shippingAddress: Address;
    paymentMethod: string;
    paymentStatus: PaymentStatus;
    createdAt: Date;
  }>;
  totalCount: number;
  page: number;
  limit: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface NotificationResponse {
  notifications: Array<{
    _id: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
    link?: string;
  }>;
  unreadCount: number;
  totalCount: number;
  page: number;
  limit: number;
}

export type NotificationType = 'order' | 'account' | 'promotion' | 'system';

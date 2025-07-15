export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
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
  user: User;
  token: string;
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
  country: string;
  postalCode: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  address: Address;
  createdAt: Date;
  updatedAt: Date;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  address?: Address;
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
      quantity: number;
      price: number;
    }>;
    total: number;
    status: string;
    createdAt: Date;
  }>;
}

export interface NotificationResponse {
  notifications: Array<{
    _id: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }>;
}

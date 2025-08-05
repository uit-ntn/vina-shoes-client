export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<OtpResponse>;
  forgotPassword: (email: string) => Promise<OtpResponse>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ message: string }>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<TokenResponse>;
  verifyOtp?: (email: string, otp: string) => Promise<{ message: string; valid: boolean }>;
  logoutFromDevice?: (refreshToken: string) => Promise<void>;
  requestOtp?: (email: string) => Promise<OtpResponse>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}

export interface AuthResponse {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  token: string;
  refreshToken?: string;
  message: string;
  role?: string;
  avatarUrl?: string;
  phone?: string;
  addresses?: Address[];
  emailVerified?: boolean;
  preferences?: UserPreferences;
}

export interface OtpResponse {
  email: string;
  expiresAt: Date;
  message: string;
}

export interface TokenResponse {
  access_token: string;
  // User information returned from the login API
  user: {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
    phone?: string;
    addresses?: Address[];
    emailVerified?: boolean;
    preferences?: UserPreferences;
  };
  // Backend uses refreshToken for refresh token
  refreshToken?: string;
  // For backward compatibility
  accessToken?: string;
  token_type?: string;
  expires_in?: number;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordWithOtpData {
  email: string;
  otp: string; // Changed from token to otp to match backend DTO
  newPassword: string;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  country: string; // Country code e.g. "VN"
  postalCode?: string;
  isDefault?: boolean;
}

export interface UserPreferences {
  language: string; // "vi", "en", etc.
  newsletter: boolean;
}

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  addresses?: Address[];
  phone?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  status?: 'active' | 'inactive' | 'banned';
  verificationToken?: string | null;
  verificationExpires?: Date | null;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  refreshTokens?: string[];
  twoFactorEnabled?: boolean;
  preferences?: UserPreferences;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type UserRole = 'admin' | 'customer' | 'user';

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  addresses?: Address[];
  avatarUrl?: string;
  preferences?: {
    language?: string;
    newsletter?: boolean;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
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

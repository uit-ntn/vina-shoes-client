// Product endpoints
export const PRODUCTS = {
  LIST: '/products',
  DETAIL: (id: string) => `/products/${id}`,
  BY_CATEGORY: (categoryId: string) => `/products/category/${categoryId}`,
  BY_BRAND: (brand: string) => `/products/brand/${brand}`,
  SEARCH: '/products/search',
  FEATURED: '/products/featured',
  NEW_ARRIVALS: '/products/new-arrivals',
  BEST_SELLERS: '/products/best-sellers',
  GET_ALL: '/products', // Changed from '/api/products' to match backend
  GET_BY_ID: (id: string) => `/api/products/${id}`,
};

// Category endpoints
export const CATEGORIES = {
  LIST: '/categories',
  DETAIL: (id: string) => `/categories/${id}`,
  PRODUCTS: (id: string) => `/categories/${id}/products`
};

// Brand endpoints
export const BRANDS = {
  LIST: '/brands',
  DETAIL: (id: string) => `/brands/${id}`,
  PRODUCTS: (id: string) => `/brands/${id}/products`
};

// Cart endpoints
export const CART = {
  GET: '/cart',
  ADD: '/cart/add',
  UPDATE: '/cart/update',
  REMOVE: '/cart/remove',
  CLEAR: '/cart/clear'
};

// Order endpoints
export const ORDERS = {
  LIST: '/orders',
  DETAIL: (id: string) => `/orders/${id}`,
  CREATE: '/orders',
  UPDATE_STATUS: (id: string) => `/orders/${id}/status`
};

// Auth endpoints
export const AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password'
};

// User endpoints
export const USERS = {
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password'
};
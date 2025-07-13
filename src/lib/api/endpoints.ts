// Authentication endpoints
export const AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
};

// User endpoints
export const USER = {
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
  ADDRESSES: '/users/addresses',
};

// Product endpoints
export const PRODUCTS = {
  LIST: '/products',
  DETAIL: (id: string | number) => `/products/${id}`,
  CATEGORIES: '/categories',
  CATEGORY: (id: string | number) => `/categories/${id}`,
  FEATURED: '/products/featured',
  NEW_ARRIVALS: '/products/new-arrivals',
  SEARCH: '/products/search',
};

// Cart endpoints
export const CART = {
  GET: '/cart',
  ADD: '/cart/items',
  UPDATE: (itemId: string | number) => `/cart/items/${itemId}`,
  REMOVE: (itemId: string | number) => `/cart/items/${itemId}`,
  CLEAR: '/cart/clear',
  APPLY_COUPON: '/cart/apply-coupon',
  REMOVE_COUPON: '/cart/remove-coupon',
};

// Order endpoints
export const ORDERS = {
  LIST: '/orders',
  DETAIL: (id: string | number) => `/orders/${id}`,
  CREATE: '/orders',
  CANCEL: (id: string | number) => `/orders/${id}/cancel`,
  TRACK: (id: string | number) => `/orders/${id}/track`,
};

// Review endpoints
export const REVIEWS = {
  LIST: (productId: string | number) => `/products/${productId}/reviews`,
  CREATE: (productId: string | number) => `/products/${productId}/reviews`,
  UPDATE: (reviewId: string | number) => `/reviews/${reviewId}`,
  DELETE: (reviewId: string | number) => `/reviews/${reviewId}`,
};

// Wishlist endpoints
export const WISHLIST = {
  LIST: '/wishlist',
  ADD: '/wishlist',
  REMOVE: (productId: string | number) => `/wishlist/${productId}`,
  CHECK: (productId: string | number) => `/wishlist/check/${productId}`,
};

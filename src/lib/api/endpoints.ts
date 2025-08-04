// Auth endpoints
export const AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_EMAIL: '/auth/verify-email',
  LOGOUT: '/auth/logout',
  LOGOUT_DEVICE: '/auth/logout-device',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  REFRESH_TOKEN: '/auth/refresh',
  CHANGE_PASSWORD: '/auth/change-password',
  VERIFY_OTP: '/auth/verify-otp',
  UPDATE_PROFILE: '/user/profile',
};

// User endpoints
export const USER = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
  ORDERS: '/user/orders',
  ORDER_DETAIL: (id: string) => `/user/orders/${id}`,
  ADDRESSES: '/user/addresses',
  NOTIFICATIONS: '/user/notifications',
  WISHLIST: '/user/wishlist',
};

// Product endpoints
export const PRODUCTS = {
  LIST: "/products",
  DETAIL: (id: string) => `/products/${id}`,
  BY_CATEGORY: (categorySlug: string) => `/products/category/${categorySlug}`,
  BY_BRAND: (brand: string) => `/products/brand/${brand}`,
  BY_AGE_GROUP: (ageGroup: string) => `/products/age-group/${ageGroup}`,
  BY_STYLE: (style: string) => `/products/style/${style}`,
  BY_TAG: (tag: string) => `/products/tag/${tag}`,
  FEATURED: "/products/featured",
  NEW_ARRIVALS: "/products/new-arrivals", 
};

// Cart endpoints
export const CART = {
  GET: "/cart",              // GET user's active cart
  ADD: "/cart/items",        // POST add item to cart
  UPDATE: "/cart/items",     // PUT update item
  REMOVE: "/cart/items",     // DELETE remove item
  CLEAR: "/cart/items",      // DELETE clear cart
};

// Order endpoints
export const ORDERS = {
  LIST: "/orders",
  MY_ORDERS: "/orders/my-orders",
  DETAIL: (id: string) => `/orders/${id}`,
  CREATE: "/orders",
  UPDATE: (id: string) => `/orders/${id}`,
  CANCEL: (id: string) => `/orders/${id}/cancel`,
  UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  STATS: "/orders/stats/overview",
  USER_ORDERS: (userId: string) => `/orders/user/${userId}`,
};

// Payment endpoints
export const PAYMENT = {
  METHODS: "/payment/methods",
  PROCESS: "/payment/process",
  VERIFY: "/payment/verify",
  WEBHOOK: "/payment/webhook"
};

// Admin endpoints
export const ADMIN = {
  DASHBOARD: "/admin/dashboard",
  USERS: {
    LIST: "/admin/users",
    DETAIL: (id: string) => `/admin/users/${id}`,
    CREATE: "/admin/users",
    UPDATE: (id: string) => `/admin/users/${id}`,
    DELETE: (id: string) => `/admin/users/${id}`
  },
  PRODUCTS: {
    LIST: "/admin/products",
    DETAIL: (id: string) => `/admin/products/${id}`,
    CREATE: "/admin/products",
    UPDATE: (id: string) => `/admin/products/${id}`,
    DELETE: (id: string) => `/admin/products/${id}`
  },
  ORDERS: {
    LIST: "/admin/orders",
    DETAIL: (id: string) => `/admin/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/admin/orders/${id}/status`
  },
  CATEGORIES: {
    LIST: "/admin/categories",
    DETAIL: (id: string) => `/admin/categories/${id}`,
    CREATE: "/admin/categories",
    UPDATE: (id: string) => `/admin/categories/${id}`,
    DELETE: (id: string) => `/admin/categories/${id}`
  }
};
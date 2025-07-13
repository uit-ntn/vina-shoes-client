import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_TIMEOUT = 30000;
const AUTH_TOKEN_KEY = 'auth_token';

// Create axios instance
const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    // Get token from localStorage (client-side only)
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem(AUTH_TOKEN_KEY);
    }
    
    // If token exists, add to headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code within the range of 2xx
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        });
        
        // Update tokens in localStorage
        const { token, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem('refresh_token', newRefreshToken);
        
        // Update authorization header
        http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${token}`
        };
        
        // Retry the original request
        return http(originalRequest);
      } catch (refreshError) {
        // Failed to refresh token, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // Handle 403 Forbidden - Insufficient permissions
    if (error.response?.status === 403) {
      console.error('Permission denied');
      // Optionally redirect to a forbidden page
      // if (typeof window !== 'undefined') {
      //   window.location.href = '/forbidden';
      // }
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }
    
    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('Server error');
    }
    
    // Network errors
    if (error.message === 'Network Error') {
      console.error('Network error - please check your internet connection');
    }
    
    // Timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - the server did not respond in time');
    }
    
    return Promise.reject(error);
  }
);

// Helper methods
export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem('refresh_token');
  delete http.defaults.headers.common['Authorization'];
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
};

// API Methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    http.get<T>(url, config)
      .then(response => response.data),
      
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    http.post<T>(url, data, config)
      .then(response => response.data),
      
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    http.put<T>(url, data, config)
      .then(response => response.data),
      
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    http.patch<T>(url, data, config)
      .then(response => response.data),
      
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    http.delete<T>(url, config)
      .then(response => response.data),
};

// Export the axios instance as default
export default http;

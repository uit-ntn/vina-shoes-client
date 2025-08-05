import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AUTH } from './endpoints';

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_TIMEOUT = 30000;
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Create axios instance
const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
// Store the pending requests
let failedQueue: any[] = [];

// Process the failed queue
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor
http.interceptors.request.use(
  (config) => {
    // Get token from localStorage (client-side only)
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem(ACCESS_TOKEN_KEY);
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
    return response;
  },
  async (error: AxiosError) => {
    // Get original request
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }
    
    // Log error details for debugging
    console.error(`API Error [${originalRequest.url}]:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    // Token expired error
    if (error.response?.status === 401 && !originalRequest.headers['isRetry']) {
      if (isRefreshing) {
        // If already refreshing, add to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return http(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;
      originalRequest.headers['isRetry'] = true;

      // Try to refresh the token
      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;
        
        if (!refreshToken) {
          // No refresh token available, clear auth and reject
          if (typeof window !== 'undefined') {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            window.dispatchEvent(new Event('auth:logout'));
          }
          processQueue(error);
          return Promise.reject(error);
        }

        // Call refresh token API
        const response = await axios.post(
          `${API_BASE_URL}${AUTH.REFRESH_TOKEN}`, 
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        // Update tokens in localStorage
        const { access_token, refreshToken: newRefreshToken } = response.data;
        if (typeof window !== 'undefined') {
          localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
          localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        }

        // Update authorization header
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        
        // Process all queued requests
        processQueue(null, access_token);
        
        // Return the original request with new token
        return http(originalRequest);
      } catch (refreshError) {
        // Failed to refresh token
        console.error('Token refresh failed:', refreshError);
        
        // Clear auth data
        if (typeof window !== 'undefined') {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          window.dispatchEvent(new Event('auth:logout'));
        }
        
        // Process queue with error
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response) {
      const { status, data } = error.response;

      // Other auth errors
      if (status === 403) {
        // Permission denied
        console.error('Permission denied');
      }

      // If we have a response with data and message, use it
      if (data && typeof data === 'object') {
        if ('message' in data) {
          throw new Error(data.message as string);
        }
        // If no message but we have data, throw the data
        throw data;
      }
    }

    // Handle network errors
    if (!error.response) {
      throw new Error('Network error occurred. Please check your connection.');
    }

    // Fallback error message
    throw new Error(error.message || 'An unexpected error occurred');
  }
);

// API Methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    http.get<T>(url, config),
      
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    http.post<T>(url, data, config),
      
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    http.put<T>(url, data, config),
      
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    http.patch<T>(url, data, config),
      
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    http.delete<T>(url, config),
};

export default http;
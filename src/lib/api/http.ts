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
    return response;
  },
  async (error: AxiosError) => {
    // Log error details for debugging
    console.error(`API Error [${error.config?.url}]:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;

      // Handle authentication errors
      if (status === 401 || status === 403) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          window.dispatchEvent(new StorageEvent('storage', {
            key: AUTH_TOKEN_KEY,
            newValue: null
          }));
        }
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
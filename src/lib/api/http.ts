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
    // Log successful responses
    console.log(`API Success [${response.config.url}]:`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error: AxiosError) => {
    // Enhanced error logging
    console.error(`API Error [${error.config?.url}]:`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      stack: error.stack
    });
    throw error;
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
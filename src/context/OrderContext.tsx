'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Order, OrdersResponse } from '@/types/order';
import * as orderService from '@/services/order.service';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Define the context type
interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  currentOrder: Order | null;
  fetchUserOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  createOrder: (orderData: any) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  trackOrder: (orderId: string) => Promise<any>;
  clearCurrentOrder: () => void;
}

// Create the context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Create a hook to use the order context
export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}

// Order provider component
export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const router = useRouter();

  // Fetch user orders whenever the user changes
  useEffect(() => {
    if (user) {
      fetchUserOrders();
    } else {
      // Clear orders if user logs out
      setOrders([]);
      setCurrentOrder(null);
    }
  }, [user]);

  // Fetch all orders for the current user
  const fetchUserOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await orderService.getUserOrders();
      setOrders(response.orders);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific order by ID
  const fetchOrderById = async (orderId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const order = await orderService.getOrderById(orderId);
      setCurrentOrder(order);
    } catch (err: any) {
      const errorMessage = err.message || `Failed to fetch order ${orderId}`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Create a new order
  const createOrder = async (orderData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const loadingToast = toast.loading('Creating your order...');
      const order = await orderService.createOrder(orderData);
      setCurrentOrder(order);
      
      // Add the new order to the orders array
      setOrders(prev => [order, ...prev]);
      
      toast.success('Order created successfully!', {
        id: loadingToast,
      });
      
      return order;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create order';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel an order
  const cancelOrder = async (orderId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const loadingToast = toast.loading('Cancelling your order...');
      const updatedOrder = await orderService.cancelOrder(orderId);
      
      // Update the orders list with the cancelled order
      setOrders(prev => 
        prev.map(order => order.id === orderId ? updatedOrder : order)
      );
      
      // Update current order if it's the one being cancelled
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder(updatedOrder);
      }
      
      toast.success('Order cancelled successfully!', {
        id: loadingToast,
      });
    } catch (err: any) {
      const errorMessage = err.message || `Failed to cancel order ${orderId}`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Track an order
  const trackOrder = async (orderId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const trackingInfo = await orderService.trackOrder(orderId);
      return trackingInfo;
    } catch (err: any) {
      const errorMessage = err.message || `Failed to track order ${orderId}`;
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear the current order
  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  // Context provider value
  const value = {
    orders,
    loading,
    error,
    currentOrder,
    fetchUserOrders,
    fetchOrderById,
    createOrder,
    cancelOrder,
    trackOrder,
    clearCurrentOrder,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

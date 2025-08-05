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
  updateOrderStatus: (orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => Promise<Order>;
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

  // Fetch user orders on mount and when user changes
  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        try {
          await fetchUserOrders();
        } catch (error) {
          console.error('Failed to load orders:', error);
        }
      } else {
        // Clear orders if user logs out
        setOrders([]);
        setCurrentOrder(null);
      }
    };

    loadOrders();
  }, [user]);

  // Fetch all orders for the current user
  const fetchUserOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching orders for user:', user.id);
      const response = await orderService.getUserOrders();
      console.log('Orders response:', response);
      if (response && Array.isArray(response.orders)) {
        setOrders(response.orders);
      } else {
        console.error('Invalid orders response format:', response);
        toast.error('Định dạng dữ liệu không hợp lệ');
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Không thể tải đơn hàng';
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

  // Update order status
  const updateOrderStatus = async (orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      
      // Update the orders list with the updated order
      setOrders(prev => 
        prev.map(order => order.id === orderId ? updatedOrder : order)
      );
      
      // Update current order if it's the one being updated
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder(updatedOrder);
      }
      
      return updatedOrder;
    } catch (err: any) {
      const errorMessage = err.message || `Failed to update order ${orderId} status`;
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
    updateOrderStatus,
    clearCurrentOrder,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

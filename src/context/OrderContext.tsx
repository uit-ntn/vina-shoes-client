'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback, useMemo } from 'react';

import { Order, OrdersResponse, CreateOrderData } from '@/types/order';
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
  createOrder: (orderData: CreateOrderData) => Promise<Order>;
  cancelOrder: (orderId: string, cancelData?: { reason: string }) => Promise<void>;
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
export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();


  // Track refs ở cấp cao nhất của component để không bị tạo lại mỗi lần render
  const prevUserIdRef = useRef<string | null>(null);
  const ordersFetchedRef = useRef<boolean>(false);
  const fetchedOrderIds = useRef<{[key: string]: boolean}>({});
  
  // Fetch user orders on mount and when user changes
  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        const currentUserId = user.id || user._id || null;
        const userChanged = prevUserIdRef.current !== currentUserId;
        
        // Only fetch orders if user changed or we haven't fetched yet
        if (userChanged) {
          console.log('User changed or initial load, fetching orders');
          try {
            await fetchUserOrders();
            // Update the previous user ID reference
            prevUserIdRef.current = currentUserId;
          } catch (error) {
            console.error('Failed to load orders:', error);
          }
        }
      } else {
        // Clear orders if user logs out
        setOrders([]);
        setCurrentOrder(null);
        prevUserIdRef.current = null;
      }
    };

    loadOrders();
  }, [user]);

  // Track fetch status with refs
  // Đã di chuyển khai báo lên trên
  
  // Fetch all orders for the current user - dùng useCallback để memoize
  const fetchUserOrders = useCallback(async () => {
    if (!user) return;
    
    // Skip if we already have orders and have fetched before
    if (orders.length > 0 && ordersFetchedRef.current) {
      console.log('Skipping orders fetch - already loaded');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching orders for user:', user.id || user._id);
      const response = await orderService.getUserOrders();
      console.log('Orders response:', response);
      if (response && Array.isArray(response.orders)) {
        setOrders(response.orders);
        // Mark as fetched
        ordersFetchedRef.current = true;
      } else {
        console.error('Invalid orders response format:', response);
        toast.error('Định dạng dữ liệu không hợp lệ');
      }
    } catch (err: unknown) {
      console.error('Error fetching orders:', err);
      const errorMessage = (err as any)?.response?.data?.message || (err as Error).message || 'Không thể tải đơn hàng';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, orders.length]);

  // Đã di chuyển khai báo lên trên
  
  // Fetch a specific order by ID - dùng useCallback để memoize
  const fetchOrderById = useCallback(async (orderId: string) => {
    console.log(`[OrderContext] Checking if we need to fetch order ${orderId}`);
    
    // Skip if we already have this order as the current order
    if (currentOrder && currentOrder.id === orderId) {
      console.log(`[OrderContext] Skipping fetch for order ${orderId} - already loaded as current order`);
      return;
    }
    
    // Check if this order is in our orders array
    const existingOrder = orders.find(order => order.id === orderId);
    if (existingOrder) {
      console.log(`[OrderContext] Using cached order ${orderId} from orders list`);
      setCurrentOrder(existingOrder);
      return;
    }
    
    // Check if we've already fetched this order
    if (fetchedOrderIds.current[orderId]) {
      console.log(`[OrderContext] Skipping fetch for order ${orderId} - already fetched`);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`[OrderContext] Fetching order details for ${orderId} from API`);
      const order = await orderService.getOrderById(orderId);
      console.log(`[OrderContext] Order ${orderId} fetched successfully:`, order);
      setCurrentOrder(order);
      
      // Mark as fetched
      fetchedOrderIds.current[orderId] = true;
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || `Failed to fetch order ${orderId}`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentOrder, orders]);

  // Create a new order - dùng useCallback để memoize
  const createOrder = useCallback(async (orderData: CreateOrderData) => {
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
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Failed to create order';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel an order - dùng useCallback để memoize
  const cancelOrder = useCallback(async (orderId: string, cancelData?: { reason: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const loadingToast = toast.loading('Cancelling your order...');
      const updatedOrder = await orderService.cancelOrder(orderId, cancelData);
      
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
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || `Failed to cancel order ${orderId}`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  // Update order status - dùng useCallback để memoize
  const updateOrderStatus = useCallback(async (orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
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
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || `Failed to update order ${orderId} status`;
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  // Clear the current order - dùng useCallback để memoize
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  // Context provider value - dùng useMemo để tránh re-render không cần thiết
  const value = useMemo(() => ({
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
  }), [
    orders, 
    loading, 
    error, 
    currentOrder, 
    fetchUserOrders, 
    fetchOrderById, 
    createOrder, 
    cancelOrder, 
    updateOrderStatus, 
    clearCurrentOrder
  ]);

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

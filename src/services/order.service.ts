import http from '@/lib/api/http';
import { ORDERS } from '@/lib/api/endpoints';
import { Order, OrdersResponse } from '@/types/order';

/**
 * Create a new order
 * @param orderData - Order data including items, shipping address and payment method
 * @returns Promise with the created order
 */
export const createOrder = async (orderData: {
  items: Array<{ productId: string; quantity: number; size: number }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    ward: string;
    district: string;
    city: string;
  };
  paymentMethod: string;
}): Promise<Order> => {
  try {
    const response = await http.post(ORDERS.CREATE, orderData);
    return response.data.order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Get orders for the current user
 * @returns Promise with user's orders
 */
export const getUserOrders = async (): Promise<OrdersResponse> => {
  try {
    const response = await http.get('/orders/my-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

/**
 * Get a specific order by ID
 * @param orderId - The ID of the order to retrieve
 * @returns Promise with the order details
 */
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await http.get(ORDERS.DETAIL(orderId));
    return response.data.order;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Cancel an order
 * @param orderId - The ID of the order to cancel
 * @returns Promise with the updated order
 */
export const cancelOrder = async (orderId: string): Promise<Order> => {
  try {
    const response = await http.patch(ORDERS.CANCEL(orderId));
    return response.data.order;
  } catch (error) {
    console.error(`Error cancelling order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Track an order's shipping status
 * @param orderId - The ID of the order to track
 * @returns Promise with the tracking information
 */
export const trackOrder = async (orderId: string): Promise<any> => {
  try {
    const response = await http.get(ORDERS.TRACK(orderId));
    return response.data;
  } catch (error) {
    console.error(`Error tracking order ${orderId}:`, error);
    throw error;
  }
};

// --- ADMIN METHODS --- //

/**
 * Get all orders (admin only)
 * @param status - Optional filter by status
 * @returns Promise with all orders matching the criteria
 */
export const getAllOrders = async (status?: string): Promise<OrdersResponse> => {
  try {
    const queryParams = status ? `?status=${status}` : '';
    const response = await http.get(`${ORDERS.LIST}${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

/**
 * Update an order's status (admin only)
 * @param orderId - The ID of the order to update
 * @param status - The new status
 * @returns Promise with the updated order
 */
export const updateOrderStatus = async (
  orderId: string, 
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<Order> => {
  try {
    const response = await http.patch(`/orders/${orderId}`, { status });
    return response.data.order;
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
    throw error;
  }
};

/**
 * Delete an order (admin only)
 * @param orderId - The ID of the order to delete
 * @returns Promise with deletion confirmation
 */
export const deleteOrder = async (orderId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await http.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Get order statistics (admin only)
 * @returns Promise with order statistics
 */
export const getOrderStats = async (): Promise<any> => {
  try {
    const response = await http.get('/orders/stats/overview');
    return response.data;
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    throw error;
  }
};

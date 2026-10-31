import apiClient from '../axios';
import type { Order, CreateOrderRequest, ApiResponse } from '../../types';

export const ordersApi = {
  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders/', data);
    return response.data;
  },

  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders/');
    return response.data;
  },

  getOrder: async (orderNumber: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderNumber}/`);
    return response.data;
  },

  cancelOrder: async (orderNumber: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post<ApiResponse<Order>>(`/orders/${orderNumber}/cancel/`);
    return response.data;
  },
};

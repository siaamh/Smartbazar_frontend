import apiClient from '../axios';
import type { Cart, CartItem, ApiResponse } from '../../types';

export const cartApi = {
  getCart: async (): Promise<ApiResponse<Cart>> => {
    const response = await apiClient.get<ApiResponse<Cart>>('/cart/');
    return response.data;
  },

  addToCart: async (productId: number, quantity: number): Promise<ApiResponse<CartItem>> => {
    const response = await apiClient.post<ApiResponse<CartItem>>('/cart/items/', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  updateCartItem: async (id: number, quantity: number): Promise<ApiResponse<CartItem>> => {
    const response = await apiClient.patch<ApiResponse<CartItem>>(`/cart/items/${id}/`, {
      quantity,
    });
    return response.data;
  },

  removeCartItem: async (id: number): Promise<void> => {
    await apiClient.delete(`/cart/items/${id}/`);
  },
};

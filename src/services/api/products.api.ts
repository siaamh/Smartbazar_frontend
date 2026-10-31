import apiClient from '../axios';
import type { Product, ProductFilterParams, PaginatedResponse } from '../../types';

export const productsApi = {
  getProducts: async (params?: ProductFilterParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products/', { params });
    return response.data;
  },

  getFeaturedProducts: async (params?: Omit<ProductFilterParams, 'is_featured'>): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products/featured/', { params });
    return response.data;
  },

  getProduct: async (slug: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${slug}/`);
    return response.data;
  },
};

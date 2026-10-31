import apiClient from '../axios';
import type { Brand, BrandFilterParams, Product, ProductFilterParams, PaginatedResponse } from '../../types';

export const brandsApi = {
  getBrands: async (params?: BrandFilterParams): Promise<PaginatedResponse<Brand>> => {
    const response = await apiClient.get<PaginatedResponse<Brand>>('/brands/', { params });
    return response.data;
  },

  getBrand: async (slug: string): Promise<Brand> => {
    const response = await apiClient.get<Brand>(`/brands/${slug}/`);
    return response.data;
  },

  getBrandProducts: async (slug: string, params?: ProductFilterParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(`/brands/${slug}/products/`, { params });
    return response.data;
  },
};

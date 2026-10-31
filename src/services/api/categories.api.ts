import apiClient from '../axios';
import type { Category, PaginatedResponse } from '../../types';

export const categoriesApi = {
  getCategories: async (): Promise<PaginatedResponse<Category>> => {
    const response = await apiClient.get<PaginatedResponse<Category>>('/categories/');
    return response.data;
  },

  getCategory: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${slug}/`);
    return response.data;
  },
};

import apiClient from '../axios';
import type { ApiResponse, User, LoginRequest, RegisterRequest } from '../../types';

interface LoginResponseData {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

interface RegisterResponseData {
  id: number;
  username: string;
  email: string;
}

export const authApi = {
  /**
   * Login via /accounts/login/ — returns access+refresh tokens AND user object.
   * Do NOT use /accounts/token/ for user login (no user object returned).
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponseData>> => {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      '/accounts/login/',
      credentials
    );
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<RegisterResponseData>> => {
    const response = await apiClient.post<ApiResponse<RegisterResponseData>>(
      '/accounts/register/',
      data
    );
    return response.data;
  },

  logout: async (refresh: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/accounts/logout/', { refresh });
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/accounts/me/');
    return response.data;
  },

  updateMe: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch<ApiResponse<User>>('/accounts/me/', data);
    return response.data;
  },
};

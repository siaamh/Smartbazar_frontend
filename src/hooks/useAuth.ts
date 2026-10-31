import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../services/api/auth.api';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useToastStore } from '../stores/toastStore';
import type { LoginRequest, RegisterRequest, User } from '../types';

export function useLogin() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const addToast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { access, refresh, user } = response.data;
        setTokens(access, refresh, user as User);
        const from = (location.state as any)?.from?.pathname || '/account';
        navigate(from, { replace: true });
      }
    },
    onError: () => {
      addToast('Invalid username or password', 'error');
    },
  });
}

export function useRegister() {
  const addToast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      addToast('Account created! Please log in.', 'success');
      navigate('/login');
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || 'Registration failed. Please try again.';
      addToast(msg, 'error');
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const setItemCount = useCartStore((s) => s.setItemCount);
  const addToast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await authApi.logout(refreshToken).catch(() => {});
      }
    },
    onSettled: () => {
      clearAuth();
      setItemCount(0);
      queryClient.clear();
      navigate('/');
      addToast('Logged out successfully', 'info');
    },
  });
}

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.getMe(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateMe() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const addToast = useToastStore((s) => s.addToast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => authApi.updateMe(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        updateUser(response.data);
        queryClient.invalidateQueries({ queryKey: ['me'] });
        addToast('Profile updated successfully', 'success');
      }
    },
    onError: () => {
      addToast('Failed to update profile', 'error');
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../services/api/orders.api';
import { useCartStore } from '../stores/cartStore';
import { useToastStore } from '../stores/toastStore';
import type { CreateOrderRequest } from '../types';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getOrders(),
  });
}

export function useOrder(orderNumber: string) {
  return useQuery({
    queryKey: ['order', orderNumber],
    queryFn: () => ordersApi.getOrder(orderNumber),
    enabled: !!orderNumber,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const setItemCount = useCartStore((s) => s.setItemCount);
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersApi.createOrder(data),
    onSuccess: () => {
      // Clear cart after successful order
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.removeQueries({ queryKey: ['cart'] });
      setItemCount(0);
      addToast('Order placed successfully!', 'success');
    },
    onError: () => {
      addToast('Failed to place order. Please try again.', 'error');
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (orderNumber: string) => ordersApi.cancelOrder(orderNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      addToast('Order cancelled', 'info');
    },
    onError: () => {
      addToast('Failed to cancel order', 'error');
    },
  });
}

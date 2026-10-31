import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../services/api/cart.api';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';

export function useCart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const setItemCount = useCartStore((s) => s.setItemCount);

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await cartApi.getCart();
      // Sync item count to store
      if (response.data) {
        setItemCount(response.data.items.reduce((acc, item) => acc + item.quantity, 0));
      }
      return response;
    },
    enabled: isAuthenticated && user?.role === 'customer',
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartApi.addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      addToast('Added to cart', 'success');
    },
    onError: () => {
      addToast('Failed to add to cart', 'error');
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      cartApi.updateCartItem(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      addToast('Failed to update cart', 'error');
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: number) => cartApi.removeCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      addToast('Item removed from cart', 'info');
    },
    onError: () => {
      addToast('Failed to remove item', 'error');
    },
  });
}

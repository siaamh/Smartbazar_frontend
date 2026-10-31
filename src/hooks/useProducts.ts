import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../services/api/products.api';
import type { ProductFilterParams } from '../types';

export function useProducts(params?: ProductFilterParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getProducts(params),
  });
}

export function useFeaturedProducts(params?: Omit<ProductFilterParams, 'is_featured'>) {
  return useQuery({
    queryKey: ['products', 'featured', params],
    queryFn: () => productsApi.getFeaturedProducts(params),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getProduct(slug),
    enabled: !!slug,
  });
}

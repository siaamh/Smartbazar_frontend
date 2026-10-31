import { useQuery } from '@tanstack/react-query';
import { brandsApi } from '../services/api/brands.api';
import type { BrandFilterParams, ProductFilterParams } from '../types';

export function useBrands(params?: BrandFilterParams) {
  return useQuery({
    queryKey: ['brands', params],
    queryFn: () => brandsApi.getBrands(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useBrand(slug: string) {
  return useQuery({
    queryKey: ['brand', slug],
    queryFn: () => brandsApi.getBrand(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function useBrandProducts(slug: string, params?: ProductFilterParams) {
  return useQuery({
    queryKey: ['brand-products', slug, params],
    queryFn: () => brandsApi.getBrandProducts(slug, params),
    enabled: !!slug,
  });
}

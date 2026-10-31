import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../services/api/categories.api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
    staleTime: 10 * 60 * 1000, // Categories change rarely
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoriesApi.getCategory(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

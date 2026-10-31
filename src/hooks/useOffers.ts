import { useQuery } from '@tanstack/react-query';
import { offersApi } from '../services/api/offers.api';

export function useOffers() {
  return useQuery({
    queryKey: ['offers'],
    queryFn: () => offersApi.getOffers(),
    staleTime: 60 * 1000, // 1 min — offers change frequently
  });
}

export function useUpcomingOffers() {
  return useQuery({
    queryKey: ['offers', 'upcoming'],
    queryFn: () => offersApi.getUpcomingOffers(),
    staleTime: 60 * 1000,
  });
}

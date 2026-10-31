import apiClient from '../axios';
import type { Offer, PaginatedResponse } from '../../types';

export const offersApi = {
  getOffers: async (): Promise<Offer[]> => {
    // Backend returns a paginated response; we unwrap results here.
    const response = await apiClient.get<PaginatedResponse<Offer>>('/offers/');
    return response.data.results;
  },

  getUpcomingOffers: async (): Promise<Offer[]> => {
    const response = await apiClient.get<PaginatedResponse<Offer>>('/offers/upcoming/');
    return response.data.results;
  },
};

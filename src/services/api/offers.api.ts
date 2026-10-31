import apiClient from '../axios';
import type { Offer } from '../../types';

export const offersApi = {
  getOffers: async (): Promise<Offer[]> => {
    const response = await apiClient.get<Offer[]>('/offers/');
    return response.data;
  },

  getUpcomingOffers: async (): Promise<Offer[]> => {
    const response = await apiClient.get<Offer[]>('/offers/upcoming/');
    return response.data;
  },
};

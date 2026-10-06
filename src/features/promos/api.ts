import apiClient from '@/lib/api-client';
import { PromoCode, CreatePromoPayload, UpdatePromoPayload } from './types';

export const promoApi = {
  getAllPromos: async (type?: string): Promise<PromoCode[]> => {
    const res = await apiClient.get('/promos', {
      params: type ? { type } : undefined,
    });
    return res.data.data;
  },

  getPromoById: async (id: number): Promise<PromoCode> => {
    const res = await apiClient.get(`/promos/${id}`);
    return res.data.data;
  },

  createPromo: async (payload: CreatePromoPayload): Promise<PromoCode> => {
    const res = await apiClient.post('/promos', payload);
    return res.data.data;
  },

  updatePromo: async (id: number, payload: UpdatePromoPayload): Promise<PromoCode> => {
    const res = await apiClient.patch(`/promos/${id}`, payload);
    return res.data.data;
  },

  deletePromo: async (id: number): Promise<void> => {
    await apiClient.delete(`/promos/${id}`);
  },
};

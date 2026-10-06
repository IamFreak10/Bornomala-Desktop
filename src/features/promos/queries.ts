import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promoApi } from './api';
import { CreatePromoPayload, UpdatePromoPayload } from './types';

export const PROMOS_QUERY_KEY = ['promos'];

export const usePromosQuery = (type?: string) => {
  return useQuery({
    queryKey: type ? [...PROMOS_QUERY_KEY, type] : PROMOS_QUERY_KEY,
    queryFn: () => promoApi.getAllPromos(type),
  });
};

export const useCreatePromoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePromoPayload) => promoApi.createPromo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOS_QUERY_KEY });
    },
  });
};

export const useUpdatePromoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePromoPayload }) =>
      promoApi.updatePromo(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOS_QUERY_KEY });
    },
  });
};

export const useDeletePromoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => promoApi.deletePromo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOS_QUERY_KEY });
    },
  });
};

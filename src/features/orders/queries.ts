import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrders,
  fetchOrderById,
  updateOrderStatus,
  deleteOrder,
  approvePaymentClaim,
  rejectPaymentClaim,
} from "./api";
import type { OrderStatus } from "./types";

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const ordersKeys = {
  all: ["orders"] as const,
  list: () => [...ordersKeys.all, "list"] as const,
  detail: (id: number) => [...ordersKeys.all, "detail", id] as const,
};

// ─── Queries ─────────────────────────────────────────────────────────────────
export function useOrdersQuery() {
  return useQuery({
    queryKey: ordersKeys.list(),
    queryFn: fetchOrders,
    staleTime: 1000 * 5,
    refetchInterval: 1000 * 10, // Poll every 10s for incoming live orders
  });
}

export function useOrderByIdQuery(id: number) {
  return useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: () => fetchOrderById(id),
    enabled: !!id,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────
export function useUpdateOrderStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

export function useApproveClaimMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      claimId,
      adminNote,
    }: {
      claimId: number;
      adminNote?: string;
    }) => approvePaymentClaim(claimId, adminNote),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

export function useRejectClaimMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      claimId,
      adminNote,
    }: {
      claimId: number;
      adminNote?: string;
    }) => rejectPaymentClaim(claimId, adminNote),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

export function useDeleteOrderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteOrder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

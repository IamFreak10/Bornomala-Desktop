export type PromoType = 'student' | 'campus_ambassador';

export interface PromoCode {
  promoId: number;
  code: string;
  type: PromoType;
  ambassadorName?: string | null;
  discountPercentage: string;
  minOrderAmount?: string | null;
  maxDiscountAmount?: string | null;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreatePromoPayload {
  code: string;
  type: PromoType;
  ambassadorName?: string;
  discountPercentage: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  isActive?: boolean;
  expiresAt?: string;
}

export interface UpdatePromoPayload extends Partial<CreatePromoPayload> {}

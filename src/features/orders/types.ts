export type OrderStatus =
  | "placed"
  | "notified"
  | "contacted"
  | "paid"
  | "confirmed"
  | "completed"
  | "cancelled";

export type PaymentClaimStatus = "pending" | "approved" | "rejected";

export type PaymentMethod = "bkash" | "nagad";

export interface BookDetail {
  bookId: number;
  courseCode?: string;
  bookName: string;
  authorName: string;
  price: string;
  coverImage?: string | null;
}

export interface StationeryDetail {
  itemId: number;
  itemName: string;
  itemPrice: string;
}

export interface OrderItem {
  orderItemId: number;
  orderId: number;
  itemType: "book" | "stationery";
  bookId: number | null;
  stationeryItemId: number | null;
  quantity: number;
  unitPrice: string;
  book?: BookDetail | null;
  sationeryItem?: StationeryDetail | null;
}

export interface ManualPaymentClaim {
  claimId: number;
  orderId: number;
  senderNumber: string;
  transactionId: string;
  paymentMethod: PaymentMethod;
  amount: string;
  status: PaymentClaimStatus;
  adminNote?: string | null;
  submittedAt: string;
  reviewedAt?: string | null;
}

export interface Order {
  orderId: number;
  studentName: string;
  institute?: string | null;
  phoneNumber: string;
  status: OrderStatus;
  subtotal?: string | null;
  discountAmount?: string | null;
  promoCode?: string | null;
  promoType?: string | null;
  totalPrice: string;
  placedAt: string;
  confirmedAt?: string | null;
  items?: OrderItem[];
  paymentClaims?: ManualPaymentClaim[];
}

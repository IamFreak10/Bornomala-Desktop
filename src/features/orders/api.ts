import { apiClient } from "@/lib/api-client";
import type { Order, OrderStatus, ManualPaymentClaim, BookDetail } from "./types";

let cachedBooksMap: Map<number, BookDetail> | null = null;
let lastBooksFetch = 0;

async function getBooksMap(): Promise<Map<number, BookDetail>> {
  const now = Date.now();
  if (cachedBooksMap && now - lastBooksFetch < 60000) {
    return cachedBooksMap;
  }

  try {
    const res = await apiClient.get("/book");
    const depts = (res.data?.data || []) as any[];
    const map = new Map<number, BookDetail>();
    for (const d of depts) {
      for (const s of d.semesters || []) {
        for (const c of s.courses || []) {
          for (const b of c.books || []) {
            if (b.bookId) {
              map.set(b.bookId, {
                bookId: b.bookId,
                bookName: b.bookName,
                authorName: b.authorName,
                price: String(b.price || "0"),
                courseCode: b.courseCode || c.courseCode,
                coverImage: b.coverImage
                  ? b.coverImage.replace(/^http:\/\//, "https://")
                  : null,
              });
            }
          }
        }
      }
    }
    cachedBooksMap = map;
    lastBooksFetch = now;
    return map;
  } catch (err) {
    console.warn("Could not fetch books catalog fallback:", err);
    return cachedBooksMap || new Map();
  }
}

function enrichOrder(order: Order, booksMap: Map<number, BookDetail>): Order {
  return {
    ...order,
    items: order.items?.map((item) => {
      let book = item.book;
      if (!book && item.bookId) {
        book = booksMap.get(item.bookId) || null;
      }
      if (book?.coverImage) {
        book = {
          ...book,
          coverImage: book.coverImage.replace(/^http:\/\//, "https://"),
        };
      }
      return {
        ...item,
        book,
      };
    }),
  };
}

/** GET /orders → all orders with items and payment claims */
export async function fetchOrders(): Promise<Order[]> {
  const res = await apiClient.get("/orders");
  const rawOrders = (res.data.data || []) as Order[];
  const booksMap = await getBooksMap();
  return rawOrders.map((o) => enrichOrder(o, booksMap));
}

/** GET /orders/:id → single order */
export async function fetchOrderById(id: number): Promise<Order> {
  const res = await apiClient.get(`/orders/${id}`);
  const rawOrder = res.data.data as Order;
  const booksMap = await getBooksMap();
  return enrichOrder(rawOrder, booksMap);
}

/** PATCH /orders/:id → update status */
export async function updateOrderStatus(
  id: number,
  status: OrderStatus
): Promise<Order> {
  const res = await apiClient.patch(`/orders/${id}`, { status });
  const rawOrder = res.data.data as Order;
  const booksMap = await getBooksMap();
  return enrichOrder(rawOrder, booksMap);
}

/** DELETE /orders/:id */
export async function deleteOrder(id: number): Promise<void> {
  await apiClient.delete(`/orders/${id}`);
}

/** PATCH /manual-payments/:id/approve */
export async function approvePaymentClaim(
  claimId: number,
  adminNote?: string
): Promise<ManualPaymentClaim> {
  const res = await apiClient.patch(`/manual-payments/${claimId}/approve`, {
    adminNote,
  });
  return res.data.data as ManualPaymentClaim;
}

/** PATCH /manual-payments/:id/reject */
export async function rejectPaymentClaim(
  claimId: number,
  adminNote?: string
): Promise<ManualPaymentClaim> {
  const res = await apiClient.patch(`/manual-payments/${claimId}/reject`, {
    adminNote,
  });
  return res.data.data as ManualPaymentClaim;
}

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Phone,
  MessageCircle,
  AlertTriangle,
  Receipt,
  User,
  Building,
  Loader2,
  Calendar,
  BookOpen,
  Printer,
} from "lucide-react";
import { BookHoverCard } from "./BookHoverCard";
import type { Order, OrderStatus } from "../types";
import {
  useUpdateOrderStatusMutation,
  useApproveClaimMutation,
  useRejectClaimMutation,
} from "../queries";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailsDialogProps) {
  if (!order) return null;

  const [copiedTx, setCopiedTx] = React.useState(false);
  const [copiedPhone, setCopiedPhone] = React.useState(false);
  const [adminNote, setAdminNote] = React.useState("");

  const updateStatusMutation = useUpdateOrderStatusMutation();
  const approveClaimMutation = useApproveClaimMutation();
  const rejectClaimMutation = useRejectClaimMutation();

  const latestClaim = order.paymentClaims && order.paymentClaims.length > 0
    ? order.paymentClaims[order.paymentClaims.length - 1]
    : null;

  const handleCopy = (text: string, type: "tx" | "phone") => {
    navigator.clipboard.writeText(text);
    if (type === "tx") {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleStatusChange = (status: OrderStatus) => {
    updateStatusMutation.mutate({ id: order.orderId, status });
  };

  const handleApproveClaim = () => {
    if (!latestClaim) return;
    approveClaimMutation.mutate({
      claimId: latestClaim.claimId,
      adminNote: adminNote.trim() || undefined,
    });
  };

  const handleRejectClaim = () => {
    if (!latestClaim) return;
    rejectClaimMutation.mutate({
      claimId: latestClaim.claimId,
      adminNote: adminNote.trim() || undefined,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const isActionLoading =
    updateStatusMutation.isPending ||
    approveClaimMutation.isPending ||
    rejectClaimMutation.isPending;

  // Clean phone number for WhatsApp
  const rawPhone = order.phoneNumber.replace(/\D/g, "");
  const waPhone = rawPhone.startsWith("88")
    ? rawPhone
    : rawPhone.startsWith("0")
    ? `88${rawPhone}`
    : `880${rawPhone}`;

  const totalItemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <DialogTitle className="text-lg font-bold">
                অর্ডার #{order.orderId}
              </DialogTitle>
              <Badge
                variant={
                  order.status === "paid" || order.status === "confirmed"
                    ? "success"
                    : order.status === "cancelled"
                    ? "destructive"
                    : "saffron"
                }
              >
                {order.status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {new Date(order.placedAt).toLocaleString("bn-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <Button
                variant="outline"
                size="xs"
                onClick={handlePrint}
                className="gap-1 text-xs print:hidden"
              >
                <Printer className="h-3.5 w-3.5" />
                প্রিন্ট
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Customer Info Card */}
          <div className="rounded-xl border border-border/80 bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground text-sm">
                    {order.studentName}
                  </span>
                </div>
                {order.institute && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building className="h-3.5 w-3.5" />
                    <span>{order.institute}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs font-mono font-medium text-foreground">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{order.phoneNumber}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.phoneNumber, "phone")}
                    className="p-1 hover:text-primary transition-colors"
                    title="কপি করুন"
                  >
                    {copiedPhone ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Communication Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${order.phoneNumber}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  কল করুন
                </a>
                <a
                  href={`https://wa.me/${waPhone}?text=${encodeURIComponent(
                    `আসসালামু আলাইকুম ${order.studentName}, বর্ণমালা বুকশপ থেকে আপনার অর্ডার #${order.orderId} প্রসঙ্গে যোগাযোগ করা হচ্ছে।`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 px-3 py-1.5 text-xs font-semibold hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* ── Ordered Books & Items List (Full Visual Display) ── */}
          <div className="rounded-xl border border-border/80 bg-card overflow-hidden">
            <div className="bg-muted/40 px-4 py-2.5 border-b border-border/80 flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                অর্ডারকৃত বই ও পণ্যের তালিকা ({order.items?.length || 0} ধরনের, মোট {totalItemCount}টি)
              </span>
              <span className="text-xs font-mono font-bold text-primary">
                মোট: ৳{order.totalPrice}
              </span>
            </div>

            <div className="divide-y divide-border/60">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => {
                  const book = item.book;
                  const title = book?.bookName || `আইটেম #${item.bookId || item.stationeryItemId || idx + 1}`;
                  const author = book?.authorName || item.itemType;
                  const cover = book?.coverImage;
                  const courseCode = book?.courseCode;
                  const qty = item.quantity || 1;
                  const unitPrice = item.unitPrice || book?.price || "0";
                  const subtotal = Number(unitPrice) * qty;

                  return (
                    <div
                      key={item.orderItemId || idx}
                      className="flex items-center gap-3.5 p-3 hover:bg-muted/30 transition-colors"
                    >
                      {/* Book Cover Thumbnail with Hover Preview */}
                      <BookHoverCard
                        book={item.book}
                        quantity={item.quantity}
                        unitPrice={item.unitPrice}
                        side="right"
                      >
                        <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-muted border border-border shadow-xs">
                          {cover ? (
                            <img
                              src={cover}
                              alt={title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <BookOpen className="h-6 w-6 opacity-40" />
                            </div>
                          )}
                        </div>
                      </BookHoverCard>

                      {/* Book Details */}
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-sm text-foreground line-clamp-1">
                          {title}
                        </h5>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {author}
                          {courseCode ? ` • কোর্স কোড: ${courseCode}` : ""}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary font-mono">
                            পরিমাণ: {qty}টি কপি
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            (প্রতি কপি ৳{unitPrice})
                          </span>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <span className="text-sm font-bold text-foreground font-mono block">
                          ৳{subtotal}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          মোট মূল্য
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  কোনো আইটেম পাওয়া যায়নি
                </div>
              )}
            </div>

            {/* Total & Discount Summary Footer */}
            <div className="bg-muted/30 px-4 py-3 border-t border-border space-y-1.5 text-xs font-medium">
              {order.subtotal && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>সাবটোটাল:</span>
                  <span className="font-mono font-semibold text-foreground">৳{order.subtotal}</span>
                </div>
              )}
              {order.promoCode && (
                <div className="flex items-center justify-between text-emerald-600 font-bold">
                  <span className="flex items-center gap-1.5">
                    <span>ছাড় ({order.promoCode}):</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-600/10 border border-emerald-600/30">
                      {order.promoType === 'campus_ambassador' ? 'এম্বাসেডর' : 'স্টুডেন্ট'}
                    </span>
                  </span>
                  <span className="font-mono">-৳{order.discountAmount || '0'}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1 border-t border-border/60 font-bold text-sm">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">
                  সর্বমোট প্রদেয় বিল:
                </span>
                <span className="text-primary font-mono text-lg font-black">
                  ৳{order.totalPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Verification Hub */}
          <div className="rounded-xl border border-border/80 bg-card p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <span>পেমেন্ট ভেরিফিকেশন ও ট্রানজেকশন তথ্য</span>
            </h4>

            {latestClaim ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/40 p-3.5 border border-border/60">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold text-xs uppercase shadow-xs ${
                        latestClaim.paymentMethod === "bkash"
                          ? "bg-[#E2136E]"
                          : "bg-[#F7941D]"
                      }`}
                    >
                      {latestClaim.paymentMethod === "bkash" ? "bK" : "Ng"}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        {latestClaim.paymentMethod} • প্রেরক নম্বর:{" "}
                        <strong className="text-foreground font-mono">{latestClaim.senderNumber}</strong>
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-sm font-bold text-primary tracking-wide">
                          TrxID: {latestClaim.transactionId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(latestClaim.transactionId, "tx")}
                          className="rounded p-1 hover:bg-muted transition-colors"
                          title="TrxID কপি করুন"
                        >
                          {copiedTx ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-bold text-foreground font-mono">
                      ৳{latestClaim.amount}
                    </p>
                    <Badge
                      variant={
                        latestClaim.status === "approved"
                          ? "success"
                          : latestClaim.status === "rejected"
                          ? "destructive"
                          : "saffron"
                      }
                      className="mt-0.5 text-[10px]"
                    >
                      {latestClaim.status === "approved"
                        ? "ভেরিফাইড (Approved)"
                        : latestClaim.status === "rejected"
                        ? "বাতিল (Rejected)"
                        : "যাচাই প্রয়োজন (Pending)"}
                    </Badge>
                  </div>
                </div>

                {latestClaim.adminNote && (
                  <p className="text-xs text-muted-foreground bg-muted/20 px-3 py-1.5 rounded-lg border border-border">
                    <span className="font-semibold text-foreground">এডমিন নোট:</span> {latestClaim.adminNote}
                  </p>
                )}

                {/* Approve / Reject Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <Input
                    placeholder="এডমিন নোট বা মন্তব্য লিখুন (ঐচ্ছিক)"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="h-8 text-xs flex-1"
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={handleApproveClaim}
                      disabled={isActionLoading || latestClaim.status === "approved"}
                      className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-none text-xs shadow-xs"
                    >
                      {approveClaimMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                      পেমেন্ট অনুমোদন
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleRejectClaim}
                      disabled={isActionLoading || latestClaim.status === "rejected"}
                      className="gap-1.5 flex-1 sm:flex-none text-xs"
                    >
                      {rejectClaimMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      প্রত্যাখ্যান
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 rounded-lg bg-amber-500/10 p-3 text-amber-700 dark:text-amber-400 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  গ্রাহক এখনো কোনো ম্যানুয়াল পেমেন্ট বা TrxID সাবমিট করেননি।
                </span>
              </div>
            )}
          </div>

          {/* Status Quick Changer */}
          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2">
            <label className="text-xs font-bold text-foreground block">
              অর্ডার স্ট্যাটাস দ্রুত পরিবর্তন করুন:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { key: "placed", label: "অপেক্ষমাণ (Placed)" },
                  { key: "notified", label: "যোগাযোগ হবে (Notified)" },
                  { key: "contacted", label: "যোগাযোগ সম্পন্ন (Contacted)" },
                  { key: "paid", label: "পেইড (Paid)" },
                  { key: "confirmed", label: "কনফার্মড (Confirmed)" },
                  { key: "completed", label: "সম্পন্ন (Completed)" },
                  { key: "cancelled", label: "বাতিল (Cancelled)" },
                ] as const
              ).map((s) => (
                <Button
                  key={s.key}
                  size="xs"
                  variant={order.status === s.key ? "default" : "outline"}
                  disabled={isActionLoading}
                  onClick={() => handleStatusChange(s.key)}
                  className="text-xs"
                >
                  {order.status === s.key && <Check className="h-3 w-3 mr-1" />}
                  {s.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

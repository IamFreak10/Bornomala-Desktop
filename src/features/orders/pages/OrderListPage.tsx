import * as React from "react";
import { PageTemplate } from "@/components/shared/PageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  BookOpen,
  DollarSign,
  Package,
  Eye,
  Check,
  Copy,
  AlertCircle,
} from "lucide-react";
import { useOrdersQuery, useApproveClaimMutation, useUpdateOrderStatusMutation } from "../queries";
import { OrderDetailsDialog } from "../components/OrderDetailsDialog";
import { BookHoverCard } from "../components/BookHoverCard";
import type { Order } from "../types";

export function OrderListPage() {
  const { data: orders = [], isLoading, isFetching, refetch } = useOrdersQuery();
  const approveClaimMutation = useApproveClaimMutation();
  const updateStatusMutation = useUpdateOrderStatusMutation();

  // Search & Filter
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Stats calculation
  const totalOrders = orders.length;
  const pendingClaims = orders.filter((o) =>
    o.paymentClaims?.some((c) => c.status === "pending")
  );
  const paidOrConfirmed = orders.filter(
    (o) => o.status === "paid" || o.status === "confirmed" || o.status === "completed"
  );
  const totalRevenue = paidOrConfirmed.reduce(
    (sum, o) => sum + Number(o.totalPrice || 0),
    0
  );

  // Filtered orders
  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter === "pending_payment") {
        const hasPendingClaim = order.paymentClaims?.some(
          (c) => c.status === "pending"
        );
        if (!hasPendingClaim) return false;
      } else if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = order.studentName.toLowerCase().includes(q);
        const matchesPhone = order.phoneNumber.toLowerCase().includes(q);
        const matchesId = String(order.orderId).includes(q);
        const matchesInstitute = (order.institute || "").toLowerCase().includes(q);
        const matchesTrx = order.paymentClaims?.some((c) =>
          c.transactionId.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesPhone && !matchesId && !matchesInstitute && !matchesTrx) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, search]);

  const quickApprove = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    const claim = order.paymentClaims?.find((c) => c.status === "pending");
    if (claim) {
      approveClaimMutation.mutate({ claimId: claim.claimId });
    } else {
      updateStatusMutation.mutate({ id: order.orderId, status: "paid" });
    }
  };

  return (
    <PageTemplate
      title="অর্ডার ও পেমেন্ট ম্যানেজমেন্ট"
      subtitle="কাস্টমার অর্ডার ট্র্যাকিং, বিকাশ/নগদ পেমেন্ট ভেরিফিকেশন ও ডেলিভারি স্ট্যাটাস"
      badge={`মোট ${totalOrders}টি অর্ডার`}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5 text-xs shadow-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-primary" : ""}`}
            />
            <span>{isFetching ? "লোড হচ্ছে…" : "রিফ্রেশ"}</span>
          </Button>
        </div>
      }
    >
      {/* ── Top Metric Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Orders */}
        <Card className="border border-border/80 bg-card shadow-xs">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                মোট অর্ডার
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {totalOrders}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Claims — Highlights when there are claims needing verification */}
        <Card
          className={`border shadow-xs transition-all ${
            pendingClaims.length > 0
              ? "border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10 ring-1 ring-amber-500/30"
              : "border-border/80 bg-card"
          }`}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span>পেমেন্ট যাচাই প্রয়োজন</span>
                {pendingClaims.length > 0 && (
                  <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {pendingClaims.length}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Paid / Confirmed */}
        <Card className="border border-border/80 bg-card shadow-xs">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                পেইড / কনফার্মড
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {paidOrConfirmed.length}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="border border-border/80 bg-card shadow-xs">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                নিশ্চিত বিক্রয় মূল্য
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-primary">
                ৳{totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Filter Tabs & Search Bar ──────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "all", label: "সবগুলো", count: orders.length },
              {
                id: "pending_payment",
                label: "পেমেন্ট যাচাই প্রয়োজন",
                count: pendingClaims.length,
                highlight: pendingClaims.length > 0,
              },
              {
                id: "placed",
                label: "অপেক্ষমাণ",
                count: orders.filter((o) => o.status === "placed").length,
              },
              {
                id: "paid",
                label: "পেইড",
                count: orders.filter((o) => o.status === "paid").length,
              },
              {
                id: "confirmed",
                label: "কনফার্মড",
                count: orders.filter((o) => o.status === "confirmed").length,
              },
              {
                id: "cancelled",
                label: "বাতিল",
                count: orders.filter((o) => o.status === "cancelled").length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  statusFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : tab.highlight
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    statusFilter === tab.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="নাম, ফোন বা TrxID খুঁজুন…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>
        </div>

        {/* ── Orders Table ────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
              <RefreshCw className="h-6 w-6 animate-spin text-primary mb-2" />
              <p className="text-xs text-muted-foreground">অর্ডার তথ্য লোড হচ্ছে…</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-semibold text-foreground">
                কোনো অর্ডার পাওয়া যায়নি
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ফিল্টার পরিবর্তন করুন বা নতুন অর্ডারের জন্য অপেক্ষা করুন।
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/40 text-xs">
                <TableRow>
                  <TableHead className="w-[100px]">অর্ডার আইডি</TableHead>
                  <TableHead>গ্রাহকের তথ্য</TableHead>
                  <TableHead>আইটেম</TableHead>
                  <TableHead>মোট টাকা</TableHead>
                  <TableHead>পেমেন্ট ও TrxID</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {filteredOrders.map((order) => {
                  const latestClaim =
                    order.paymentClaims && order.paymentClaims.length > 0
                      ? order.paymentClaims[order.paymentClaims.length - 1]
                      : null;
                  const isPendingVerification = latestClaim?.status === "pending";

                  return (
                    <TableRow
                      key={order.orderId}
                      onClick={() => setSelectedOrder(order)}
                      className={`cursor-pointer transition-colors hover:bg-muted/40 ${
                        isPendingVerification
                          ? "bg-amber-500/5 dark:bg-amber-500/10 font-medium"
                          : ""
                      }`}
                    >
                      {/* Order ID & Time */}
                      <TableCell>
                        <div className="font-bold text-foreground">
                          #{order.orderId}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(order.placedAt).toLocaleTimeString("bn-BD", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </TableCell>

                      {/* Customer Info */}
                      <TableCell>
                        <div className="font-semibold text-foreground">
                          {order.studentName}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                          <span>{order.phoneNumber}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(order.phoneNumber);
                            }}
                            className="hover:text-primary"
                            title="ফোন নম্বর কপি করুন"
                          >
                            {copiedId === order.phoneNumber ? (
                              <Check className="h-2.5 w-2.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-2.5 w-2.5" />
                            )}
                          </button>
                        </div>
                        {order.institute && (
                          <div className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                            {order.institute}
                          </div>
                        )}
                      </TableCell>

                      {/* Items Preview with Cover, Name & Details */}
                      <TableCell className="min-w-[260px] max-w-[340px] py-2.5">
                        {order.items && order.items.length > 0 ? (
                          <div className="space-y-1.5">
                            {order.items.map((item, idx) => {
                              const book = item.book;
                              const title = book?.bookName || `বই #${item.bookId || idx + 1}`;
                              const author = book?.authorName || item.itemType;
                              const cover = book?.coverImage;
                              const courseCode = book?.courseCode;
                              const qty = item.quantity || 1;
                              const price = item.unitPrice || book?.price || "0";

                              return (
                                <div
                                  key={item.orderItemId || idx}
                                  className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/20 p-1.5 hover:bg-muted/40 transition-colors"
                                >
                                  <BookHoverCard
                                    book={book}
                                    quantity={qty}
                                    unitPrice={price}
                                    side="right"
                                  >
                                    <div className="h-10 w-8 shrink-0 overflow-hidden rounded-md bg-muted border border-border/80 shadow-xs">
                                      {cover ? (
                                        <img
                                          src={cover}
                                          alt={title}
                                          className="h-full w-full object-cover"
                                          loading="lazy"
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                          <BookOpen className="h-3.5 w-3.5 opacity-40" />
                                        </div>
                                      )}
                                    </div>
                                  </BookHoverCard>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <p className="font-bold text-foreground line-clamp-1 text-xs">
                                        {title}
                                      </p>
                                      <span className="rounded bg-primary/10 px-1 py-0.2 text-[9px] font-bold text-primary font-mono shrink-0">
                                        x{qty}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                                      {author} {courseCode ? `• ${courseCode}` : ""}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">কোনো পণ্য নেই</span>
                        )}
                      </TableCell>

                      {/* Total Price */}
                      <TableCell>
                        <span className="font-bold text-foreground font-mono">
                          ৳{order.totalPrice}
                        </span>
                      </TableCell>

                      {/* Payment Claim Column */}
                      <TableCell>
                        {latestClaim ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`inline-flex items-center justify-center rounded px-1 text-[10px] font-bold text-white uppercase ${
                                  latestClaim.paymentMethod === "bkash"
                                    ? "bg-[#E2136E]"
                                    : "bg-[#F7941D]"
                                }`}
                              >
                                {latestClaim.paymentMethod}
                              </span>
                              <span className="font-mono text-[11px] font-bold text-primary">
                                {latestClaim.transactionId}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(latestClaim.transactionId);
                                }}
                                className="hover:text-primary"
                                title="TrxID কপি করুন"
                              >
                                {copiedId === latestClaim.transactionId ? (
                                  <Check className="h-2.5 w-2.5 text-emerald-500" />
                                ) : (
                                  <Copy className="h-2.5 w-2.5 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              প্রেরক: {latestClaim.senderNumber}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground italic">
                            জমা হয়নি
                          </span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <div className="space-y-1">
                          <Badge
                            variant={
                              order.status === "paid" || order.status === "confirmed"
                                ? "success"
                                : order.status === "cancelled"
                                ? "destructive"
                                : "saffron"
                            }
                            className="text-[10px] capitalize"
                          >
                            {order.status}
                          </Badge>

                          {/* Secondary Claim Badge */}
                          {latestClaim && (
                            <div>
                              <Badge
                                variant={
                                  latestClaim.status === "approved"
                                    ? "success"
                                    : latestClaim.status === "rejected"
                                    ? "destructive"
                                    : "saffron"
                                }
                                className="text-[9px] px-1 py-0"
                              >
                                {latestClaim.status === "approved"
                                  ? "Payment Verified"
                                  : latestClaim.status === "rejected"
                                  ? "Payment Rejected"
                                  : "Claim Pending"}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Action Buttons */}
                      <TableCell className="text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Quick Approve Button for pending claims */}
                          {isPendingVerification && (
                            <Button
                              size="xs"
                              variant="default"
                              onClick={(e) => quickApprove(order, e)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-[11px] shadow-xs"
                            >
                              <Check className="h-3 w-3" />
                              অনুমোদন
                            </Button>
                          )}

                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                            className="gap-1 text-[11px]"
                          >
                            <Eye className="h-3 w-3" />
                            বিস্তারিত
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Details Dialog */}
      <OrderDetailsDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
      />
    </PageTemplate>
  );
}

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { BookOpen, Loader2, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Book } from '../types';
import { useUpdateBookMutation } from '../queries';

// ─── Schema ──────────────────────────────────────────────────────────────────
const schema = z
  .object({
    bookName: z.string().min(1, 'বইয়ের নাম দিন'),
    authorName: z.string().min(1, 'লেখকের নাম দিন'),
    price: z
      .number({ error: 'মূল্য লিখুন' })
      .positive('মূল্য ধনাত্মক হতে হবে'),
    quantity: z
      .number({ error: 'পরিমাণ লিখুন' })
      .int()
      .nonnegative('পরিমাণ ০ বা তার বেশি হতে হবে'),
    has_discount: z.boolean(),
    disCountPrice: z.string(),
  })
  .refine(
    (v) => {
      if (!v.has_discount) return true;
      const dp = Number(v.disCountPrice);
      return !isNaN(dp) && dp > 0 && dp < v.price;
    },
    {
      message: 'ছাড়ের মূল্য ০ থেকে বেশি এবং মূল মূল্যের কম হতে হবে',
      path: ['disCountPrice'],
    }
  );

type FormValues = z.infer<typeof schema>;

// ─── Props ───────────────────────────────────────────────────────────────────
interface EditBookDialogProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function EditBookDialog({ book, open, onOpenChange }: EditBookDialogProps) {
  const mutation = useUpdateBookMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      bookName: '',
      authorName: '',
      price: 0,
      quantity: 0,
      has_discount: false,
      disCountPrice: '',
    },
  });

  const hasDiscount = watch('has_discount');

  // Pre-fill form whenever the selected book or dialog open state changes
  React.useEffect(() => {
    if (book && open) {
      reset({
        bookName: book.bookName,
        authorName: book.authorName,
        price: Number(book.price),
        quantity: book.quantity,
        has_discount: book.has_discount,
        disCountPrice: book.disCountPrice ?? '',
      });
    }
  }, [book, open, reset]);

  async function onSubmit(values: FormValues) {
    if (!book) return;
    try {
      await mutation.mutateAsync({
        bookId: book.bookId,
        data: {
          bookName: values.bookName,
          authorName: values.authorName,
          price: String(values.price),
          quantity: values.quantity,
          has_discount: values.has_discount,
          disCountPrice: values.has_discount ? values.disCountPrice : '0',
        },
      });
      onOpenChange(false);
    } catch {
      // error surfaced via mutation.error below
    }
  }

  function handleClose() {
    if (mutation.isPending) return;
    reset();
    mutation.reset();
    onOpenChange(false);
  }

  const serverError =
    mutation.error instanceof Error
      ? mutation.error.message
      : mutation.isError
      ? 'বই আপডেট করতে ব্যর্থ হয়েছে'
      : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-full" showCloseButton={!mutation.isPending}>
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Pencil className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle>বই সম্পাদনা করুন</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {book?.bookName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-1">
          {/* Book name */}
          <div className="space-y-1">
            <Label htmlFor="edit-bookName" className="text-xs font-semibold">
              বইয়ের নাম *
            </Label>
            <Input
              id="edit-bookName"
              placeholder="যেমন: ম্যাথমেটিক্স-১"
              {...register('bookName')}
              aria-invalid={!!errors.bookName}
            />
            {errors.bookName && (
              <p className="text-[11px] text-destructive">{errors.bookName.message}</p>
            )}
          </div>

          {/* Author */}
          <div className="space-y-1">
            <Label htmlFor="edit-authorName" className="text-xs font-semibold">
              লেখকের নাম *
            </Label>
            <Input
              id="edit-authorName"
              placeholder="লেখকের নাম লিখুন"
              {...register('authorName')}
              aria-invalid={!!errors.authorName}
            />
            {errors.authorName && (
              <p className="text-[11px] text-destructive">{errors.authorName.message}</p>
            )}
          </div>

          {/* Price + Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="edit-price" className="text-xs font-semibold">
                মূল্য (৳) *
              </Label>
              <Input
                id="edit-price"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                {...register('price', { valueAsNumber: true })}
                aria-invalid={!!errors.price}
              />
              {errors.price && (
                <p className="text-[11px] text-destructive">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-quantity" className="text-xs font-semibold">
                পরিমাণ *
              </Label>
              <Input
                id="edit-quantity"
                type="number"
                min={0}
                placeholder="0"
                {...register('quantity', { valueAsNumber: true })}
                aria-invalid={!!errors.quantity}
              />
              {errors.quantity && (
                <p className="text-[11px] text-destructive">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          {/* Discount toggle */}
          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
            <Controller
              name="has_discount"
              control={control}
              render={({ field }) => (
                <input
                  id="edit-has_discount"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-brand-saffron cursor-pointer"
                />
              )}
            />
            <Label htmlFor="edit-has_discount" className="text-xs cursor-pointer select-none">
              ছাড় সক্রিয় করুন
            </Label>
          </div>

          {hasDiscount && (
            <div className="space-y-1">
              <Label htmlFor="edit-disCountPrice" className="text-xs font-semibold">
                ছাড়ের মূল্য (৳) *
              </Label>
              <Input
                id="edit-disCountPrice"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                {...register('disCountPrice')}
                aria-invalid={!!errors.disCountPrice}
              />
              {errors.disCountPrice && (
                <p className="text-[11px] text-destructive">{errors.disCountPrice.message}</p>
              )}
            </div>
          )}

          {/* Server error */}
          {serverError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              {serverError}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={mutation.isPending}
              className="text-xs"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              variant="saffron"
              size="sm"
              disabled={mutation.isPending}
              className="gap-1.5 text-xs"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <BookOpen className="h-3.5 w-3.5" />
                  সংরক্ষণ করুন
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

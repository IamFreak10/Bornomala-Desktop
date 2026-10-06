import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import {
  Upload,
  X,
  BookPlus,
  ImageIcon,
  Loader2,
  ChevronDown,
} from 'lucide-react';
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
import type { Department } from '../types';
import { useCreateBookMutation } from '../queries';

// ---------- schema ----------
const schema = z.object({
  deptId: z.number({ error: 'বিভাগ বেছে নিন' }),
  semId: z.number({ error: 'সেমিস্টার বেছে নিন' }),
  courseCode: z.string().min(1, 'কোর্স বেছে নিন'),
  bookName: z.string().min(1, 'বইয়ের নাম দিন'),
  authorName: z.string().min(1, 'লেখকের নাম দিন'),
  price: z.number({ error: 'মূল্য লিখুন' }).positive('মূল্য ধনাত্মক হতে হবে'),
  quantity: z.number({ error: 'পরিমাণ লিখুন' }).int().nonnegative(),
});

type FormValues = z.infer<typeof schema>;

interface AddBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: Department[];
  onSuccess?: () => void;
}

// --------- helper select ---------
function Select({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  children,
}: {
  id: string;
  value: string | number | '';
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-8 w-full appearance-none rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground transition-colors outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

// ---------- component ----------
export function AddBookDialog({
  open,
  onOpenChange,
  departments,
  onSuccess,
}: AddBookDialogProps) {
  const mutation = useCreateBookMutation();
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);
  const [coverError, setCoverError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: 0,
    },
  });

  const watchedDeptId = watch('deptId');
  const watchedSemId = watch('semId');

  const selectedDept = departments.find((d) => d.departmentId === Number(watchedDeptId));
  const semesters = selectedDept?.semesters ?? [];
  const selectedSem = semesters.find((s) => s.semesterId === Number(watchedSemId));
  const courses = selectedSem?.courses ?? [];

  // Reset dependent fields when dept changes
  React.useEffect(() => {
    setValue('semId', undefined as unknown as number);
    setValue('courseCode', '');
  }, [watchedDeptId, setValue]);

  // Reset course when sem changes
  React.useEffect(() => {
    setValue('courseCode', '');
  }, [watchedSemId, setValue]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function removeCover() {
    setCoverFile(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function onSubmit(values: FormValues) {
    if (!coverFile) {
      setCoverError('কভার ছবি আপলোড করুন');
      return;
    }
    setCoverError(null);

    try {
      await mutation.mutateAsync({
        dept: selectedDept?.departmentName ?? '',
        sem: selectedSem?.semesterNumber ?? 1,
        courseCode: values.courseCode,
        bookName: values.bookName,
        authorName: values.authorName,
        price: values.price,
        quantity: values.quantity,
        coverFile,
      });
      reset();
      removeCover();
      mutation.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // error surfaced via mutation.error below
    }
  }

  function handleClose() {
    if (mutation.isPending) return;
    reset();
    removeCover();
    setCoverError(null);
    mutation.reset();
    onOpenChange(false);
  }

  const serverError =
    mutation.error instanceof Error
      ? mutation.error.message
      : mutation.isError
      ? 'বই যোগ করতে ব্যর্থ হয়েছে'
      : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-2xl w-full"
        showCloseButton={!mutation.isPending}
      >
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-saffron/10 text-brand-saffron">
              <BookPlus className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle>নতুন বই যোগ করুন</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                বিভাগ ও কোর্স বেছে কভার ছবিসহ বই যোগ করুন
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-1">
          {/* Two-column grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* LEFT — Image upload */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold">কভার ছবি *</Label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => !coverPreview && fileInputRef.current?.click()}
                className={`relative flex h-48 w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
                  coverPreview
                    ? 'border-border'
                    : 'cursor-pointer border-border/60 hover:border-primary/50 hover:bg-muted/30'
                }`}
              >
                {coverPreview ? (
                  <>
                    <img
                      src={coverPreview}
                      alt="প্রিভিউ"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCover();
                      }}
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
                      <p className="truncate text-[10px] text-white/80">{coverFile?.name}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center p-4">
                    <div className="rounded-xl border border-border/60 bg-muted/50 p-3">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">ছবি টেনে আনুন বা ক্লিক করুন</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, WEBP</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="gap-1"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-3 w-3" />
                      ব্রাউজ করুন
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {!coverFile && coverError && (
                <p className="text-[11px] text-destructive">{coverError}</p>
              )}
            </div>

            {/* RIGHT — Fields */}
            <div className="flex flex-col gap-3">
              {/* Department */}
              <div className="space-y-1">
                <Label htmlFor="deptId" className="text-xs font-semibold">
                  বিভাগ *
                </Label>
                <Controller
                  name="deptId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="deptId"
                      value={field.value ?? ''}
                      onChange={(v) => field.onChange(Number(v))}
                      placeholder="বিভাগ বেছে নিন"
                    >
                      {departments.map((d) => (
                        <option key={d.departmentId} value={d.departmentId}>
                          {d.departmentName}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                {errors.deptId && (
                  <p className="text-[11px] text-destructive">{errors.deptId.message}</p>
                )}
              </div>

              {/* Semester */}
              <div className="space-y-1">
                <Label htmlFor="semId" className="text-xs font-semibold">
                  সেমিস্টার *
                </Label>
                <Controller
                  name="semId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="semId"
                      value={field.value ?? ''}
                      onChange={(v) => field.onChange(Number(v))}
                      placeholder="সেমিস্টার বেছে নিন"
                      disabled={!watchedDeptId || semesters.length === 0}
                    >
                      {semesters.map((s) => (
                        <option key={s.semesterId} value={s.semesterId}>
                          সেমিস্টার {s.semesterNumber}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                {errors.semId && (
                  <p className="text-[11px] text-destructive">{errors.semId.message}</p>
                )}
              </div>

              {/* Course */}
              <div className="space-y-1">
                <Label htmlFor="courseCode" className="text-xs font-semibold">
                  কোর্স *
                </Label>
                <Controller
                  name="courseCode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="courseCode"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      placeholder="কোর্স বেছে নিন"
                      disabled={!watchedSemId || courses.length === 0}
                    >
                      {courses.map((c) => (
                        <option key={c.courseCode} value={c.courseCode}>
                          {c.courseName}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                {errors.courseCode && (
                  <p className="text-[11px] text-destructive">{errors.courseCode.message}</p>
                )}
              </div>

              {/* Price + Quantity side by side */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="price" className="text-xs font-semibold">
                    মূল্য (৳) *
                  </Label>
                  <Input
                    id="price"
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
                  <Label htmlFor="quantity" className="text-xs font-semibold">
                    পরিমাণ *
                  </Label>
                  <Input
                    id="quantity"
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
            </div>
          </div>

          {/* Book name + Author — full width row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="bookName" className="text-xs font-semibold">
                বইয়ের নাম *
              </Label>
              <Input
                id="bookName"
                placeholder="যেমন: ম্যাথমেটিক্স-১"
                {...register('bookName')}
                aria-invalid={!!errors.bookName}
              />
              {errors.bookName && (
                <p className="text-[11px] text-destructive">{errors.bookName.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="authorName" className="text-xs font-semibold">
                লেখকের নাম *
              </Label>
              <Input
                id="authorName"
                placeholder="লেখকের নাম লিখুন"
                {...register('authorName')}
                aria-invalid={!!errors.authorName}
              />
              {errors.authorName && (
                <p className="text-[11px] text-destructive">{errors.authorName.message}</p>
              )}
            </div>
          </div>

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
                  আপলোড হচ্ছে...
                </>
              ) : (
                <>
                  <BookPlus className="h-3.5 w-3.5" />
                  বই যোগ করুন
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

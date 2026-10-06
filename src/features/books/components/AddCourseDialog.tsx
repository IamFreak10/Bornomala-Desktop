import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, Loader2, ChevronDown } from 'lucide-react';
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
import { useCreateCourseMutation } from '../queries';
const schema = z.object({
  deptId: z.number({
    error: 'বিভাগ বেছে নিন',
  }),
  semId: z.number({
    error: 'সেমিস্টার বেছে নিন',
  }),
  courseCode: z.string().min(1, 'কোর্স কোড দিন').max(250, 'কোর্স কোড খুব বড়'),
  courseName: z.string().min(1, 'সাবজেক্ট/কোর্সের নাম দিন'),
});

type FormValues = z.infer<typeof schema>;

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: Department[];
  /** Pre-select current dept/sem from the books page */
  defaultDeptId?: number | null;
  defaultSemId?: number | null;
}

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

export function AddCourseDialog({
  open,
  onOpenChange,
  departments,
  defaultDeptId,
  defaultSemId,
}: AddCourseDialogProps) {
  const mutation = useCreateCourseMutation();

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
      deptId: defaultDeptId ?? undefined,
      semId: defaultSemId ?? undefined,
      courseCode: '',
      courseName: '',
    },
  });

  const watchedDeptId = watch('deptId');
  const selectedDept = departments.find(
    (d) => d.departmentId === Number(watchedDeptId)
  );
  const semesters = selectedDept?.semesters ?? [];

  React.useEffect(() => {
    if (!open) return;
    reset({
      deptId: defaultDeptId ?? undefined,
      semId: defaultSemId ?? undefined,
      courseCode: '',
      courseName: '',
    });
    mutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-seed when dialog opens
  }, [open, defaultDeptId, defaultSemId]);

  React.useEffect(() => {
    if (!open) return;
    // Keep sem if it still belongs to the selected dept
    const stillValid = semesters.some(
      (s) => s.semesterId === Number(watch('semId'))
    );
    if (!stillValid) {
      setValue('semId', undefined as unknown as number);
    }
  }, [watchedDeptId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(values: FormValues) {
    try {
      await mutation.mutateAsync({
        semesterId: values.semId,
        courseCode: values.courseCode.trim(),
        courseName: values.courseName.trim(),
      });
      onOpenChange(false);
    } catch {
      // surfaced via mutation.error
    }
  }

  function handleClose() {
    if (mutation.isPending) return;
    onOpenChange(false);
  }

  const serverError =
    mutation.error instanceof Error
      ? mutation.error.message
      : mutation.isError
        ? 'সাবজেক্ট যোগ করতে ব্যর্থ হয়েছে (অ্যাডমিন লগইন প্রয়োজন হতে পারে)'
        : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md w-full"
        showCloseButton={!mutation.isPending}
      >
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle>নতুন সাবজেক্ট যোগ করুন</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                সেমিস্টারে কোর্স/সাবজেক্ট যোগ করুন — তারপর সেখানে বই আপলোড করা
                যাবে
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-1">
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
              <p className="text-[11px] text-destructive">
                {errors.deptId.message}
              </p>
            )}
          </div>

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
              <p className="text-[11px] text-destructive">
                {errors.semId.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="courseCode" className="text-xs font-semibold">
              কোর্স কোড *
            </Label>
            <Input
              id="courseCode"
              placeholder="যেমন: 28511-cse"
              className="font-mono text-sm"
              {...register('courseCode')}
              aria-invalid={!!errors.courseCode}
            />
            {errors.courseCode && (
              <p className="text-[11px] text-destructive">
                {errors.courseCode.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="courseName" className="text-xs font-semibold">
              সাবজেক্টের নাম *
            </Label>
            <Input
              id="courseName"
              placeholder="যেমন: ম্যাথমেটিক্স-১"
              {...register('courseName')}
              aria-invalid={!!errors.courseName}
            />
            {errors.courseName && (
              <p className="text-[11px] text-destructive">
                {errors.courseName.message}
              </p>
            )}
          </div>

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
                  <GraduationCap className="h-3.5 w-3.5" />
                  সাবজেক্ট যোগ করুন
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

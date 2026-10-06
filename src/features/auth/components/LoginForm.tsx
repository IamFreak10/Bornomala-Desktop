import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { loginWithEmail } from '../api';
import { useAuthStore } from '../store';
import { Sparkles, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { ModeToggle } from '@/components/Theme/mode-toggle';

const loginSchema = z.object({
  email: z.string().email('সঠিক ইমেইল ঠিকানা প্রদান করুন'),
  password: z.string().min(6, 'কমপক্ষে ৬ ক্যারেক্টার হতে হবে'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await loginWithEmail(values.email, values.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'লগইন ব্যর্থ হয়েছে, পুনরায় চেষ্টা করুন');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    setUser({
      id: 'demo-cashier-01',
      name: 'তানভীর আহমেদ',
      email: 'cashier@bornomala.io',
      role: 'admin',
    });
    navigate('/dashboard');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-12 selection:bg-brand-saffron/25 selection:text-brand-saffron">
      {/* Top corner mode toggle */}
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>

      {/* Decorative Brand Glows */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-saffron/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-navy/15 dark:bg-brand-blue/10 blur-3xl pointer-events-none" />

      <Card className="relative w-full max-w-md border-border bg-card/95 text-card-foreground shadow-2xl backdrop-blur-md rounded-2xl overflow-hidden">
        {/* Brand Header */}
        <CardHeader className="text-center pb-2 pt-6">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-saffron via-brand-saffron to-brand-navy text-2xl font-bold text-white shadow-lg shadow-brand-saffron/25">
            ব
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            বর্ণমালা <span className="from-brand-saffron to-brand-blue bg-clip-text text-transparent">পিওএস</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Bornomala POS Desktop • ক্যাশিয়ার ও কাউন্টার লগইন
          </p>
        </CardHeader>

        <CardContent className="p-6 pt-2 space-y-4">
          {/* Quick Demo Mode Access Button */}
          <div className="rounded-xl border border-brand-saffron/30 bg-brand-saffron/10 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-saffron">
              <Sparkles className="h-3.5 w-3.5" />
              <span>ড্যাশবোর্ড ও UI প্রিভিউ মোড</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              ব্যাকএন্ড সার্ভার ছাড়াই সরাসরি ডিজাইন ও ড্যাশবোর্ড এক্সপ্লোর করুন
            </p>
            <Button
              type="button"
              onClick={handleDemoLogin}
              variant="saffron"
              size="sm"
              className="mt-2.5 w-full gap-1.5 text-xs font-bold text-white shadow-xs"
            >
              <span>ডেমো মোডে ড্যাশবোর্ডে প্রবেশ করুন</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="absolute bg-card px-2 text-[10px] uppercase font-semibold text-muted-foreground">
              অথবা অফিসিয়াল লগইন
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-foreground">
                ইমেইল ঠিকানা (Email)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="cashier@bornomala.io"
                className="text-xs"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-foreground">
                পাসওয়ার্ড (Password)
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="text-xs"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="rounded-lg bg-destructive/10 p-2 text-center text-xs font-medium text-destructive">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full text-xs font-semibold gap-1.5"
              disabled={isSubmitting}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন'}</span>
            </Button>
          </form>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>নিরাপদ অফলাইন ক্যাশ কাউন্টার এনক্রিপশন</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';

export function DashboardPage() {
  const { user } = useAuthStore();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'শুভ সকাল';
    if (hour < 17) return 'শুভ দুপুর';
    if (hour < 20) return 'শুভ অপরাহ্ন';
    return 'শুভ রাত্রি';
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {greeting()}, {user?.name || 'অ্যাডমিন'}
            </h1>
            <span className="rounded-full border border-brand-saffron/30 bg-brand-saffron/10 px-2.5 py-0.5 text-xs font-semibold text-brand-saffron">
              ড্যাশবোর্ড ওভারভিউ
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 sm:text-sm">
            বর্ণমালা ডেস্কটপ স্যুট - আপনার নিজস্ব কম্পোনেন্ট ও লেআউট দিয়ে ড্যাশবোর্ড সাজান
          </p>
        </div>

        {/* Action Button Placeholder */}
        <div className="flex items-center gap-2">
          <Button
            variant="saffron"
            size="sm"
            className="gap-1.5 rounded-lg px-3 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>অ্যাকশন যোগ করুন</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards Template Slot (Row of 4) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Card
            key={item}
            className="border-dashed border-2 border-border/70 bg-card/50 transition-colors hover:border-primary/50"
          >
            <CardContent className="flex flex-col justify-between p-4 min-h-[100px]">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>কার্ড ০{item} প্লেসহোল্ডার</span>
                <LayoutDashboard className="h-3.5 w-3.5 opacity-50" />
              </div>
              <div className="my-2">
                <div className="h-6 w-24 rounded bg-muted/60" />
              </div>
              <div className="h-2 w-16 rounded bg-muted/40" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Canvas Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-dashed border-2 border-border/70 bg-card/40">
            <CardContent className="flex min-h-[320px] flex-col items-center justify-center p-6 text-center">
              <div className="rounded-xl border border-border/50 bg-muted/30 p-3 mb-3">
                <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                প্রধান কন্টেন্ট বা চার্ট এরিয়া
              </h3>
              <p className="max-w-sm text-xs text-muted-foreground mt-1">
                এখানে আপনার প্রয়োজনীয় গ্রাফ, টেবিল বা প্রধান ফিচার কম্পোনেন্ট বসান।
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-dashed border-2 border-border/70 bg-card/40">
            <CardContent className="flex min-h-[320px] flex-col items-center justify-center p-6 text-center">
              <div className="rounded-xl border border-border/50 bg-muted/30 p-3 mb-3">
                <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                সাইড উইজেট এরিয়া
              </h3>
              <p className="max-w-xs text-xs text-muted-foreground mt-1">
                এখানে কুইক অ্যাকশন বা সাইডবার উইজেট বসান।
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

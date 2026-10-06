import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PageTemplateProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageTemplate({
  title,
  subtitle,
  badge,
  actions,
  children,
}: PageTemplateProps) {
  return (
    <div className="space-y-6 pb-8 animate-in fade-in-50 duration-200">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {title}
            </h1>
            {badge && (
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5 sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Main Content Area */}
      {children ? (
        children
      ) : (
        <Card className="border-dashed border-2 border-border/80 bg-card/40 backdrop-blur-xs">
          <CardContent className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 mb-4">
              <span className="text-2xl font-mono text-muted-foreground">❖</span>
            </div>
            <h3 className="text-base font-semibold text-foreground">
              আপনার কম্পোনেন্ট এখানে ডিজাইন করুন
            </h3>
            <p className="max-w-md text-xs text-muted-foreground mt-1.5">
              এই পেজের ডিজাইন ও উপাদানগুলো আপনি নিজের মতো করে তৈরি করতে পারেন। আপনার কম্পোনেন্ট এই কন্টেইনারে ইমপোর্ট করে যুক্ত করুন।
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

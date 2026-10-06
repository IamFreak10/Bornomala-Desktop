import { PageTemplate } from '@/components/shared/PageTemplate';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function POSPage() {
  return (
    <PageTemplate
      title="পিওএস টার্মিনাল"
      subtitle="দ্রুত বিক্রয় এবং বিলিং কাউন্টার ইন্টারফেস"
      badge="POS Template"
      actions={
        <Button variant="saffron" size="sm" className="gap-1.5 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" />
          <span>নতুন বিক্রয়</span>
        </Button>
      }
    />
  );
}

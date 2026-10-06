import { PageTemplate } from '@/components/shared/PageTemplate';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function InventoryPage() {
  return (
    <PageTemplate
      title="ইনভেন্টরি ও স্টক"
      subtitle="পণ্যের তালিকা ও স্টক ম্যানেজমেন্ট"
      badge="Inventory Template"
      actions={
        <Button variant="saffron" size="sm" className="gap-1.5 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" />
          <span>নতুন পণ্য যোগ করুন</span>
        </Button>
      }
    />
  );
}

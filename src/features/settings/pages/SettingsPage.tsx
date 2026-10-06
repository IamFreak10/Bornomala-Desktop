import { PageTemplate } from '@/components/shared/PageTemplate';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export function SettingsPage() {
  return (
    <PageTemplate
      title="সিস্টেম ও কনফিগারেশন"
      subtitle="অ্যাপ্লিকেশন প্রিফারেন্স ও সেটিংস"
      badge="Settings Template"
      actions={
        <Button variant="default" size="sm" className="gap-1.5 text-xs font-semibold">
          <Save className="h-3.5 w-3.5" />
          <span>সংরক্ষণ করুন</span>
        </Button>
      }
    />
  );
}

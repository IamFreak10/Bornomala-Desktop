import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Receipt,
  LayoutDashboard,
  Boxes,
  Settings,
  ArrowRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelectAction = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  const navItems = [
    {
      title: 'ড্যাশবোর্ড',
      desc: 'ড্যাশবোর্ড ওভারভিউ ও কন্টেইনার',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'পিওএস টার্মিনাল',
      desc: 'সেলস ও বিলিং ইন্টারফেস টেমপ্লেট',
      path: '/pos',
      icon: ShoppingCart,
    },
    {
      title: 'অর্ডার ও ইনভয়েস',
      desc: 'অর্ডার তালিকা টেমপ্লেট',
      path: '/orders',
      icon: Receipt,
    },
    {
      title: 'ইনভেন্টরি',
      desc: 'স্টক ও পণ্য তালিকা টেমপ্লেট',
      path: '/inventory',
      icon: Boxes,
    },
    {
      title: 'সেটিংস',
      desc: 'অ্যাপ্লিকেশন কনফিগারেশন টেমপ্লেট',
      path: '/settings',
      icon: Settings,
    },
  ];

  const filteredItems = navItems.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden p-0 bg-popover text-popover-foreground border-border shadow-2xl rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>কমান্ড প্যালেট</DialogTitle>
          <DialogDescription>মেনু ও রুট নেভিগেশনের জন্য অনুসন্ধান করুন</DialogDescription>
        </DialogHeader>

        {/* Search Input Header */}
        <div className="flex items-center border-b border-border px-4 py-3 bg-muted/20">
          <Search className="h-5 w-5 text-primary shrink-0 mr-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="রুট বা পেজ অনুসন্ধান করুন..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-medium"
            autoFocus
          />
          <kbd className="hidden rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
            ESC
          </kbd>
        </div>

        {/* Options List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleSelectAction(item.path)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground text-left"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold text-sm">{item.title}</span>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
          {filteredItems.length === 0 && (
            <div className="py-8 text-center text-xs text-muted-foreground">
              কোনো ফলাফল পাওয়া যায়নি
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
          <span>দ্রুত রুট জাম্প</span>
          <span className="font-mono text-[10px]">Bornomala Suite</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

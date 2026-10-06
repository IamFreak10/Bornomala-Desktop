import * as React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export function AppStatusBar() {
  const [timeStr, setTimeStr] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('bn-BD', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="sticky bottom-0 z-20 flex h-7 w-full shrink-0 select-none items-center justify-between border-t border-border bg-card/90 px-3 text-[11px] text-muted-foreground backdrop-blur-md">
      {/* Left: System Status */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          <span className="font-medium text-[10px]">সিস্টেম রেডি</span>
        </div>
      </div>

      {/* Right: Live Bengali Clock & Desktop App Version */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 font-mono text-foreground">
          <Clock className="h-3 w-3 text-brand-saffron" />
          <span>{timeStr || '১২:০০:০০'}</span>
        </div>
        <span className="text-border">|</span>
        <span className="font-mono text-[10px] text-muted-foreground">Bornomala v0.1.0</span>
      </div>
    </footer>
  );
}

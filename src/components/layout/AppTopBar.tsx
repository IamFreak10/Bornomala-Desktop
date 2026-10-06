import {
  Search,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { ModeToggle } from '@/components/Theme/mode-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/features/auth/store';
import { useNavigate } from 'react-router-dom';

interface AppTopBarProps {
  onOpenCommandMenu?: () => void;
}

export function AppTopBar({ onOpenCommandMenu }: AppTopBarProps) {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between border-b border-border bg-card/85 px-3 backdrop-blur-md transition-colors sm:px-4">
      {/* Left section: Sidebar trigger & Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-foreground" />
      </div>

      {/* Center section: Global Search / Command Palette Launcher */}
      <div className="flex flex-1 items-center justify-center px-2 sm:px-6">
        <button
          onClick={onOpenCommandMenu}
          className="group relative flex h-9 w-full max-w-sm items-center justify-between rounded-xl border border-border bg-background/60 px-3 text-xs text-muted-foreground shadow-xs transition-all hover:border-primary/50 hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="truncate">অনুসন্ধান বা কমান্ড...</span>
          </div>
          <kbd className="pointer-events-none hidden h-5 shrink-0 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right section: Theme Mode Toggle & User Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <ModeToggle />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex items-center gap-2 rounded-lg p-1 transition-all hover:bg-accent focus:outline-none">
                <Avatar className="h-7 w-7 border border-border bg-primary/10 text-primary">
                  <AvatarFallback className="text-xs font-bold">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : 'BM'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-left text-xs font-medium md:block">
                  <span className="block leading-tight text-foreground font-semibold">
                    {user?.name || 'অ্যাডমিন'}
                  </span>
                </span>
                <ChevronDown className="hidden h-3 w-3 text-muted-foreground md:block" />
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-52 bg-popover text-popover-foreground border-border shadow-xl">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-semibold leading-none text-foreground">
                  {user?.name || 'অ্যাডমিন'}
                </p>
                <p className="text-[11px] leading-none text-muted-foreground">
                  {user?.email || 'admin@bornomala.io'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-3.5 w-3.5" />
              <span>লগ আউট</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

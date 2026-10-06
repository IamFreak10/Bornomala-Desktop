import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppTopBar } from './AppTopBar';
import { AppStatusBar } from './AppStatusBar';
import { CommandMenu } from '@/components/shared/CommandMenu';

export function DashboardLayout() {
  const [commandMenuOpen, setCommandMenuOpen] = React.useState(false);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background text-foreground antialiased selection:bg-brand-saffron/20 selection:text-brand-saffron">
        {/* Modern Desktop Collapsible Sidebar */}
        <AppSidebar />

        {/* Inset Main Container */}
        <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-background">
          {/* Top Bar Header */}
          <AppTopBar onOpenCommandMenu={() => setCommandMenuOpen(true)} />

          {/* Main Scrollable Canvas */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>

          {/* Bottom Desktop Status & Diagnostic Bar */}
          <AppStatusBar />
        </SidebarInset>

        {/* Global Keyboard Command & Search Palette */}
        <CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
      </div>
    </SidebarProvider>
  );
}

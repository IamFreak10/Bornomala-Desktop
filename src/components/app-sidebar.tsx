"use client";

import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Boxes,
  BookOpen,
  Tag,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  const navItems = [
    {
      title: "ড্যাশবোর্ড",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "পিওএস টার্মিনাল",
      url: "/pos",
      icon: ShoppingCart,
    },
    {
      title: "অর্ডার ও ইনভয়েস",
      url: "/orders",
      icon: Receipt,
    },
    {
      title: "প্রোমো কোড",
      url: "/promos",
      icon: Tag,
    },
    {
      title: "ইনভেন্টরি",
      url: "/inventory",
      icon: Boxes,
    },
    {
      title: "বই ব্যবস্থাপনা",
      url: "/books",
      icon: BookOpen,
    },
    {
      title: "সেটিংস",
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar text-sidebar-foreground select-none" {...props}>
      {/* Brand Header */}
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <Link to="/dashboard" className="flex items-center gap-2.5 px-1 py-1">
          {/* Bengali Brand Glyph */}
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-saffron via-brand-saffron to-brand-navy text-white shadow-md shadow-brand-saffron/20 font-bold text-lg">
            <span>ব</span>
            <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-sidebar bg-emerald-500" />
          </div>

          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-sidebar-foreground">বর্ণমালা</span>
              <span className="rounded bg-brand-saffron/15 px-1 py-0.2 text-[9px] font-bold text-brand-saffron">DESKTOP</span>
            </div>
            <span className="truncate text-[11px] text-muted-foreground">Bornomala Desktop App</span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden">
            ন্যাভিগেশন রুটস
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1 mt-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <Link
                        to={item.url}
                        className={`flex items-center justify-between gap-3 rounded-xl px-2.5 py-2 transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      />
                    }
                    tooltip={item.title}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      <span className="text-xs leading-none truncate group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Clean Minimal Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-3 text-center text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
        <span className="text-[11px]">Bornomala v0.1.0</span>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  History,
  CreditCard,
  Bell,
  User,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

interface CustomerSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function CustomerSidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}: CustomerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Accounts", href: "/accounts", icon: Wallet },
    { label: "Transfer Money", href: "/transfer", icon: ArrowRightLeft },
    { label: "Transactions", href: "/transactions", icon: History },
    { label: "Payments", href: "/payments", icon: CreditCard },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Security", href: "/security", icon: Shield },
    { label: "Support", href: "/support", icon: LifeBuoy },
  ];

  const handleLogout = () => {
    logout();
    toast.info("You have been signed out safely");
    router.push("/login");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      {/* Brand & Collapse Header */}
      <div>
        <div className="flex items-center justify-between pb-6 pt-2 border-b border-border/60">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-soft">
              <ShieldCheck className="h-6 w-6" />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in">
                <span className="text-lg font-black tracking-tight text-foreground">
                  APEX<span className="text-primary font-normal">BANK</span>
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground -mt-1">
                  Customer Portal
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150",
                  isActive
                    ? "bg-primary text-white shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="pt-4 border-t border-border/60 space-y-3">
        {!isCollapsed && (
          <div className="rounded-xl bg-muted/60 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Signed in as
            </p>
            <p className="truncate text-xs font-bold text-foreground">
              {user?.fullName || "Customer"}
            </p>
            <p className="truncate text-[10px] text-muted-foreground">{user?.email || "customer@apexbank.io"}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-danger hover:bg-danger-50 transition",
            isCollapsed && "justify-center px-2"
          )}
          title="Sign Out"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 z-30",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50 w-72 max-w-[80vw] bg-card shadow-dropdown">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ShieldAlert, Menu, Bell, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { Badge } from "@/components/ui/badge";

interface AdminHeaderProps {
  onMobileMenuClick: () => void;
}

export function AdminHeader({ onMobileMenuClick }: AdminHeaderProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-20 flex h-20 w-full items-center justify-between border-b border-border bg-card/80 px-6 sm:px-8 backdrop-blur-md">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          type="button"
          onClick={onMobileMenuClick}
          className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search accounts, fraud alerts, transactions..."
            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="gap-1.5 hidden sm:inline-flex">
          <ShieldAlert className="h-3 w-3" />
          <span>Real-Time Monitor Online</span>
        </Badge>

        <Link
          href="/admin/fraud-monitoring"
          className="relative rounded-xl p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          title="Fraud Monitoring Queue"
        >
          <Bell className="h-5 w-5 text-warning" />
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-danger animate-ping" />
        </Link>

        <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-background p-1.5 pr-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-white font-bold text-xs shadow-soft">
            A
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-foreground leading-tight">
              {user?.fullName || "Administrator"}
            </p>
            <p className="text-[10px] text-secondary font-bold">
              Operations Lead
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

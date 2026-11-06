"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Bell, Menu, Shield, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { Badge } from "@/components/ui/badge";

interface CustomerHeaderProps {
  onMobileMenuClick: () => void;
}

export function CustomerHeader({ onMobileMenuClick }: CustomerHeaderProps) {
  const user = useAuthStore((state) => state.user);
  const [currentDate, setCurrentDate] = React.useState("");

  React.useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-20 w-full items-center justify-between border-b border-border bg-card/80 px-6 sm:px-8 backdrop-blur-md">
      {/* Left: Mobile trigger & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          type="button"
          onClick={onMobileMenuClick}
          className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </button>

        <div className="relative w-full hidden sm:block">
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search transactions, accounts, references..."
            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>
      </div>

      {/* Right: Date, Notifications, Profile Chip */}
      <div className="flex items-center gap-4">
        {/* Date Stamp */}
        <div className="hidden lg:block text-right">
          <span className="text-[11px] font-semibold text-muted-foreground">
            {currentDate}
          </span>
        </div>

        {/* Notifications Icon with Badge */}
        <Link
          href="/notifications"
          className="relative rounded-xl p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          title="Notification Center"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-danger animate-pulse" />
        </Link>

        {/* Profile Avatar Chip */}
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-2xl border border-border/80 bg-background p-1.5 pr-3 hover:border-primary/50 transition"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white font-bold text-xs shadow-soft">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-foreground leading-tight">
              {user?.fullName || "Customer"}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              Verified Retail
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}

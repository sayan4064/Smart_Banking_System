"use client";

import * as React from "react";
import { CustomerSidebar } from "@/components/layout/customer-sidebar";
import { CustomerHeader } from "@/components/layout/customer-header";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <CustomerSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <CustomerHeader onMobileMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 bg-subtle-glow">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

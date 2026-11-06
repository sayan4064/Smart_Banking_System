"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

export function SessionManager() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, expiresAt, logout, extendSession, getRemainingSessionSeconds } =
    useAuthStore();

  const warnedRef = React.useRef(false);

  React.useEffect(() => {
    if (!isAuthenticated || !expiresAt) {
      warnedRef.current = false;
      return;
    }

    const checkInterval = setInterval(() => {
      const remainingSeconds = getRemainingSessionSeconds();

      // Expired: session exceeded 1 hour
      if (remainingSeconds <= 0) {
        clearInterval(checkInterval);
        logout();
        toast.error("Your 1-hour banking session has expired for your security. Please log in again.");
        if (pathname && !pathname.startsWith("/login")) {
          router.push("/login?expired=true");
        }
        return;
      }

      // Warning when 5 minutes (300 seconds) remain
      if (remainingSeconds <= 300 && !warnedRef.current) {
        warnedRef.current = true;
        const minutes = Math.max(1, Math.ceil(remainingSeconds / 60));
        toast.warning(`Session expiring in ${minutes} minute(s)`, {
          description: "Your 1-hour secure banking session will expire soon.",
          duration: 10000,
          action: {
            label: "Extend 1 Hour",
            onClick: () => {
              extendSession();
              warnedRef.current = false;
              toast.success("Banking session extended by 1 hour");
            },
          },
        });
      }
    }, 10000); // Check every 10 seconds

    // Also check on window focus / tab reactivation
    const handleFocus = () => {
      const remaining = getRemainingSessionSeconds();
      if (remaining <= 0) {
        logout();
        if (pathname && !pathname.startsWith("/login")) {
          router.push("/login?expired=true");
        }
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(checkInterval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuthenticated, expiresAt, pathname, router, logout, extendSession, getRemainingSessionSeconds]);

  return null;
}


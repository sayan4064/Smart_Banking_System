"use client";

import * as React from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  KeyRound,
  Check,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export interface NotificationItem {
  id: string | number;
  type:
    | "MONEY_RECEIVED"
    | "MONEY_SENT"
    | "TXN_COMPLETED"
    | "TXN_FAILED"
    | "OTP_REQUIRED"
    | "FRAUD_ALERT"
    | "REFUND_PROCESSED";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "FRAUD_ALERT",
    title: "Suspicious Velocity Challenge",
    message: "High balance ratio transfer initiated on ACC-84910248. OTP challenge required before settlement.",
    timestamp: "2026-11-06T11:40:00Z",
    read: false,
  },
  {
    id: 2,
    type: "MONEY_SENT",
    title: "Transfer Dispatched",
    message: "₹15,000.00 debited from ACC-84910248 to ACC-19284019. Saga status: COMPLETED.",
    timestamp: "2026-11-06T10:15:02Z",
    read: false,
  },
  {
    id: 3,
    type: "REFUND_PROCESSED",
    title: "Saga Compensation Refund",
    message: "Transfer of ₹2,400.00 to ACC-77192038 failed due to receiver account freeze. Amount has been credited back.",
    timestamp: "2026-11-05T16:20:04Z",
    read: true,
  },
  {
    id: 4,
    type: "MONEY_RECEIVED",
    title: "Razorpay Account Deposit",
    message: "₹50,000.00 deposit verified and credited to ACC-84910248.",
    timestamp: "2026-11-05T09:00:01Z",
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = React.useState<"ALL" | "UNREAD" | "ALERTS">("ALL");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string | number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const filtered = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.read;
    if (filter === "ALERTS") return n.type === "FRAUD_ALERT" || n.type === "OTP_REQUIRED" || n.type === "REFUND_PROCESSED";
    return true;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "FRAUD_ALERT":
        return <ShieldAlert className="h-5 w-5 text-danger" />;
      case "OTP_REQUIRED":
        return <KeyRound className="h-5 w-5 text-warning" />;
      case "MONEY_RECEIVED":
        return <ArrowDownLeft className="h-5 w-5 text-success" />;
      case "MONEY_SENT":
        return <ArrowUpRight className="h-5 w-5 text-primary" />;
      case "REFUND_PROCESSED":
        return <RotateCcw className="h-5 w-5 text-secondary" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time transaction alerts, fraud notifications, and security dispatches
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            leftIcon={<Check className="h-4 w-4" />}
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Tabs / Filter Controls */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
            filter === "ALL"
              ? "bg-primary text-white shadow-soft"
              : "border border-border bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("UNREAD")}
          className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
            filter === "UNREAD"
              ? "bg-primary text-white shadow-soft"
              : "border border-border bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter("ALERTS")}
          className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
            filter === "ALERTS"
              ? "bg-primary text-white shadow-soft"
              : "border border-border bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          Security &amp; Fraud Alerts
        </button>
      </div>

      {/* Notification Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground text-sm">
              No notifications in this filter category.
            </CardContent>
          </Card>
        ) : (
          filtered.map((item) => (
            <Card
              key={item.id}
              className={`transition hover:border-slate-300 ${
                !item.read ? "border-primary/40 bg-card shadow-soft" : "opacity-80"
              }`}
              onClick={() => markAsRead(item.id)}
            >
              <CardContent className="p-5 flex items-start gap-4 cursor-pointer">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background border border-border">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.message}</p>
                </div>

                {!item.read && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1" />
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

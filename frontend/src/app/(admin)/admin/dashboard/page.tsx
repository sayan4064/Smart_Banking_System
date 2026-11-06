"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Wallet,
  ArrowRightLeft,
  ShieldAlert,
  AlertTriangle,
  XCircle,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RiskBadge } from "@/components/fraud/risk-badge";
import { TxnStatusBadge } from "@/components/transactions/txn-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { AdminDashboardMetrics, FraudAlert } from "@/types/admin.types";

const adminChartData = [
  { day: "Mon", volume: 1200000, fraudFlags: 4 },
  { day: "Tue", volume: 1850000, fraudFlags: 2 },
  { day: "Wed", volume: 2400000, fraudFlags: 7 },
  { day: "Thu", volume: 2100000, fraudFlags: 5 },
  { day: "Fri", volume: 3200000, fraudFlags: 9 },
  { day: "Sat", volume: 2900000, fraudFlags: 3 },
  { day: "Sun", volume: 1750000, fraudFlags: 1 },
];

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = React.useState<AdminDashboardMetrics | null>(null);
  const [alerts, setAlerts] = React.useState<FraudAlert[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    async function load() {
      const [m, a] = await Promise.all([
        adminService.getMetrics(),
        adminService.getFraudAlerts(),
      ]);
      setMetrics(m);
      setAlerts(a);
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Operations &amp; Risk Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time monitoring of distributed Saga transfers and Redis fraud rule counters
          </p>
        </div>

        <Link href="/admin/fraud-monitoring">
          <Button variant="secondary" size="sm" leftIcon={<ShieldAlert className="h-4 w-4" />}>
            Open Threat Monitor
          </Button>
        </Link>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <MetricCard
          title="Total Customers"
          value={metrics ? metrics.totalCustomers.toLocaleString("en-IN") : "1,248"}
          change="+32 this week"
          isPositive={true}
          icon={<Users className="h-5 w-5" />}
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
        />
        <MetricCard
          title="Active Accounts"
          value={metrics ? metrics.activeAccounts.toLocaleString("en-IN") : "1,892"}
          change="+18 this week"
          isPositive={true}
          icon={<Wallet className="h-5 w-5" />}
          iconBgColor="bg-success-50"
          iconColor="text-success"
        />
        <MetricCard
          title="Total Transaction Volume"
          value={formatCurrency(metrics?.totalVolume || 84920000)}
          change="+24.5%"
          isPositive={true}
          icon={<TrendingUp className="h-5 w-5" />}
          iconBgColor="bg-secondary/10"
          iconColor="text-secondary"
        />
        <MetricCard
          title="Total System Transfers"
          value={metrics ? metrics.totalTransactions.toLocaleString("en-IN") : "15,420"}
          change="+450 today"
          isPositive={true}
          icon={<ArrowRightLeft className="h-5 w-5" />}
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
        />
        <MetricCard
          title="Suspicious / Held Txns"
          value={metrics ? String(metrics.suspiciousTransactions) : "42"}
          change="3 unresolved"
          isPositive={false}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconBgColor="bg-warning-50"
          iconColor="text-warning"
        />
        <MetricCard
          title="Failed / Compensated"
          value={metrics ? String(metrics.failedTransactions) : "18"}
          change="Saga 100% recovered"
          isPositive={true}
          icon={<XCircle className="h-5 w-5" />}
          iconBgColor="bg-danger-50"
          iconColor="text-danger"
        />
      </div>

      {/* Daily Volume Bar Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Daily Settlement Volume (Past 7 Days)</CardTitle>
            <CardDescription>Aggregate financial volume cleared through API Gateway</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E9F2" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8992A7", fontSize: 12, fontWeight: 500 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8992A7", fontSize: 12, fontWeight: 500 }}
                    tickFormatter={(val) => `₹${val / 100000}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "1rem",
                      border: "1px solid #E5E9F2",
                      boxShadow: "0 10px 25px -5px rgba(23, 32, 51, 0.1)",
                      fontSize: "12px",
                    }}
                    formatter={(val: any) => [formatCurrency(Number(val)), "Cleared Volume"]}
                  />
                  <Bar dataKey="volume" fill="#6C63FF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-2xl bg-muted/60" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Suspicious Transactions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Recent Fraud Alerts &amp; Anomaly Triggers</CardTitle>
            <CardDescription>Live evaluation results from the 5-rule engine</CardDescription>
          </div>
          <Link href="/admin/fraud-monitoring">
            <Button variant="ghost" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
              Full Monitor
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">Txn Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Triggered Alert</th>
                  <th className="py-3 px-4">Decision</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {alerts.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/40 transition">
                    <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                      {item.transactionReference}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-foreground">{item.customerName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{item.accountNumber}</p>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-foreground">
                      {formatCurrency(item.amount, item.currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge level={item.riskLevel} score={item.riskScore} />
                    </td>
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      {item.triggeredRules.join(", ")}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {item.decision}
                    </td>
                    <td className="py-3.5 px-4">
                      <TxnStatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

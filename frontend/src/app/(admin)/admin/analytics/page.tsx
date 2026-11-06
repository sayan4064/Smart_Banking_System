"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => adminService.getAnalytics(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-primary" />
            Banking & Fraud Analytics
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Aggregated transaction velocity, system throughput, and fraud detection precision metrics.
          </p>
        </div>
      </div>

      {/* Primary Volume Trend Area Chart */}
      <Card className="p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-brand-dark">
              Daily Transaction Volume (Last 7 Days)
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Gross processed transaction volume across all payment rails & internal transfers.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-green-50 text-green-700 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24.8% WoW
          </span>
        </div>

        <div className="h-72 w-full">
          {isLoading || !analytics ? (
            <div className="h-full flex items-center justify-center text-sm text-brand-muted">
              Loading volume trends...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.dailyVolume} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#315CFD" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#315CFD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#8992A7" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#8992A7"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(val: number) => [formatCurrency(val, "INR"), "Volume"]}
                  contentStyle={{
                    backgroundColor: "#172033",
                    border: "none",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#315CFD"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#volumeGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Grid: Fraud Rule Frequency and Settlement Statuses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fraud Rule Trigger Breakdown */}
        <Card className="p-6 border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-brand-dark flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-primary" />
              Fraud Rule Trigger Frequency
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Breakdown of automated heuristic rules fired across all evaluated transactions.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {analytics?.fraudDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-brand-dark">{item.rule}</span>
                  <span className="text-brand-muted">{item.triggeredCount} hits ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-primary h-full rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6 border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-brand-dark flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-secondary" />
              Saga Settlement Status Distribution
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Outcome distribution across total microservice Saga executions.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {analytics?.statusDistribution.map((statusItem, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: statusItem.color }}
                  />
                  <span className="text-xs font-bold text-brand-dark">
                    {statusItem.status}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {statusItem.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

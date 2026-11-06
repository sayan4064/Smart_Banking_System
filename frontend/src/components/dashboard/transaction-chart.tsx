"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const chartData = [
  { month: "Jun", income: 45000, expense: 28000 },
  { month: "Jul", income: 62000, expense: 34000 },
  { month: "Aug", income: 58000, expense: 41000 },
  { month: "Sep", income: 75000, expense: 39000 },
  { month: "Oct", income: 89000, expense: 48000 },
  { month: "Nov", income: 110000, expense: 52000 },
];

export function TransactionChart() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-72 w-full animate-pulse rounded-2xl bg-muted/60" />;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#315CFD" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#315CFD" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E5484D" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#E5484D" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E9F2" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8992A7", fontSize: 12, fontWeight: 500 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8992A7", fontSize: 12, fontWeight: 500 }}
            tickFormatter={(val) => `₹${val / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: "1rem",
              border: "1px solid #E5E9F2",
              boxShadow: "0 10px 25px -5px rgba(23, 32, 51, 0.1)",
              fontSize: "12px",
            }}
            formatter={(value: any, name: any) => [
              formatCurrency(Number(value) || 0),
              name === "income" ? "Monthly Inflow" : "Monthly Outflow",
            ]}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#315CFD"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#incomeGradient)"
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#E5484D"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#expenseGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

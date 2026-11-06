import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  isPositive = true,
  icon,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-soft",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            iconBgColor,
            iconColor
          )}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          {value}
        </h3>

        {change && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-bold",
                isPositive
                  ? "bg-success-50 text-success"
                  : "bg-danger-50 text-danger"
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {change}
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}

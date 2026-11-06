import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, AlertTriangle, ShieldX } from "lucide-react";

export type RiskLevelType = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface RiskBadgeProps {
  level: RiskLevelType | string;
  score?: number;
  className?: string;
}

export function RiskBadge({ level, score, className }: RiskBadgeProps) {
  const config: Record<
    string,
    {
      label: string;
      variant: "success" | "warning" | "danger" | "muted";
      icon: React.ReactNode;
    }
  > = {
    LOW: {
      label: "Low Risk",
      variant: "success",
      icon: <ShieldCheck className="h-3 w-3" />,
    },
    MEDIUM: {
      label: "Medium Risk",
      variant: "warning",
      icon: <AlertTriangle className="h-3 w-3" />,
    },
    HIGH: {
      label: "High Risk",
      variant: "danger",
      icon: <ShieldAlert className="h-3 w-3" />,
    },
    CRITICAL: {
      label: "Critical Risk",
      variant: "danger",
      icon: <ShieldX className="h-3 w-3" />,
    },
  };

  const current = config[level] || {
    label: level,
    variant: "muted",
    icon: null,
  };

  return (
    <Badge variant={current.variant} className={className}>
      {current.icon}
      <span>{current.label}</span>
      {typeof score === "number" && (
        <span className="font-mono text-[10px] opacity-80">({score})</span>
      )}
    </Badge>
  );
}


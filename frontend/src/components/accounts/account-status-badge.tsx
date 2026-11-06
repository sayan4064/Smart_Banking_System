import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Snowflake, XCircle } from "lucide-react";

export type AccountStatusType = "ACTIVE" | "BLOCKED" | "FROZEN" | "CLOSED";

interface AccountStatusBadgeProps {
  status: AccountStatusType | string;
  className?: string;
}

export function AccountStatusBadge({
  status,
  className,
}: AccountStatusBadgeProps) {
  const config: Record<
    string,
    {
      label: string;
      variant: "success" | "danger" | "warning" | "muted";
      icon: React.ReactNode;
    }
  > = {
    ACTIVE: {
      label: "Active",
      variant: "success",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    BLOCKED: {
      label: "Blocked",
      variant: "danger",
      icon: <Lock className="h-3 w-3" />,
    },
    FROZEN: {
      label: "Frozen",
      variant: "warning",
      icon: <Snowflake className="h-3 w-3" />,
    },
    CLOSED: {
      label: "Closed",
      variant: "muted",
      icon: <XCircle className="h-3 w-3" />,
    },
  };

  const current = config[status] || {
    label: status,
    variant: "muted",
    icon: null,
  };

  return (
    <Badge variant={current.variant} className={className}>
      {current.icon}
      <span>{current.label}</span>
    </Badge>
  );
}


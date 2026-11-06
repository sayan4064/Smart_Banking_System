import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  RotateCcw,
  ShieldAlert,
  KeyRound,
  Ban,
} from "lucide-react";

export type TransactionStatusType =
  | "INITIATED"
  | "PROCESSING"
  | "FRAUD_CHECK_PENDING"
  | "OTP_REQUIRED"
  | "OTP_VERIFIED"
  | "COMPLETED"
  | "FAILED"
  | "COMPENSATING"
  | "REFUNDED"
  | "CANCELLED";

interface TxnStatusBadgeProps {
  status: TransactionStatusType | string;
  className?: string;
  showIcon?: boolean;
}

export function TxnStatusBadge({
  status,
  className,
  showIcon = true,
}: TxnStatusBadgeProps) {
  const config: Record<
    string,
    {
      label: string;
      variant: "success" | "warning" | "danger" | "subtle" | "secondary" | "muted";
      icon: React.ReactNode;
    }
  > = {
    INITIATED: {
      label: "Initiated",
      variant: "subtle",
      icon: <Clock className="h-3 w-3" />,
    },
    PROCESSING: {
      label: "Processing",
      variant: "subtle",
      icon: <Clock className="h-3 w-3 animate-spin" />,
    },
    FRAUD_CHECK_PENDING: {
      label: "Fraud Check",
      variant: "warning",
      icon: <ShieldAlert className="h-3 w-3" />,
    },
    OTP_REQUIRED: {
      label: "OTP Required",
      variant: "warning",
      icon: <KeyRound className="h-3 w-3" />,
    },
    OTP_VERIFIED: {
      label: "OTP Verified",
      variant: "secondary",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    COMPLETED: {
      label: "Completed",
      variant: "success",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    FAILED: {
      label: "Failed",
      variant: "danger",
      icon: <XCircle className="h-3 w-3" />,
    },
    COMPENSATING: {
      label: "Compensating",
      variant: "warning",
      icon: <RotateCcw className="h-3 w-3 animate-spin" />,
    },
    REFUNDED: {
      label: "Refunded",
      variant: "secondary",
      icon: <RotateCcw className="h-3 w-3" />,
    },
    CANCELLED: {
      label: "Cancelled",
      variant: "muted",
      icon: <Ban className="h-3 w-3" />,
    },
  };

  const current = config[status] || {
    label: status,
    variant: "muted",
    icon: <Clock className="h-3 w-3" />,
  };

  return (
    <Badge variant={current.variant} className={className}>
      {showIcon && current.icon}
      <span>{current.label}</span>
    </Badge>
  );
}


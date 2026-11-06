import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-2xl border p-4 text-sm transition-all duration-200 flex items-start gap-3.5",
  {
    variants: {
      variant: {
        info: "bg-primary-50 text-foreground border-primary-100 [&>svg]:text-primary",
        success: "bg-success-50 text-foreground border-success-100 [&>svg]:text-success",
        warning: "bg-warning-50 text-foreground border-warning-100 [&>svg]:text-warning",
        danger: "bg-danger-50 text-foreground border-danger-100 [&>svg]:text-danger",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
  onDismiss?: () => void;
}

export function Alert({
  className,
  variant = "info",
  title,
  children,
  onDismiss,
  ...props
}: AlertProps) {
  const Icon = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    danger: AlertCircle,
  }[variant || "info"];

  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-bold leading-tight tracking-tight">{title}</h5>}
        <div className="text-xs text-muted-foreground leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-black/5 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}


import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        subtle:
          "border-transparent bg-primary/10 text-primary",
        success:
          "border-transparent bg-success-50 text-success-600 border border-success-100",
        warning:
          "border-transparent bg-warning-50 text-warning-600 border border-warning-100",
        danger:
          "border-transparent bg-danger-50 text-danger-600 border border-danger-100",
        outline:
          "border border-border text-foreground bg-card",
        muted:
          "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-success",
            variant === "warning" && "bg-warning",
            variant === "danger" && "bg-danger",
            variant === "subtle" && "bg-primary",
            variant === "default" && "bg-white",
            variant === "secondary" && "bg-white"
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };


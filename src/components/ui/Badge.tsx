import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "accent" | "peach" | "neutral" | "success" | "warning" | "error";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    brand: "bg-[var(--ecp-brand-100)] text-[var(--ecp-brand-800)] border border-[var(--ecp-brand-800)]/20",
    accent: "bg-[var(--ecp-accent-100)] text-[#8A6318] border border-[var(--ecp-accent-400)]/40",
    peach: "bg-[var(--ecp-peach-100)] text-[#A34E39] border border-[var(--ecp-peach-400)]/30",
    neutral: "bg-[var(--ecp-surface-muted)] text-[var(--ecp-text-secondary)] border border-[var(--ecp-border)]",
    success: "bg-[var(--ecp-success-surface)] text-[var(--ecp-success)] border border-[var(--ecp-success)]/30",
    warning: "bg-[var(--ecp-warning-surface)] text-[var(--ecp-warning)] border border-[var(--ecp-warning)]/30",
    error: "bg-[var(--ecp-error-surface)] text-[var(--ecp-error)] border border-[var(--ecp-error)]/30",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-semibold rounded-md",
    md: "px-2.5 py-0.5 text-xs font-semibold rounded-full",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}


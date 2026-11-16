import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "warm" | "muted" | "bordered";
}

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-[var(--ecp-surface)] border-[var(--ecp-border)] shadow-sm",
    warm: "bg-[var(--ecp-surface-warm)] border-[var(--ecp-border)] shadow-sm",
    muted: "bg-[var(--ecp-surface-muted)] border-[var(--ecp-border)]",
    bordered: "bg-transparent border-[var(--ecp-border-strong)]",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 md:p-6 transition-all",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

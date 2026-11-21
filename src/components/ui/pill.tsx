import * as React from "react"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface PillProps extends Omit<BadgeProps, "shape"> {
  dot?: boolean;
}

function Pill({
  className,
  dot = false,
  children,
  ...props
}: PillProps) {
  return (
    <Badge
      shape="pill"
      data-slot="pill"
      className={cn("gap-1.5", className)}
      {...props}
    >
      {dot && (
        <span
          className="size-1.5 rounded-pill bg-current shrink-0 opacity-80"
          aria-hidden="true"
        />
      )}
      {children}
    </Badge>
  )
}

export { Pill }

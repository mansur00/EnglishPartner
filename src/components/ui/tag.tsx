import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface TagProps extends BadgeProps {
  selected?: boolean;
  onRemove?: () => void;
  removeAriaLabel?: string;
  icon?: React.ReactNode;
}

function Tag({
  className,
  variant = "secondary",
  size = "default",
  selected = false,
  onRemove,
  removeAriaLabel = "Remove tag",
  icon,
  children,
  onClick,
  ...props
}: TagProps) {
  const isClickable = Boolean(onClick);

  return (
    <Badge
      variant={selected ? "default" : variant}
      size={size}
      shape="pill"
      data-slot="tag"
      data-selected={selected ? "true" : undefined}
      className={cn(
        "gap-1.5 transition-all select-none",
        isClickable && "cursor-pointer hover:opacity-90 active:scale-95",
        selected && "shadow-xs ring-2 ring-ring/30",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={removeAriaLabel}
          className="ml-0.5 -mr-1 p-0.5 rounded-pill text-muted-foreground hover:text-foreground hover:bg-muted/80 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={12} />
        </button>
      )}
    </Badge>
  )
}

export { Tag }

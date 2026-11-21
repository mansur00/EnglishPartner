import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { badgeVariants, type BadgeVariantProps } from "./badge-variants"
import { cn } from "@/lib/utils"

export interface BadgeProps
  extends useRender.ComponentProps<"span">,
    BadgeVariantProps {
  pill?: boolean;
}

function Badge({
  className,
  variant = "default",
  size = "default",
  shape = "pill",
  pill,
  render,
  ...props
}: BadgeProps) {
  const resolvedShape = pill !== undefined ? (pill ? "pill" : "rounded") : shape

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size, shape: resolvedShape }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
      size,
    },
  })
}

export { Badge, badgeVariants }

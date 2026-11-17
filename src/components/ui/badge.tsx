import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent px-2.5 text-xs font-semibold whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        brand:
          "bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary-foreground",
        accent:
          "bg-[var(--sun-100)] text-[var(--brand-950)] border border-[var(--sun-300)] dark:bg-amber-950/40 dark:text-[var(--sun-300)] dark:border-[var(--sun-700)]",
        peach:
          "bg-[var(--topic-tile)] text-[var(--topic-ink)] border border-[var(--topic-border)]",
        neutral:
          "bg-muted text-muted-foreground border border-border",
        success:
          "bg-emerald-500/10 text-emerald-800 border border-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:border-emerald-400/30",
        warning:
          "bg-amber-500/10 text-amber-800 border border-amber-500/30 dark:bg-amber-400/15 dark:text-amber-300 dark:border-amber-400/30",
        error:
          "bg-destructive/10 text-destructive border border-destructive/20 dark:bg-destructive/20",
      },
      size: {
        default: "h-6 px-2.5 text-xs rounded-full",
        sm: "h-5 px-2 text-xs rounded-md",
        md: "h-6 px-3 text-xs rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size }), className),
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

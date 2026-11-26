import { cva, type VariantProps } from "class-variance-authority"

export const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden border border-transparent font-semibold whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      variant: {
        default: "border-0 bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "border-0 bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "border-0 bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/25 dark:text-destructive [a]:hover:bg-destructive/20",
        outline:
          "border border-border bg-transparent text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "border-0 bg-transparent hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        success:
          "border-0 bg-status-success-bg text-status-success-ink",
        warning:
          "border-0 bg-status-warning-bg text-status-warning-ink",
        info:
          "border-0 bg-status-info-bg text-status-info-ink",
        link: "border-0 bg-transparent text-primary underline-offset-4 hover:underline",
        // Additional brand & legacy variants
        brand:
          "border-0 bg-primary/10 text-primary dark:bg-primary/25 dark:text-primary",
        accent:
          "border-0 bg-sun-100 text-brand-950 dark:bg-status-warning-bg dark:text-sun-300",
        peach:
          "border-0 bg-topic-tile text-topic-ink",
        neutral:
          "border-0 bg-muted text-muted-foreground",
        error:
          "border-0 bg-status-danger-bg text-status-danger-ink",
      },
      size: {
        sm: "h-5 px-2 text-chip",
        default: "h-6 px-2.5 text-chip",
        md: "h-6 px-3 text-chip",
        lg: "h-7 px-3 text-meta",
      },
      shape: {
        pill: "rounded-pill",
        rounded: "rounded-panel",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "pill",
    },
  }
)

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

import { cva, type VariantProps } from "class-variance-authority"

export const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden border border-transparent font-semibold whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3.5!",
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
        success:
          "bg-status-success-bg text-status-success-ink border border-status-success-ink/20",
        warning:
          "bg-status-warning-bg text-status-warning-ink border border-status-warning-ink/20",
        link: "text-primary underline-offset-4 hover:underline",
        // Additional brand & legacy variants
        brand:
          "bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary-foreground",
        accent:
          "bg-sun-100 text-brand-950 border border-sun-300 dark:bg-status-warning-bg dark:text-sun-300 dark:border-sun-700",
        peach:
          "bg-topic-tile text-topic-ink border border-topic-border",
        neutral:
          "bg-muted text-muted-foreground border border-border",
        error:
          "bg-status-danger-bg text-status-danger-ink border border-status-danger-ink/20",
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

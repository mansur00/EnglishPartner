import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        cta: "bg-sun-500 text-brand-950 hover:bg-sun-400 active:bg-sun-600 shadow-sm font-semibold",
        default: "bg-primary text-primary-foreground hover:bg-[var(--brand-900)] active:bg-[var(--brand-950)] shadow-xs font-semibold",
        primary: "bg-primary text-primary-foreground hover:bg-[var(--brand-900)] active:bg-[var(--brand-950)] shadow-xs font-semibold",
        accent:
          "bg-[var(--sun-500)] text-[var(--brand-950)] hover:bg-[var(--sun-400)] shadow-xs font-semibold",
        outline:
          "border border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-[var(--brand-100)] text-[var(--brand-800)] hover:bg-[var(--brand-200)] active:bg-[var(--brand-300)] dark:bg-[var(--accent)] dark:text-[var(--accent-foreground)] font-semibold",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 gap-2 px-5 text-base rounded-[12px]",
        md: "h-11 gap-2 px-5 text-base rounded-[12px]",
        sm: "h-9 gap-1.5 px-3.5 text-sm rounded-[10px]",
        xs: "h-7 gap-1 px-2.5 text-xs rounded-[8px]",
        lg: "h-13 gap-2.5 px-7 text-lg rounded-[12px]",
        icon: "size-11 rounded-[12px]",
        "icon-sm": "size-9 rounded-[10px]",
        "icon-lg": "size-13 rounded-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

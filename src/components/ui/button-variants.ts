import { cva, type VariantProps } from "class-variance-authority"

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-control border border-transparent bg-clip-padding text-label font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-brand-900 active:bg-brand-950 shadow-xs font-semibold",
        secondary:
          "bg-brand-100 text-brand-800 hover:bg-brand-200 active:bg-brand-300 dark:bg-accent dark:text-accent-foreground font-semibold",
        outline:
          "border border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs",
        link: "text-primary underline-offset-4 hover:underline",
        // Extended & brand-specific variants
        cta: "bg-cta bg-cta-hover active:bg-sun-600 shadow-sm font-semibold",
        primary:
          "bg-primary text-primary-foreground hover:bg-brand-900 active:bg-brand-950 shadow-xs font-semibold",
        accent: "bg-cta hover:bg-sun-400 shadow-xs font-semibold",
      },
      size: {
        default: "h-control-md gap-2 px-5 text-label rounded-control",
        md: "h-control-md gap-2 px-5 text-label rounded-control",
        sm: "h-control-sm gap-1.5 px-3.5 text-meta rounded-control",
        xs: "h-7 gap-1 px-2.5 text-chip rounded-panel",
        lg: "h-control-lg gap-2.5 px-7 text-lead rounded-control",
        icon: "size-tap rounded-control",
        "icon-xs": "size-7 rounded-panel p-1",
        "icon-sm": "h-control-sm w-control-sm rounded-control p-1.5",
        "icon-lg": "h-control-lg w-control-lg rounded-control p-2.5",
      },
      pill: {
        true: "rounded-pill",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      pill: false,
    },
  }
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

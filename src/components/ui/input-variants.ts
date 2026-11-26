import { cva, type VariantProps } from "class-variance-authority"

export const inputVariants = cva(
  "w-full min-w-0 rounded-control transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-meta file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        outline:
          "border border-input bg-transparent text-foreground dark:bg-transparent disabled:bg-muted/30 outline-none focus:outline-none focus-visible:outline-none shadow-xs focus:shadow-none ring-0 focus:ring-0",
        filled:
          "border border-transparent bg-muted/60 hover:bg-muted focus-visible:bg-card disabled:bg-muted/30 focus:outline-none focus-visible:outline-none",
        ghost:
          "border-0 bg-transparent hover:bg-transparent focus-visible:bg-transparent outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 disabled:bg-transparent",
      },
      inputSize: {
        sm: "h-control-sm px-3 text-meta",
        default: "h-input px-4 text-body",
        lg: "h-control-lg px-4 text-lead",
      },
      pill: {
        true: "rounded-pill",
        false: "",
      },
    },
    defaultVariants: {
      variant: "outline",
      inputSize: "default",
      pill: false,
    },
  }
)

export type InputVariantProps = VariantProps<typeof inputVariants>;

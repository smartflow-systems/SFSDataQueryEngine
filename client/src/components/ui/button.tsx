import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "sfs-button",
        destructive:
          "bg-[#8b2020] text-[#ffffff] hover:bg-[#a52525] border border-[#8b2020] sfs-card",
        outline:
          "border-2 border-[rgba(212,175,55,0.35)] bg-transparent text-[#d4af37] hover:bg-[rgba(212,175,55,0.1)] hover:border-[#d4af37] smooth-transition",
        secondary:
          "sfs-card text-[#d4af37] hover:transform hover:-translate-y-1",
        ghost: "hover:bg-[rgba(212,175,55,0.1)] hover:text-[#ffdd00] text-[#d4af37] smooth-transition",
        link: "text-[#d4af37] underline-offset-4 hover:underline hover:text-[#ffdd00] smooth-transition",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#d4af37] via-[#f4e4bc] to-[#b8941f] text-[#0b0b0b] font-bold hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] hover:scale-105 border-2 border-[#d4af37]",
        destructive:
          "bg-[#8b2020] text-[#e9e6df] hover:bg-[#a52525] border border-[#8b2020]",
        outline:
          "border-2 border-[rgba(212,175,55,0.3)] bg-transparent text-[#d4af37] hover:bg-[rgba(212,175,55,0.1)] hover:border-[#d4af37]",
        secondary:
          "bg-[rgba(45,31,26,0.5)] text-[#d4af37] hover:bg-[rgba(45,31,26,0.8)] border border-[rgba(212,175,55,0.3)]",
        ghost: "hover:bg-[rgba(212,175,55,0.1)] hover:text-[#f4e4bc] text-[#d4af37]",
        link: "text-[#d4af37] underline-offset-4 hover:underline hover:text-[#f4e4bc]",
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

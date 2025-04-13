
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-extrabold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-[6px] border-[#0f172a] transform active:translate-y-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)]",
        outline:
          "bg-transparent border-[6px] border-[#0f172a] text-white hover:bg-[#151e2d] shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)]",
        ghost: "bg-transparent hover:bg-accent/10 hover:text-accent-foreground border-transparent hover:border-[#0f172a]/40",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
        fun: "bg-[#10b981] text-white hover:bg-[#10b981]/90 shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)]",
        soft: "bg-primary/10 text-primary hover:bg-primary/20 shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)]",
        // Theme colors with enhanced cartoon style
        green: "bg-green text-white hover:bg-green/90 shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)]",
        lime: "bg-lime text-white hover:bg-lime/90 shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)]",
        teal: "bg-teal text-white hover:bg-teal/90 shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)]",
        blue: "bg-status-blue text-white hover:bg-status-blue/90 shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)]",
        purple: "bg-purple text-white hover:bg-purple/90 shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)]",
        orange: "bg-orange text-white hover:bg-orange/90 shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)]",
        gradient: "bg-gradient-to-r from-primary to-accent text-white shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:shadow-[0_12px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)]",
        // Enhanced cartoon buttons
        cartoon: "bg-[#10b981] text-white border-[6px] border-[#0f172a] rounded-2xl shadow-[0_12px_0_rgba(15,23,42,0.7)] hover:shadow-[0_14px_0_rgba(15,23,42,0.7)] active:shadow-[0_2px_0_rgba(15,23,42,0.7)] hover:bg-[#10b981]/90 transition-all",
        cartoon2: "bg-[#10b981] text-[#0f172a] font-extrabold border-[6px] border-[#0f172a] rounded-2xl shadow-[0_12px_0_rgba(5,150,105,0.7)] hover:shadow-[0_14px_0_rgba(5,150,105,0.7)] active:shadow-[0_2px_0_rgba(5,150,105,0.7)] hover:bg-[#34d399] transition-all",
        "cartoon-outline": "bg-transparent text-[#10b981] border-[6px] border-[#0f172a] rounded-2xl shadow-[0_12px_0_rgba(5,150,105,0.5)] hover:shadow-[0_14px_0_rgba(5,150,105,0.5)] active:shadow-[0_2px_0_rgba(5,150,105,0.5)] hover:bg-[#10b981]/10 transition-all",
      },
      size: {
        default: "h-14 px-6 py-4",
        sm: "h-12 rounded-2xl px-5 text-sm",
        lg: "h-16 rounded-2xl px-8 text-lg",
        icon: "h-14 w-14 rounded-2xl",
        cartoon: "h-18 rounded-2xl px-10 py-6 text-xl",
      },
    },
    defaultVariants: {
      variant: "cartoon",
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
    
    // Add haptic feedback on click
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (navigator.vibrate) {
        navigator.vibrate(30); // stronger vibration
      }
      
      if (props.onClick) {
        props.onClick(e);
      }
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        onClick={handleClick}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

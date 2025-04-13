
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border-[4px] border-[#0f172a] bg-[#151e2d] px-3 py-2 text-white font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/40 focus-visible:outline-none focus-visible:border-kiwi-light focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-[inset_0_2px_3px_rgba(0,0,0,0.4)]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }


import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleTrigger
    ref={ref}
    className={`p-2 bg-[#151e2d] hover:bg-[#1e293b] border-[3px] border-[#0f172a] rounded-lg shadow-[0_5px_0_rgba(15,23,42,0.5)] hover:shadow-[0_7px_0_rgba(15,23,42,0.5)] active:shadow-[0_2px_0_rgba(15,23,42,0.5)] active:translate-y-2 transition-all duration-200 ${className}`}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.CollapsibleTrigger>
))
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={`mt-2 overflow-hidden bg-[#1e293b]/30 p-3 border-[3px] border-[#0f172a]/30 rounded-lg ${className}`}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.CollapsibleContent>
))
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

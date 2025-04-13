
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Check if window exists (we're in browser environment)
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      
      const onChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
      
      // Set initial value
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      
      // Add event listener
      mql.addEventListener("change", onChange)
      
      // Cleanup
      return () => mql.removeEventListener("change", onChange)
    }
    
    return undefined
  }, [])

  return isMobile
}

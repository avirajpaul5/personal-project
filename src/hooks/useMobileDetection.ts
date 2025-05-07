import { useState, useEffect } from "react";

/**
 * Custom hook for detecting if the current device is mobile
 * @param breakpoint The width threshold for mobile detection (default: 768px)
 * @returns Boolean indicating if the device is mobile
 */
export function useMobileDetection(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

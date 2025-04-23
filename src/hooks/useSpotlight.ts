import { useState, useEffect } from "react";

/**
 * Custom hook for managing spotlight search functionality
 * @returns Spotlight state and methods
 */
export function useSpotlight() {
  const [isOpen, setIsOpen] = useState(false);

  // Effect hook for spotlight search keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  /**
   * Opens the spotlight search
   */
  const openSpotlight = () => setIsOpen(true);

  /**
   * Closes the spotlight search
   */
  const closeSpotlight = () => setIsOpen(false);

  return { isOpen, openSpotlight, closeSpotlight };
}

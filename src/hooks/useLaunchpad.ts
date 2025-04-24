import { useState, useEffect } from "react";

/**
 * Custom hook for managing Launchpad functionality
 * @returns Launchpad state and methods
 */
export function useLaunchpad() {
  const [isOpen, setIsOpen] = useState(false);

  // Effect hook for Launchpad keyboard shortcut (Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  /**
   * Opens the Launchpad
   */
  const openLaunchpad = () => setIsOpen(true);

  /**
   * Closes the Launchpad
   */
  const closeLaunchpad = () => setIsOpen(false);

  /**
   * Toggles the Launchpad state
   */
  const toggleLaunchpad = () => setIsOpen(!isOpen);

  return { isOpen, openLaunchpad, closeLaunchpad, toggleLaunchpad };
}

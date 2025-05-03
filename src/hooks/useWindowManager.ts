import { useState } from "react";
import { Window as WindowType } from "../components/utils/types";

/**
 * Custom hook for managing window state and operations
 * @param initialWindows Initial window configurations
 * @returns Window management methods and state
 */
export function useWindowManager(initialWindows: WindowType[]) {
  const [windows, setWindows] = useState<WindowType[]>(initialWindows);

  /**
   * Opens an app window or brings it to front if already open
   * @param id Window ID to open
   */
  const openWindow = (id: string) => {
    const isMobile = window.innerWidth < 768;
    setWindows((prevWindows) =>
      prevWindows.map((window) => {
        if (window.id === id) {
          // Calculate staggered position based on number of open windows
          const openWindows = prevWindows.filter(
            (w) => w.isOpen && !w.isMinimized
          );
          const offset = openWindows.length * 30;
          return {
            ...window,
            isOpen: true,
            isMinimized: false,
            isMaximized: isMobile ? true : window.isMaximized,
            x: isMobile ? 0 : 100 + offset,
            y: isMobile ? 28 : 100 + offset, // 28px for navbar
            lastActive: Date.now(),
          };
        }
        return window;
      })
    );
  };

  /**
   * Minimizes a window
   * @param id Window ID to minimize
   */
  const minimizeWindow = (id: string) => {
    setWindows((prevWindows) =>
      prevWindows.map((window) =>
        window.id === id ? { ...window, isMinimized: true } : window
      )
    );
  };

  /**
   * Minimizes a window and marks it as closed
   * @param id Window ID to minimize
   */
  const minimizeAndCloseWindow = (id: string) => {
    setWindows((prevWindows) =>
      prevWindows.map((window) =>
        window.id === id
          ? { ...window, isMinimized: true, isOpen: false }
          : window
      )
    );
  };

  /**
   * Restores a minimized window
   * @param id Window ID to restore
   */
  const restoreWindow = (id: string) => {
    setWindows((prevWindows) =>
      prevWindows.map((window) =>
        window.id === id
          ? {
              ...window,
              isMinimized: false,
              isOpen: true,
              lastActive: Date.now(),
            }
          : window
      )
    );
  };

  /**
   * Closes a window
   * @param id Window ID to close
   */
  const closeWindow = (id: string) => {
    setWindows((prevWindows) =>
      prevWindows.map((window) =>
        window.id === id ? { ...window, isOpen: false } : window
      )
    );
  };

  /**
   * Completely closes a window (from dock)
   * @param id Window ID to close
   */
  const closeWindowCompletely = (id: string) => {
    setWindows((prevWindows) =>
      prevWindows.map((window) =>
        window.id === id
          ? { ...window, isOpen: false, isMinimized: false }
          : window
      )
    );
  };

  /**
   * Toggles window maximization state
   * @param id Window ID to maximize/restore
   */
  const toggleMaximize = (id: string) => {
    const navbarHeight = 28;
    setWindows((prevWindows) =>
      prevWindows.map((window) => {
        if (window.id === id) {
          const isMaximizing = !window.isMaximized;
          if (isMaximizing) {
            // Always set to flush position when maximizing
            return {
              ...window,
              isMaximized: true,
              lastActive: Date.now(),
              x: 0,
              y: navbarHeight,
            };
          } else {
            // Restore to previous position (optional: you can store/restore previous x/y)
            return {
              ...window,
              isMaximized: false,
              lastActive: Date.now(),
              // Optionally restore previous x/y here
            };
          }
        }
        return window;
      })
    );
  };

  /**
   * Updates window position
   * @param id Window ID to update
   * @param newX New X position
   * @param newY New Y position
   */
  const updatePosition = (id: string, newX: number, newY: number) => {
    setWindows((prevWindows) =>
      prevWindows.map((window) =>
        window.id === id ? { ...window, x: newX, y: newY } : window
      )
    );
  };

  /**
   * Brings a window to focus (front)
   * @param id Window ID to focus
   */
  const focusWindow = (id: string) => {
    setWindows((prevWindows) =>
      prevWindows.map((window) =>
        window.id === id ? { ...window, lastActive: Date.now() } : window
      )
    );
  };

  return {
    windows,
    openWindow,
    minimizeWindow,
    minimizeAndCloseWindow,
    restoreWindow,
    closeWindow,
    closeWindowCompletely,
    toggleMaximize,
    updatePosition,
    focusWindow,
  };
}

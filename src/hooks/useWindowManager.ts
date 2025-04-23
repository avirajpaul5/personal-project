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
    setWindows((prevWindows) =>
      prevWindows.map((window) => {
        if (window.id === id) {
          // Calculate staggered position based on number of open windows
          const openWindows = prevWindows.filter((w) => w.isOpen && !w.isMinimized);
          const offset = openWindows.length * 30;
          return {
            ...window,
            isOpen: true,
            isMinimized: false,
            x: 100 + offset,
            y: 100 + offset,
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
        window.id === id ? { ...window, isMinimized: true, isOpen: false } : window
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
        window.id === id ? { ...window, isOpen: false, isMinimized: false } : window
      )
    );
  };

  /**
   * Toggles window maximization state
   * @param id Window ID to maximize/restore
   */
  const toggleMaximize = (id: string) => {
    setWindows((prevWindows) =>
      prevWindows.map((window) => {
        if (window.id === id) {
          // Bring window to front when maximizing
          const isMaximizing = !window.isMaximized;
          return {
            ...window,
            isMaximized: !window.isMaximized,
            lastActive: Date.now(),
            // Store original position/size only when maximizing
            ...(isMaximizing
              ? {
                  x: window.x,
                  y: window.y,
                  width: 600,
                  height: 400,
                }
              : {}),
          };
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

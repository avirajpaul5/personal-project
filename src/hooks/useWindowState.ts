import { useState, useRef, useEffect } from "react";

/**
 * Interface for window size
 */
interface Size {
  width: number;
  height: number;
}

/**
 * Interface for window position
 */
interface Position {
  x: number;
  y: number;
}

/**
 * Custom hook for managing window state
 * @param initialSize Initial window size
 * @param initialPosition Initial window position
 * @param isOpen Whether the window is initially open
 * @param isMaximized Whether the window is initially maximized
 * @param onPositionChange Callback for position changes
 * @returns Window state and handlers
 */
export function useWindowState(
  initialSize: Size = { width: 550, height: 350 },
  initialPosition: Position,
  isOpen: boolean,
  isMaximized: boolean,
  onPositionChange: (x: number, y: number) => void
) {
  // State for window size and visibility
  const [size, setSize] = useState<Size>(initialSize);
  const [isVisible, setIsVisible] = useState(false);
  const [exitType, setExitType] = useState<"close" | "minimize">("close");

  // Refs for storing previous window state
  const previousSize = useRef<Size>(initialSize);
  const previousPosition = useRef<Position>(initialPosition);

  // Effect to set visibility when window is opened
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  /**
   * Handle window close action
   * @param onBodyClick Optional callback for body click
   */
  const handleClose = (onBodyClick?: () => void) => {
    if (onBodyClick) {
      onBodyClick();
    }
    setExitType("close");
    setIsVisible(false);
  };

  /**
   * Handle window minimize action
   * @param onBodyClick Optional callback for body click
   */
  const handleMinimize = (onBodyClick?: () => void) => {
    if (onBodyClick) {
      onBodyClick();
    }
    setExitType("minimize");
    setIsVisible(false);
  };

  /**
   * Handle window maximize/restore action
   * @param onBodyClick Optional callback for body click
   * @param onMaximize Callback for maximize action
   */
  const handleMaximize = (
    onBodyClick?: () => void,
    onMaximize?: () => void
  ) => {
    if (onBodyClick) {
      onBodyClick();
    }
    if (!isMaximized) {
      // Store current size and position before maximizing
      previousSize.current = size;
      previousPosition.current = { x: initialPosition.x, y: initialPosition.y };

      // Navbar height is 28px (h-7 in Tailwind)
      const navbarHeight = 28;

      // Set window size to full screen minus navbar height
      setSize({
        width: window.innerWidth,
        height: window.innerHeight - navbarHeight,
      });

      // Position window just below the navbar with no gap
      onPositionChange(0, navbarHeight);
    } else {
      // Restore previous size and position
      setSize(previousSize.current);
      onPositionChange(previousPosition.current.x, previousPosition.current.y);
    }
    if (onMaximize) {
      onMaximize();
    }
  };

  /**
   * Handle window drag stop event
   * Ensures the window stays within the viewport
   */
  const handleDragStop = (_e: any, d: { x: number; y: number }) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const newX = Math.max(0, Math.min(d.x, windowWidth - size.width));
    const newY = Math.max(0, Math.min(d.y, windowHeight - size.height));
    onPositionChange(newX, newY);
  };

  /**
   * Handle window resize event
   */
  const handleResize = (
    _e: any,
    _direction: any,
    ref: HTMLElement,
    _delta: any,
    position: Position
  ) => {
    setSize({
      width: parseInt(ref.style.width),
      height: parseInt(ref.style.height),
    });
    onPositionChange(position.x, position.y);
  };

  // Define exit animation variants
  const exitVariants = {
    close: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
    minimize: {
      y: 100,
      scale: 0.8,
      opacity: 0.5,
      filter: "blur(4px)",
      transition: {
        duration: 0.4,
        ease: [0.68, -0.55, 0.27, 1.55],
      },
    },
  };

  return {
    size,
    isVisible,
    exitType,
    exitVariants,
    handleClose,
    handleMinimize,
    handleMaximize,
    handleDragStop,
    handleResize,
  };
}

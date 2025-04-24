import { createContext, useContext, ReactNode, useState, useEffect } from "react";

// Define the shape of our spotlight context
interface SpotlightContextType {
  isOpen: boolean;
  openSpotlight: () => void;
  closeSpotlight: () => void;
}

// Create the context with a default value
const SpotlightContext = createContext<SpotlightContextType | undefined>(undefined);

// Props for the SpotlightProvider component
interface SpotlightProviderProps {
  children: ReactNode;
}

/**
 * SpotlightProvider component that wraps the application and provides spotlight context
 */
export function SpotlightProvider({ children }: SpotlightProviderProps) {
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

  // Create the value object to be provided by the context
  const spotlightValue: SpotlightContextType = {
    isOpen,
    openSpotlight,
    closeSpotlight,
  };

  return (
    <SpotlightContext.Provider value={spotlightValue}>
      {children}
    </SpotlightContext.Provider>
  );
}

/**
 * Custom hook to use the spotlight context
 */
export function useSpotlight() {
  const context = useContext(SpotlightContext);
  if (context === undefined) {
    throw new Error("useSpotlight must be used within a SpotlightProvider");
  }
  return context;
}

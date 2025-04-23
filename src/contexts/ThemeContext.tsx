import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme as useThemeHook, BACKGROUNDS } from '../hooks/useTheme';

// Define the shape of our theme context
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
  backgrounds: {
    light: string;
    dark: string;
  };
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider component that wraps the application and provides theme context
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Use the existing theme hook
  const { isDark, toggleTheme, setTheme } = useThemeHook();

  // Create the value object to be provided by the context
  const themeValue: ThemeContextType = {
    isDark,
    toggleTheme,
    setTheme,
    backgrounds: BACKGROUNDS,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to use the theme context
 * @returns Theme context values
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

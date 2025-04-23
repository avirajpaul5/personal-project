import { useState, useEffect } from "react";

/**
 * Background images for light and dark modes
 */
export const BACKGROUNDS = {
  light:
    "url('https://images.unsplash.com/photo-1604147495798-57beb5d6af73?q=80&w=2000')",
  dark: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000')",
};

// Theme storage key for localStorage
const THEME_STORAGE_KEY = "portfolio-theme-preference";

/**
 * Check if the user prefers dark mode based on system preference
 */
const getSystemThemePreference = (): boolean => {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

/**
 * Custom hook for managing theme state
 * @returns Theme state and toggle function
 */
export function useTheme() {
  // Initialize theme from localStorage or system preference
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme !== null) {
      return savedTheme === "dark";
    }
    // Fall back to system preference
    return getSystemThemePreference();
  });

  // Effect hook for managing dark mode
  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }

    // Save preference to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (localStorage.getItem(THEME_STORAGE_KEY) === null) {
        setIsDark(e.matches);
      }
    };

    // Add listener for preference changes
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  /**
   * Toggles between light and dark themes
   */
  const toggleTheme = () => setIsDark(!isDark);

  /**
   * Set theme explicitly to light or dark
   */
  const setTheme = (dark: boolean) => setIsDark(dark);

  return { isDark, toggleTheme, setTheme };
}

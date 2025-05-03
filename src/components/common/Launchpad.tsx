import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Window } from "../utils/types";
import { useTheme } from "../../contexts/ThemeContext";
import { Search } from "lucide-react";
import "../../styles/launchpad.css";

interface LaunchpadProps {
  isOpen: boolean;
  onClose: () => void;
  apps: Window[];
  onAppClick: (id: string) => void;
}

export default function Launchpad({
  isOpen,
  onClose,
  apps,
  onAppClick,
}: LaunchpadProps) {
  const { isDark } = useTheme();

  // State for search
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  // Adjust apps per page based on screen size
  const [appsPerPage, setAppsPerPage] = useState(28); // 7 columns x 4 rows for desktop

  // Update apps per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 375) {
        setAppsPerPage(12); // 3 columns x 4 rows for extra small devices
      } else if (window.innerWidth <= 768) {
        setAppsPerPage(16); // 4 columns x 4 rows for mobile
      } else if (window.innerWidth <= 1024) {
        setAppsPerPage(20); // 5 columns x 4 rows for tablets
      } else {
        setAppsPerPage(28); // 7 columns x 4 rows for desktop
      }
    };

    handleResize(); // Call once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter apps based on search query
  const filteredApps = apps.filter((app) =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredApps.length / appsPerPage);

  // Handle keyboard navigation for Launchpad
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        if (searchQuery) {
          // If there's a search query, clear it first
          e.preventDefault();
          setSearchQuery("");
          searchInputRef.current?.focus();
        } else {
          // Otherwise close the Launchpad
          onClose();
        }
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        // Navigate to next page
        e.preventDefault();
        if (currentPage < totalPages - 1) {
          setCurrentPage(currentPage + 1);
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        // Navigate to previous page
        e.preventDefault();
        if (currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, searchQuery, currentPage, totalPages]);

  // Handle app click
  const handleAppClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from closing the Launchpad
    onAppClick(id);
    onClose();
  };

  // Get current page apps
  const currentApps = filteredApps.slice(
    currentPage * appsPerPage,
    (currentPage + 1) * appsPerPage
  );

  // Focus search input when Launchpad opens and reset page
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
      setSearchQuery("");
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle page change
  const handlePageChange = (newPage: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from closing the Launchpad
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle search click
  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from closing the Launchpad
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Reset to first page when search query changes
    setCurrentPage(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="launchpad-container"
          style={{ zIndex: 9999 }} // Ensure consistent z-index with CSS
          onClick={onClose} // Close when clicking anywhere
        >
          {/* Search bar */}
          <div className="search-bar" onClick={handleSearchClick}>
            <Search className="w-4 h-4 text-white/70 mr-2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-white/70"
            />
            {searchQuery && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
                className="text-white/70 text-xs ml-1 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* No results message */}
          {filteredApps.length === 0 && searchQuery && (
            <motion.div
              className="no-results"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-white text-lg">
                No results found for "{searchQuery}"
              </p>
            </motion.div>
          )}

          {/* App grid - only show if we have results or no search query */}
          {(filteredApps.length > 0 || !searchQuery) && (
            <div className="launchpad-grid">
              {filteredApps.length > 0 ? (
                currentApps.map((app) => (
                  <motion.div
                    key={app.id}
                    className="app-icon-container"
                    onClick={(e) => handleAppClick(app.id, e)}
                  >
                    <div className="app-icon">
                      <img
                        src={app.icon}
                        alt={app.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="app-title">{app.title}</span>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center text-white text-lg">
                  <p>No apps available</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination dots */}
          {totalPages > 1 && (
            <div className="pagination" onClick={(e) => e.stopPropagation()}>
              {Array.from({ length: totalPages }).map((_, index) => {
                const isActive = currentPage === index;
                return (
                  <button
                    key={index}
                    onClick={(e) => handlePageChange(index, e)}
                    className={`pagination-dot ${isActive ? "active" : ""}`}
                    aria-label={`Page ${index + 1}`}
                    title={`Page ${index + 1}`}
                  />
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

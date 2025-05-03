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
  const appsPerPage = 32; // 8 columns x 4 rows

  // Filter apps based on search query
  const filteredApps = apps.filter((app) =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredApps.length / appsPerPage);

  // Handle Escape key to close Launchpad or clear search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (searchQuery) {
          // If there's a search query, clear it first
          e.preventDefault();
          setSearchQuery("");
          searchInputRef.current?.focus();
        } else {
          // Otherwise close the Launchpad
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, searchQuery]);

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

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  // Focus search input when Launchpad opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
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

<<<<<<< Updated upstream
          {/* App grid */}
          <div className="launchpad-grid">
            {currentApps.length > 0 ? (
              currentApps.map((app) => (
=======
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
              {currentApps.map((app) => (
>>>>>>> Stashed changes
                <motion.div
                  key={app.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                    delay: Math.random() * 0.2,
                  }}
                  className="app-icon-container"
                  onClick={(e) => handleAppClick(app.id, e)}
                >
                  <div className="app-icon">
                    <img
                      src={app.icon}
                      alt={app.title}
<<<<<<< Updated upstream
                      className="w-full h-full object-contain"
=======
                      className="w-12 h-12 mt-6"
>>>>>>> Stashed changes
                    />
                  </div>
                  <span className="app-title">{app.title}</span>
                </motion.div>
<<<<<<< Updated upstream
              ))
            ) : (
              <div className="col-span-full text-center text-white text-lg">
                <p>No apps available</p>
              </div>
            )}
          </div>
=======
              ))}
            </div>
          )}
>>>>>>> Stashed changes

          {/* Pagination dots */}
          {totalPages > 1 && (
            <div className="pagination" onClick={(e) => e.stopPropagation()}>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => handlePageChange(index, e)}
                  className={clsx(
                    "pagination-dot",
                    currentPage === index ? "active" : ""
                  )}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

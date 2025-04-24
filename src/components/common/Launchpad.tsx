import { useEffect, useState } from "react";
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

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const appsPerPage = 28; // 7 columns x 4 rows
  const totalPages = Math.ceil(apps.length / appsPerPage);

  // Handle Escape key to close Launchpad
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle app click
  const handleAppClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from closing the Launchpad
    onAppClick(id);
    onClose();
  };

  // Get current page apps
  const currentApps = apps.slice(
    currentPage * appsPerPage,
    (currentPage + 1) * appsPerPage
  );

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
              type="text"
              placeholder="Search"
              className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-white/70"
            />
          </div>

          {/* App grid */}
          <div className="launchpad-grid">
            {currentApps.map((app) => (
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
                <div
                  className={clsx(
                    "app-icon",
                    isDark ? "bg-gray-800/80" : "bg-white/80"
                  )}
                >
                  <img src={app.icon} alt={app.title} />
                </div>
                <span className="app-title">{app.title}</span>
              </motion.div>
            ))}
          </div>

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

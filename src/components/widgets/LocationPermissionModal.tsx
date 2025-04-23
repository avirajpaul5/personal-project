import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

/**
 * LocationPermissionModal component props interface
 */
interface LocationPermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

/**
 * LocationPermissionModal component for requesting location permission
 */
export default function LocationPermissionModal({
  isOpen,
  onAllow,
  onDeny,
}: LocationPermissionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 bg-amber-50 dark:bg-amber-900/30 p-2 rounded-full text-amber-500 dark:text-amber-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    Location Access Required
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    To provide accurate weather information, we need access to
                    your location. You can change this later in your browser
                    settings.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onDeny}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                >
                  Don't Allow
                </button>
                <button
                  onClick={onAllow}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-sm"
                >
                  Allow
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

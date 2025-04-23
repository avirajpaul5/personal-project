import clsx from "clsx";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * WindowTitleBar component props interface
 */
interface WindowTitleBarProps {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

/**
 * WindowTitleBar component for window title and control buttons
 */
export default function WindowTitleBar({
  title,
  onClose,
  onMinimize,
  onMaximize,
}: WindowTitleBarProps) {
  // Get theme from context
  const { isDark } = useTheme();
  return (
    <div
      className={clsx(
        "window-handle flex items-center p-2 border-b",
        isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"
      )}
    >
      {/* Window control buttons */}
      <div className="flex space-x-2 pl-2">
        <button
          onClick={onClose}
          className={clsx(
            "w-3 h-3 rounded-full transition-colors",
            isDark
              ? "bg-red-500 hover:bg-red-400"
              : "bg-red-500 hover:bg-red-600"
          )}
        />
        <button
          onClick={onMinimize}
          className={clsx(
            "w-3 h-3 rounded-full transition-colors",
            isDark
              ? "bg-yellow-500 hover:bg-yellow-400"
              : "bg-yellow-500 hover:bg-yellow-600"
          )}
        />
        <button
          onClick={onMaximize}
          className={clsx(
            "w-3 h-3 rounded-full transition-colors",
            isDark
              ? "bg-green-500 hover:bg-green-400"
              : "bg-green-500 hover:bg-green-600"
          )}
        />
      </div>
      {/* Window title */}
      <span
        className={clsx(
          "flex-1 text-center text-xs font-medium",
          isDark ? "text-gray-200" : "text-gray-700"
        )}
      >
        {title}
      </span>
    </div>
  );
}

import { useState, useEffect } from "react";
import ThemeToggle from "../common/ThemeToggle";
import NotificationCenter from "../notifications/NotificationCenter";
import clsx from "clsx";

export default function Navbar({
  isDark,
  onThemeToggle,
}: {
  isDark: boolean;
  onThemeToggle: () => void;
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] =
    useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 right-0 h-7 backdrop-blur-xl flex items-center justify-between px-4 text-sm z-50 app-navbar transition-colors duration-300",
        isDark ? "bg-gray-900/30 text-gray-300" : "bg-white/30 text-gray-900"
      )}
    >
      <div className="font-semibold">Aviraj Paul</div>
      <div className="flex items-center space-x-4">
        <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
        <button
          onClick={() => setIsNotificationCenterOpen(true)}
          className={clsx(
            "hover:bg-opacity-20 px-2 py-0.5 rounded transition-colors",
            isDark ? "hover:bg-white" : "hover:bg-black"
          )}
        >
          {formatDate(currentTime)}
        </button>{" "}
      </div>
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}

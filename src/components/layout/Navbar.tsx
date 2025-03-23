import { useState, useEffect } from "react";
import ThemeToggle from "../common/ThemeToggle";
import NotificationCenter from "../notifications/NotificationCenter";

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
    <div className="fixed top-0 left-0 right-0 h-7 bg-black/20 dark:bg-white/10 backdrop-blur-xl flex items-center justify-between px-4 text-white text-sm z-50 app-navbar">
      <div className="font-semibold">Aviraj Paul</div>
      <div className="flex items-center space-x-4">
        <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
        <button
          onClick={() => setIsNotificationCenterOpen(true)}
          className="hover:bg-gray-200/50 dark:hover:bg-gray-800/50 px-2 py-0.5 rounded"
        >
          {formatDate(currentTime)}
        </button>{" "}
      </div>
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </div>
  );
}

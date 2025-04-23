import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, toZonedTime } from "date-fns-tz";

/**
 * WorldClockWidget component for displaying time in different timezones
 */
export default function WorldClockWidget() {
  const [time, setTime] = useState(new Date());
  const cities = [
    {
      name: "Local",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    { name: "New York", timezone: "America/New_York" },
    { name: "London", timezone: "Europe/London" },
    { name: "Tokyo", timezone: "Asia/Tokyo" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timeZone: string) => {
    try {
      const zonedDate = toZonedTime(date, timeZone);
      return format(zonedDate, "HH:mm", { timeZone });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "??:??";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-gray-800/50 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-100">
        World Clock
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {cities.map((city) => (
          <div key={city.name} className="text-sm">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              {city.name}
            </div>
            <div className="text-gray-500 dark:text-gray-400 font-mono text-base mt-1">
              {formatTime(time, city.timezone)}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

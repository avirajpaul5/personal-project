import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns-tz";
import { AlertTriangle } from "lucide-react";
import { toZonedTime } from "date-fns-tz";

export function WorldClockWidget() {
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
      className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 shadow-lg"
    >
      <h3 className="font-bold mb-3 dark:text-gray-100">World Clock</h3>
      <div className="grid grid-cols-2 gap-3">
        {cities.map((city) => (
          <div key={city.name} className="text-sm">
            <div className="font-medium dark:text-gray-300">{city.name}</div>
            <div className="text-gray-600 dark:text-gray-400">
              {formatTime(time, city.timezone)}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<{
    temp: number;
    condition: string;
    icon: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationError, setLocationError] = useState("");

  const checkLocationPermission = async () => {
    try {
      if (!navigator.permissions) {
        setShowLocationModal(true);
        return;
      }

      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permission.state === "granted") {
        await getWeatherData();
      } else if (permission.state === "prompt") {
        setShowLocationModal(true);
      } else if (permission.state === "denied") {
        setShowLocationModal(true);
      }
    } catch (error) {
      console.error("Permission check failed:", error);
      setShowLocationModal(true);
    }
  };

  const getWeatherData = async (lat?: number, lon?: number) => {
    try {
      if (!lat || !lon) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            getWeatherData(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            setLocationError("Location access denied");
            setShowLocationModal(false);
            setLoading(false);
          }
        );
        return;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
          import.meta.env.VITE_OWM_KEY
        }&units=metric`
      );
      const data = await response.json();

      setWeather({
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        icon: getWeatherIcon(data.weather[0].id),
      });
      setError("");
    } catch (err) {
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (code: number) => {
    if (code >= 200 && code < 300) return "⛈️";
    if (code >= 300 && code < 600) return "🌧️";
    if (code >= 600 && code < 700) return "❄️";
    if (code === 800) return "☀️";
    if (code > 800) return "☁️";
    return "🌤️";
  };

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const handleRetry = () => {
    setError("");
    setLocationError("");
    setLoading(true);
    checkLocationPermission();
  };

  return (
    <>
      <LocationPermissionModal
        isOpen={showLocationModal}
        onAllow={() => {
          setShowLocationModal(false);
          getWeatherData();
        }}
        onDeny={() => {
          setLocationError("Location access required for weather data");
          setShowLocationModal(false);
          setLoading(false);
        }}
      />

      <motion.div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 shadow-lg">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold">Weather</h3>
          {(error || locationError) && (
            <button
              onClick={handleRetry}
              className="text-blue-500 dark:text-blue-400 hover:underline text-sm"
            >
              Retry
            </button>
          )}
        </div>

        {loading ? (
          <div className="animate-pulse">Loading weather...</div>
        ) : error || locationError ? (
          <div className="text-red-500">{error || locationError}</div>
        ) : weather ? (
          <div className="flex items-center space-x-4">
            <span className="text-4xl">{weather.icon}</span>
            <div>
              <div className="text-2xl font-medium">{weather.temp}°C</div>
              <div className="text-gray-600 dark:text-gray-300">
                {weather.condition}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Weather data unavailable</div>
        )}
      </motion.div>
    </>
  );
}

interface LocationPermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

function LocationPermissionModal({
  isOpen,
  onAllow,
  onDeny,
}: LocationPermissionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 text-yellow-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Location Access Required
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    To provide accurate weather information, we need access to
                    your location. You can change this later in your browser
                    settings.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onDeny}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Don't Allow
                </button>
                <button
                  onClick={onAllow}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
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

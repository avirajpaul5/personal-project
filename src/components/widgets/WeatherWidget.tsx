import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LocationPermissionModal from "./LocationPermissionModal";

/**
 * Weather data interface
 */
interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
}

/**
 * WeatherWidget component for displaying current weather
 */
export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationError, setLocationError] = useState("");

  /**
   * Check location permission status
   */
  const checkLocationPermission = async () => {
    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permission.state === "granted") {
        getWeatherData();
      } else if (permission.state === "prompt") {
        setShowLocationModal(true);
      }
    } catch {
      setShowLocationModal(true);
    }
  };

  /**
   * Get current position as a promise
   */
  const getCurrentPosition = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );

  /**
   * Fetch weather data from OpenWeatherMap API
   */
  const getWeatherData = async (lat?: number, lon?: number) => {
    setLoading(true);
    try {
      if (!lat || !lon) {
        const position = await getCurrentPosition();
        lat = position.coords.latitude;
        lon = position.coords.longitude;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
          import.meta.env.VITE_OWM_KEY
        }&units=metric`
      );

      const data = await response.json();

      if (!data.weather || !data.weather.length) {
        throw new Error("Malformed weather data");
      }

      setWeather({
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        icon: getWeatherIcon(data.weather[0].id),
      });
      setError("");
    } catch (err) {
      console.error("Error fetching weather:", err);

      if (err instanceof GeolocationPositionError) {
        if (err.code === 1) {
          setLocationError("Location access denied");
        }
      } else {
        setError("Failed to fetch weather data");
      }

      setShowLocationModal(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get weather icon based on condition code
   */
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

  /**
   * Handle retry button click
   */
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

      <motion.div className="bg-white/70 dark:bg-gray-800/50 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-100">
            Weather
          </h3>
          {(error || locationError) && (
            <button
              onClick={handleRetry}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Retry
            </button>
          )}
        </div>

        {loading ? (
          <div className="animate-pulse text-gray-600 dark:text-gray-300">
            Loading weather...
          </div>
        ) : error || locationError ? (
          <div className="text-red-500 font-medium">
            {error || locationError}
          </div>
        ) : weather ? (
          <div className="flex items-center space-x-5">
            <span className="text-5xl">{weather.icon}</span>
            <div>
              <div className="text-2xl font-medium text-gray-800 dark:text-white">
                {weather.temp}°C
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-1">
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

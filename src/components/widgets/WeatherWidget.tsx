import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LocationPermissionModal from "./LocationPermissionModal";
import {
  MapPin,
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudLightning,
} from "lucide-react";

/**
 * Weather data interface
 */
interface WeatherData {
  temp: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  cityName: string;
  hourlyForecast: HourlyForecast[];
}

interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
}

/**
 * WeatherWidget component for displaying current weather
 */
export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [permissionState, setPermissionState] =
    useState<PermissionState | null>(null);

  /**
   * Check location permission status
   */
  const checkLocationPermission = async () => {
    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      setPermissionState(permission.state);

      if (permission.state === "granted") {
        getWeatherData();
      }
      // We don't automatically show the modal anymore
    } catch (err) {
      console.error("Error checking permission:", err);
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
   * Get weather icon component based on condition code
   */
  const getWeatherIconComponent = (code: number, size = 24) => {
    if (code >= 200 && code < 300)
      return <CloudLightning size={size} className="text-white" />;
    if (code >= 300 && code < 600)
      return <CloudRain size={size} className="text-white" />;
    if (code >= 600 && code < 700)
      return <CloudSnow size={size} className="text-white" />;
    if (code === 800) return <Sun size={size} className="text-white" />;
    if (code > 800) return <Cloud size={size} className="text-white" />;
    return <Cloud size={size} className="text-white" />;
  };

  /**
   * Get weather icon emoji based on condition code
   */
  const getWeatherIcon = (code: number) => {
    if (code >= 200 && code < 300) return "⛈️";
    if (code >= 300 && code < 600) return "🌧️";
    if (code >= 600 && code < 700) return "❄️";
    if (code === 800) return "☀️";
    if (code > 800) return "☁️";
    return "🌤️";
  };

  /**
   * Format time from timestamp
   */
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date
      .toLocaleTimeString([], { hour: "2-digit", hour12: true })
      .toUpperCase();
  };

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

      // Get current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
          import.meta.env.VITE_OWM_KEY
        }&units=imperial`
      );

      const currentData = await currentResponse.json();

      if (!currentData.weather || !currentData.weather.length) {
        throw new Error("Malformed weather data");
      }

      // Get hourly forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${
          import.meta.env.VITE_OWM_KEY
        }&units=imperial&cnt=6`
      );

      const forecastData = await forecastResponse.json();

      if (!forecastData.list || !forecastData.list.length) {
        throw new Error("Malformed forecast data");
      }

      // Process hourly forecast data
      const hourlyForecast = forecastData.list.map((item: any) => ({
        time: formatTime(item.dt),
        temp: Math.round(item.main.temp),
        icon: getWeatherIcon(item.weather[0].id),
      }));

      setWeather({
        temp: Math.round(currentData.main.temp),
        tempMin: Math.round(currentData.main.temp_min),
        tempMax: Math.round(currentData.main.temp_max),
        condition: currentData.weather[0].main,
        icon: getWeatherIcon(currentData.weather[0].id),
        cityName: currentData.name,
        hourlyForecast: hourlyForecast,
      });

      setError("");
    } catch (err) {
      console.error("Error fetching weather:", err);

      if (err instanceof GeolocationPositionError) {
        if (err.code === 1) {
          setLocationError("Location access denied");
          // Only show the modal if the user explicitly denied permission
          setShowLocationModal(true);
        }
      } else {
        setError("Failed to fetch weather data");
      }
    } finally {
      setLoading(false);
    }
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
    checkLocationPermission();
  };

  /**
   * Handle location permission request
   */
  const handleRequestLocation = () => {
    // This will trigger the browser's native permission dialog
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success callback
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherData(lat, lon);
        setPermissionState("granted");
      },
      (err) => {
        // Error callback
        console.error("Geolocation error:", err);
        if (err.code === 1) {
          // Permission denied
          setLocationError("Location access denied");
          setShowLocationModal(true);
        } else {
          setError("Failed to get location");
        }
      }
    );
  };

  return (
    <>
      <LocationPermissionModal
        isOpen={showLocationModal}
        onAllow={() => {
          setShowLocationModal(false);
          handleRequestLocation();
        }}
        onDeny={() => {
          setLocationError("Location access required for weather data");
          setShowLocationModal(false);
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800/50 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-100">
          Weather
        </h3>

        {loading ? (
          <div className="animate-pulse text-gray-600 dark:text-gray-300">
            Loading weather...
          </div>
        ) : permissionState === "granted" && weather ? (
          <div className="rounded-xl overflow-hidden">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 text-white rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin size={16} className="text-white" />
                    <span className="font-medium">{weather.cityName}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-6xl font-light">{weather.temp}°</span>
                    <div className="ml-4 mt-2">
                      <div className="text-lg">{weather.condition}</div>
                      <div className="text-sm">
                        H:{weather.tempMax}° L:{weather.tempMin}°
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-1">
                  {getWeatherIconComponent(
                    weather.condition === "Clear"
                      ? 800
                      : weather.condition === "Clouds"
                      ? 801
                      : weather.condition === "Rain"
                      ? 500
                      : weather.condition === "Snow"
                      ? 600
                      : weather.condition === "Thunderstorm"
                      ? 200
                      : 800,
                    36
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/20">
                <div className="flex justify-between">
                  {weather.hourlyForecast.map((hour, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-xs">{hour.time}</div>
                      <div className="my-1">
                        {getWeatherIconComponent(
                          hour.icon === "⛈️"
                            ? 200
                            : hour.icon === "🌧️"
                            ? 500
                            : hour.icon === "❄️"
                            ? 600
                            : hour.icon === "☀️"
                            ? 800
                            : 801,
                          20
                        )}
                      </div>
                      <div className="text-sm">{hour.temp}°</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : permissionState === "denied" || error || locationError ? (
          <div className="text-center py-2">
            <div className="text-red-500 font-medium mb-3">
              {error || locationError || "Location access denied"}
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="text-center py-3">
            <div className="text-gray-600 dark:text-gray-300 mb-4">
              Enable location access to see your local weather
            </div>
            <button
              onClick={handleRequestLocation}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium mx-auto"
            >
              <MapPin className="w-4 h-4" />
              <span>Enable Location</span>
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}

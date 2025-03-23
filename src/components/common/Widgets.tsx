import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns-tz";
import { AlertTriangle } from "lucide-react";

export function WorldClockWidget() {
  const [time, setTime] = useState(new Date());
  const cities = [
    { name: "Local", timezone: undefined },
    { name: "New York", timezone: "America/New_York" },
    { name: "London", timezone: "Europe/London" },
    { name: "Tokyo", timezone: "Asia/Tokyo" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 shadow-lg"
    >
      <h3 className="font-bold mb-3">World Clock</h3>
      <div className="grid grid-cols-2 gap-3">
        {cities.map((city) => (
          <div key={city.name} className="text-sm">
            <div className="font-medium">{city.name}</div>
            <div className="text-gray-600 dark:text-gray-300">
              {format(time, "HH:mm", {
                timeZone: city.timezone,
              })}
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

export function MusicWidget() {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Spotify.Track | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "connecting" | "ready">("idle");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize Spotify SDK
  useEffect(() => {
    const initializePlayer = async () => {
      const token = localStorage.getItem("spotify_token");
      if (!token) return;

      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      script.onload = () => {
        const player = new window.Spotify.Player({
          name: "Portfolio OS Player",
          getOAuthToken: (cb) => cb(token),
          volume: 0.5,
        });

        player.addListener("ready", ({ device_id }) => {
          console.log("Device ID:", device_id);
          setDeviceId(device_id);
          setStatus("ready");
        });

        player.addListener("player_state_changed", (state) => {
          setCurrentTrack(state?.track_window.current_track || null);
        });

        player.addListener("initialization_error", ({ message }) => {
          console.error("Initialization Error:", message);
        });

        player.connect().then((success) => {
          if (success) {
            console.log("Connected to Spotify");
            setStatus("connecting");
          }
        });

        setPlayer(player);
      };

      document.body.appendChild(script);
    };

    if (localStorage.getItem("spotify_token")) {
      initializePlayer();
    }
  }, []);

  // Handle Spotify authentication
  const handleLogin = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = encodeURIComponent(window.location.origin);
    const scopes = encodeURIComponent("streaming user-read-playback-state");

    window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
  };

  // Check for access token in URL
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken) {
      localStorage.setItem("spotify_token", accessToken);
      setIsAuthenticated(true);
      window.history.pushState({}, document.title, window.location.pathname);
    }
  }, []);

  // Transfer playback to web player
  const transferPlayback = async () => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("spotify_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: true,
        }),
      });

      if (response.status === 202) {
        console.log("Playback transfer initiated");
        // Wait for player state update
        setTimeout(() => player?.resume(), 1000);
      } else {
        console.error("Transfer failed:", await response.text());
      }
    } catch (error) {
      console.error("Transfer error:", error);
    }
  };

  const togglePlayback = async () => {
    if (player) {
      player.togglePlay();
    }
  };

  return (
    <motion.div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 shadow-lg">
      <h3 className="font-bold mb-3">Now Playing</h3>
      {localStorage.getItem("spotify_token") ? (
        currentTrack ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={currentTrack.album.images[0]?.url}
                className="w-12 h-12 rounded"
                alt="Album cover"
              />
              <div>
                <div className="font-medium">{currentTrack.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {currentTrack.artists.map((artist) => artist.name).join(", ")}
                </div>
              </div>
            </div>
            <button
              onClick={togglePlayback}
              className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center"
            >
              ▶️
            </button>
          </div>
        ) : (
          <div className="text-gray-500">
            <button
              onClick={transferPlayback}
              className="text-blue-500 hover:underline"
            >
              Transfer playback to this device
            </button>
          </div>
        )
      ) : (
        <button
          onClick={handleLogin}
          className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
        >
          Connect Spotify
        </button>
      )}
    </motion.div>
  );
}

export function QuoteWidget() {
  const quotes = [
    "Hi! I'm a passionate developer who loves creating beautiful interfaces.",
    "I believe in writing clean, maintainable code that scales.",
    "When I'm not coding, you can find me exploring new technologies.",
  ];
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 shadow-lg"
    >
      <h3 className="font-bold mb-3">Quote of the Day</h3>
      <p className="text-gray-600 dark:text-gray-300">{quote}</p>
    </motion.div>
  );
}

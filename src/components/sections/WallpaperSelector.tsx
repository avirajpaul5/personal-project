import { useState, useRef, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

// Additional wallpapers beyond the default light/dark ones
const additionalWallpapers = [
  "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2000')",
  "url('https://images.unsplash.com/photo-1502239608882-93b729c6af43?q=80&w=2000')",
  "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000')",
  "url('https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2000')",
];

export default function WallpaperSelector() {
  const { isDark, backgrounds, currentWallpaper, setWallpaper } = useTheme();
  const [customWallpaper, setCustomWallpaper] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Combine default and additional wallpapers
  const allWallpapers = [backgrounds.light, backgrounds.dark, ...additionalWallpapers];
  
  // If there's a custom wallpaper, add it to the list
  const displayWallpapers = customWallpaper 
    ? [customWallpaper, ...allWallpapers]
    : allWallpapers;

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const wallpaperUrl = `url('${event.target.result}')`;
          setCustomWallpaper(wallpaperUrl);
          setWallpaper(wallpaperUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const wallpaperUrl = `url('${event.target.result}')`;
          setCustomWallpaper(wallpaperUrl);
          setWallpaper(wallpaperUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [setWallpaper]);

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className={clsx("text-xl font-semibold mb-4", isDark ? "text-white" : "text-gray-800")}>
        Select Wallpaper
      </h2>
      
      {/* Drag & Drop Area */}
      <div 
        ref={dropAreaRef}
        className={clsx(
          "border-2 border-dashed rounded-lg p-6 mb-6 text-center cursor-pointer transition-colors",
          isDragging 
            ? (isDark ? "border-blue-400 bg-blue-900/20" : "border-blue-400 bg-blue-100/50") 
            : (isDark ? "border-gray-600 hover:border-gray-500" : "border-gray-300 hover:border-gray-400"),
        )}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className={clsx("w-10 h-10 mx-auto mb-2", isDark ? "text-gray-400" : "text-gray-500")} />
        <p className={isDark ? "text-gray-300" : "text-gray-600"}>
          Drag & drop an image here, or click to select
        </p>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
      </div>
      
      {/* Wallpaper Grid */}
      <div className="grid grid-cols-2 gap-4 overflow-y-auto flex-grow">
        {displayWallpapers.map((wallpaper, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(
              "relative h-32 rounded-lg overflow-hidden cursor-pointer",
              "border-2",
              currentWallpaper === wallpaper 
                ? (isDark ? "border-blue-500" : "border-blue-600") 
                : (isDark ? "border-gray-700" : "border-gray-200")
            )}
            onClick={() => setWallpaper(wallpaper)}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: wallpaper }}
            />
            {currentWallpaper === wallpaper && (
              <div className={clsx(
                "absolute inset-0 flex items-center justify-center",
                isDark ? "bg-blue-900/30" : "bg-blue-500/20"
              )}>
                <div className={clsx(
                  "w-4 h-4 rounded-full",
                  isDark ? "bg-blue-400" : "bg-blue-600"
                )} />
              </div>
            )}
            {index === 0 && customWallpaper && (
              <div className="absolute bottom-1 left-1 right-1 text-center text-xs bg-black/50 text-white rounded py-0.5">
                Custom
              </div>
            )}
            {index === 0 && !customWallpaper && (
              <div className="absolute bottom-1 left-1 right-1 text-center text-xs bg-black/50 text-white rounded py-0.5">
                Light
              </div>
            )}
            {index === 1 && !customWallpaper && (
              <div className="absolute bottom-1 left-1 right-1 text-center text-xs bg-black/50 text-white rounded py-0.5">
                Dark
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

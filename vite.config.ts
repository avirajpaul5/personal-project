import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { splitVendorChunkPlugin } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and related packages into a separate chunk
          "react-vendor": ["react", "react-dom"],
          // Split Framer Motion into its own chunk
          "framer-motion": ["framer-motion"],
          // Split other UI libraries
          "ui-libs": ["sonner", "clsx", "cmdk", "react-rnd"],
          // Split date utilities
          "date-utils": ["date-fns", "date-fns-tz"],
        },
      },
    },
    // Increase the warning limit to avoid warnings for reasonable chunk sizes
    chunkSizeWarningLimit: 800,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Removing splitVendorChunkPlugin as it's not compatible with manualChunks function
// import { splitVendorChunkPlugin } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // Removed splitVendorChunkPlugin
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React and related packages
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "react-vendor";
          }

          // Framer Motion
          if (id.includes("node_modules/framer-motion")) {
            return "framer-motion";
          }

          // UI libraries
          if (
            id.includes("node_modules/sonner") ||
            id.includes("node_modules/clsx") ||
            id.includes("node_modules/cmdk") ||
            id.includes("node_modules/react-rnd")
          ) {
            return "ui-libs";
          }

          // Date utilities
          if (id.includes("node_modules/date-fns")) {
            return "date-utils";
          }

          // Other vendor packages will be automatically chunked by Vite
        },
      },
    },
    // Increase the warning limit to avoid warnings for reasonable chunk sizes
    chunkSizeWarningLimit: 800,
  },
});

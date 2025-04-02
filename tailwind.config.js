export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "mac-window": "rgba(255, 255, 255, 0.9)",
        "mac-border": "rgba(0, 0, 0, 0.2)",
      },
      gray: {
        800: "#1f2937",
        900: "#111827",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

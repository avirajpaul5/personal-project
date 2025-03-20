export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mac-window': 'rgba(255, 255, 255, 0.9)',
        'mac-border': 'rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
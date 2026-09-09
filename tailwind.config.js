/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8B6AAC",
          foreground: "#ffffff",
          soft: "#DDD0F1",
          deep: "#6B4F8A",
        },
        canvas: "#FBF7F2",
        forest: "#2F4F3E",
      },
      fontFamily: {
        arabic: ["Tajawal", "Segoe UI", "Tahoma", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(107, 79, 138, 0.25)",
      },
    },
  },
  plugins: [],
};

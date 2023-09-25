/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "gray-85": "#242424",
        "gray-90": "#1e1e1e",
        "gray-95": "#141414",
        "gray-100": "#121212",
      },
    },
  },
  plugins: [],
};

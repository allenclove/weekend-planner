/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Minimalist palette
        primary: '#000000',
        secondary: '#666666',
        tertiary: '#999999',
        bg: '#FFFFFF',
        'bg-secondary': '#F5F5F5',
        border: '#E0E0E0',
      }
    },
  },
  plugins: [],
}

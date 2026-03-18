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
        // Semantic colors (minimal use)
        success: '#22c55e',
      },
      spacing: {
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px
        'md': '1rem',      // 16px
        'lg': '1.5rem',    // 24px
        'xl': '2rem',      // 32px
      },
      borderRadius: {
        'sm': '0.25rem',   // 4px - small elements
        'md': '0.5rem',    // 8px - cards
        'lg': '1rem',      // 16px - modals
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },
    },
  },
  plugins: [],
}

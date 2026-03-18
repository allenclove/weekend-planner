/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    // Card background colors
    'bg-blue-100', 'bg-purple-100', 'bg-green-100', 'bg-orange-100', 'bg-pink-100',
    'bg-blue-200', 'bg-purple-200', 'bg-green-200', 'bg-orange-200', 'bg-pink-200',
    'bg-blue-300', 'bg-purple-300', 'bg-green-300', 'bg-orange-300', 'bg-pink-300',
    // Card border colors
    'border-blue-300', 'border-purple-300', 'border-green-300', 'border-orange-300', 'border-pink-300',
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

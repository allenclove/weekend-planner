/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom gradient colors for categories
        'category-work': {
          start: '#667eea',
          end: '#764ba2'
        },
        'category-entertainment': {
          start: '#f093fb',
          end: '#f5576c'
        },
        'category-exercise': {
          start: '#4facfe',
          end: '#00f2fe'
        },
        'category-learning': {
          start: '#43e97b',
          end: '#38f9d7'
        },
        'category-social': {
          start: '#fa709a',
          end: '#fee140'
        },
        'category-rest': {
          start: '#a8edea',
          end: '#fed6e3'
        },
        // Priority gradient colors
        'priority-high': {
          start: '#ff6b6b',
          end: '#ee5a6f'
        },
        'priority-medium': {
          start: '#feca57',
          end: '#ff9ff3'
        },
        'priority-low': {
          start: '#48dbfb',
          end: '#0abde3'
        }
      },
      backgroundImage: {
        'gradient-work': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-entertainment': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-exercise': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-learning': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'gradient-social': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'gradient-rest': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'gradient-high': 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
        'gradient-medium': 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)',
        'gradient-low': 'linear-gradient(135deg, #48dbfb 0%, #0abde3 100%)'
      }
    },
  },
  plugins: [],
}

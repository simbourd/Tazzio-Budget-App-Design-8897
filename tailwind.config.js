/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#F7F3E9',
        moka: '#8B4513',
        cappuccino: '#D2B48C',
        caramel: '#C8860D',
        beige: '#F5F5DC',
        sage: '#9CAF88',
        terracotta: '#E07A5F',
        'coffee-dark': '#3C2414',
        'coffee-light': '#F2E7D5',
        'latte': '#E6D5C3',
        'espresso': '#5D4037',
        'foam': '#FFFBF5'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'coffee': '0 4px 20px rgba(139, 69, 19, 0.1)',
      }
    },
  },
  plugins: [],
}
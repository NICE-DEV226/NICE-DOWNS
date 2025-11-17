/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary-blue': '#2563eb',
        'primary-indigo': '#4f46e5',
        'accent-emerald': '#10b981',
        'accent-orange': '#f59e0b',
        'light-gray': '#f8fafc',
        'medium-gray': '#e2e8f0',
      },
      animation: {
        'subtle-glow': 'subtle-glow 2s ease-in-out infinite',
        'gentle-float': 'gentle-float 3s ease-in-out infinite',
      },
      keyframes: {
        'subtle-glow': {
          '0%': { boxShadow: '0 0 0 0 rgba(37, 99, 235, 0.1)' },
          '100%': { boxShadow: '0 0 0 8px rgba(37, 99, 235, 0)' },
        },
        'gentle-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        glass: "rgba(255, 255, 255, 0.08)",
        "glass-border": "rgba(255, 255, 255, 0.15)",
        "glass-dark": "rgba(0, 0, 0, 0.25)",
        "glass-dark-border": "rgba(255, 255, 255, 0.05)",
      },
      backdropBlur: {
        xs: "2px",
        md: "12px",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

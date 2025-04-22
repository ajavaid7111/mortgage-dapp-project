/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00FFFF',
        'neon-purple': '#BC00FE',
        'neon-pink': '#FF00FF',
        'dark-bg': '#0D1117', // GitHub dark background
        'dark-card': '#161B22', // GitHub dark card background
        'dark-border': '#30363d', // GitHub dark border
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 5s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF',
        'neon-purple': '0 0 5px #BC00FE, 0 0 10px #BC00FE, 0 0 15px #BC00FE',
      },
      backgroundImage: {
        'glass': 'linear-gradient(rgba(22, 27, 34, 0.8), rgba(22, 27, 34, 0.8))', // Semi-transparent dark card bg
      },
    },
  },
  plugins: [],
}


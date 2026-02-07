/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'apna-bg': 'rgba(238,231,213,255)',
        'apna-orange': '#F26B2A',
        'apna-blue': '#4A70B0',
        'apna-yellow': '#FFC107',
        'apna-whatsapp': '#25D366',
      },
      fontFamily: {
        'handwriting': ['Dancing Script', 'cursive'],
        'sans': ['Poppins', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-apna': 'linear-gradient(135deg, rgba(255, 248, 220, 0.8) 0%, rgba(230, 240, 250, 0.8) 100%)',
      },
      animation: {
        'scroll': 'scroll 17s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      }
    },
  },
  plugins: [],
} 
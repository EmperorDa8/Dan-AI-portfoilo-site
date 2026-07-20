/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif']
      },
      colors: {
        primary: '#6b4cff',
        secondary: '#ff4c8b',
        cardDark: '#0f0f10',
        borderDark: '#2a2a2c',
        textMuted: '#a8a8ad',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

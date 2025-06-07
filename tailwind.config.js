/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",             // Adicione este para garantir
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hl-dark': '#072723',
        'hl-dark-mid': '#0e4a40',
        'hl-accent': '#97fbe3',
        'hl-accent-light': '#c9fdf0',
        'success': '#00c853',
        'warning': '#ffd600',
        'error': '#ff3d00',
        'info': '#2196f3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 8px 16px rgba(7, 39, 35, 0.2)',
        'button': '0 4px 8px rgba(151, 251, 227, 0.3)',
      },
    },
  },
  plugins: [],
}

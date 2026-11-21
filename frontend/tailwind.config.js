/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          nav: '#202020',
          'nav-border': '#48779E',
          bg: '#EAF1F7',
          card: '#FFFFFF',
          'card-border': '#A8B9C8',
          primary: '#48779E',
          'primary-hover': '#3A6486',
          text: '#202020',
          meta: '#A8B9C8',
        }
      },
      fontFamily: {
        brand: ['Cinzel', 'Georgia', 'serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}

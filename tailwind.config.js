/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
            "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "barco": "#f1de2c"
      },
      fontFamily: {
        helveticaB: ["helvetica-bold", "sans-serif"],
        helveticaR: ["helvetica-roman", "sans-serif"],
        helveticaL: ["helvetica-light", "sans-serif"],
      }

    },
    screens:{
      'sm': '360px',
      'md': '768px',
      'tablet': "1080px",
      'lg': '1920px'
    },
  },
  plugins: [],
}

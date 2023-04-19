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
      'hd': "1280px",
      'lg': '1920px',
      'hlg': {'raw': '(max-height: 1030px)'},
      'hhd': {'raw': '(max-height: 930px)'},
      'hmd': {'raw': '(max-height: 888px)'},
      'hsm': {'raw': '(max-height: 833px)'},
      'hss': {'raw': '(max-height: 810px)'},
    },
  },
  plugins: [],
}

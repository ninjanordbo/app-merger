/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./views/**/*.vue",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./utils/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
    "./assets/css/*.scss",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#88B56B",
          300: "#86efac",
          400: "#4ade80",
          500: "#89b56b",
          700: "#15803d",
          800: "#3d5a4a",
        },
        secondary: {
          400: "#3F6844",
        },
        "dark-blue": {
          DEFAULT: "#28292E",
        },
        neutral: {
          50: "#F7F9FC",
          100: "#E8ECF2",
          200: "#DADDE5",
          300: "#BEC2CC",
          400: "#A1A7B3",
          500: "#858C99",
          600: "#6C7380",
          700: "#555A66",
          800: "#3D424D",
          900: "#262B33",
          950: "#11141A",
        },
        gray: {
          DEFAULT: "#303030",
          input: "#edeff2",
          light: "#555A66",
        },
        error: {
          300: "#FF6666",
          500: "#FF0000",
        },
        warning: {
          400: "#FFC81A",
          600: "#E5AF00",
        },
        success: {
          400: "#33FF99",
          600: "#00CC66",
        },
      },
      boxShadow: {
        "btn-primary":
          "0px 1px 2px rgba(27, 28, 29, 0.48), 0px 0px 0px 1px #242628",
        "btn-secondary":
          "0px 1px 3px rgba(14, 18, 27, 0.12), 0px 0px 0px 1px #E1E4EA",
        nav: "0px 3px 10px 0px rgba(0, 0, 0, 0.05)",
      },
      minHeight: {
        15: "3.75rem", // 60px
      },
    },
    screens: {
      xxs: "380px",
      xs: "480px",
      sm: "640px",
      md: "720px",
      lg: "1024px",
      xl: "1280px",
      "1.5xl": "1600px",
      "2xl": "1920px",
    },
  },
};

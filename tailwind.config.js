/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      main: ["Nunito", "sans-serif"],
      primary: ["Nunito", "sans-serif"],
      secondary: ["Open Sans", "sans-serif"],
    },
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: true,
    darkTheme: "halloween",
    base: true,
    styled: true,
    utils: true,
    rtl: false,
    prefix: "",
    logs: true,
  },
};

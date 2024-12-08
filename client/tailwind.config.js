/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(216, 14%, 7%)",
        primaryLight: "hsl(0, 0%, 14%)",
        primaryTransparent: "hsl(216, 14%, 7%,.7)",
        // gray: "hsl(0, 0%, 12%)",
        secondary: "hsl(0, 0%, 100%)",
        secondaryDim: "hsl(0, 0%, 100%, .9)",
        accent: "hsl(210, 100%, 41%)",
        green: "hsl(105, 100%, 52%)",
        greenTransparent: "hsl(105, 100%, 52%, .8)",
        blue: "hsl(235, 100%, 52%)",
        blueTransparent: "hsl(235, 100%, 52%, .8)",
      },
      spacing: {
        paddingX: "var(--paddingX)",
        menuHeight: "var(--menuHeight)",
      },
      screens: {
        mobilesm: "0px",
        mobile: "480px",
      },
    },
  },
  plugins: [],
};

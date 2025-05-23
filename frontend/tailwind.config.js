/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        typography: {
          50: "#FDFDFD",
          100: "#F7F7F7",
          200: "#D4D4D8",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D2D6DB",
          400: "#9DA4AE",
          500: "#6C737F",
          600: "#4D5761",
          700: "#384250",
          800: "#1F2A37",
          900: "#111927",
        },
        primary: {
          50: "#F9F5FF",
          100: "#C6D4F1",
          200: "#A0B6EA",
          300: "#7896E4",
          400: "#4F73DF",
          500: "#254EDB",
          600: "#2145BF",
          700: "#1C3BA4",
          800: "#183188",
          900: "#13286D",
        },
        success: {
          50: "#EDFCF2",
          100: "#D3F8DF",
          200: "#AAF0C4",
          300: "#73E2A3",
          400: "#3CCB7F",
          500: "#16B364",
          600: "#099250",
          700: "#087443",
          800: "#095C37",
          900: "#084C2E",
        },
        info: {
          50: "#EFF8FF",
          100: "#D1E9FF",
          200: "#B2DDFF",
          300: "#84CAFF",
          400: "#53B1FD",
          500: "#2E90FA",
          600: "#1570EF",
          700: "#175CD3",
          800: "#1849A9",
          900: "#194185",
        },
        warning: {
          50: "#FEF6EE",
          100: "#FDEAD7",
          200: "#FECDCA",
          300: "#FDA29B",
          400: "#F97066",
          500: "#F04438",
          600: "#D92D20",
          700: "#B42318",
          800: "#912018",
          900: "#7A271A",
        },
        dark: {
          50: "#FCFCFD",
          100: "#F2F4F7",
          200: "#E4E7EC",
          300: "#D0D5DD",
          400: "#98A2B3",
          500: "#667085",
          600: "#475467",
          700: "#344054",
          800: "#1D2939",
          900: "#101828",
        },
      },
    },
  },
  plugins: [],
};

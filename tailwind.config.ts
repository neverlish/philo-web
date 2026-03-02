import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ec5b13",
          dark: "#c44d0f",
        },
        background: "#F9F7F2",
        foreground: "#2C2420",
        muted: "#6B5F56",
        card: "#ffffff",
        border: "#e7e5e4",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

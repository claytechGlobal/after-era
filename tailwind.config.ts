import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#121110",
        paper: "#fbf8f3",
        stone: "#f1ebe3",
        line: "#e4ddd2",
        gold: "#c49a4a",
        "gold-deep": "#8d6a28"
      },
      fontFamily: {
        head: ["var(--font-archivo)", "sans-serif"],
        display: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"]
      },
      letterSpacing: {
        tr1: "0.14em",
        tr2: "0.22em"
      }
    }
  },
  plugins: []
};

export default config;

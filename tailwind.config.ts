import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "tradeflow-dark": "#0a0a0f",
        "tradeflow-secondary": "#12121a",
        "tradeflow-muted": "#2a2a3a",
        "tradeflow-accent": "#3b82f6",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};

export default config;

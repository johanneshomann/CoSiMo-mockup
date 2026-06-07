import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        brand: ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;

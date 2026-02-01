import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pressStart: ['"Press Start 2P"', "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;

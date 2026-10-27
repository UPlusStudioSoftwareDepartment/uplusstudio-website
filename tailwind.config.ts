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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          orange: "#c45c3e",
          charcoal: "#0f0f0f",
          sage: "#5c6b5a",
          cream: "#faf8f5",
        },
      },
      backgroundImage: {
        'gradient-to-r': 'linear-gradient(to right, var(--tw-linear-stops))',
      },
    },
    animation: {
      blob: "blob 7s infinite",
      "slow-zoom": "slow-zoom 20s linear infinite alternate",
      "fade-in": "fade-in 1s ease-out forwards",
      "slide-in": "slide-in 1s ease-out forwards",
      wave: "wave 0.6s ease-in-out 1",
    },
    keyframes: {
      wave: {
        "0%, 100%": { transform: "scale(1)" },
        "50%": { transform: "scale(1.02)" },
      },
      blob: {
        "0%": {
          transform: "translate(0px, 0px) scale(1)",
        },
        "33%": {
          transform: "translate(30px, -50px) scale(1.1)",
        },
        "66%": {
          transform: "translate(-20px, 20px) scale(0.9)",
        },
        "100%": {
          transform: "tranlate(0px, 0px) scale(1)",
        },
      },
      "slow-zoom": {
        "0%": { transform: "scale(1)" },
        "100%": { transform: "scale(1.1)" },
      },
      "fade-in": {
        "0%": { opacity: "0", transform: "translateY(10px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
      "slide-in": {
        "0%": { transform: "translateX(-20px)", opacity: "0" },
        "100%": { transform: "translateX(0)", opacity: "1" },
      },
    },
  },
  plugins: [],
};
export default config;

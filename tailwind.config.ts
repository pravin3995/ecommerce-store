import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          DEFAULT: "#0d1b2e",
          800: "#132540",
          900: "#0a1522",
        },
        gold: {
          DEFAULT: "#fed980",
          600: "#e8b94f",
        },
        accent: {
          DEFAULT: "#ff4001",
          600: "#e23900",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 30px rgba(13,27,46,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;

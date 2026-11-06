import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
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
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          50: "#EEF3FF",
          100: "#DDE7FE",
          500: "#315CFD",
          600: "#224AD8",
          700: "#1A3AB5",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          50: "#F2F0FF",
          500: "#6C63FF",
          600: "#554BE8",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        success: {
          DEFAULT: "#16A36A",
          50: "#EDFBF4",
          100: "#D1F5E3",
          600: "#128254",
        },
        warning: {
          DEFAULT: "#E9A23B",
          50: "#FEF8EC",
          100: "#FCEFD3",
          600: "#C68428",
        },
        danger: {
          DEFAULT: "#E5484D",
          50: "#FEF2F2",
          100: "#FDE2E2",
          600: "#C93439",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(23, 32, 51, 0.05)",
        card: "0 2px 12px -2px rgba(23, 32, 51, 0.06), 0 1px 3px 0 rgba(23, 32, 51, 0.04)",
        dropdown: "0 10px 25px -5px rgba(23, 32, 51, 0.1), 0 8px 10px -6px rgba(23, 32, 51, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;


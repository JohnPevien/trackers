import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // Vercel-ish neutrals. Surfaces layer on near-black, borders are subtle.
        background: "oklch(0.145 0 0)", // #0a0a0a-ish, the page background
        foreground: "oklch(0.985 0 0)", // near-white text
        card: {
          DEFAULT: "oklch(0.18 0 0)", // surface, slightly lighter than background
          foreground: "oklch(0.985 0 0)",
        },
        popover: {
          DEFAULT: "oklch(0.18 0 0)",
          foreground: "oklch(0.985 0 0)",
        },
        primary: {
          DEFAULT: "oklch(0.985 0 0)", // primary button is white-on-dark
          foreground: "oklch(0.145 0 0)",
        },
        secondary: {
          DEFAULT: "oklch(0.25 0 0)", // subtle button bg
          foreground: "oklch(0.985 0 0)",
        },
        muted: {
          DEFAULT: "oklch(0.22 0 0)",
          foreground: "oklch(0.65 0 0)", // dimmer text
        },
        accent: {
          DEFAULT: "oklch(0.25 0 0)",
          foreground: "oklch(0.985 0 0)",
        },
        destructive: {
          DEFAULT: "oklch(0.55 0.2 25)", // muted red, not screaming
          foreground: "oklch(0.985 0 0)",
        },
        border: "oklch(1 0 0 / 10%)", // subtle white-alpha border
        input: "oklch(1 0 0 / 12%)",
        ring: "oklch(0.65 0 0)", // focus ring
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
    },
  },
  plugins: [],
};

export default config;

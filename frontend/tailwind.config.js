/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        line: "var(--color-line)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        signal: "var(--color-signal)",
        drop: "var(--color-drop)",
        rise: "var(--color-rise)",
        warn: "var(--color-warn)",
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', '"JetBrains Mono"', "monospace"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        md: "10px",
        lg: "16px",
      },
      boxShadow: {
        spotlight: "0 0 40px -10px var(--color-line)",
        glow: "0 0 24px -4px var(--color-signal)",
      },
    },
  },
  plugins: [],
};
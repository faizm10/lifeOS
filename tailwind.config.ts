import type { Config } from "tailwindcss";

// LifeOS — Personal Almanac palette.
// All values use oklch() to match the design exploration.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper:     "oklch(0.965 0.014 85)",
        "paper-2": "oklch(0.945 0.020 85)",
        surface:   "oklch(0.985 0.008 85)",
        "surface-2": "oklch(0.93 0.020 80)",
        "surface-3": "oklch(0.90 0.022 80)",

        rule:        "oklch(0.66 0.025 70)",
        "rule-soft": "oklch(0.85 0.022 75)",
        "rule-strong": "oklch(0.50 0.028 65)",

        ink:    "oklch(0.22 0.018 65)",
        "ink-2": "oklch(0.38 0.020 65)",
        "ink-3": "oklch(0.52 0.022 68)",
        "ink-4": "oklch(0.68 0.020 72)",

        accent:        "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        "accent-fg":   "var(--accent-fg)",

        pos:  "oklch(0.46 0.13 145)",
        neg:  "oklch(0.48 0.17 28)",
        warn: "oklch(0.55 0.13 65)",

        "warm-bg":      "oklch(0.955 0.022 75)",
        "warm-surface": "oklch(0.975 0.018 75)",
      },
      fontFamily: {
        sans:  ["Geist", "Inter", "ui-sans-serif", "system-ui"],
        serif: ['"Instrument Serif"', '"Iowan Old Style"', "Georgia", "serif"],
        mono:  ["Geist Mono", '"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "1px",
        lg: "3px",
      },
      letterSpacing: {
        widest2: "0.18em",
      },
    },
  },
  plugins: [],
};

export default config;

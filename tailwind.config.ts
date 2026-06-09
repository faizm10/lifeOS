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
        base: "#0a0e14",
        panel: "#0d1117",
        elevated: "#161b22",
        hairline: "#21262d",
        ink: "#c9d1d9",
        muted: "#8b949e",
        dim: "#484f58",
        accent: {
          DEFAULT: "#f0a020",
          dim: "#b87d18",
        },
        link: "#39c5cf",
        danger: "#f85149",
        success: "#3fb950",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        grid: "radial-gradient(circle, #21262d 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

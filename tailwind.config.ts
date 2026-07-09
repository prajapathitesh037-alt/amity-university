import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        stone: "var(--stone)",
        gold: "var(--gold)",
        maroon: "var(--maroon)",
        ink: "var(--ink)",
        "muted-ink": "var(--muted-ink)",
        sky: "var(--sky)",
        night: "var(--night)",
        "amber-night": "var(--amber-night)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
      },
      fontSize: {
        hero: ["clamp(3.5rem, 9vw, 9.5rem)", { lineHeight: "0.88", letterSpacing: "-0.04em" }],
        "hero-sub": ["clamp(1.1rem, 2.2vw, 1.75rem)", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        "section-title": ["clamp(2.25rem, 5.5vw, 5.5rem)", { lineHeight: "0.92", letterSpacing: "-0.03em" }],
        "section-body": ["clamp(1rem, 1.4vw, 1.2rem)", { lineHeight: "1.65", letterSpacing: "-0.01em" }],
      },
      transitionTimingFunction: {
        amity: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "amity-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;

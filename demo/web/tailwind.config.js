/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Sans"', "system-ui", "sans-serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        void: {
          DEFAULT: "#09090B",
          raised: "#111113",
          surface: "#18181B",
          inset: "#1C1C1F",
        },
        mem: {
          gold: "#0090FF",
          "gold-dim": "#0078D4",
          mint: "#22C997",
          "mint-dim": "#12A67A",
          frost: "#FAFAFA",
          muted: "#A1A1AA",
          line: "rgba(255,255,255,0.08)",
          "line-strong": "rgba(255,255,255,0.14)",
        },
        fil: {
          blue: "#0090FF",
          "blue-bright": "#4DB8FF",
          navy: "#09090B",
          slate: "#27272A",
        },
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.45)",
        "card-hover": "0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 32px -12px rgba(0,0,0,0.5)",
      },
      borderRadius: {
        "4xl": "1.25rem",
        "5xl": "1.5rem",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

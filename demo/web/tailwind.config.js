/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', "system-ui", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        void: {
          DEFAULT: "#020306",
          raised: "#080B10",
          surface: "#0E1219",
          inset: "#141A24",
        },
        mem: {
          gold: "#E3B341",
          "gold-dim": "#B8922A",
          mint: "#1DE9B6",
          "mint-dim": "#12B894",
          frost: "#E8EDF5",
          muted: "#7A8494",
          line: "rgba(255,255,255,0.06)",
          "line-strong": "rgba(255,255,255,0.12)",
        },
      },
      boxShadow: {
        bezel:
          "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.4), 0 24px 48px -12px rgba(0,0,0,0.55)",
        "bezel-inner": "inset 0 1px 1px rgba(255,255,255,0.06)",
        glow: "0 0 60px rgba(227,179,65,0.15)",
        "glow-mint": "0 0 48px rgba(29,233,182,0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-ring": "pulse-ring 3s ease-in-out infinite",
        "flow-dash": "flow-dash 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-ring": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "flow-dash": {
          to: { strokeDashoffset: "-20" },
        },
      },
    },
  },
  plugins: [],
};

import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', '"Noto Sans Georgian Variable"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        tier: { H: "#EF4444", P: "#F59E0B", D: "#94A3B8" },
        room: {
          occupied: "#6366F1",
          dirty: "#EF4444",
          clean: "#22C55E",
          inspected: "#3B82F6",
          ooo: "#111827",
          oos: "#A855F7",
        },
        // Theme tokens live in globals.css as RGB channels so opacity modifiers (bg-os-panel/90) work.
        os: {
          bg: "rgb(var(--os-bg) / <alpha-value>)",
          panel: "rgb(var(--os-panel) / <alpha-value>)",
          card: "rgb(var(--os-card) / <alpha-value>)",
          hover: "rgb(var(--os-hover) / <alpha-value>)",
          edge: "rgb(var(--os-edge) / <alpha-value>)",
          ink: "rgb(var(--os-ink) / <alpha-value>)",
          mute: "rgb(var(--os-mute) / <alpha-value>)",
        },
      },
      keyframes: {
        "slide-up": { "0%": { transform: "translateY(12px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        "card-in": { "0%": { transform: "translateY(8px) scale(.98)", opacity: "0" }, "100%": { transform: "none", opacity: "1" } },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
        pop: { "0%": { transform: "scale(1)" }, "50%": { transform: "scale(1.08)" }, "100%": { transform: "scale(1)" } },
        buzz: {
          "0%,100%": { transform: "rotate(0)" },
          "25%": { transform: "rotate(-1.5deg)" },
          "75%": { transform: "rotate(1.5deg)" },
        },
      },
      animation: {
        "slide-up": "slide-up .28s ease-out both",
        "card-in": "card-in .35s ease-out both",
        shake: "shake .4s ease-in-out",
        pop: "pop .3s ease-out",
        buzz: "buzz .12s linear 4",
      },
    },
  },
  plugins: [],
} satisfies Config;

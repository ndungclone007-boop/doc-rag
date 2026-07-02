import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF7F0",
        "paper-dim": "#F1ECE1",
        ink: "#20241F",
        "ink-soft": "#4A5147",
        moss: "#D9D3C1",
        teal: {
          DEFAULT: "#1F4E4A",
          dark: "#153937",
          light: "#2E6E68",
        },
        amber: {
          DEFAULT: "#C6862B",
          light: "#F0DEB8",
          dark: "#8F5F1B",
        },
        rust: {
          DEFAULT: "#B5533C",
          light: "#F1D9D1",
        },
      },
      fontFamily: {
        serif: ["var(--font-lora)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(32,36,31,0.06), 0 1px 12px rgba(32,36,31,0.05)",
      },
      backgroundImage: {
        grain: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.035%22/></svg>')",
      },
    },
  },
  plugins: [],
};

export default config;

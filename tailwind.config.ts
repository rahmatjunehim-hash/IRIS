import type { Config } from "tailwindcss";

export default {
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
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        ivory: "#FDFBF7",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "apple-subtle": "0 1px 3px rgba(0, 0, 0, 0.03), 0 4px 12px rgba(0, 0, 0, 0.03)",
        "apple-card": "0 2px 8px rgba(0, 0, 0, 0.04), 0 12px 24px -4px rgba(0, 0, 0, 0.06)",
        "apple-float": "0 8px 30px rgba(0, 0, 0, 0.08), 0 20px 40px -10px rgba(0, 0, 0, 0.08)",
        "apple-glow": "0 0 25px -5px rgba(16, 185, 129, 0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;

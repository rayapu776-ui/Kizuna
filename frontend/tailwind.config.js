/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Mizu Calm + Matcha Growth Color System
        mizu: {
          50: "#f2f9f8",
          100: "#e5f2ed", // Soft Mint
          200: "#c7e5dd",
          300: "#9fd0c5",
          400: "#6eb6aa",
          500: "#3fa796", // Secondary Fresh Teal
          600: "#279181",
          700: "#167d78", // Primary Mizu Teal
          800: "#105c58",
          900: "#0c4542",
          DEFAULT: "#167d78",
          fresh: "#3fa796",
        },
        matcha: {
          50: "#f4f8f5",
          100: "#e5efe7",
          200: "#c7dfc9",
          300: "#a3cba6",
          400: "#7fb384",
          500: "#5f8f6b", // Matcha Green
          600: "#4d7757",
          700: "#3d5f45",
          800: "#2d4734",
          DEFAULT: "#5f8f6b",
        },
        softMint: "#e5f2ed",
        warmIvory: "#faf9f5",
        surfaceWhite: "#ffffff",
        primaryText: "#193b37",
        secondaryText: "#6b7f7b",
        kizunaBorder: "#d8e7e3",
        attentionAmber: "#d39a45",
        criticalCoral: "#c75c5c",

        // Semantic shades
        ivory: {
          50: "#fcfbf8",
          100: "#faf9f5",
          200: "#f3f0e6",
          300: "#e9e5d4",
          DEFAULT: "#faf9f5",
        },
        coral: {
          50: "#faf0f0",
          100: "#f5dbdb",
          200: "#e9b8b8",
          500: "#c75c5c",
          600: "#ad4848",
          DEFAULT: "#c75c5c",
        },
        amber: {
          50: "#fdf8ee",
          100: "#f9edd6",
          200: "#f3dab0",
          500: "#d39a45",
          600: "#b88033",
          DEFAULT: "#d39a45",
        },
      },
      fontFamily: {
        sans: [
          '"Noto Sans"',
          '"Noto Sans JP"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        jp: [
          '"Noto Sans JP"',
          '"Noto Sans"',
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      fontSize: {
        "title-main": [
          "34px",
          { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "heading-section": [
          "24px",
          { lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "600" },
        ],
        "heading-card": [
          "18px",
          { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "body-primary": [
          "15px",
          { lineHeight: "1.65", letterSpacing: "-0.005em", fontWeight: "400" },
        ],
        "kpi-value": [
          "32px",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
      },
      boxShadow: {
        calm: "0 1px 3px 0 rgba(22, 125, 120, 0.04), 0 1px 2px -1px rgba(22, 125, 120, 0.03)",
        "calm-md":
          "0 4px 6px -1px rgba(22, 125, 120, 0.05), 0 2px 4px -2px rgba(22, 125, 120, 0.03)",
        "calm-hover":
          "0 8px 20px -3px rgba(22, 125, 120, 0.09), 0 0 0 1px #d8e7e3",
        matcha: "0 2px 8px -1px rgba(95, 143, 107, 0.15)",
      },
    },
  },
  plugins: [],
};

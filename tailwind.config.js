/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        primaryHover: "var(--color-primary-hover)",
        bgPrimary: "var(--color-bg-primary)",
        bgSecondary: "var(--color-bg-secondary)",
        bgDark: "var(--color-bg-dark)",
        textPrimary: "var(--color-text-primary)",
        textSecondary: "var(--color-text-secondary)",
        textMuted: "var(--color-text-muted)",
        textInverse: "var(--color-text-inverse)",
        accent: {
          yellow: "var(--color-accent-yellow)",
          green: "var(--color-accent-green)",
          purple: "var(--color-accent-purple)",
        },
        success: "var(--color-success)",
        successBg: "var(--color-success-bg)",
        error: "var(--color-error)",
        errorBg: "var(--color-error-bg)",
        warningBg: "var(--color-warning-bg)",
        border: "var(--color-border)",
        shadow: "var(--color-shadow)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"]
      },
      boxShadow: {
        brutal: "4px 4px 0 var(--color-shadow)",
        "brutal-lg": "6px 6px 0 var(--color-shadow)",
        "brutal-accent": "6px 6px 0 var(--color-accent-yellow)",
      },
    },
  },
  plugins: [],
};

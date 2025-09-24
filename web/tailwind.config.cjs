module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"]
      },
      colors: {
        brand: {
          50:  "#052e2b",
          100: "#083d35",
          200: "#0b4d3f",
          300: "#0f5f49",
          400: "#117353",
          500: "#16a34a",   /* emerald-600 */
          600: "#22c55e",   /* emerald-500 */
          700: "#34d399",   /* emerald-400 */
          800: "#86efac",   /* emerald-300 */
          900: "#bbf7d0"    /* emerald-200 */
        },
        accent: {
          500: "#22c55e"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(34,197,94,0.10)",
        neon: "0 0 0 2px rgba(34,197,94,0.25), 0 0 40px rgba(34,197,94,0.25)",
        card: "0 10px 25px rgba(0,0,0,0.35)"
      },
      backgroundImage: {
        'hero-grid': "radial-gradient(transparent 1px, rgba(34,197,94,0.06) 1px)",
      }
    }
  },
  plugins: [],
};

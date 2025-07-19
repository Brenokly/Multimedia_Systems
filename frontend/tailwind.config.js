/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["var(--font-pixel)"],
      },
      boxShadow: {
        "inset-btn": "inset -4px -4px 0 0 var(--btn-shadow)",
      },
      colors: {
        pixelBorder: "var(--border-shadow)",
        pixelBorderLight: "var(--border-highlight)",
        pixelText: "var(--color-brand-text)",
        pixelBg: "var(--bg-color)",

        pixelBtn: "var(--color-brand-btn)",
        pixelBtnShadow: "var(--btn-shadow)",

        pixelBlueBtn: "var(--color-btn-blue)",
        pixelBlueBtnShadow: "var(--btn-bs)",

        pixelSection1: "var(--section-bg-1)",
        pixelSection2: "var(--section-bg-2)",

        pixelFooter: "var(--color-footer-bg)",
        pixelHeader: "var(--color-header-bg)",

        pixelYellow: "var(--color-yellow-primary)",
        pixelYellowShadow: "var(--color-yellow-shadow)",
      },
    },
  },
  plugins: [],
};

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
      colors: {
        // Acesso direto a variáveis CSS com nomes simples
        pixelBorder: "var(--color-brand-border-dark)",
        pixelBorderLight: "var(--color-brand-border-light)",
        pixelText: "var(--color-brand-text)",
        pixelBg: "var(--color-brand-bg)",

        pixelBtn: "var(--color-brand-btn)",
        pixelBtnShadow: "var(--color-brand-btn-shadow)",

        pixelBlueBtn: "var(--color-btn-blue)",
        pixelBlueBtnShadow: "var(--color-btn-blue-shadow)",

        pixelSection1: "var(--color-brand-section-1)",
        pixelSection2: "var(--color-brand-section-2)",

        pixelFooter: "var(--color-footer-bg)",
        pixelHeader: "var(--color-header-bg)",

        pixelYellow: "var(--color-yellow-primary)",
        pixelYellowShadow: "var(--color-yellow-shadow)",
      },
    },
  },
  plugins: [],
};

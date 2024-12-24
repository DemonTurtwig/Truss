module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ["'Bebas Neue'", "cursive"],
        mono: ["'Roboto Mono'", "monospace"],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
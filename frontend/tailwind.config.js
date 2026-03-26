/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#6eed53',
        'brand-secondary': '#acc7ff',
        'brand-tertiary': '#f4d041',
      },
      fontFamily: {
        'headline': ['Plus Jakarta Sans', 'sans-serif'],
        'body': ['Be Vietnam Pro', 'sans-serif'],
        'label': ['Space Grotesk', 'monospace'],
      },
    },
  },
  plugins: [],
}

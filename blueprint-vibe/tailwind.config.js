/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
    "./ue/**/*.{ts,tsx}",
    "./styles/**/*.{ts,css}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "primary": "var(--background-primary)",
      "navbar-text-color": "var(--navbar-text-color)",
      "navbar-color": "var(--navbar-color)",
      "text-color": "var(--navbar-link-color)"
    },
    extend: {},
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: "var(--background-primary)",
      lighter: "var(--background-lighter)",
      "navbar-text-color": "var(--navbar-text-color)",
      "navbar-color": "var(--navbar-color)",
      "text-color": "var(--navbar-link-color)",
      "text-hover-color": "var(--navbar-link-hover-color)",
      input: "var(--input-background-color)",
      "input-text": "var(--input-text-color)",
      "input-border-color": "var(--input-border-color)",
      "dropdown-option-hover-color": "var(--dropdown-option-hover-color)"
    },
    extend: {}
  },
  plugins: []
};

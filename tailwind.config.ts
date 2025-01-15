/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
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
            "dropdown-option-hover-color": "var(--dropdown-option-hover-color)",
            "border-color": "var(--border-color)"
        },
        fontFamily: {
            roboto: "var(--font-family), Roboto"
        },
        extend: {}
    },
    plugins: []
};

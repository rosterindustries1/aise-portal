/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'agency-dark': '#0a0a0a',
                'agency-gray': '#1a1a1a',
                'agency-accent': '#c41e3a',
                'agency-text': '#e5e5e5'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}

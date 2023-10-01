/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: false,
    content: ['./src/**/*.{ts,tsx,js,jsx}', './index.html'],
    theme: {
        extend: {},
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['autumn'],
    },
}

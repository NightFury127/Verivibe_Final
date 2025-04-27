/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0, transform: 'translateY(-20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: 0, transform: 'translateX(-20px)' },
                    '100%': { opacity: 1, transform: 'translateX(0)' },
                },
                pulse: {
                    '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 99, 71, 0.7)' },
                    '50%': { transform: 'scale(1.15)', boxShadow: '0 0 0 10px rgba(255, 99, 71, 0)' },
                    '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 99, 71, 0)' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 1s ease-in',
                slideIn: 'slideIn 0.5s ease-out',
                pulse: 'pulse 1.2s infinite',
            },
        },
    },
    plugins: [],
};
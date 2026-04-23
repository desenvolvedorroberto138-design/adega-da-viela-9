/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'viela-magenta': '#C71585', // Seu primary-dark
        'viela-pink': '#f805ec',    // Seu secondary
        'viela-dark': '#000000',    // Seu primary
        'viela-gray': '#f8f9fa',    // Seu bg-light
      },
      borderRadius: {
        'viela': '12px',            // Seu --radius
      },
      boxShadow: {
        'viela': '0 4px 12px rgba(0,0,0,0.1)', // Sua --shadow
      }
    },
  },
  plugins: [],
}
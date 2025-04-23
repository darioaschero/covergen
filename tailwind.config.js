/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Add safelist for dynamically generated color classes
  safelist: [
    {
      // Updated pattern for colors and full shade range (100-900)
      pattern: /bg-(red|yellow|green|blue|indigo|purple|pink|fuchsia)-(100|200|300|400|500|600|700|800|900)/, 
    },
    {
      // Updated pattern for colors and full shade range (100-900)
      pattern: /text-(red|yellow|green|blue|indigo|purple|pink|fuchsia)-(100|200|300|400|500|600|700|800|900)/, 
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} 
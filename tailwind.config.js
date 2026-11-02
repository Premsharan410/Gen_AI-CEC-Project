/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#EEF5FA',         // soft pale blue
          lavender: '#EDE9FA',   // soft lavender
          mint: '#E2F3E9',       // soft mint
          cream: '#FEF9EE',      // soft warm cream for statistics
          card: '#FFFFFF',       // crisp white card
          text: '#24313D',       // deep charcoal primary text
          muted: '#526477',      // slate gray secondary text
          blue: '#2864DC',       // rich blue primary buttons
          'blue-hover': '#1d52bc',
          teal: '#168A83',       // scientific accent teal
          violet: '#7961D9',     // secondary accent violet
          amber: '#F2B84B',      // warm amber highlight
          border: '#D5E0E9',     // visible blue-gray border
          'border-strong': '#9FB2C4',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 8px -1px rgba(36, 49, 61, 0.06), 0 1px 3px -1px rgba(36, 49, 61, 0.04)',
        'card-hover': '0 8px 20px -2px rgba(40, 100, 220, 0.12), 0 3px 6px -2px rgba(36, 49, 61, 0.06)',
      }
    },
  },
  plugins: [],
}

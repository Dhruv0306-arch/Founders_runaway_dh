/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        slate: {
          950: '#000000',
        },
        // E-Cell inspired palette
        ecell: {
          black: '#000000',
          dark: '#120a2e',       // Very dark purple (card bg)
          navy: '#200b6a',       // Deep navy (navbar)
          purple: '#4526b1',     // Core purple
          violet: '#4c22e1',     // Vibrant purple
          lavender: '#7153d9',   // Muted purple
          muted: '#beb1de',      // Lavender text
          orange: '#FD562A',     // Primary CTA orange-red
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

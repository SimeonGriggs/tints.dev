const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './remix.config.js'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        brand: '#2522fc',
        first: {
          50: 'var(--first-50)',
          100: 'var(--first-100)',
          200: 'var(--first-200)',
          300: 'var(--first-300)',
          400: 'var(--first-400)',
          500: 'var(--first-500)',
          600: 'var(--first-600)',
          700: 'var(--first-700)',
          800: 'var(--first-800)',
          900: 'var(--first-900)',
        },
        blue: {
          50: '#fafaff',
          100: '#f0f0ff',
          200: '#bfbefe',
          300: '#8886fd',
          400: '#5754fd',
          500: '#2522fc',
          600: '#0703d8',
          700: '#050297',
          800: '#030156',
          900: '#010014',
        },
      },
      fontSize: {
        '2xs': '0.66rem',
      },
      spacing: {
        header: '60px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

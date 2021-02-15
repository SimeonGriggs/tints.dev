module.exports = {
  purge: ['./**/*.html', './src/**/*.jsx'],
  theme: {
    extend: {
      fontSize: {
        'text-2xs': `0.625rem`,
      },
      colors: {
        current: {
          '50': 'var(--current-50, #F9FAFB)',
          '100': 'var(--current-100, #F7FAFC)',
          '200': 'var(--current-200, #EDF2F7)',
          '300': 'var(--current-300, #E2E8F0)',
          '400': 'var(--current-400, #CBD5E0)',
          '500': 'var(--current-500, #A0AEC0)',
          '600': 'var(--current-600, #718096)',
          '700': 'var(--current-700, #4A5568)',
          '800': 'var(--current-800, #2D3748)',
          '900': 'var(--current-900, #1A202C)',
        },
      },
    },
  },
  variants: {},
  plugins: [],
};

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        warm: { 50: '#fdfbf7', 100: '#f5efe5', 200: '#e9ddcb', 300: '#d8c4a8', 400: '#bba180', 500: '#967859', 600: '#7e6046', 700: '#664d3b', 800: '#533f33', 900: '#43342c' },
        navy: { DEFAULT: '#293241', dark: '#1d2531' },
        terracotta: { DEFAULT: '#b94e2b', dark: '#913b23', light: '#e99875' },
        sage: { DEFAULT: '#71876b', dark: '#40563c' },
      },
      keyframes: { fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } } },
      animation: { fadeIn: 'fadeIn .25s ease-out' },
    },
  },
  plugins: [],
};

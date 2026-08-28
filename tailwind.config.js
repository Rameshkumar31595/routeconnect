export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#f8f7fc',
          100: '#f3f0ff',
        },
      },
      boxShadow: {
        soft: '0 24px 70px rgba(168, 85, 247, 0.08)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(168, 85, 247, 0.18), transparent 35%), linear-gradient(180deg, #f8f7fc 0%, #ffffff 100%)',
      },
    },
  },
  plugins: [],
};

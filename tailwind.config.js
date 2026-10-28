export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0F172A',
          navy: '#111827',
          blue: '#1D4ED8',
          gold: '#F9B233',
          orange: '#F97316',
          red: '#D92D20',
          cream: '#F8FAFC',
          success: '#16A34A',
          warning: '#F59E0B',
        },
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        hero: 'linear-gradient(135deg, rgba(17,24,39,1) 0%, rgba(29,78,216,0.97) 40%, rgba(249,178,51,0.88) 100%)',
      },
    },
  },
  plugins: [],
};

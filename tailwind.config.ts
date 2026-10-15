import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        theme: {
          primary: 'var(--theme-primary)',
          bg: 'var(--theme-bg)',
          surface: 'var(--theme-surface)',
          border: 'var(--theme-border)',
        },
      },
      borderRadius: {
        'theme': 'var(--radius)',
      },
    },
  },
  plugins: [],
};

export default config;

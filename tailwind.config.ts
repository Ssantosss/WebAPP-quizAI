import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'SF Pro Display','SF Pro Text','-apple-system','system-ui','Inter','ui-sans-serif','sans-serif'
        ],
      },
      colors: { brand: { DEFAULT: '#176d46' } },
      borderRadius: { '2xl': '1.25rem' },
    },
  },
  safelist: [
    'container-app','card','btn','btn-hero','btn-ghost','btn-line','h1','h2','sub','nav-safe-bottom'
  ],
  plugins: [],
};
export default config;

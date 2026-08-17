/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Neutral "ink" scale used for text, borders, surfaces.
        ink: {
          50: '#f7f8f8',
          100: '#eef0f0',
          200: '#dce0e0',
          300: '#bcc3c3',
          400: '#929c9c',
          500: '#6f7a7a',
          600: '#586161',
          700: '#484f4f',
          800: '#3d4343',
          900: '#232727',
          950: '#161919',
        },
        // Primary brand — a warm, friendly coral-rose.
        brand: {
          50: '#fff1f3',
          100: '#ffe0e5',
          200: '#ffc7d1',
          300: '#ff9fb1',
          400: '#ff6885',
          500: '#fa385c',
          600: '#e81c48',
          700: '#c3103b',
          800: '#a31138',
          900: '#8a1336',
          950: '#4d0419',
        },
        // Warm accent for highlights, ratings, subtle CTAs.
        accent: {
          50: '#fdf6ee',
          100: '#f9e9d3',
          200: '#f2cfa4',
          300: '#eaad6c',
          400: '#e28c40',
          500: '#d97321',
          600: '#c05a17',
          700: '#a04416',
          800: '#823719',
          900: '#6b2f18',
        },
      },
      fontFamily: {
        // Manrope is a soft, geometric sans in the spirit of Airbnb Cereal.
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        // Soft, diffuse shadows — light on the eyes, à la modern travel apps.
        card: '0 2px 8px rgba(23, 23, 28, 0.05)',
        'card-hover': '0 6px 24px rgba(23, 23, 28, 0.10)',
        soft: '0 1px 3px rgba(23, 23, 28, 0.05)',
        pill: '0 3px 14px rgba(23, 23, 28, 0.10)',
      },
      maxWidth: {
        content: '1200px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-up': 'fade-up 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

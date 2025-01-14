import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        user: {
          background: {
            DEFAULT: '#040506',
            dark: '#020304',
          },
          primary: {
            DEFAULT: '#2761c3',
            hover: '#27c39f',
          },
        },
        admin: {
          background: {
            DEFAULT: '#f8fafc',
            dark: '#e2e8f0',
          },
          primary: {
            DEFAULT: '#3b82f6',
            hover: '#2563eb',
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'shine': 'shine 3s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        shimmer: {
          '100%': { backgroundPosition: '200% center' },
        },
      },
      textShadow: {
        'neon': '0 0 5px rgba(221,235,240,0.5)',
        'neon-strong': '0 0 10px rgba(221,235,240,0.8)',
      },
      boxShadow: {
        'neon-exp': '0 0 10px rgba(39,195,97,0.5)',
        'neon-points': '0 0 10px rgba(195,167,39,0.5)',
        'neon-progress': '0 0 10px rgba(39,97,195,0.3)',
        'neon-progress-strong': '0 0 15px rgba(39,97,195,0.5)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

export default config;

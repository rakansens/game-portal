import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'neon-exp': '0 0 5px theme("colors.green.400"), 0 0 20px theme("colors.green.600")',
        'neon-points': '0 0 5px theme("colors.yellow.400"), 0 0 20px theme("colors.yellow.600")',
        'neon-progress': '0 0 10px rgba(39,97,195,0.5)',
        'neon-progress-strong': '0 0 20px rgba(39,97,195,0.8)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'shine': 'shine 1s forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '-250% 0' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
      textShadow: {
        'neon': '0 0 5px rgba(221,235,240,0.5)',
        'neon-strong': '0 0 10px rgba(221,235,240,0.8)',
      },
      rotate: {
        'y-5': 'rotateY(5deg)',
        'y-minus-5': 'rotateY(-5deg)',
      },
      perspective: {
        'DEFAULT': '1000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.clip-corners': {
          clipPath: 'polygon(92% 0, 100% 25%, 100% 100%, 8% 100%, 0 75%, 0 0)',
        },
        '.clip-corners-sm': {
          clipPath: 'polygon(96% 0, 100% 12.5%, 100% 100%, 4% 100%, 0 87.5%, 0 0)',
        },
        '.text-shadow-neon': {
          textShadow: '0 0 5px rgba(221,235,240,0.5)',
        },
        '.text-shadow-neon-strong': {
          textShadow: '0 0 10px rgba(221,235,240,0.8)',
        },
        '.perspective': {
          perspective: '1000px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.rotate-y-5': {
          transform: 'rotateY(5deg)',
        },
        '.rotate-y-minus-5': {
          transform: 'rotateY(-5deg)',
        },
      });
    }),
  ],
};

export default config;

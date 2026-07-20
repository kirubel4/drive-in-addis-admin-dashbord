/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        canvas: '#FAFAFA',
        surface: '#FFFFFF',
        sidebar: '#101012',
        'sidebar-hover': '#1B1B1E',
        'sidebar-border': '#232326',
        border: {
          DEFAULT: '#E4E4E7',
          subtle: '#EFEFF1',
        },
        ink: {
          900: '#18181B',
          700: '#3F3F46',
          500: '#71717A',
          400: '#A1A1AA',
          300: '#D4D4D8',
        },
        accent: {
          DEFAULT: '#5B5BD6',
          hover: '#4E4EC4',
          soft: '#EEEEFC',
          text: '#4438CA',
        },
        success: { DEFAULT: '#30A46C', soft: '#E7F8EF' },
        warning: { DEFAULT: '#B9700C', soft: '#FDF3E3' },
        danger: { DEFAULT: '#E5484D', soft: '#FEECEC' },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        popover: '0 4px 16px -4px rgb(0 0 0 / 0.12), 0 1px 2px 0 rgb(0 0 0 / 0.06)',
      },
      borderRadius: {
        lg: '10px',
        md: '8px',
        sm: '6px',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.35 },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 2s ease-in-out infinite',
        fadeIn: 'fadeIn 0.15s ease-out',
      },
    },
  },
  plugins: [],
}

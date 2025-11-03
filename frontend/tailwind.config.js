/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // iOS 26 Design System Colors
      colors: {
        // Light mode colors
        background: 'rgb(242, 242, 247)', // #F2F2F7
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.72)',
          elevated: 'rgba(255, 255, 255, 0.85)',
          overlay: 'rgba(255, 255, 255, 0.95)',
        },
        text: {
          primary: 'rgba(0, 0, 0, 0.9)',
          secondary: 'rgba(0, 0, 0, 0.6)',
          tertiary: 'rgba(0, 0, 0, 0.4)',
          inverse: 'rgba(255, 255, 255, 0.9)',
        },
        // iOS semantic colors
        system: {
          blue: '#007AFF',
          'blue-dark': '#0A84FF',
          green: '#34C759',
          'green-dark': '#30D158',
          orange: '#FF9500',
          'orange-dark': '#FFCC02',
          red: '#FF3B30',
          'red-dark': '#FF453A',
          yellow: '#FFCC00',
          purple: '#AF52DE',
          pink: '#FF2D92',
          indigo: '#5856D6',
          teal: '#30B0C7',
        },
        // Recovery app specific colors
        recovery: {
          success: 'var(--color-system-green)',
          warning: 'var(--color-system-orange)',
          danger: 'var(--color-system-red)',
          info: 'var(--color-system-blue)',
          calm: '#6B7280',
          neutral: '#9CA3AF',
        },
        // Mood colors
        mood: {
          excellent: '#10B981',
          good: '#34D399',
          moderate: '#FCD34D',
          low: '#FB923C',
          poor: '#EF4444',
        },
        // Gradient colors for glass morphism
        glass: {
          light: 'rgba(255, 255, 255, 0.25)',
          dark: 'rgba(0, 0, 0, 0.25)',
          blur: 'rgba(255, 255, 255, 0.1)',
        },
      },
      // iOS typography system
      fontFamily: {
        'sf-pro': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'sf-mono': ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
      },
      fontSize: {
        // iOS Dynamic Type scale (using rem units, 1rem = 16px = 16pt)
        'caption-2': '0.6875rem', // 11pt
        'caption-1': '0.75rem',    // 12pt
        'footnote': '0.8125rem',   // 13pt
        'subhead': '0.9375rem',    // 15pt
        'callout': '1rem',         // 16pt
        'body': '1.0625rem',       // 17pt
        'headline': '1.0625rem',   // 17pt (semibold)
        'title-3': '1.25rem',      // 20pt
        'title-2': '1.375rem',     // 22pt
        'title-1': '1.75rem',      // 28pt
        'large-title': '2.125rem', // 34pt
      },
      // Spacing system (8pt grid)
      spacing: {
        '0.5': '0.125rem', // 2pt
        '1': '0.25rem',   // 4pt
        '1.5': '0.375rem', // 6pt
        '2': '0.5rem',    // 8pt
        '3': '0.75rem',   // 12pt
        '4': '1rem',      // 16pt
        '5': '1.25rem',   // 20pt
        '6': '1.5rem',    // 24pt
        '8': '2rem',      // 32pt
        '10': '2.5rem',   // 40pt
        '12': '3rem',     // 48pt
        '16': '4rem',     // 64pt
        '20': '5rem',     // 80pt
        '24': '6rem',     // 96pt
        '32': '8rem',     // 128pt
      },
      // Border radius system
      borderRadius: {
        'xs': '0.25rem',   // 4pt
        'sm': '0.5rem',    // 8pt
        'md': '0.75rem',   // 12pt
        'lg': '1rem',      // 16pt
        'xl': '1.5rem',    // 24pt
        '2xl': '2rem',     // 32pt
        'full': '9999px',
      },
      // iOS blur effects
      backdropBlur: {
        'glass': '20px',
        'heavy': '30px',
        'light': '10px',
      },
      // Shadow system for iOS 26
      boxShadow: {
        'glass-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'glass': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glass-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glass-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-glass': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      // Animation durations
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '350': '350ms',  // iOS standard
        '400': '400ms',
        '500': '500ms',
      },
      // Animation timing functions
      transitionTimingFunction: {
        'spring-out': 'cubic-bezier(0.33, 0, 0, 1)',
        'spring-in': 'cubic-bezier(0, 0, 0.66, 1)',
        'ease-in-out-spring': 'cubic-bezier(0.33, 0, 0.66, 1)',
      },
      // Z-index scale
      zIndex: {
        'dropdown': 1000,
        'sticky': 1020,
        'fixed': 1030,
        'modal-backdrop': 1040,
        'modal': 1050,
        'popover': 1060,
        'tooltip': 1070,
        'toast': 1080,
        'emergency': 9999,
      },
      // Custom animations
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-emergency': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        'breathing-cycle': {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.3)' },
          '50%': { transform: 'scale(1.4)' },
          '75%': { transform: 'scale(1.2)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 122, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 122, 255, 0.8)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'fade-out': 'fade-out 200ms ease-in',
        'scale-in': 'scale-in 350ms spring-out',
        'scale-out': 'scale-out 350ms spring-in',
        'slide-up': 'slide-up 300ms ease-out',
        'slide-down': 'slide-down 300ms ease-out',
        'pulse-emergency': 'pulse-emergency 2s ease-in-out infinite',
        'breathing': 'breathing-cycle 5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      // Grid system
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    // Custom plugin for iOS 26 Liquid Glass effects
    function({ addUtilities, theme }) {
      const glassUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '0.5px solid rgba(255, 255, 255, 0.3)',
        },
        '.glass-dark': {
          background: 'rgba(28, 28, 30, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '0.5px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-elevated': {
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '0.5px solid rgba(255, 255, 255, 0.4)',
        },
        '.glass-elevated-dark': {
          background: 'rgba(28, 28, 30, 0.85)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '0.5px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-overlay': {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '0.5px solid rgba(255, 255, 255, 0.5)',
        },
        '.glass-overlay-dark': {
          background: 'rgba(28, 28, 30, 0.95)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '0.5px solid rgba(255, 255, 255, 0.3)',
        },
      };

      addUtilities(glassUtilities);
    },
    // Plugin for accessibility
    function({ addUtilities }) {
      const accessibilityUtilities = {
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        },
        '.focus-visible:focus': {
          outline: '2px solid',
          outlineColor: 'var(--color-system-blue)',
          outlineOffset: '2px',
        },
        '.focus-ring': {
          '&:focus-visible': {
            outline: '2px solid var(--color-system-blue)',
            outlineOffset: '2px',
          },
        },
      };

      addUtilities(accessibilityUtilities);
    },
  ],
};
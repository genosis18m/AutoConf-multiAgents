import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#14101C',
          surface: '#1C1726',
          elevated: '#271F33',
        },
        accent: {
          cyan: '#FF6A3D',
          orange: '#F2A65A',
          green: '#54D6A6',
          purple: '#9B8CFF',
          yellow: '#FFC85A',
          red: '#FF5C5C',
        },
        text: {
          primary: '#F4ECE3',
          secondary: '#B2A8BE',
          dim: '#6F6582',
        },
        border: {
          subtle: '#38304A',
          glow: 'rgba(255, 106, 61, 0.3)',
        },
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'serif'],
        body: ['Hanken Grotesk', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 229, 255, 0.15)',
        'glow-green': '0 0 20px rgba(0, 230, 118, 0.15)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'fade-in-up': 'fade-in-up 0.5s ease forwards',
        'slide-in-right': 'slide-in-right 0.4s ease forwards',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px #FF6A3D' },
          '50%': { boxShadow: '0 0 28px #FF6A3D' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: { glass: '20px' },
    },
  },
  plugins: [],
}

export default config

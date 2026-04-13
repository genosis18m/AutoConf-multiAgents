import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0A0F',
          surface: '#12121A',
          elevated: '#1A1A24',
        },
        accent: {
          cyan: '#00E5FF',
          orange: '#FF6B35',
          green: '#00E676',
          purple: '#B388FF',
          yellow: '#FFD740',
          red: '#FF5252',
        },
        text: {
          primary: '#E8E8EC',
          secondary: '#9898A0',
          dim: '#5A5A66',
        },
        border: {
          subtle: '#2A2A3A',
          glow: 'rgba(0, 229, 255, 0.3)',
        },
      },
      fontFamily: {
        display: ['Clash Display', 'Satoshi', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'General Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
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
          '0%, 100%': { boxShadow: '0 0 8px #00E5FF' },
          '50%': { boxShadow: '0 0 28px #00E5FF' },
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

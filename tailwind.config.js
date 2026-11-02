/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0A0F1C',
        dugout: '#131A2B',
        line: '#1E2738',
        edge: '#2A3550',
        chalk: '#E8ECF4',
        muted: '#A3AEC2',
        faint: '#6B7894',
        red: { DEFAULT: '#E63946', soft: '#FF8A8D' },
        flag: { DEFAULT: '#2F6BFF', soft: '#8FB0FF', deep: '#10213F' },
        lights: '#F4C542',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Barlow Condensed"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b1110',
        surface: 'rgba(255,255,255,.06)',
        surface2: 'rgba(255,255,255,.085)',
        border: 'rgba(255,255,255,.10)',
        text: 'rgba(255,255,255,.92)',
        muted: 'rgba(255,255,255,.66)',
        faint: 'rgba(255,255,255,.45)',
        good: '#77f2c1',
        warn: '#ffd56a',
        bad: '#ff7a8a',
        accent: '#7fe0ff',
        accent2: '#9cff86',
      },
      borderRadius: {
        'radius': '18px',
        'radius2': '26px',
      },
      boxShadow: {
        'urban': '0 18px 60px rgba(0,0,0,.55)',
      },
    },
  },
  plugins: [],
}


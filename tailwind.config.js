// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ✅ PALETA ACTUALIZADA
        terminal: {
          bg: {
            primary: '#000000',    // Negro puro
            secondary: '#1A1A1A',  // Gris oscuro para secciones
            card: '#121212'        // Gris más oscuro para tarjetas
          },
          text: {
            primary: '#EAEAEA',
            secondary: '#CCCCCC', 
            muted: '#999999'
          },
          border: 'rgba(255,255,255,0.1)',
          accent: {
            blue: '#3b82f6',
            green: '#00FF9D',
            red: '#FF5E5E', 
            electric: '#0066FF'
          }
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Roboto Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
    },
  },
  plugins: [],
}
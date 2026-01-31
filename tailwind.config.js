/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: false,
  theme: {
    extend: {
      colors: {
        // AÑADE TUS COLORES PERSONALIZADOS COMO CLASES TAILWIND
        positive: '#00FF9D',
        negative: '#FF5E5E',
        electric: '#0066FF',
        // Colores de terminal
        terminal: {
          bg: {
            primary: '#000000',
            secondary: '#1A1A1A',
            card: '#121212'
          },
          text: {
            primary: '#EAEAEA',
            secondary: '#CCCCCC', 
            muted: '#999999'
          },
          border: 'rgba(255,255,255,0.1)',
          accent: {
            blue: '#3b82f6',
            green: '#00FF9D',  // Cambiado para que coincida
            red: '#FF5E5E', 
            electric: '#0066FF'
          }
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Roboto Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      // CLASES DE ANCHO PERSONALIZADAS
      width: {
        '7/10': '70%',
        '3/10': '30%',
      },
      // ANIMACIONES
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
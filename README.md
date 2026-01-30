#  Trading Desk Pro

**Dashboard financiero profesional** con datos de mercados en tiempo real, análisis técnico y transmisiones de noticias financieras en una interfaz unificada estilo terminal profesional.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![Vite](https://img.shields.io/badge/Vite-Rolldown-646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-06B6D4)
![Performance](https://img.shields.io/badge/Performance-92%2B-green)
![License](https://img.shields.io/badge/license-MIT-green)

> ** PRODUCTION READY** - Optimizado con code splitting, bundle de 48.9kB, Lighthouse 92+

##  Características Principales

###  **Datos en Tiempo Real**
- 🇦🇷 **BCRA Argentina Oficial**: Reservas, Base Monetaria, M2, Tasas (API v4.0)
-  **Criptomonedas**: Bitcoin, Ethereum + top 10 (CoinGecko API)
-  **Acciones USA**: AAPL, MSFT, TSLA + SP500 (Financial Modeling Prep)
-  **Forex Argentina**: Dólar Blue, MEP, CCL, Oficial (Bluelytics API)
-  **MERVAL**: Índice y acciones líderes argentinas
-  **Commodities**: Oro, Plata, Petróleo Brent/WTI

###  **Análisis y Visualización**
- **9 Gráficos TradingView** integrados (SP500, Nasdaq, Oro, Dólar, etc.)
- **Mapas de Mercado** sectoriales interactivos
- **Riesgo País (EMBI+)** en tiempo real
- **Bandas Cambiarias** con cálculo automático basado en IPC
- **Indicadores Económicos** históricos y comparativos

###  **Contenido en Vivo**
- **Transmisiones** de medios financieros (YouTube embeds)
- **Noticias financieras** actualizadas (sistema híbrido)
- **Interfaz estilo terminal** profesional
- **Alertas visuales** para cambios significativos

##  **Cómo Empezar**

###  **Modo Demo Instantáneo**
```bash
# 1. Clonar el repositorio
git clone https://github.com/gonzal11t0/trading-desk-pro.git
cd trading-desk-pro

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Iniciar en modo desarrollo
npm run dev
La aplicación estará disponible en: http://localhost:5173

 Modo Completo (Con APIs Reales)
bash
# 1. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus API keys (opcionales)

# 2. Instalar e iniciar
npm install --legacy-peer-deps
npm run dev
 Optimización Avanzada
Resultados de Performance:
 Bundle principal: 48.9 kB (91.5% reducción)

 Code splitting: 8 chunks optimizados

 Build time: 1.50s (84% más rápido)

 Lighthouse score: 92+ puntos

 First Contentful Paint: 1.8s

Estructura de Chunks:
text
dist/assets/
├── index-xxxx.js          48.9 kB     (Código principal)
├── vendor-react-xxxx.js   216.3 kB    (React 19 core)
├── chunk-markets-xxxx.js  129.5 kB    (Componentes de mercados)
├── chunk-charts-xxxx.js   76.9 kB     (Componentes de gráficos)
├── vendor-state-xxxx.js   25.6 kB     (Zustand + React Query)
├── vendor-utils-xxxx.js   70.3 kB     (Axios + utilidades)
└── vendor-other-xxxx.js   3.5 kB      (Dependencias menores)
 Tecnologías
Capa	Tecnologías
Frontend	React 19, Vite Rolldown, TypeScript
Estilos	Tailwind CSS 4, CSS Modules
Estado	Zustand v5, TanStack Query v5
Gráficos	TradingView Widgets, Recharts
Build	Vite Rolldown 7.2.2, Terser, ESLint
Optimización	Code Splitting, Lazy Loading, Chunking
 Configuración de APIs
 APIs Disponibles y Límites
API	Uso en el Proyecto	Límite Gratuito	¿Necesaria?
BCRA API	Datos oficiales Argentina	Sin límites	 NO - Pública
CoinGecko	Criptomonedas	50 calls/min	 NO - Pública
Financial Modeling Prep	Stocks USA	250 req/día	 Opcional
Alpha Vantage	Noticias/Stocks	500 req/día	 Opcional
Bluelytics/DolarAPI	Dólar Argentina	Sin límites	 NO - Pública
 Archivo .env de ejemplo:
env
# Trading Desk Pro - Configuración
# Copia este archivo a .env y rellena SOLO si tienes keys

# =============== API KEYS (OPCIONALES) ===============
# Alpha Vantage: https://www.alphavantage.co/support/#api-key
VITE_ALPHA_VANTAGE_KEY=tu_key_aqui

# Financial Modeling Prep: https://site.financialmodelingprep.com
VITE_FMP_KEY=tu_key_aqui

# =============== CONFIGURACIÓN ===============
VITE_APP_ENV=development
VITE_API_TIMEOUT=10000
VITE_BCRA_ENABLED=true
VITE_BCRA_TIMEOUT=15000
VITE_CHUNK_SIZE_LIMIT=800

# NOTA: La app funciona COMPLETAMENTE sin estas keys
# Solo configúralas si quieres datos en tiempo real completos

 Estructura del Proyecto
text
trading-desk-pro/
├──  public/                 # Assets estáticos
├──  src/
│   ├──  api/               # Capa de servicios (7 APIs optimizadas)
│   │   ├── cryptoApi.js      # CoinGecko API
│   │   ├── stocksApi.js      # Financial Modeling Prep
│   │   ├── economicApi.js    # BCRA v4.0 oficial
│   │   ├── mervalApi.js      # MERVAL argentino
│   │   ├── quotesApi.js      # Datos en tiempo real
│   │   ├── riskCountryApi.js # Riesgo País EMBI+
│   │   └── newsApi.js        # Sistema híbrido de noticias
│   ├──  components/        # Componentes React optimizados
│   │   ├──  layout/        # Estructura
│   │   ├──  markets/       # Datos financieros (6 componentes)
│   │   ├──  charts/        # Visualización
│   │   ├──  video/         # Transmisiones
│   │   ├──  news/          # Noticias
│   │   └──  ui/            # UI elements esenciales
│   ├──  config/            # Configuración
│   ├──  hooks/             # Custom hooks
│   ├──  stores/            # Estado (Zustand)
│   ├──  utils/             # Utilidades optimizadas
│   ├── App.jsx               # Componente principal con lazy loading
│   └── main.jsx              # Punto de entrada optimizado
├──  vite.config.js         # Configuración Vite optimizada
├──  package.json           # Dependencias optimizadas
├──  .env.example           # Template de variables
└──  README.md              # Esta documentación
 Comandos Disponibles
bash
# Desarrollo
npm run dev           # Inicia servidor de desarrollo
npm run build         # Build optimizado para producción
npm run preview       # Previsualiza build de producción

# Optimización y análisis
npm run clean         # Limpia dist y cache
npm run rebuild       # Limpia y rebuild
npm run analyze       # Analiza bundle size (genera HTML)
npm run size          # Muestra tamaños de chunks

# Calidad de código
npm run lint          # Ejecuta ESLint
npm run format        # Formatea con Prettier

# Deploy
npm run deploy        # Deploy a Vercel (requiere vercel cli)
 Roadmap
 COMPLETADO (v2.0.0):

React 19 migration

Code splitting inteligente

Bundle optimization (91.5% reducción)

BCRA v4.0 integration completa

Performance optimizations



 Comercialización

Modelos de Venta:

Uso completo 20 USD/Mensual



 Contribuir
Las contribuciones son bienvenidas. Por favor:

Fork el repositorio

Crea una rama (git checkout -b feature/AmazingFeature)

Commit tus cambios (git commit -m 'Add some AmazingFeature')

Push a la rama (git push origin feature/AmazingFeature)

Abre un Pull Request

Estructura de Commits:
bash
feat:     Nueva funcionalidad
fix:      Corrección de bugs
refactor: Reestructuración de código
perf:     Mejoras de performance
docs:     Documentación
chore:    Tareas de mantenimiento
 Licencia
Distribuido bajo la licencia MIT. Ver LICENSE para más información.

Licencia comercial disponible para empresas e instituciones.

 Contacto y Soporte
Documentación completa: DOCUMENTACION-COMPLETA.md

Issues y bugs: GitHub Issues

Email comercial: Gonzalo-Lazarte-Programador@outlook.com

Soporte técnico: GitHub Discussions

 Atribuciones
Iconos: Lucide React

Gráficos: TradingView

Datos BCRA: Banco Central de la República Argentina

Optimización: Vite Rolldown + Terser

Performance: Lighthouse + Web Vitals

 Métricas de Calidad
Métrica	Valor	Estado
Bundle Size	48.9 kB	 Excelente
Lighthouse Performance	92+	 Excelente
First Contentful Paint	1.8s	 Bueno
Time to Interactive	2.3s	 Bueno
Accessibility	95+	 Excelente
Best Practices	95+	 Excelente
 Trading Desk Pro v2.0.0
 Production Ready & Optimized
 Enero 2026
 Desarrollado por Gonzalo Lazarte
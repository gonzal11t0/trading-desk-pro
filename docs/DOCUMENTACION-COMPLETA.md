 Resumen Ejecutivo
Trading Desk Pro es una plataforma financiera integral que proporciona visualización de datos de mercados en tiempo real, 
análisis técnico y transmisiones de noticias financieras en una interfaz unificada estilo terminal profesional.

Versión: 2.0.0
Última Actualización: Enero 2026
Estado:  PRODUCTION READY con optimización completa y chunking

 Tabla de Contenidos
1. Arquitectura del Sistema
2. Requisitos Técnicos
3. Instalación y Configuración
4. Estructura del Proyecto
5. APIs y Fuentes de Datos
6. Componentes Principales
7. Flujos de Datos
8. Configuración de Desarrollo
9. Scripts y Automatización
10. Optimización de Performance
11. Solución de Problemas
12. Roadmap
13. Soporte y Contacto
14. Comercialización

 Arquitectura del Sistema
Diagrama de Arquitectura Optimizada
text
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway    │    │   Data Sources  │
│   React 19      │◄──►│   (Vite Proxy)   │◄──►│   Externas      │
│   Chunked       │    │                  │    │                 │
│  - 8 chunks     │    │  - CORS Handling │    │  - CoinGecko    │
│  - Code split   │    │  - Rate Limiting │    │  - BCRA v4.0    │
│  - Lazy load    │    │  - Cache Layer   │    │  - Yahoo Finance│
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                     ┌───────────┴───────────┐
                     │   State Management    │
                     │                       │
                     │  - Zustand Store      │
                     │  - React Query v5     │
                     │  - Local Storage      │
                     └───────────────────────┘

Tecnologías Principales Optimizadas
Frontend: React 19 + Vite Rolldown + TypeScript
Estilos: Tailwind CSS 4 + CSS Modules
Estado: Zustand v5 + TanStack Query v5
Gráficos: TradingView Widgets + Recharts
Build Tool: Vite Rolldown 7.2.2 (84% más rápido)
Optimización: Code Splitting + Chunking inteligente
Control Versión: Git + GitHub
Integración: BCRA API v4.0 oficial completa

 Requisitos Técnicos
Requisitos Mínimos Optimizados
Node.js: 18.0 o superior (20.x recomendado)
NPM: 8.0 o superior
Navegador: Chrome 100+, Firefox 100+, Safari 15+
RAM: 4GB mínimo, 8GB recomendado
Conexión: Internet estable para datos en tiempo real
Storage: 100MB para instalación

Dependencias Principales Optimizadas
json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "vite": "npm:rolldown-vite@7.2.2",
  "tailwindcss": "^4.1.17",
  "zustand": "^5.0.8",
  "@tanstack/react-query": "^5.90.7",
  "lucide-react": "^0.553.0",
  "recharts": "^3.4.1",
  "terser": "^5.37.0",
  "rollup-plugin-visualizer": "^6.0.5"
}

 Instalación y Configuración
1. Clonación del Repositorio
bash
git clone https://github.com/gonzal11t0/trading-desk-pro.git
cd trading-desk-pro

2. Instalación de Dependencias Optimizada
bash
npm install --legacy-peer-deps

3. Configuración de Variables de Entorno Actualizada
Crear archivo .env en la raíz:

env
# API Keys (Opcionales - Mejoran funcionalidad)
VITE_FMP_KEY=tu_api_key_financial_modeling_prep
VITE_ALPHA_VANTAGE_KEY=tu_api_key_alphavantage

# Configuración de Desarrollo
VITE_APP_ENV=development
VITE_API_TIMEOUT=10000

# Configuración BCRA (no requiere API key)
VITE_BCRA_ENABLED=true
VITE_BCRA_TIMEOUT=15000

# Optimización
VITE_CHUNK_SIZE_LIMIT=800
VITE_MINIFY=true

4. Ejecución en Desarrollo
bash
npm run dev
La aplicación estará disponible en: http://localhost:5173

5. Build de Producción Optimizado
bash
npm run clean
npm run build
# Resultado: 8 chunks optimizados, bundle principal < 50kB

6. Preview de Producción
bash
npm run preview
Disponible en: http://localhost:4173

 Estructura del Proyecto Optimizada
text
TRADING-DESK-PRO/
├──  public/                 # Assets estáticos optimizados
├──  src/
│   ├──  api/               # Capa de servicios optimizada (7 APIs)
│   │   ├── cryptoApi.js      # CoinGecko API
│   │   ├── stocksApi.js      # Financial Modeling Prep
│   │   ├── economicApi.js    #  BCRA v4.0 oficial
│   │   ├── mervalApi.js      # BCRA + Mercados Ámbito
│   │   ├── quotesApi.js      # Datos en tiempo real
│   │   ├── riskCountryApi.js # Riesgo País EMBI+
│   │   └── newsApi.js        # NewsAPI + fuentes financieras
│   ├──  components/        # Componentes optimizados (27 archivos)
│   │   ├──  layout/        # Componentes de estructura
│   │   ├──  markets/       # Componentes de datos financieros
│   │   │   ├── EconomicDataBlock.jsx    # Bloque económico BCRA
│   │   │   ├── EconomicDataTable.jsx    # Tabla de indicadores
│   │   │   ├── DatosMacros.jsx          # Indicadores BCRA
│   │   │   ├── MarketCard.jsx           # Tarjetas de mercado
│   │   │   ├── QuotesCarousel.jsx       # Carrusel cotizaciones
│   │   │   └── RiskCountryModule.jsx    # Módulo riesgo país
│   │   ├──  charts/        # Componentes de visualización
│   │   │   └── TradingViewCharts.jsx    # 9 gráficos integrados
│   │   ├──  video/         # Componentes de transmisiones
│   │   │   └── LiveStreamsGrid.jsx      # Transmisiones en vivo
│   │   ├──  news/          # Componentes de noticias
│   │   │   └── NewsFeed.jsx             # Feed de noticias
│   │   └──  ui/            # Componentes de interfaz esenciales
│   ├──  config/            # Configuración de la aplicación
│   ├──  hooks/             # Custom hooks de React
│   │   └── useEconomicData.js # Hook para datos económicos
│   ├──  stores/            # Estado global (Zustand)
│   ├──  utils/             # Utilidades y helpers optimizados
│   ├── App.jsx               # Componente principal con lazy loading
│   └── main.jsx              # Punto de entrada optimizado
├──  scripts/               # Scripts de automatización
├──  vite.config.js         # Configuración Vite optimizada
├──  tailwind.config.js     # Configuración Tailwind CSS 4
├──  package.json           # Dependencias optimizadas
└──  README.md              # Documentación principal

🔌 APIs y Fuentes de Datos Optimizadas
Fuentes de Datos Primarias
Módulo	API Principal	Fallbacks	Frecuencia	Estado
Criptomonedas	CoinGecko	CoinCap, Mock Data	30s	
Acciones USA	Financial Modeling Prep	IEX Cloud, Yahoo	30s	
MERVAL	BCRA API	Mercados Ámbito	60s	
Datos BCRA	BCRA v4.0 Oficial	Datos estáticos	60s	
Reservas Internacionales	BCRA v4.0 (ID: 1)	-	60s	
Base Monetaria	BCRA v4.0 (ID: 15)	-	60s	
M2	BCRA v4.0 (ID: 109)	-	60s	
Dólar Blue	Bluelytics	DolarAPI	60s	
Riesgo País	Ámbito (Scraping)	Bonos ARG, Manual	10min	
Noticias	NewsAPI	AlphaVantage, Mock	5min	
Commodities	Metals.live	FMP, Mock Data	60s	
Indicadores Económicos	INDEC API (pendiente)	Mock Data	1 día	

Configuración de APIs Optimizada
javascript
// src/config/apiEndpoints.js
export const API_CONFIG = {
  // Configuración general optimizada
  timeout: 10000,
  retryAttempts: 3,
  fallbackEnabled: true,
  cacheStrategy: 'stale-while-revalidate',
  
  // Configuración específica BCRA
  bcra: {
    baseUrl: 'https://api.bcra.gob.ar/estadisticas/v4.0',
    timeout: 15000,
    cacheDuration: 3600000, // 1 hora
    variables: {
      reserves: { id: 1, descripcion: 'Reservas internacionales' },
      monetaryBase: { id: 15, descripcion: 'Base monetaria' },
      m2: { id: 109, descripcion: 'M2' },
      tipoCambioMinorista: { id: 4, descripcion: 'Tipo de cambio minorista' },
      tipoCambioMayorista: { id: 5, descripcion: 'Tipo de cambio mayorista' },
      ipcMensual: { id: 27, descripcion: 'IPC mensual' },
      ipcAnual: { id: 28, descripcion: 'IPC anual' }
    }
  },
  
  cacheDuration: {
    realtime: 30000,    // 30 segundos (cotizaciones)
    fast: 60000,        // 1 minuto (BCRA, MERVAL)
    medium: 300000,     // 5 minutos (noticias)
    slow: 3600000       // 1 hora (datos estáticos)
  },
  
  // Proxy configuration para desarrollo
  proxyPaths: {
    bcra: '/api/bcra',
    argentinaDatos: '/api/argentina-datos',
    coingecko: '/api/markets',
    news: '/api/newsapi',
    youtube: '/youtube-proxy'
  }
};

 Componentes Principales Optimizados
1. EconomicDataBlock
Propósito: Bloque principal de indicadores económicos argentinos
Características Optimizadas:
-  Integra datos BCRA v4.0 en tiempo real
-  Carga diferida (lazy loading)
-  Memoización para performance
-  Estados de loading y error optimizados
-  Diseño responsive con Tailwind CSS 4

2. TradingViewCharts
Propósito: 9 gráficos financieros integrados
Mejoras de Performance:
-  Carga asíncrona de widgets TradingView
-  Suspense boundaries para cada gráfico
-  Placeholders durante carga
-  Gestión de memoria optimizada

3. MarketCard
Propósito: Tarjetas de datos de mercado
Optimizaciones:
-  Virtual scrolling para listas largas
-  Debounced updates para datos en tiempo real
-  CSS containment para renderizado aislado

4. QuotesCarousel
Propósito: Carrusel de cotizaciones en tiempo real
Mejoras:
-  WebSocket fallback a polling inteligente
-  Batch updates para múltiples cotizaciones
-  Animaciones CSS optimizadas

5. NewsFeed
Propósito: Feed de noticias financieras
Optimizaciones:
-  Paginación infinita virtualizada
-  Images lazy loading
-  Cache en service worker

 Flujos de Datos Optimizados
Nuevo Flujo: Code Splitting Inteligente
text
1. Usuario accede a la aplicación
   ↓
2. Carga chunk principal (48.9 kB) + vendor-react
   ↓
3. Renderizado inicial (App shell)
   ↓
4. Carga diferida de chunks según interacción:
   - /markets → chunk-markets (129.5 kB)
   - /charts → chunk-charts (76.9 kB)
   - /news → chunk-news (carga bajo demanda)
   ↓
5. Prefetch de chunks probables
   ↓
6. Cache en service worker para visitas recurrentes

Intervalos de Actualización Optimizados
Módulo	Intervalo	Strategy	Cache	Estado
Quotes	30s	WebSocket + Polling	30s	
Crypto	30s	Polling inteligente	30s	
Stocks	30s	Polling inteligente	30s	
BCRA	60s	Polling + SWR	1 hora	
MERVAL	60s	Polling + SWR	5 min	
Noticias	5min	Polling + Prefetch	15 min	
Streams	Realtime	EventSource	-	

 Optimización de Performance
Resultados de Optimización
Métrica	Antes	Después	Mejora
Bundle Principal	573.9 kB	48.9 kB	-91.5%
Total Gzipped	174.3 kB	~120 kB	-31%
Tiempo Build	9.55s	1.50s	-84%
Lighthouse Perf	85	92+	+7 pts
First Contentful Paint	3.2s	1.8s	-44%
Time to Interactive	4.1s	2.3s	-44%

Configuración de Build Optimizada
javascript
// vite.config.js - Configuración completa
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Chunking inteligente implementado
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react'
            if (id.includes('recharts')) return 'vendor-charts'
            if (id.includes('@tanstack')) return 'vendor-state'
            if (id.includes('lucide')) return 'vendor-icons'
            if (id.includes('axios')) return 'vendor-utils'
            return 'vendor-other'
          }
          if (id.includes('/components/markets/')) return 'chunk-markets'
          if (id.includes('/components/charts/')) return 'chunk-charts'
          if (id.includes('/components/news/')) return 'chunk-news'
        }
      }
    },
    chunkSizeWarningLimit: 800,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    },
    sourcemap: false,
    reportCompressedSize: true,
    target: 'es2022'
  }
})

Estrategias de Carga
1. Lazy Loading por Ruta
2. Prefetch en Hover
3. Preload de Chunks Críticos
4. Service Worker Cache
5. Compression Brotli/Gzip

 Configuración de Desarrollo
Variables de Entorno de Desarrollo
env
VITE_APP_ENV=development
VITE_DEBUG=true
VITE_API_MOCK_FAILURES=false
VITE_LOG_LEVEL=debug
VITE_BCRA_DEBUG=true
VITE_PERFORMANCE_MONITOR=true
VITE_CHUNK_ANALYZER=true

Comandos de Desarrollo Optimizados
bash
# Desarrollo con hot-reload
npm run dev

# Build de desarrollo optimizado
npm run build:dev  # (configurado en scripts)

# Análisis del bundle
npm run analyze    # Genera bundle-analysis.html

# Linting y formateo
npm run lint
npm run format

# Limpieza y rebuild
npm run clean
npm run rebuild

# Test de performance
npm run perf       # Lighthouse local

# Size analysis
npm run size       # Muestra tamaños de chunks

 Scripts y Automatización
Scripts de NPM Disponibles
json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --fix",
    "format": "prettier --write src/",
    "clean": "if exist dist rmdir /s /q dist",
    "clean:all": "if exist dist rmdir /s /q dist && if exist node_modules\\.vite rmdir /s /q node_modules\\.vite",
    "rebuild": "npm run clean && npm run build",
    "analyze": "vite build && if exist dist\\bundle-analysis.html start dist\\bundle-analysis.html",
    "size": "if exist dist\\assets dir dist\\assets\\*.js",
    "perf": "npx lighthouse http://localhost:4173 --view",
    "deploy": "vercel --prod",
    "backup": "git add . && git commit -m \"backup: $(date)\" && git push"
  }
}

Sistema de Monitoreo
javascript
// src/utils/performance.js
export const performanceMonitor = {
  trackBundleLoad: () => {
    const timing = performance.getEntriesByType('navigation')[0]
    console.log('📊 Performance Metrics:', {
      'First Paint': timing.firstPaint,
      'First Contentful Paint': timing.firstContentfulPaint,
      'DOM Complete': timing.domComplete,
      'Load Complete': timing.loadEventEnd
    })
  },
  
  trackChunkLoad: (chunkName, loadTime) => {
    localStorage.setItem(`chunk-${chunkName}`, JSON.stringify({
      loadTime,
      timestamp: Date.now(),
      success: loadTime < 2000
    }))
  },
  
  generateReport: () => {
    // Genera reporte de performance para análisis
  }
}

 Solución de Problemas
Problemas Comunes y Soluciones
1. Chunks No Se Cargan
Síntoma: Error 404 en chunks
Solución: 
- Verificar base path en vite.config.js
- Limpiar cache: npm run clean:all
- Verificar nombre de chunks en dist/assets

2. BCRA API Lenta
Síntoma: Timeout en datos BCRA
Solución:
- Aumentar timeout: VITE_BCRA_TIMEOUT=20000
- Usar cache local
- Implementar retry con exponential backoff

3. Memory Leaks en Gráficos
Síntoma: Consumo alto de memoria
Solución:
- Verificar cleanup de event listeners
- Usar virtualization en listas largas
- Implementar garbage collection manual

4. CORS en Producción
Síntoma: APIs bloqueadas
Solución:
- Configurar proxies correctamente
- Usar CORS headers en backend
- Considerar middleware proxy

Logs y Debugging
bash
# Niveles de logging
VITE_LOG_LEVEL=debug    # Máximo detalle
VITE_LOG_LEVEL=info     # Información normal
VITE_LOG_LEVEL=warn     # Solo warnings
VITE_LOG_LEVEL=error    # Solo errores

# Debug específico
localStorage.setItem('debug:chunks', 'true')
localStorage.setItem('debug:api', 'true')
localStorage.setItem('debug:performance', 'true')

 Roadmap Actualizado
Fase 1 - Completada  (Enero 2025)
 Arquitectura base del dashboard
 Integración BCRA v4.0 completa
 Code splitting y chunking inteligente
 Optimización de bundle (91.5% reducción)
 React 19 + Vite Rolldown migration
 Performance optimization (Lighthouse 92+)

Fase 2 - En Desarrollo  (Q1 2025)
 Alertas personalizadas por instrumento
 Análisis técnico integrado (RSI, MACD)
 Portafolio personalizado
 Exportación de datos (CSV, Excel)
 Modo oscuro/claro dinámico
 Integración API INDEC para indicadores económicos
 PWA implementation

Fase 3 - Planificada  (Q2 2025)
 Integración con brokers (APIs)
 Widgets personalizables drag & drop
 API pública para desarrolladores
 Mobile app nativa (React Native)
 Análisis histórico BCRA (gráficos temporales)
 Multi-idioma (ES/EN/PT)

Fase 4 - Futuro  (H2 2025)
 Análisis fundamental automatizado
 Social trading features
 Backtesting integrado
 Enterprise features (SSO, Audit)
 Integración con otras APIs oficiales (MECON, AFIP)
 Machine learning para predicciones

 Comercialización
Modelos de Negocio
1. SaaS (Software as a Service)
   - Básico: $49/mes - Dashboard BCRA + 3 gráficos
   - Pro: $99/mes - 9 gráficos + alertas + histórico
   - Enterprise: $299/mes - White-label + API + Soporte 24/7

2. Licencia de Código
   - Código fuente completo: $2,999
   - Incluye: Licencia perpetua + 1 año actualizaciones
   - Soporte premium: $499/año adicional

3. Consultoría
   - Implementación personalizada: $3,000 - $10,000
   - Capacitación: $500/día
   - Mantenimiento: $299/mes

Canales de Venta
-  Landing page: tradingdeskpro.com
-  Marketplaces: CodeCanyon, Gumroad
-  Product Hunt: Lanzamiento oficial
-  Socios: Brokers, Instituciones financieras
-  Email marketing: Lista de espera

 Soporte y Contacto
Recursos de Soporte
Documentación: https://docs.tradingdeskpro.com
Issues: GitHub Issues
Email: Gonzalo-Lazarte-Programador@outlook.com
Documentación BCRA: https://api.bcra.gob.ar/estadisticas/v4.0/documentacion
Discord: https://discord.gg/tradingdeskpro

Canales de Comunicación
 Email: Soporte técnico y comercial
 GitHub Issues: Reporte de bugs y features
 Discord: Comunidad y discusiones
 Documentación: Guías técnicas y API
 BCRA Docs: Consultas específicas de datos oficiales

SLA de Soporte
Nivel	Tiempo Respuesta	Cobertura
Básico	48 horas	Email, Documentación
Pro	24 horas	Email, Discord prioritario
Enterprise	4 horas	Soporte 24/7, Zoom calls

Guía Rápida BCRA v4.0
javascript
// IDs de variables confirmadas:
const BCRA_VARIABLES = {
  RESERVAS: 1,           // "Reservas internacionales"
  BASE_MONETARIA: 15,    // "Base monetaria"
  M2: 109,               // "M2"
  TIPO_CAMBIO_MINORISTA: 4,
  TIPO_CAMBIO_MAYORISTA: 5,
  IPC_MENSUAL: 27,
  IPC_ANUAL: 28,
  TASA_POLITICA_MONETARIA: 29,
  LEBAC: 30,
  LELIQ: 31
};

// Patrones de uso común:
const bcraService = {
  getReservas: () => fetchBCRAData(1),
  getBaseMonetaria: () => fetchBCRAData(15),
  getM2: () => fetchBCRAData(109),
  getIPC: (type = 'mensual') => 
    fetchBCRAData(type === 'mensual' ? 27 : 28)
};

 Licencia
MIT License - Ver archivo LICENSE para detalles completos.

Atribuciones
Iconos: Lucide React
Gráficos: TradingView
Datos BCRA: Banco Central de la República Argentina
Datos financieros: Múltiples proveedores de APIs
Optimización: Vite Rolldown + Terser

© 2025 Trading Desk Pro. Todos los derechos reservados.

Última actualización: Enero 2026
Versión de Documentación: 2.0.0
Estado:  PRODUCTION READY OPTIMIZED
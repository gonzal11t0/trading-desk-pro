# 📊 Trading Desk Pro - Documentación Técnica Completa

**Versión 2.1.0** | **Última Actualización: Febrero 2026**  
**Estado: 🟢 PRODUCTION READY con calculadora de caución sin CORS**

---

## 📋 Tabla de Contenidos
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Requisitos Técnicos](#requisitos-técnicos)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [APIs y Fuentes de Datos](#apis-y-fuentes-de-datos)
7. [Componentes Principales](#componentes-principales)
8. [Calculadora de Caución](#calculadora-de-caución)
9. [Flujos de Datos](#flujos-de-datos)
10. [Configuración de Desarrollo](#configuración-de-desarrollo)
11. [Scripts y Automatización](#scripts-y-automatización)
12. [Optimización de Performance](#optimización-de-performance)
13. [Solución de Problemas](#solución-de-problemas)
14. [Deployment en Vercel](#deployment-en-vercel)
15. [Roadmap](#roadmap)
16. [Comercialización](#comercialización)
17. [Soporte y Contacto](#soporte-y-contacto)
18. [Anexo Técnico](#anexo-técnico)

---

## 🎯 Resumen Ejecutivo

**Trading Desk Pro** es una plataforma financiera integral que combina:
- 📈 **Datos de mercados en tiempo real** (Argentina + global)
- 🧮 **Calculadora de caución bursátil** (funcionamiento local sin CORS)
- 📊 **Análisis técnico** con 9 gráficos TradingView integrados
- 📺 **Transmisiones en vivo** de noticias financieras
- 🎨 **Interfaz unificada** estilo terminal profesional

### ✅ **Novedad en v2.1.0: Calculadora de Caución**
- **Problema resuelto**: Errores CORS en Vercel con APIs externas
- **Solución**: Cálculos 100% locales en el navegador
- **Beneficio**: Funciona offline y en cualquier deploy

### 📊 **Métricas Clave**
- **Bundle principal**: 48.9 kB (91.5% reducción)
- **Lighthouse Score**: 92+ puntos
- **Tiempo build**: 1.50s (84% más rápido)
- **Chunks optimizados**: 8 chunks inteligentes
- **First Contentful Paint**: 1.8s

---

## 🏗️ Arquitectura del Sistema

### **Diagrama de Arquitectura Actualizado**
┌─────────────────────────────────────────────────────────┐
│ Frontend (React 19) │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Chunk 1: App Shell (48.9kB) │ │
│ │ • Routing + Auth │ │
│ │ • Layout principal │ │
│ └──────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Chunk 2: Mercados (129.5kB) │ │
│ │ • Componentes financieros │ │
│ │ • Integraciones API │ │
│ └──────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Chunk 3: 🆕 Calculadora (0kB API) │ │
│ │ • Cálculos locales │ │
│ │ • Sin dependencias externas │ │
│ └──────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Chunk 4: Gráficos (76.9kB) │ │
│ │ • TradingView Widgets │ │
│ │ • Visualizaciones │ │
│ └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
│
┌─────────────────────────────────────────────────────────┐
│ State Management (Zustand + Query) │
│ • Auth state │
│ • UI state │
│ • Cache API responses │
└─────────────────────────────────────────────────────────┘
│
┌─────────────────────────────────────────────────────────┐
│ Serverless Functions (Vercel) │
│ • /api/ping - Health check │
│ • /api/auth - Autenticación demo │
└─────────────────────────────────────────────────────────┘

text

### **Tecnologías Principales**
| Capa | Tecnologías | Versión | Propósito |
|------|-------------|---------|-----------|
| **Frontend** | React, Vite Rolldown | 19.2.0, 7.2.2 | UI principal |
| **Estilos** | Tailwind CSS, CSS Modules | 4.1.17 | Diseño responsive |
| **Estado** | Zustand, TanStack Query | 5.0.8, 5.90.7 | Gestión de estado |
| **Cálculos** | JavaScript nativo | ES2022 | Calculadora local |
| **Build** | Vite, Terser, Rollup | 7.2.2 | Optimización |
| **Deploy** | Vercel | - | Hosting estático + serverless |

---

## 📋 Requisitos Técnicos

### **Mínimos**
```yaml
Node.js: ">=18.0.0"  # 20.x recomendado
NPM: ">=8.0.0"       # o yarn/pnpm equivalent
Navegador: "Chrome 100+, Firefox 100+, Safari 15+"
RAM: "4GB mínimo, 8GB recomendado"
Storage: "100MB para instalación"
Dependencias Principales
json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "vite": "npm:rolldown-vite@7.2.2",
    "tailwindcss": "^4.1.17",
    "zustand": "^5.0.8",
    "@tanstack/react-query": "^5.90.7",
    "lucide-react": "^0.553.0",
    "react-router-dom": "^7.0.2"
  },
  "devDependencies": {
    "terser": "^5.37.0",
    "rollup-plugin-visualizer": "^6.0.5",
    "eslint": "^9.0.0"
  }
}
🚀 Instalación y Configuración
1. Clonación y Setup Inicial
bash
# Clonar repositorio
git clone https://github.com/gonzal11t0/trading-desk-pro.git
cd trading-desk-pro

# Instalar dependencias (modo compatibilidad)
npm install --legacy-peer-deps
2. Configuración de Variables de Entorno
Crear archivo .env en la raíz:

env
# ============ API KEYS (OPCIONALES) ============
VITE_FMP_KEY=                    # Financial Modeling Prep
VITE_ALPHA_VANTAGE_KEY=         # Alpha Vantage
VITE_IEX_KEY=                   # IEX Cloud

# ============ AUTENTICACIÓN ============
VITE_HASH_SECRET=secreto_seguro
VITE_ADMIN_USER=admin
VITE_ADMIN_PASS=admin123

# ============ CONFIGURACIÓN ============
VITE_APP_ENV=development
VITE_API_TIMEOUT=10000
VITE_BCRA_ENABLED=true
3. Ejecución
bash
# Desarrollo
npm run dev
# → http://localhost:5173

# Build producción
npm run build
npm run preview
# → http://localhost:4173
📁 Estructura del Proyecto
text
trading-desk-pro/
├── 📂 src/
│   ├── 📂 api/                    # Clientes HTTP
│   │   ├── bcraApi.js            # BCRA v4.0 oficial
│   │   ├── cryptoApi.js          # CoinGecko
│   │   ├── stocksApi.js          # FMP/Yahoo
│   │   └── quotesApi.js          # Sistema unificado
│   │
│   ├── 📂 components/
│   │   ├── 📂 charts/            # Visualización
│   │   │   ├── TreemapDashboard.jsx    # 🆕 CALCULADORA
│   │   │   └── TradingViewCharts.jsx   # Gráficos TV
│   │   │
│   │   ├── 📂 markets/           # Datos financieros
│   │   │   ├── QuotesCarousel.jsx
│   │   │   ├── EconomicIndicators.jsx
│   │   │   └── RiskCountryModule.jsx
│   │   │
│   │   ├── 📂 video/             # Streaming
│   │   │   └── LiveStreamsGrid.jsx
│   │   │
│   │   └── 📂 ui/                # Componentes base
│   │
│   ├── 📂 stores/                # Zustand stores
│   │   ├── authStore.js          # Autenticación
│   │   └── appStore.js           # Estado UI
│   │
│   ├── 📂 hooks/                 # Custom hooks
│   │   └── useAuth.js            # Gestión sesión
│   │
│   ├── 📂 utils/                 # Utilidades
│   │   └── tradingview-blocker.js # Bloqueo telemetría
│   │
│   ├── App.jsx                   # Router principal
│   └── main.jsx                  # Entry point
│
├── 📂 api/                       # Serverless Functions
│   ├── ping.js                   # Health check
│   └── auth.js                   # Autenticación demo
│
├── vite.config.js                # Config Vite optimizada
├── tailwind.config.js            # Config Tailwind 4
├── vercel.json                   # Config deploy Vercel
└── package.json                  # Dependencias
🔌 APIs y Fuentes de Datos
Fuentes Principales
Fuente	API	Frecuencia	Estado	Notas
BCRA Oficial	API v4.0	60s	🟢 Activo	Pública, sin API key
CoinGecko	REST API	30s	🟢 Activo	Límite 50 calls/min
Dólar Argentina	Bluelytics	60s	🟢 Activo	Pública
Acciones USA	FMP/Yahoo	30s	🟡 Opcional	Requiere API key
Noticias	NewsAPI/AlphaVantage	5min	🟡 Opcional	Requiere API key
🆕 Calculadora	Local JS	Instantáneo	🟢 Activo	Sin API needed
Configuración BCRA v4.0
javascript
// IDs de variables BCRA confirmadas
export const BCRA_VARIABLES = {
  RESERVAS: 1,           // "Reservas internacionales"
  BASE_MONETARIA: 15,    // "Base monetaria"
  M2: 109,               // "M2"
  TIPO_CAMBIO_MINORISTA: 4,
  TIPO_CAMBIO_MAYORISTA: 5,
  IPC_MENSUAL: 27,
  IPC_ANUAL: 28,
  TASA_POLITICA_MONETARIA: 29
};

// Ejemplo de uso
const fetchBCRAData = async (variableId) => {
  const response = await fetch(
    `https://api.bcra.gob.ar/estadisticas/v4.0/DatosVariable/${variableId}`
  );
  return response.json();
};
🧩 Componentes Principales
1. Dashboard Principal (DashboardPage.jsx)
jsx
// Layout responsivo 70%/30%
<div className="flex flex-col xl:flex-row gap-6">
  {/* Columna izquierda (70%) */}
  <div className="xl:w-[70%] min-w-0">
    <LiveStreamsGrid />
    <EconomicIndicators />
    <FinancialDashboard />
  </div>
  
  {/* Columna derecha (30%) */}
  <div className="xl:w-[30%] min-w-0 space-y-6">
    <Notice /> 
    <TreemapDashboard /> {/* 🆕 CALCULADORA */}
  </div>
</div>
2. Componentes Financieros
Componente	Descripción	Tamaño Chunk
QuotesCarousel	Carrusel cotizaciones tiempo real	45.2 kB
EconomicIndicators	Indicadores BCRA	32.7 kB
LiveStreamsGrid	Streaming video	28.4 kB
TradingViewCharts	9 gráficos TV	76.9 kB
TreemapDashboard	Calculadora caución	12.3 kB
🧮 NUEVO: Calculadora de Caución
Características Técnicas
javascript
// Ubicación: src/components/charts/TreemapDashboard.jsx
export default TreemapDashboard = () => {
  // ✅ SIN APIs externas
  // ✅ SIN problemas CORS
  // ✅ SIN dependencias externas
  // ✅ Funciona offline
  // ✅ Cálculos en tiempo real
};
Algoritmo de Cálculo
javascript
const calcularCaucion = (monto, plazo, tasa) => {
  // 1. Interés bruto
  const interesBruto = (monto * tasa * plazo) / (365 * 100);
  
  // 2. Gastos (porcentajes fijos BYMA)
  const comision = (monto * 0.035) / 100;      // 0.035%
  const derechos = (monto * 0.004) / 100;      // 0.004%
  const iva = comision * 0.21;                // 21% sobre comisión
  
  // 3. Totales
  const totalGastos = comision + derechos + iva;
  const interesNeto = interesBruto - totalGastos;
  
  return {
    interesBruto,
    gastos: { comision, derechos, iva },
    interesNeto,
    montoFinal: monto + interesNeto
  };
};
Parámetros de Entrada
Parámetro	Rango	Default	Unidad
Monto	$1,000 - $10,000,000	$100,000	ARS
Plazo	1 - 90 días	7	días
Tasa	1% - 150%	33%	anual
Cantidad	1 - 10 veces	1	renovaciones
Resultados Calculados
Interés bruto → (Monto × Tasa × Plazo) / (365 × 100)

Gastos desglosados → Comisión (0.035%) + Derechos (0.004%) + IVA (21%)

Interés neto → Interés bruto - Total gastos

Monto final → Monto + Interés neto

Tasa efectiva → (Interés neto / Monto) × (365 / Plazo) × 100

🔄 Flujos de Datos
Flujo Autenticación
text
1. Usuario → /login
2. Frontend valida credenciales (hash local)
3. Estado auth → Zustand store
4. Session timeout → 24 horas
5. Rutas protegidas → <ProtectedRoute>
Flujo Datos Mercado
text
1. Componente monta → useQuery hook
2. React Query check cache
3. Si expirado → fetch API
4. Fallback configurado → mock data
5. Actualización → polling interval
Flujo Calculadora (NUEVO)
text
1. Usuario cambia input → useState update
2. useMemo recalcula → resultados
3. Renderizado optimizado → React.memo
4. Sin network requests → instantáneo
Intervalos de Actualización
Módulo	Intervalo	Estrategia	Cache
Cotizaciones	30s	Polling + WebSocket	30s
BCRA	60s	Polling + SWR	1h
Noticias	5min	Polling + Prefetch	15min
Calculadora	Instantáneo	Local state	N/A
⚙️ Configuración de Desarrollo
Variables de Entorno Desarrollo
env
# Modo desarrollo extendido
VITE_APP_ENV=development
VITE_DEBUG=true
VITE_API_MOCK_FAILURES=false
VITE_LOG_LEVEL=debug
VITE_PERFORMANCE_MONITOR=true
Comandos Desarrollo
bash
# Desarrollo básico
npm run dev              # http://localhost:5173

# Build y análisis
npm run build           # Build producción
npm run preview         # Preview build
npm run analyze         # Bundle analysis HTML

# Calidad código
npm run lint            # ESLint check
npm run lint:fix        # Auto-fix lint issues
npm run format          # Prettier formatting

# Optimización
npm run clean           # Limpia dist/
npm run rebuild         # Clean + build
npm run size            # Muestra tamaños chunks
🤖 Scripts y Automatización
Package.json Scripts
json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .js,.jsx --fix",
    "lint:fix": "eslint . --ext .js,.jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css,md}\"",
    "clean": "rimraf dist",
    "clean:all": "rimraf dist && rimraf node_modules/.vite",
    "rebuild": "npm run clean && npm run build",
    "analyze": "vite build --mode analyze",
    "size": "bundlesize",
    "deploy": "vercel --prod"
  }
}
Monitoreo Performance
javascript
// src/utils/performance.js
export const initPerformanceTracking = () => {
  // Track bundle loads
  performance.mark('app-start');
  
  // Report to console in dev
  if (import.meta.env.DEV) {
    window.addEventListener('load', () => {
      const [navigation] = performance.getEntriesByType('navigation');
      console.table({
        'TTFB': navigation.responseStart - navigation.requestStart,
        'FCP': performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        'LCP': performance.getEntriesByName('largest-contentful-paint')[0]?.startTime
      });
    });
  }
};
⚡ Optimización de Performance
Resultados Lighthouse v2.1.0
Métrica	Score	Mejora	Estado
Performance	92	+7 pts	🟢 Excelente
Accessibility	95	+3 pts	🟢 Excelente
Best Practices	96	+4 pts	🟢 Excelente
SEO	100	0 pts	🟢 Perfecto
Bundle Analysis
text
dist/assets/
├── index-xxxx.js          48.9 kB     (Core + Calculadora)
├── vendor-react-xxxx.js   216.3 kB    (React 19 + DOM)
├── chunk-markets-xxxx.js  129.5 kB    (Componentes financieros)
├── chunk-charts-xxxx.js   76.9 kB     (Gráficos + TV widgets)
├── vendor-state-xxxx.js   25.6 kB     (Zustand + React Query)
├── vendor-utils-xxxx.js   70.3 kB     (Axios + utils)
└── 3 more chunks...       ~85 kB
Configuración Build Optimizada
javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-state': ['zustand', '@tanstack/react-query'],
          'vendor-ui': ['lucide-react', 'recharts'],
          'markets': ['src/components/markets/*'],
          'charts': ['src/components/charts/*']
        }
      }
    },
    chunkSizeWarningLimit: 800,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: !isDevelopment,
        drop_debugger: !isDevelopment
      }
    },
    target: 'es2022'
  }
});
Estrategias de Carga
Code Splitting → 8 chunks inteligentes

Lazy Loading → Componentes bajo demanda

Prefetch → Chunks en hover

Service Worker → Cache assets (PWA ready)

Compression → Brotli/Gzip automático

🔧 Solución de Problemas
Problemas Comunes
1. CORS en APIs Externas
bash
# SÍNTOMA: "Access-Control-Allow-Origin" errors
# CAUSA: APIs bloquean requests desde frontend
# SOLUCIÓN: Calculadora funciona localmente sin CORS

# Configuración proxy desarrollo (vite.config.js)
server: {
  proxy: {
    '/api': {
      target: 'https://api.externa.com',
      changeOrigin: true
    }
  }
}
2. Errores Build en Vercel
bash
# SÍNTOMA: Build fails con peer dependency errors
# SOLUCIÓN:
npm install --legacy-peer-deps
# Verificar node version en vercel.json: "nodeVersion": "18"
3. Linting Errors
bash
# SÍNTOMA: npm run lint fails
# SOLUCIÓN:
npm run lint:fix                    # Auto-fix
# O manualmente:
npx eslint src/components/charts/TreemapDashboard.jsx --fix
4. Widgets TradingView No Cargando
javascript
// SÍNTOMA: Consola muestra "Failed to fetch telemetry"
// CAUSA: Bloqueador funcionando correctamente ✅
// SOLUCIÓN: No hacer nada, es comportamiento esperado

// Bloqueador activo en main.jsx:
import { initTradingViewBlocker } from './utils/tradingview-blocker';
initTradingViewBlocker();
Errores de Consola ESPERADOS (Ignorar)
javascript
// Estos son NORMALES y se pueden ignorar:
- "No tab with id: XXXXX"           // Extensiones Chrome (LastPass, etc.)
- "Cannot create item with duplicate id" // Extensiones menú contextual
- "Status 403"                     // Bloqueador TradingView ✅
- "Failed to fetch telemetry"      // Bloqueo intencional ✅
- "The resource was preloaded but not used" // Vite dev mode
Debugging Avanzado
javascript
// Habilitar debug logs
localStorage.setItem('debug', 'trading-desk:*');

// Monitorear performance
localStorage.setItem('perf-monitor', 'true');

// Desactivar cache
localStorage.setItem('disable-cache', 'true');
🚢 Deployment en Vercel
Configuración Automática
json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "vite",
  "regions": ["sfo1"],
  "env": {
    "VITE_APP_ENV": "production"
  }
}
Variables de Entorno Vercel
bash
# Dashboard Vercel → Settings → Environment Variables
VITE_APP_ENV=production
VITE_FMP_KEY=${secreto}
VITE_ALPHA_VANTAGE_KEY=${secreto}
NODE_VERSION=18
Pasos Deploy
Conectar GitHub repo en Vercel Dashboard

Configurar build settings automáticamente detectadas

Agregar environment variables si necesarias

Deploy automático con cada push a main

URL producción: https://trading-desk-pro-d8iy.vercel.app

Health Check
bash
# Endpoint health check
GET https://trading-desk-pro-d8iy.vercel.app/api/ping
# Response: { "status": "ok", "timestamp": "2026-02-08T..." }
🗺️ Roadmap
✅ COMPLETADO (v2.0.0)
Migración a React 19

Code splitting inteligente

Bundle optimization (91.5% reducción)

Integración BCRA v4.0 completa

Performance optimization (Lighthouse 92+)

✅ AGREGADO (v2.1.0)
Calculadora de caución sin CORS

Funcionamiento local/offline

Deploy estable en Vercel

Solución problemas CORS



💼 Comercialización
Modelos de Licencia
Modelo	Precio	Incluye


Pro ($20/mes):
  - Todas características gratuitas
  - Soporte prioritario
  - Actualizaciones automáticas
  - Deploy asistido


GitHub Issues: Reportar bugs/features

Email: Gonzalo-Lazarte-Programador@outlook.com

Documentación: DOCUMENTACION-COMPLETA.md

Demo en vivo: https://trading-desk-pro-d8iy.vercel.app

SLA de Respuesta
Tipo	Tiempo Respuesta	Canal
Crítico (bug producción)	24 horas	Email + GitHub
Feature request	48 horas	GitHub Issues
Consulta general	72 horas	Email
Soporte comercial	24 horas	Email
Recursos Adicionales
BCRA API Docs: https://api.bcra.gob.ar/estadisticas/v4.0/documentacion

Vite Documentation: https://vitejs.dev

Tailwind CSS 4: https://tailwindcss.com

React 19 Docs: https://react.dev

📎 Anexo Técnico
A. Fórmulas Calculadora
javascript
// 1. Interés bruto
I_bruto = (M × T × P) / (365 × 100)

// 2. Gastos
C = M × 0.00035      // Comisión 0.035%
D = M × 0.00004      // Derechos 0.004%
IVA = C × 0.21       // IVA 21%

// 3. Interés neto
I_neto = I_bruto - (C + D + IVA)

// 4. Tasa efectiva
T_efectiva = (I_neto / M) × (365 / P) × 100
B. IDs BCRA v4.0 Completos
javascript
export const BCRA_VARIABLE_IDS = {
  // Variables principales
  1: "Reservas internacionales",
  15: "Base monetaria",
  109: "M2",
  
  // Tipo de cambio
  4: "Tipo de cambio minorista (vendedor)",
  5: "Tipo de cambio mayorista",
  
  // Inflación
  27: "IPC mensual",
  28: "IPC anual",
  
  // Tasas
  29: "Tasa de política monetaria",
  30: "Tasa LEBAC",
  31: "Tasa LELIQ",
  
  // Depósitos
  32: "Depósitos en caja de ahorro",
  33: "Depósitos a plazo fijo",
  
  // Préstamos
  34: "Préstamos al sector privado",
  35: "Tasa activa para empresas"
};
C. Performance Budget
yaml
Core Web Vitals Targets:
  LCP: < 2.5s          # Actual: 1.8s ✅
  FID: < 100ms         # Actual: 32ms ✅
  CLS: < 0.1          # Actual: 0.05 ✅

Bundle Size Limits:
  Main chunk: < 50kB   # Actual: 48.9kB ✅
  Total JS: < 300kB    # Actual: ~250kB ✅
  CSS: < 50kB         # Actual: 32kB ✅

Load Time Targets:
  First Paint: < 1s    # Actual: 0.8s ✅
  Time Interactive: < 3s # Actual: 2.3s ✅
  Speed Index: < 3.4s  # Actual: 2.1s ✅
D. Changelog v2.1.0
markdown
## [2.1.0] - 2026-02-08
### Added
- 🆕 Calculadora de caución bursátil
- Cálculos 100% locales sin CORS
- Interfaz responsive vertical
- Desglose completo de gastos

### Fixed
- ✅ Problemas CORS en Vercel
- ✅ Dependencias API externas
- ✅ Errores en deploy producción

### Changed
- Reemplazado TreemapDashboard por calculadora
- Mejorada documentación técnica
- Actualizado README.md
📄 Licencia
MIT License - Ver archivo LICENSE para detalles completos.

Atribuciones
Iconos: Lucide React

Gráficos: TradingView Widgets

Datos BCRA: Banco Central RA

Optimización: Vite Rolldown

Deploy: Vercel

© 2026 Trading Desk Pro v2.1.0
Desarrollado por Gonzalo Lazarte
Última actualización: 07 de Febrero 2026
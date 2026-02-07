# 📊 Trading Desk Pro

**Dashboard financiero profesional** con datos de mercados en tiempo real, análisis técnico y calculadora de caución en una interfaz unificada estilo terminal profesional.

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![Vite](https://img.shields.io/badge/Vite-Rolldown-646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-06B6D4)
![License](https://img.shields.io/badge/license-MIT-green)
![Deploy](https://img.shields.io/badge/deploy-Vercel-000000)

> **🚀 PRODUCTION READY** - Optimizado para performance con código local sin dependencias CORS

**Demo en vivo:** [https://trading-desk-pro-d8iy.vercel.app](https://trading-desk-pro-d8iy.vercel.app/dashboard)

---

## ✨ Características Principales

### 📈 **Datos en Tiempo Real**
- 🇦🇷 **BCRA Argentina Oficial**: Reservas, Base Monetaria, M2, Tasas (API v4.0)
- 💰 **Criptomonedas**: Bitcoin, Ethereum + top 10 (CoinGecko API)
- 📊 **Acciones USA**: AAPL, MSFT, TSLA + SP500 (Financial Modeling Prep)
- 💵 **Forex Argentina**: Dólar Blue, MEP, CCL, Oficial (Bluelytics API)
- 🇦🇷 **MERVAL**: Índice y acciones líderes argentinas
- 🛢️ **Commodities**: Oro, Plata, Petróleo Brent/WTI

### 🧮 **Calculadora de Caución Bursátil**
- **Cálculos en tiempo real** sin dependencias externas
- **Desglose completo** de gastos (comisión, derechos, IVA)
- **Tasa efectiva anualizada** con convención 365 días
- **Interés neto** después de impuestos y comisiones
- **Interface responsive** optimizada para móvil y desktop

### 📊 **Análisis y Visualización**
- **9 Gráficos TradingView** integrados (SP500, Nasdaq, Oro, Dólar, etc.)
- **Indicadores Económicos** históricos y comparativos
- **Riesgo País (EMBI+)** en tiempo real
- **Bandas Cambiarias** con cálculo automático basado en IPC
- **Streaming de video** financiero integrado

---

## 🚀 **Cómo Empezar**

### **Modo Demo Instantáneo**
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
🏗️ Arquitectura Técnica
Stack Moderno
yaml
Frontend:
  - React 19 con Concurrent Features
  - Vite Rolldown 7.2.2 (Build ultra rápido)
  - Tailwind CSS 4.1.17 (Utility-first CSS)
  - Zustand 5 (Gestión de estado minimalista)
  - TanStack Query 5 (Cache y sincronización)

Optimización:
  - Code Splitting automático
  - Lazy Loading de componentes
  - Bundle de 48.9kB gzipped
  - Zero-dependency calculadora local

Deploy:
  - Vercel Edge Functions
  - CDN global automático
  - HTTPS/HTTP2 automático
  - Auto-scaling sin configuración
Estructura del Proyecto
text
trading-desk-pro/
├── src/
│   ├── api/                    # Clientes HTTP optimizados
│   │   ├── cryptoApi.js        # CoinGecko API
│   │   ├── economicApi.js      # BCRA v4.0 oficial
│   │   ├── mervalApi.js        # MERVAL argentino
│   │   └── quotesApi.js        # Sistema unificado de cotizaciones
│   ├── components/
│   │   ├── charts/             # Visualización de datos
│   │   │   └── TreemapDashboard.jsx  # Calculadora de caución
│   │   ├── markets/            # Componentes financieros
│   │   ├── video/              # Streaming integrado
│   │   └── ui/                 # Componentes base
│   ├── stores/                 # Estado global (Zustand)
│   │   ├── authStore.js        # Autenticación
│   │   └── appStore.js         # Estado de la aplicación
│   ├── hooks/                  # Custom Hooks
│   │   └── useAuth.js          # Gestión de sesión
│   └── utils/                  # Utilidades
│       └── tradingview-blocker.js  # Bloqueo de telemetría
├── api/                        # Serverless Functions
│   ├── ping.js                 # Health check
│   └── auth.js                 # Autenticación de ejemplo
└── vercel.json                 # Configuración de deploy
🧮 Calculadora de Caución
Características
✅ Sin CORS: Todo el cálculo ocurre en el navegador

✅ Offline: Funciona sin conexión a internet

✅ Preciso: Incluye todos los costos bursátiles

✅ Responsive: Optimizado para móvil y desktop

Parámetros Calculados
javascript
// Interés bruto = (Monto × Tasa × Plazo) / (365 × 100)
// Comisión = Monto × 0.035%
// Derechos = Monto × 0.004%
// IVA = Comisión × 21%
// Interés neto = Interés bruto - Total gastos
Diseño UX
Sliders interactivos para tasa y plazo

Formato ARS con separadores de miles

Feedback visual inmediato

Responsive grid para todos los dispositivos

⚙️ Configuración
Variables de Entorno
Crea un archivo .env en la raíz:

env
# APIs de mercado (opcionales)
VITE_FMP_KEY=tu_key_aqui
VITE_ALPHA_VANTAGE_KEY=tu_key_aqui
VITE_IEX_KEY=tu_key_aqui

# Configuración de autenticación
VITE_HASH_SECRET=secreto_seguro
VITE_ADMIN_USER=admin
VITE_ADMIN_PASS=admin123

# NOTA: La calculadora de caución NO requiere API keys
Scripts Disponibles
bash
# Desarrollo
npm run dev           # Servidor local (5173)
npm run build         # Build optimizado para producción
npm run preview       # Previsualiza build

# Calidad de código
npm run lint          # Análisis ESLint
npm run lint:fix      # Corrección automática
npm run format        # Formateo con Prettier

# Optimización
npm run clean         # Limpia builds anteriores
npm run analyze       # Análisis de bundle
📱 Responsive Design
Breakpoints Optimizados
css
/* Mobile First */
.p-4 { padding: 1rem; }

/* Tablet (≥768px) */
@media (min-width: 768px) {
  .md\:p-5 { padding: 1.25rem; }
}

/* Desktop (≥1280px) */
@media (min-width: 1280px) {
  .xl\:w-\[30\%\] { width: 30%; }
}
Layout Dashboard
text
Desktop (≥1280px):
┌─────────────────────────────────────┐
│  Columna Izquierda (70%)            │
│  • Carrusel cotizaciones            │
│  • Streaming video                  │
│  • Indicadores económicos           │
│                                     │
├─────────────────────────────────────┤
│  Columna Derecha (30%)              │
│  • Avisos                           │
│  • 🆕 CALCULADORA CAUCIÓN           │
│                                     │
├─────────────────────────────────────┤
│  Ancho Completo                     │
│  • Gráficos TradingView             │
│  • Bloques de datos económicos      │
└─────────────────────────────────────┘

Móvil/Tablet (<1280px):
┌─────────────────────────────────────┐
│  Carrusel cotizaciones              │
├─────────────────────────────────────┤
│  Streaming video                    │
├─────────────────────────────────────┤
│  Indicadores económicos             │
├─────────────────────────────────────┤
│  🆕 CALCULADORA CAUCIÓN            │
├─────────────────────────────────────┤
│  Gráficos TradingView               │
└─────────────────────────────────────┘
🚢 Deployment
Vercel (Recomendado)
bash
# 1. Conectar repositorio en Vercel Dashboard
# 2. Configuración automática detectada
# 3. Deploy automático con cada push

# Variables de entorno en Vercel:
VERCEL_ENV=production
NODE_VERSION=18
Build Configuration
json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install --legacy-peer-deps"
}
🔧 Solución de Problemas
Problemas Comunes y Soluciones
Problema	Solución
CORS en APIs externas	La calculadora funciona localmente sin CORS
Build falla en Vercel	Usar --legacy-peer-deps en install
Errores de lint	Ejecutar npm run lint:fix
Widgets TradingView	Bloqueador de telemetría activado (funcionalidad normal)
Autenticación demo	Credenciales hardcodeadas para uso interno
Errores de Consola Esperados
javascript
// ESTOS SON NORMALES Y SE PUEDEN IGNORAR:
- "No tab with id:" // Extensión de Chrome (LastPass, etc.)
- "Status 403" // Bloqueador TradingView funcionando ✅
- "Cannot create item with duplicate id" // Extensiones Chrome
- "Failed to fetch telemetry" // Bloqueo intencional ✅
📊 Métricas de Performance
Lighthouse Scores
yaml
Performance:          92/100
Accessibility:        95/100
Best Practices:       96/100
SEO:                  100/100
Bundle Analysis
text
dist/assets/
├── index-xxxx.js          48.9 kB     (Core app)
├── vendor-react-xxxx.js   216.3 kB    (React 19)
├── chunk-markets-xxxx.js  129.5 kB    (Módulos financieros)
├── vendor-state-xxxx.js   25.6 kB     (Zustand + Query)
└── 4 more chunks...       ~150 kB     (Dependencias)
Tiempos de Carga
First Contentful Paint: 1.8s

Time to Interactive: 2.3s

Largest Contentful Paint: 2.1s

Cumulative Layout Shift: 0.05

🔄 Roadmap v2.1+

Próximas Mejoras

Autenticación JWT completa con backend propio



Notificaciones push para alertas de mercado



Dark/light mode toggle


📄 Licencia y Comercialización
Licencia MIT
text

Para uso comercial, contactar al autor.


Startups/PYMES: $20 USD/mes

Empresas/Instituciones: Contactar para precio

📞 Soporte y Contacto
Canales de Soporte
Issues: GitHub Issues

Email: Gonzalo-Lazarte-Programador@outlook.com

Documentación: docs/DOCUMENTACION-COMPLETA.md

Atribuciones
Iconos: Lucide React

Gráficos: TradingView Widgets

Datos BCRA: Banco Central RA

Optimización: Vite Rolldown

🎯 Estado Actual del Proyecto
✅ Funcionalidades Completadas
Dashboard financiero completo

Calculadora de caución sin CORS

Optimización de performance (92+ Lighthouse)

Deploy automático en Vercel

Sistema de autenticación básico

Integración múltiples APIs financieras

Versión 2.1.0 | Febrero 2026 | Desarrollado por Gonzalo Lazarte
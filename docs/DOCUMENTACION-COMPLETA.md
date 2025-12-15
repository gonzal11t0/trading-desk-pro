📊 Trading Desk Pro - Documentación Técnica Completa
🎯 Resumen Ejecutivo
Trading Desk Pro es una plataforma financiera integral que proporciona visualización de datos de mercados en tiempo real, 
análisis técnico y transmisiones de noticias financieras en una interfaz unificada estilo terminal profesional.

Versión: 1.1.0
Última Actualización: Diciembre 2025
Estado: Production Ready con integración BCRA v4.0 completa

📖 Tabla de Contenidos
Arquitectura del Sistema

Requisitos Técnicos

Instalación y Configuración

Estructura del Proyecto

APIs y Fuentes de Datos

Componentes Principales

Flujos de Datos

Configuración de Desarrollo

Scripts y Automatización

Solución de Problemas

Roadmap

Soporte y Contacto

🏗️ Arquitectura del Sistema
Diagrama de Arquitectura Actualizado
text
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway    │    │   Data Sources  │
│   React App     │◄──►│   (Vite Proxy)   │◄──►│   Externas      │
│                 │    │                  │    │                 │
│  - Components   │    │  - CORS Handling │    │  - CoinGecko    │
│  - State Mgmt   │    │  - Rate Limiting │    │  - BCRA v4.0    │
│  - Real-time UI │    │  - Cache Layer   │    │  - Yahoo Finance│
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                     ┌───────────┴───────────┐
                     │   State Management    │
                     │                       │
                     │  - Zustand Store      │
                     │  - React Query        │
                     │  - Local Storage      │
                     └───────────────────────┘
Tecnologías Principales Actualizadas
Frontend: React 18 + Vite + TypeScript

Estilos: Tailwind CSS + CSS Modules

Estado: Zustand + TanStack Query v5

Gráficos: TradingView Widgets + Recharts

Build Tool: Vite 5.x

Control Versión: Git + GitHub

Nuevo: Integración BCRA API v4.0 oficial

⚙️ Requisitos Técnicos
Requisitos Mínimos Actualizados
Node.js: 18.0 o superior (20.x recomendado)

NPM: 8.0 o superior

Navegador: Chrome 100+, Firefox 100+, Safari 15+

RAM: 4GB mínimo, 8GB recomendado

Conexión: Internet estable para datos en tiempo real

Dependencias Principales Actualizadas
json
{
  "react": "^18.2.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.0.0",
  "lucide-react": "^0.300.0",
  "recharts": "^2.10.0"
}
🚀 Instalación y Configuración
1. Clonación del Repositorio
bash
git clone https://github.com/tu-usuario/trading-desk-pro.git
cd trading-desk-pro
2. Instalación de Dependencias
bash
npm install
3. Configuración de Variables de Entorno Actualizada
Crear archivo .env en la raíz:

env
# API Keys (Opcionales - Mejoran funcionalidad)
VITE_FMP_KEY=tu_api_key_financial_modeling_prep
VITE_NEWSAPI_KEY=tu_api_key_newsapi
VITE_IEX_KEY=tu_api_key_iex_cloud

# Configuración de Desarrollo
VITE_APP_ENV=development
VITE_API_TIMEOUT=10000

# NUEVO: Configuración BCRA (no requiere API key)
VITE_BCRA_ENABLED=true
VITE_BCRA_TIMEOUT=15000
4. Ejecución en Desarrollo
bash
npm run dev
La aplicación estará disponible en: http://localhost:5173

5. Build de Producción
bash
npm run build
npm run preview
📁 Estructura del Proyecto Actualizada
text
TRADING-DESK-PRO/
├── 📁 public/                 # Assets estáticos
├── 📁 src/
│   ├── 📁 api/               # Capa de servicios de datos
│   │   ├── cryptoApi.js      # CoinGecko API
│   │   ├── stocksApi.js      # Financial Modeling Prep
│   │   ├── economicApi.js    # ✅ NUEVO: BCRA v4.0 + datos económicos
│   │   ├── mervalApi.js      # BCRA + Mercados Ámbito
│   │   ├── commoditiesApi.js # Metals.live + FMP
│   │   ├── quotesApi.js      # Datos en tiempo real
│   │   ├── riskCountryApi.js # Riesgo País EMBI+
│   │   └── newsApi.js        # NewsAPI + fuentes financieras
│   ├── 📁 components/
│   │   ├── 📁 layout/        # Componentes de estructura
│   │   ├── 📁 markets/       # Componentes de datos financieros
│   │   │   ├── EconomicDataBlock.jsx    # ✅ NUEVO: Bloque económico
│   │   │   ├── EconomicDataTable.jsx    # Tabla de indicadores
│   │   │   ├── DatosMacros.jsx          # ✅ NUEVO: Indicadores BCRA
│   │   │   ├── MarketCard.jsx
│   │   │   ├── QuotesCarousel.jsx
│   │   │   └── RiskCountryModule.jsx
│   │   ├── 📁 charts/        # Componentes de visualización
│   │   ├── 📁 video/         # Componentes de transmisiones
│   │   ├── 📁 news/          # Componentes de noticias
│   │   └── 📁 ui/            # Componentes de interfaz
│   ├── 📁 config/            # Configuración de la aplicación
│   ├── 📁 hooks/             # Custom hooks de React
│   │   └── useEconomicData.js # ✅ NUEVO: Hook para datos económicos
│   ├── 📁 stores/            # Estado global (Zustand)
│   ├── 📁 utils/             # Utilidades y helpers
│   ├── App.jsx               # Componente principal
│   └── main.jsx              # Punto de entrada
├── 📄 package.json
├── 📄 vite.config.js
├── 📄 tailwind.config.js
├── 📄 .gitignore
└── 📄 README.md

🔌 APIs y Fuentes de Datos Actualizadas

Fuentes de Datos Primarias Actualizadas

Módulo	API Principal	Fallbacks	Frecuencia	Estado
Criptomonedas	CoinGecko	CoinCap, Mock Data	30s	✅
Acciones USA	Financial Modeling Prep	IEX Cloud, Yahoo	30s	✅
MERVAL	BCRA API	Mercados Ámbito	60s	✅
Commodities	Metals.live	FMP, Mock Data	60s	✅
Datos BCRA	BCRA v4.0 Oficial	Datos estáticos	60s	✅ NUEVO
Reservas Internacionales	BCRA v4.0 (ID: 1)	-	60s	✅
Base Monetaria	BCRA v4.0 (ID: 15)	-	60s	✅
M2	BCRA v4.0 (ID: 109)	-	60s	✅
Dólar Blue	Bluelytics	DolarAPI	60s	✅
Riesgo País	Ámbito (Scraping)	Bonos ARG, Manual	10min	✅
Noticias	NewsAPI	AlphaVantage, Mock	5min	✅
Indicadores Económicos	PENDIENTE: INDEC API	Mock Data	1 día	⚠️
Configuración de APIs Actualizada
javascript
// src/config/apiEndpoints.js
export const API_CONFIG = {
  // Configuración general
  timeout: 10000,
  retryAttempts: 3,
  fallbackEnabled: true,
  
  // NUEVO: Configuración específica BCRA
  bcra: {
    baseUrl: 'https://api.bcra.gob.ar/estadisticas/v4.0',
    timeout: 15000,
    cacheDuration: 3600000, // 1 hora
    variables: {
      reserves: { id: 1, descripcion: 'Reservas internacionales' },
      monetaryBase: { id: 15, descripcion: 'Base monetaria' },
      m2: { id: 109, descripcion: 'M2' }
    }
  },
  
  cacheDuration: {
    fast: 30000,    // 30 segundos
    medium: 60000,  // 1 minuto
    slow: 300000    // 5 minutos
  }
};
🧩 Componentes Principales Actualizados
1. EconomicDataBlock (NUEVO)
Propósito: Bloque principal de indicadores económicos argentinos
Características:

Integra datos BCRA v4.0 en tiempo real

Muestra Reservas, Base Monetaria, M2

Diseño con gradientes y efectos visuales

Estados de loading y error integrados

2. DatosMacros (NUEVO)
Propósito: Visualización de indicadores monetarios del BCRA
Props:

reserves: { value, change, description }

monetaryBase: { value, change, description }

moneySupply: { m2, m3, description }

3. useEconomicData Hook (NUEVO)
Propósito: Hook personalizado para manejo de datos económicos
Retorno:

javascript
{
  // Datos BCRA
  bcraData: Array,      // Datos brutos BCRA
  reserves: Object,     // Reservas formateadas
  monetaryBase: Object, // Base monetaria formateada
  moneySupply: Object,  // Agregados monetarios
  
  // Estado
  loading: Boolean,
  error: String|null,
  lastUpdate: String,
  
  // Métodos
  refresh: Function,
  getBcraData: Function
}
4. EconomicDataTable
Estado Actual: Muestra datos mock - requiere integración INDEC API
Indicadores Pendientes:

EMAE (Estimador Mensual de Actividad Económica)

PBI Trimestral

Construcción ISAC

Producción Automotriz (ADEFA)

Desempleo/Empleo

Salarios

Balanza Comercial/Exportaciones/Importaciones

5. TradingHeader
Mejoras: Ahora muestra estado de conexión BCRA

6. QuotesCarousel
Sin cambios: Funcionalidad completa

7. RiskCountryModule
Sin cambios: EMBI+ Argentina funcionando

8. TradingViewCharts
Sin cambios: 9 gráficos configurados

9. LiveStreamsGrid
Sin cambios: Transmisiones en vivo funcionando

🔄 Flujos de Datos Actualizados
Nuevo Flujo: Datos BCRA v4.0
text
1. Trigger de Actualización (cada 60s o manual)
   ↓
2. Llamada a BCRA API: GET /monetarias?limit=200
   ↓
3. Extraer IDs específicos (1, 15, 109)
   ↓
4. Obtener ultValorInformado de cada variable
   ↓
5. Formatear valores (millones → billones)
   ↓
6. Actualizar estado global (Zustand)
   ↓
7. Renderizar en EconomicDataBlock y DatosMacros
Intervalos de Actualización Actualizados
Módulo	Intervalo	Timeout	Retries	Estado
Quotes	30s	10s	3	✅
Crypto	30s	10s	3	✅
Stocks	30s	10s	3	✅
BCRA	60s	15s	2	✅ NUEVO
MERVAL	60s	15s	2	✅
Commodities	60s	15s	2	✅
Riesgo País	10min	30s	1	✅
Noticias	5min	20s	2	✅
⚙️ Configuración de Desarrollo
Variables de Entorno de Desarrollo Actualizadas
env
VITE_APP_ENV=development
VITE_DEBUG=true
VITE_API_MOCK_FAILURES=false
VITE_LOG_LEVEL=debug
VITE_BCRA_DEBUG=true  # NUEVO: Debug específico BCRA
Comandos de Desarrollo Actualizados
bash
# Desarrollo con hot-reload
npm run dev

# Build de desarrollo
npm run build:dev

# Análisis del bundle
npm run analyze

# Linting y formateo
npm run lint
npm run format

# NUEVO: Test específico BCRA
npm run test:bcra
Estructura de Commits
bash
feat:     Nueva funcionalidad (ej: Integración BCRA v4.0)
fix:      Corrección de bugs (ej: Error formateo valores)
refactor: Reestructuración de código
docs:     Documentación (ej: Actualizar docs APIs)
style:    Cambios de formato (sin afectar lógica)
test:     Pruebas
chore:    Tareas de mantenimiento
perf:     Mejoras de performance
🤖 Scripts y Automatización Actualizados
Scripts de NPM Disponibles Actualizados
json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --fix",
    "format": "prettier --write src/",
    "backup": "git add . && git commit -m \"backup: $(date)\" && git push",
    "analyze": "npx vite-bundle-analyzer",
    "test:bcra": "node scripts/test-bcra.js"  # NUEVO
  }
}
Sistema de Backup Automático Actualizado
Archivo: scripts/backup.js

javascript
// Backup automatizado con logging mejorado
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const backup = () => {
  const timestamp = new Date().toISOString();
  const commitMessage = `backup: ${timestamp}`;
  
  console.log(`🔄 Iniciando respaldo: ${timestamp}`);
  
  exec(`git add . && git commit -m "${commitMessage}" && git push`, 
    (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error en respaldo: ${error.message}`);
        return;
      }
      console.log(`✅ Respaldo completado: ${timestamp}`);
      console.log(`📊 Output: ${stdout}`);
    });
};

backup();
Monitoreo de Performance Actualizado
javascript
// src/utils/performance.js
export const performanceMonitor = {
  trackAPICall: (endpoint, duration, success) => {
    // Log de performance de APIs
    console.log(`📊 API Call: ${endpoint} - ${duration}ms - ${success ? '✅' : '❌'}`);
    
    // Almacenar métricas para análisis
    const metrics = JSON.parse(localStorage.getItem('apiMetrics') || '[]');
    metrics.push({ endpoint, duration, success, timestamp: Date.now() });
    localStorage.setItem('apiMetrics', JSON.stringify(metrics.slice(-100))); // Últimas 100 llamadas
  },
  
  trackComponentRender: (componentName, renderTime) => {
    // Monitoreo de rendimiento de componentes
    if (renderTime > 100) { // > 100ms es lento
      console.warn(`⚠️ Componente lento: ${componentName} - ${renderTime}ms`);
    }
  },
  
  // NUEVO: Monitoreo específico BCRA
  trackBcraPerformance: (variable, value, responseTime) => {
    console.log(`🏦 BCRA ${variable}: ${value} - ${responseTime}ms`);
  }
};
🐛 Solución de Problemas Actualizada
Problemas Comunes y Soluciones Actualizadas
1. Errores de CORS con BCRA API
Síntoma: Las requests al BCRA son bloqueadas
Solución:

javascript
// vite.config.js - Configuración proxy actualizada
export default {
  server: {
    proxy: {
      // Proxy para BCRA API
      '/api/bcra': {
        target: 'https://api.bcra.gob.ar',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bcra/, '/estadisticas/v4.0')
      },
      // Otros proxies...
    }
  }
}

2. Datos BCRA No Se Actualizan
Síntoma: Los valores monetarios permanecen estáticos
Solución:

bash
# Verificar estado de API BCRA
curl -I https://api.bcra.gob.ar/estadisticas/v4.0/monetarias

# Revisar logs específicos BCRA
localStorage.setItem('debug:bcra', 'true')

# Verificar IDs de variables
console.log('BCRA Variables:', localStorage.getItem('bcraVariables'))
3. Formato Incorrecto de Valores BCRA
Síntoma: Valores como "41.824,000M" en lugar de "USD 41.8B"
Solución: Verificar función formatValue en DatosMacros.jsx:

javascript
// FORMATO CORRECTO:
const formatValue = (value, isUSD = false) => {
  const billions = value / 1000; // Convertir millones a billones
  const symbol = isUSD ? 'USD' : 'ARS';
  return `${symbol} ${billions.toFixed(1).replace('.', ',')}B`;
};
4. Indicadores Económicos Vacíos
Síntoma: Tabla EconomicDataTable muestra "--" en todos los campos
Causa: Falta integración con API INDEC
Solución Temporal: Usar datos mock mientras se implementa:

javascript
// En economicApi.js - fetchEconomicData()
return {
  indicators: getMockIndicators(), // Datos mock temporalmente
  reserves: getBcraData().reserves,
  // ...
};
Logs y Debugging Actualizados
javascript
// Habilitar logs detallados
localStorage.setItem('debug', 'trading-desk:*');

// Ver errores específicos BCRA
console.log('BCRA Errors:', localStorage.getItem('bcraErrors'));

// Monitorear performance
console.log('API Metrics:', JSON.parse(localStorage.getItem('apiMetrics') || '[]'));

🗺️ Roadmap Actualizado
Fase 1 - Completada ✅
Arquitectura base del dashboard

Integración con APIs financieras básicas

Sistema de componentes modular

Gráficos TradingView integrados

NUEVO: Integración BCRA v4.0 completa

NUEVO: Datos monetarios oficiales en tiempo real

Fase 2 - En Desarrollo 🚧
Alertas personalizadas por instrumento

Análisis técnico integrado (RSI, MACD)

Portafolio personalizado

Exportación de datos

Modo oscuro/claro dinámico

NUEVO: Integración API INDEC para indicadores económicos

Fase 3 - Planificada 📅
Integración con brokers (APIs)

Machine learning para predicciones

Widgets personalizables

API pública para desarrolladores

Mobile app nativa

NUEVO: Análisis histórico BCRA (gráficos temporales)

Fase 4 - Futuro 🔮
Análisis fundamental automatizado

Social trading features

Backtesting integrado

Multi-idioma

Enterprise features

NUEVO: Integración con otras APIs oficiales (MECON, AFIP)

📞 Soporte y Contacto
Recursos de Soporte Actualizados
Documentación: docs/trading-desk-pro.com

Issues: GitHub Issues

Email: Gonzalo-Lazarte-Programador@outlook.com

Documentación BCRA: https://api.bcra.gob.ar/estadisticas/v4.0/documentacion

Canales de Comunicación
📧 Email: Para soporte técnico

🐛 GitHub Issues: Para reportar bugs

💬 Discord: Para comunidad y discusiones

📚 Documentación: Para guías técnicas

🏦 Documentación BCRA: Para consultas específicas de datos oficiales

Guía Rápida BCRA v4.0
javascript
// IDs de variables confirmadas:
const BCRA_VARIABLES = {
  RESERVAS: 1,           // "Reservas internacionales"
  BASE_MONETARIA: 15,    // "Base monetaria"
  M2: 109,               // "M2"
  // Otras variables disponibles:
  TIPO_CAMBIO_MINORISTA: 4,
  TIPO_CAMBIO_MAYORISTA: 5,
  IPC_MENSUAL: 27,
  IPC_ANUAL: 28
};

// Endpoints principales:
const BCRA_ENDPOINTS = {
  LISTADO_VARIABLES: '/monetarias',
  DATOS_VARIABLE: (id) => `/monetarias/${id}`,
  METODOLOGIA: (id) => `/metodologia/${id}`
};
📄 Licencia
MIT License - Ver archivo LICENSE para detalles completos.

Atribuciones Actualizadas
Iconos por Lucide React

Gráficos por TradingView

Datos BCRA por Banco Central de la República Argentina

Datos financieros por múltiples proveedores

© 2025 Trading Desk Pro. Todos los derechos reservados.

Última actualización: Diciembre 2025
Versión de Documentación: 1.1.0

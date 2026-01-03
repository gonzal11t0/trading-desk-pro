# 📊 Trading Desk Pro

**Dashboard financiero profesional** con datos de mercados en tiempo real, análisis técnico y transmisiones de noticias financieras en una interfaz unificada estilo terminal profesional.

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-06B6D4)
![License](https://img.shields.io/badge/license-MIT-green)

> **🚀 Funciona inmediatamente en modo demo** con datos reales del BCRA y simulados para otras fuentes. Ideal para probar sin configuración.

## ✨ Vista Rápida
[Dashboard Completo](docs/img-1.png)
[Indicadores Económicos](docs/img-2.png)
## 🎮 **Cómo Empezar - Dos Modos de Uso**

### 🆓 **Modo Demo (Instantáneo - Recomendado para probar)**
La aplicación funciona **inmediatamente sin configuración** usando:
- ✅ **Datos reales** del BCRA Argentina (oficial)
- ✅ **Datos reales** de CoinGecko (criptomonedas)
- ✅ **Datos simulados** para fuentes que requieren API keys

```bash
# 1. Clonar el repositorio
git clone https://github.com/gonzal11t0/trading-desk-pro.git
cd trading-desk-pro

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run dev
La aplicación estará disponible en: http://localhost:5173

🔑 Modo Completo (Con APIs Reales - Opcional)
Para datos en tiempo real completos de todas las fuentes:

bash
# 1. Clonar y configurar
git clone https://github.com/gonzal11t0/trading-desk-pro.git
cd trading-desk-pro
cp .env.example .env

# 2. Editar .env con tus API keys (opcional)
# Ver sección "Configuración de APIs" más abajo

# 3. Instalar e iniciar
npm install
npm run dev
📊 Características Principales
📈 Datos en Tiempo Real
🇦🇷 BCRA Argentina: Reservas, Base Monetaria, M2, Tasas (API oficial)

💰 Criptomonedas: Bitcoin, Ethereum + top 10 (CoinGecko API)

📈 Acciones USA: AAPL, MSFT, TSLA + SP500 (Financial Modeling Prep)

💱 Forex Argentina: Dólar Blue, MEP, CCL, Oficial (Bluelytics API)

🛢️ Commodities: Oro, Plata, Petróleo Brent/WTI

📉 MERVAL: Índice y acciones líderes argentinas

📊 Análisis y Visualización
9 Gráficos TradingView integrados (SP500, Nasdaq, Oro, Dólar, etc.)

Mapas de Mercado sectoriales (treemap interactivo)

Riesgo País (EMBI+) en tiempo real

Bandas Cambiarias con cálculo automático basado en IPC

Indicadores Económicos históricos y comparativos

📺 Contenido en Vivo
Transmisiones de medios financieros (YouTube embeds)

Noticias financieras actualizadas (sistema híbrido de fuentes)

Interfaz estilo terminal profesional con actualizaciones automáticas

Alertas visuales para cambios significativos en mercados

🏗️ Tecnologías
Capa	Tecnologías
Frontend	React 18, Vite 5, TypeScript
Estilos	Tailwind CSS, CSS Modules
Estado	Zustand, TanStack Query v5
Gráficos	TradingView Widgets, Recharts
Build	Vite 5.x, ESLint, Prettier
Control	Git, GitHub
🔌 Configuración de APIs (Opcional)
📋 APIs Disponibles y Planes Gratuitos
API	Uso en el Proyecto	Límite Gratuito	¿Necesaria?
BCRA API	Datos oficiales Argentina	Sin límites	❌ NO - Pública
CoinGecko	Criptomonedas	50 calls/min	❌ NO - Pública
Alpha Vantage	Noticias/Stocks	500 req/día	⚠️ Opcional
Financial Modeling Prep	Stocks USA	250 req/día	⚠️ Opcional
Bluelytics/DolarAPI	Dólar Argentina	Sin límites	❌ NO - Pública
⚙️ Archivo .env de ejemplo:
env
# Trading Desk Pro - Configuración
# Copia este archivo a .env y rellena SOLO si tienes keys

# =============== API KEYS (OPCIONALES) ===============
# Alpha Vantage: https://www.alphavantage.co/support/#api-key
VITE_ALPHA_VANTAGE_KEY=tu_key_aqui

# Financial Modeling Prep: https://site.financialmodelingprep.com
VITE_FMP_KEY=tu_key_aqui

# IEX Cloud: https://iexcloud.io (alternativa)
VITE_IEX_KEY=tu_key_aqui

# =============== CONFIGURACIÓN ===============
VITE_APP_ENV=development
VITE_API_TIMEOUT=10000
VITE_BCRA_ENABLED=true
VITE_BCRA_TIMEOUT=15000

# NOTA: La app funciona COMPLETAMENTE sin estas keys
# Solo configúralas si quieres datos en tiempo real completos
📁 Estructura del Proyecto
text
trading-desk-pro/
├── 📁 public/                 # Assets estáticos
├── 📁 src/
│   ├── 📁 api/               # Capa de servicios
│   │   ├── cryptoApi.js      # CoinGecko API
│   │   ├── stocksApi.js      # Financial Modeling Prep
│   │   ├── economicApi.js    # BCRA v4.0 oficial
│   │   ├── mervalApi.js      # MERVAL argentino
│   │   ├── inflationApi.js   # Datos de inflación
│   │   └── newsApi.js        # Sistema híbrido de noticias
│   ├── 📁 components/        # Componentes React
│   │   ├── 📁 layout/        # Estructura
│   │   ├── 📁 markets/       # Datos financieros
│   │   ├── 📁 charts/        # Visualización
│   │   ├── 📁 video/         # Transmisiones
│   │   ├── 📁 news/          # Noticias
│   │   └── 📁 ui/            # UI elements
│   ├── 📁 config/            # Configuración
│   ├── 📁 hooks/             # Custom hooks
│   ├── 📁 stores/            # Estado (Zustand)
│   ├── 📁 utils/             # Utilidades
│   ├── App.jsx               # Componente principal
│   └── main.jsx              # Punto de entrada
├── 📄 package.json
├── 📄 vite.config.js
├── 📄 .env.example
└── 📄 README.md
🛠️ Comandos Disponibles
bash
# Desarrollo
npm run dev           # Inicia servidor de desarrollo
npm run build         # Build para producción
npm run preview       # Previsualiza build de producción

# Calidad de código
npm run lint          # Ejecuta ESLint
npm run format        # Formatea con Prettier

# Análisis
npm run analyze       # Analiza bundle size
🤝 Contribuir
Las contribuciones son bienvenidas. Por favor:

Fork el repositorio

Crea una rama (git checkout -b feature/AmazingFeature)

Commit tus cambios (git commit -m 'Add some AmazingFeature')

Push a la rama (git push origin feature/AmazingFeature)

Abre un Pull Request

📄 Licencia
Distribuido bajo la licencia MIT. Ver LICENSE para más información.

📞 Contacto y Soporte
Documentación completa: DOCUMENTACION-COMPLETA.md

Issues: GitHub Issues

Email: Gonzalo-Lazarte-Programador@outlook.com

🙏 Atribuciones
Iconos: Lucide React

Gráficos: TradingView

Datos BCRA: Banco Central de la República Argentina

Datos financieros: Múltiples proveedores de APIs
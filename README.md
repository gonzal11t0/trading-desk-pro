# Trading Desk Pro

Dashboard financiero web para monitorear mercados (Argentina + global), visualizar datos en tiempo real y centralizar contenido de análisis en una interfaz única.

## Estado actual del proyecto

- **Stack principal:** React 19 + Vite (rolldown-vite) + Tailwind + Zustand + TanStack Query.
- **Versión en `package.json`:** `2.0.0`.
- **Deploy previsto:** Vercel (`vercel.json` incluye frontend estático + funciones `api/*.js`).
- **Autenticación vigente en frontend:** credenciales hardcodeadas en `useAuth` (modo local/demo).

---

## Funcionalidades principales

- Login y rutas protegidas (`/login`, `/dashboard`, `/admin`).
- Dashboard principal con:
  - carrusel de cotizaciones,
  - streams de video financieros,
  - indicadores económicos,
  - módulos de dólar/riesgo país/treemap,
  - widgets de TradingView.
- Panel de administración con gestión manual de usuarios (en memoria del cliente).
- Integración de múltiples fuentes de datos (CoinGecko, Bluelytics, Yahoo/FMP, feeds de noticias, etc.) con fallback.

---

## Arquitectura resumida

### Frontend

- `src/main.jsx`: inicialización de React, Router, QueryClient y utilidades globales.
- `src/App.jsx`: layout principal, rutas protegidas y composición del dashboard.
- `src/components/**`: módulos UI por dominio (`markets`, `charts`, `layout`, `admin`, `video`, `ui`).
- `src/api/**`: clientes HTTP y normalización de datos externos.
- `src/stores/**`: estado global (auth, app, educación, treemap).
- `src/hooks/**`: hooks especializados para cada fuente/módulo.

### Backend ligero (serverless)

- `api/ping.js`: healthcheck básico.
- `api/auth.js`: endpoint de login de ejemplo con usuarios hardcodeados.

---

## Requisitos

- Node.js 18+
- npm 8+

---

## Instalación y ejecución

```bash
npm install
npm run dev
```

Aplicación en desarrollo: `http://localhost:5173`.

### Build de producción

```bash
npm run build
npm run preview
```

---

## Variables de entorno

Crear `.env` en la raíz (todas opcionales según módulo):

```env
# APIs de mercado/noticias
VITE_FMP_KEY=
VITE_ALPHA_VANTAGE_KEY=
VITE_IEX_KEY=

# Auth helpers (si se usa utilidad hash)
VITE_HASH_SECRET=
VITE_ADMIN_USER=
VITE_ADMIN_PASS=

# Usuarios adicionales opcionales (formato libre según authHelpers)
VITE_USER_1=
VITE_USER_2=
```

> Nota: hoy gran parte del login real se maneja con credenciales embebidas en frontend (`src/hooks/useAuth.js`), por lo que estas variables **no reemplazan** completamente ese flujo.

---

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run lint:fix
npm run format
```

### Observaciones importantes de scripts

- `clean`, `clean:all` y `size` usan sintaxis de Windows CMD (`if exist ...`) y no son portables a bash/linux.
- `users:*` apunta a `scripts/manage-users.js`, archivo/directorio que actualmente no existe en el repo.

---

## Limitaciones técnicas actuales (a considerar)

1. `npm run lint` falla por errores existentes del proyecto (variables sin uso, parsing error en `MarketMaps.jsx`, etc.).
2. Hay lógica de autenticación sensible en cliente (credenciales base64 hardcodeadas).
3. La documentación histórica estaba desalineada con el estado real del código y scripts.

---

## Documentación extendida

- Ver análisis completo del proyecto en: [`docs/DOCUMENTACION-COMPLETA.md`](docs/DOCUMENTACION-COMPLETA.md)

---

## Licencia

MIT. Ver [`LICENSE`](LICENSE).

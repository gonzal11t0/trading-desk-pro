# Trading Desk Pro — Documentación Técnica Completa (actualizada)

**Última actualización:** 2026-02-05  
**Objetivo del documento:** reflejar el estado real actual del repositorio, con diagnóstico técnico y plan de mejora.

---

## 1) Resumen ejecutivo

Trading Desk Pro es una SPA React orientada a consumo de datos de mercado, contenidos financieros y visualizaciones técnicas. El proyecto presenta una base funcional sólida para uso interno/demo, pero con deuda técnica relevante en calidad de código, seguridad de autenticación y portabilidad de scripts.

### Diagnóstico rápido

- ✅ Build de producción funciona correctamente (`npm run build`).
- ⚠️ Lint no pasa actualmente (`npm run lint`).
- ⚠️ Existen scripts declarados que no son portables en Linux/macOS y otros que apuntan a archivos inexistentes.
- ⚠️ La autenticación está principalmente implementada en cliente con credenciales embebidas.

---

## 2) Stack y dependencias

### Frontend

- React 19
- React Router 7
- TanStack Query 5
- Zustand 5
- Recharts
- Tailwind CSS
- Vite (rolldown-vite)

### Infra / Deploy

- Vercel (sitio estático + funciones serverless `api/*.js`)

---

## 3) Arquitectura actual

```text
Cliente (React/Vite)
  ├─ Router + ProtectedRoute
  ├─ Dashboard modular (markets/charts/video/admin)
  ├─ Estado global (Zustand)
  ├─ Fetching/caching (React Query + clients src/api)
  └─ Proxy de desarrollo (vite.config.js)

Funciones serverless (Vercel)
  ├─ /api/ping
  └─ /api/auth
```

### Piezas clave

- `src/main.jsx`: bootstrap, providers, bloqueo de telemetría TradingView.
- `src/App.jsx`: rutas y composición de pantallas.
- `src/hooks/useAuth.js` + `src/stores/authStore.js`: sesión frontend y control de timeout.
- `vite.config.js`: split de chunks + proxy de desarrollo + optimización terser.
- `vercel.json`: routing para build estático y funciones API.

---

## 4) Estructura de carpetas (alto nivel)

```text
api/                    # funciones serverless
src/
  api/                  # adaptadores de fuentes externas
  components/
    admin/
    ads/
    charts/
    layout/
    markets/
    ui/
    video/
  config/
  hooks/
  stores/
  utils/
docs/
public/
```

---

## 5) Flujo funcional principal

1. Usuario entra a `/login`.
2. `useAuth` valida contra hashes/credenciales embebidas.
3. Si autenticado, accede a `/dashboard`.
4. Módulos del dashboard consultan APIs externas (directo o vía proxy dev).
5. Admin puede habilitar panel y gestionar usuarios a nivel UI (estado local).

---

## 6) Integraciones externas (actuales)

Según configuración y clientes del proyecto:

- CoinGecko
- Bluelytics / fuentes de dólar Argentina
- Yahoo / FMP / IEX (según módulo y key)
- News API / Alpha Vantage (según key)
- YouTube embebido/proxy
- Datos BCRA (múltiples endpoints configurados)

---

## 7) Variables de entorno detectadas

```env
VITE_FMP_KEY=
VITE_ALPHA_VANTAGE_KEY=
VITE_IEX_KEY=
VITE_HASH_SECRET=
VITE_ADMIN_USER=
VITE_ADMIN_PASS=
VITE_USER_1=
VITE_USER_2=
# ... VITE_USER_N
```

> Observación: no toda la autenticación depende de estas variables; hay credenciales hardcodeadas en frontend.

---

## 8) Scripts npm y estado

### Operativos

- `dev`
- `build`
- `preview`
- `lint`
- `lint:fix`
- `format`

### Con problemas de portabilidad o consistencia

- `clean`, `clean:all`, `size`: sintaxis CMD de Windows.
- `users:list`, `users:add`, `users:reset`, `users:delete`: refieren a `scripts/manage-users.js` que no existe actualmente.

---

## 9) Hallazgos técnicos (análisis)

### 9.1 Calidad de código

`npm run lint` reporta errores bloqueantes en distintos módulos (unused vars, parsing error y reglas hooks).

Impacto:

- Riesgo de regresiones.
- Menor mantenibilidad.
- Dificulta CI/CD estricto.

### 9.2 Seguridad / autenticación

La lógica actual de login principal en frontend usa credenciales codificadas/hardcodeadas.

Impacto:

- No apto para producción con seguridad real.
- Exposición de secretos al cliente.
- Escalabilidad limitada para gestión de usuarios.

### 9.3 Operación y DX (Developer Experience)

Scripts inconsistentes con entorno cross-platform y documentación histórica desactualizada.

Impacto:

- Fricción para colaboradores.
- Onboarding lento.

---

## 10) Recomendaciones priorizadas

### Prioridad alta

1. **Migrar autenticación a backend real** (JWT + refresh + hash seguro de passwords).
2. **Eliminar credenciales embebidas del frontend**.
3. **Corregir errores de lint** y dejar baseline en cero para habilitar CI estricto.

### Prioridad media

4. Reemplazar scripts Windows-only por alternativas cross-platform (`rimraf`, `shx`, scripts node).
5. Implementar/retirar scripts `users:*` según estrategia final.
6. Normalizar capa API con manejo de errores y contratos tipados (JSDoc o TypeScript).

### Prioridad baja

7. Agregar tests básicos:
   - unit tests en utilidades críticas,
   - smoke tests de rutas protegidas,
   - contrato mínimo para adaptadores API.
8. Crear pipeline CI (lint + build + test).

---

## 11) Guía rápida de ejecución

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

---

## 12) Estado de documentación

Este documento y el `README.md` fueron alineados al estado actual del código para servir como base de trabajo realista.


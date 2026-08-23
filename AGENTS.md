# Trading Desk Pro

## Reglas de trabajo

- Instalar con `npm ci --legacy-peer-deps`.
- Ejecutar `npm run lint` y `npm run build` antes de confirmar cambios.
- No presentar datos mock como datos actuales. Ante una falla, usar caché identificada o mostrar “no disponible”.
- Mantener claves y contraseñas fuera del repositorio; documentarlas únicamente en archivos `.env.example` sin valores reales.
- Centralizar la URL del backend en `src/config/runtime.js`.
- No agregar una dependencia si la plataforma o JavaScript nativo resuelven el caso de forma clara.
- Mantener las rutas API antes del fallback SPA en `vercel.json`.

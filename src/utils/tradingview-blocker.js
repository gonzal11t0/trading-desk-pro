// tradingview-blocker.js - SOLUCIÓN NUCLEAR
export const initTradingViewBlocker = () => {
  // 1. BLOQUEAR FETCH
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const [url, options] = args;
    
    if (typeof url === 'string') {
      // Lista de URLs a bloquear
      const blockedPatterns = [
        /support-portal-problems/,
        /telemetry\.tradingview\.com/,
        /snowplow-embed-widget-tracker/,
        /chart-data\.tradingview\.com/
      ];
      
      const shouldBlock = blockedPatterns.some(pattern => pattern.test(url));
      if (shouldBlock) {
        // Retornar una promesa RESUELTA (no rechazada) con datos falsos
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ blocked: true, fake: 'data' }),
          text: () => Promise.resolve('{"blocked": true}'),
          statusText: 'OK'
        });
      }
    }
    
    return originalFetch.apply(this, args);
  };
  
  // 2. BLOQUEAR XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  
  XMLHttpRequest.prototype.open = function(method, url, async) {
    this._blocked = false;
    
    if (typeof url === 'string' && (
      url.includes('support-portal-problems') || 
      url.includes('telemetry.tradingview.com')
    )) {
      this._blocked = true;
      this._fakeUrl = url;
    }
    
    return originalXHROpen.apply(this, arguments);
  };
  
  XMLHttpRequest.prototype.send = function(body) {
    if (this._blocked) {
      // Simular una respuesta exitosa
      setTimeout(() => {
        if (this.onload) {
          this.status = 200;
          this.statusText = 'OK';
          this.responseText = '{"blocked":true}';
          this.response = '{"blocked":true}';
          this.onload();
        }
        if (this.onreadystatechange) {
          this.readyState = 4;
          this.onreadystatechange();
        }
      }, 10);
      return;
    }
    
    return originalXHRSend.apply(this, arguments);
  };
  
  // 3. SILENCIAR CONSOLA COMPLETAMENTE para TradingView
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = function(...args) {
    if (args.some(arg => 
      typeof arg === 'string' && (
        arg.includes('TradingView') ||
        arg.includes('support-portal') ||
        arg.includes('telemetry') ||
        arg.includes('Chart.DataProblemModel') ||
        arg.includes('Failed to fetch')
      )
    )) {
      return; // SILENCIAR COMPLETAMENTE
    }
    originalError.apply(console, args);
  };
  
  console.warn = function(...args) {
    if (args.some(arg => 
      typeof arg === 'string' && (
        arg.includes('TradingView') ||
        arg.includes('ChunkLoadError') ||
        arg.includes('DataProblemModel')
      )
    )) {
      return; // SILENCIAR COMPLETAMENTE
    }
    originalWarn.apply(console, args);
  };  
  
};
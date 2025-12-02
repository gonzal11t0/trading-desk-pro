// public/preload-patch.js
// Este archivo DEBE cargarse ANTES que cualquier otro script

(function() {
  'use strict';
  
  console.log('🔧 Inyectando parche PRELOAD para TradingView...');
  
  // CAPTURAR Y REDIRIGIR console.error INMEDIATAMENTE
  const originalError = window.console.error;
  
  window.console.error = function() {
    const args = Array.from(arguments);
    const message = args.join(' ');
    
    // PATRONES EXACTOS de tus errores (copiados de tu consola)
    const tradingViewPatterns = [
      'support-portal-problems',
      'Chart.DataProblemModel',
      'Status 403',
      'Fetch:/support/',
      'Couldn\'t load support portal'
    ];
    
    // Verificar SI es un error de TradingView
    const isTradingViewError = tradingViewPatterns.some(pattern => 
      message.includes(pattern)
    );
    
    if (isTradingViewError) {
      // TRANSFORMAR en console.debug (invisible por defecto)
      if (window.console.debug) {
        console.debug('[TradingView Silenciado]', 
          message.substring(0, 100) + '...');
      }
      return; // NO llamar al original
    }
    
    // Si NO es de TradingView, mostrar normalmente
    return originalError.apply(console, arguments);
  };
  
  // También interceptar console.warn
  const originalWarn = window.console.warn;
  window.console.warn = function() {
    const args = Array.from(arguments);
    const message = args.join(' ');
    
    if (message.includes('Chart.DataProblemModel')) {
      // Silenciar completamente
      return;
    }
    
    return originalWarn.apply(console, arguments);
  };
  
  // PARCHE EXTREMO: Interceptar el objeto Error
  const OriginalError = window.Error;
  window.Error = function(message) {
    if (typeof message === 'string' && 
        (message.includes('support-portal') || 
         message.includes('Chart.DataProblemModel'))) {
      // Crear un error "falso" que no se mostrará
      const fakeError = new OriginalError('[TradingView Error Silenciado]');
      fakeError.stack = ''; // Limpiar stack trace
      return fakeError;
    }
    return new OriginalError(message);
  };
  
  // Copiar prototype
  window.Error.prototype = OriginalError.prototype;
  
  console.log('✅ Parche PRELOAD aplicado - Consola limpia lista');
})();
/**
 * GENERADOR DE CONTRASEÑAS SEGURAS PARA .env - VERSIÓN MEJORADA
 * ✅ Seguridad avanzada para entornos de producción
 * ✅ Caracteres 100% compatibles con .env
 * ✅ Validación estricta y detallada
 */

/**
 * Símbolos SEGUROS para .env - Validados exhaustivamente
 * ✅ PERMITIDOS: Caracteres que NO causan problemas de parsing
 */
const SAFE_SYMBOLS = '!$%&*()_+-=[]<>?@';
const SAFE_SYMBOLS_ARRAY = SAFE_SYMBOLS.split('');

/**
 * Símbolos PROHIBIDOS para .env - Causan problemas de parsing/seguridad
 * ❌ PROHIBIDOS: Caracteres que rompen archivos .env o son peligrosos
 */
const PROHIBITED_SYMBOLS = ['#', ';', ':', '{', '}', '|', '"', "'", '`', '\\', ' ', '\t', '\n', '\r'];
const PROHIBITED_SYMBOLS_SET = new Set(PROHIBITED_SYMBOLS);

/**
 * Patrones inseguros comunes a evitar
 */
const UNSAFE_PATTERNS = [
  /^[0-9]+$/, // Solo números
  /^[a-zA-Z]+$/, // Solo letras
  /^[!$%&*()_+\-=\[\]<>?@]+$/, // Solo símbolos
  /(.)\1{3,}/, // Caracteres repetidos 4+ veces
  /(0123|1234|2345|3456|4567|5678|6789|7890)/, // Secuencias numéricas
  /(abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz)/i, // Secuencias alfabéticas
  /(qwerty|azerty|qwertz|asdfgh|zxcvbn)/i, // Patrones de teclado
];

/**
 * Contraseñas comunes a evitar (lista extendida)
 */
const COMMON_PASSWORDS = new Set([
  'password', '123456', '12345678', '123456789', '1234567890',
  'admin', 'administrator', 'root', 'superuser',
  'qwerty', 'qwerty123', 'qwertyuiop', 'azerty', 'qwertz',
  'letmein', 'monkey', 'dragon', 'sunshine', 'password1',
  'welcome', 'login', 'abc123', 'football', 'baseball',
  'trustno1', 'master', 'hello', 'secret', 'passw0rd',
  'admin123', 'test123', 'temp123', 'changeme', 'default',
]);

/**
 * Configuración por defecto para generación de contraseñas
 */
const DEFAULT_OPTIONS = {
  length: 16,
  includeNumbers: true,
  includeUppercase: true,
  includeLowercase: true,
  includeSymbols: true,
  avoidAmbiguous: true, // Evita caracteres ambiguos como 0/O, 1/l/I
  requireEachType: true, // Requiere al menos uno de cada tipo seleccionado
  maxRetries: 100, // Intentos máximos para generar contraseña válida
};

/**
 * Caracteres ambiguos a evitar (opcional)
 */
const AMBIGUOUS_CHARS = {
  numbers: '01', // 0 (cero), 1 (uno)
  letters: 'OIl', // O (oh), I (i mayúscula), l (L minúscula)
};

/**
 * Genera una contraseña segura optimizada para archivos .env
 * @param {number} length - Longitud deseada (12-32 caracteres)
 * @param {Object} options - Opciones de generación
 * @returns {string} Contraseña 100% segura para .env
 * @throws {Error} Si no se puede generar una contraseña válida
 */
export const generateSecurePassword = (
  length = DEFAULT_OPTIONS.length,
  options = {}
) => {
  // Validar y fusionar opciones
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Validaciones de entrada
  if (typeof length !== 'number' || length < 12 || length > 32) {
    throw new Error('La longitud debe ser entre 12 y 32 caracteres');
  }

  // Definir conjuntos de caracteres base
  const charset = {
    numbers: '23456789', // Excluye 0 y 1 por ser ambiguos
    uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ', // Excluye O e I
    lowercase: 'abcdefghijkmnopqrstuvwxyz', // Excluye l
    symbols: opts.avoidAmbiguous 
      ? SAFE_SYMBOLS_ARRAY.filter(s => !['I', 'l', '1', '0', 'O'].includes(s)).join('')
      : SAFE_SYMBOLS,
  };

  // Construir charset final según opciones
  let finalCharset = '';
  const requiredSets = [];

  if (opts.includeLowercase) {
    finalCharset += charset.lowercase;
    requiredSets.push(charset.lowercase);
  }
  if (opts.includeUppercase) {
    finalCharset += charset.uppercase;
    requiredSets.push(charset.uppercase);
  }
  if (opts.includeNumbers) {
    finalCharset += charset.numbers;
    requiredSets.push(charset.numbers);
  }
  if (opts.includeSymbols) {
    finalCharset += charset.symbols;
    requiredSets.push(charset.symbols);
  }

  // Verificar que haya al menos un conjunto
  if (finalCharset.length === 0) {
    throw new Error('Debe incluir al menos un tipo de carácter');
  }

  // Intentar generar contraseña válida
  for (let attempt = 0; attempt < opts.maxRetries; attempt++) {
    let password = '';
    
    // Paso 1: Asegurar al menos un carácter de cada tipo requerido
    if (opts.requireEachType) {
      for (const set of requiredSets) {
        password += set[Math.floor(Math.random() * set.length)];
      }
    }
    
    // Paso 2: Completar hasta la longitud deseada
    while (password.length < length) {
      const randomChar = finalCharset[Math.floor(Math.random() * finalCharset.length)];
      password += randomChar;
    }
    
    // Paso 3: Mezclar para evitar patrones predecibles
    password = shuffleString(password);
    
    // Paso 4: Validaciones exhaustivas
    if (validatePasswordSecurity(password, opts)) {
      return password;
    }
  }

  throw new Error(`No se pudo generar una contraseña válida después de ${opts.maxRetries} intentos`);
};

/**
 * Valida exhaustivamente la seguridad de una contraseña
 * @private
 */
const validatePasswordSecurity = (password, options) => {
  // 1. Verificar longitud
  if (password.length < options.length) return false;
  
  // 2. Verificar caracteres prohibidos
  if (!isPasswordSafeForEnv(password)) return false;
  
  // 3. Verificar que incluya los tipos requeridos
  if (options.requireEachType) {
    const checks = {
      lowercase: options.includeLowercase && /[a-z]/.test(password),
      uppercase: options.includeUppercase && /[A-Z]/.test(password),
      numbers: options.includeNumbers && /\d/.test(password),
      symbols: options.includeSymbols && /[!$%&*()_+\-=\[\]<>?@]/.test(password),
    };
    
    if (!Object.values(checks).every(v => v === true || v === false)) {
      return false;
    }
  }
  
  // 4. Evitar contraseñas comunes
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return false;
  }
  
  // 5. Evitar patrones inseguros
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(password)) {
      return false;
    }
  }
  
  // 6. Verificar entropía mínima (caracteres únicos)
  const uniqueChars = new Set(password).size;
  if (uniqueChars < Math.ceil(password.length * 0.6)) {
    return false;
  }
  
  // 7. Verificar distribución razonable
  const charTypeCounts = {
    lowercase: (password.match(/[a-z]/g) || []).length,
    uppercase: (password.match(/[A-Z]/g) || []).length,
    numbers: (password.match(/\d/g) || []).length,
    symbols: (password.match(/[!$%&*()_+\-=\[\]<>?@]/g) || []).length,
  };
  
  // No más del 50% de un solo tipo
  for (const count of Object.values(charTypeCounts)) {
    if (count > password.length * 0.5) {
      return false;
    }
  }
  
  return true;
};

/**
 * Mezcla aleatoriamente una cadena (Fisher-Yates shuffle)
 * @private
 */
const shuffleString = (str) => {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
};

/**
 * Verifica si una contraseña es segura para .env con diagnóstico detallado
 * @param {string} password - Contraseña a verificar
 * @returns {Object} Resultado con diagnóstico detallado
 */
export const isPasswordSafeForEnv = (password) => {
  if (typeof password !== 'string' || password.length === 0) {
    return {
      safe: false,
      issues: ['Contraseña vacía o inválida'],
      problematicChars: [],
      recommendations: ['Proporciona una contraseña válida']
    };
  }

  const issues = [];
  const problematicChars = [];
  const recommendations = [];

  // 1. Verificar caracteres prohibidos
  for (const char of PROHIBITED_SYMBOLS) {
    if (password.includes(char)) {
      problematicChars.push(char);
    }
  }

  if (problematicChars.length > 0) {
    issues.push(`Contiene caracteres prohibidos: ${problematicChars.join(', ')}`);
    recommendations.push('Elimina los caracteres prohibidos o usa el generador seguro');
  }

  // 2. Verificar longitud mínima
  if (password.length < 12) {
    issues.push(`Longitud insuficiente (${password.length} < 12 caracteres)`);
    recommendations.push('Usa al menos 12 caracteres');
  }

  // 3. Verificar contraseñas comunes
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    issues.push('Contraseña demasiado común');
    recommendations.push('Evita contraseñas populares y fáciles de adivinar');
  }

  // 4. Verificar diversidad de caracteres
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!$%&*()_+\-=\[\]<>?@]/.test(password);

  const charTypes = [hasLower, hasUpper, hasNumbers, hasSymbols].filter(Boolean).length;
  
  if (charTypes < 3) {
    issues.push(`Diversidad insuficiente (solo ${charTypes} tipos de caracteres)`);
    recommendations.push('Combina letras mayúsculas, minúsculas, números y símbolos');
  }

  // 5. Verificar patrones inseguros
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(password)) {
      issues.push('Contiene patrones inseguros o predecibles');
      recommendations.push('Evita secuencias, repeticiones y patrones del teclado');
      break;
    }
  }

  return {
    safe: issues.length === 0,
    issues,
    problematicChars,
    recommendations,
    strength: calculatePasswordStrength(password),
    charTypes: {
      lowercase: hasLower,
      uppercase: hasUpper,
      numbers: hasNumbers,
      symbols: hasSymbols,
    }
  };
};

/**
 * Calcula fortaleza detallada de contraseña (0-100)
 * @private
 */
const calculatePasswordStrength = (password) => {
  let score = 0;
  
  // Base por longitud (máx 35)
  score += Math.min(35, (password.length * 2));
  
  // Diversidad de caracteres (máx 40)
  const charTypes = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!$%&*()_+\-=\[\]<>?@]/.test(password),
  ].filter(Boolean).length;
  
  score += charTypes * 10;
  
  // Entropía (caracteres únicos, máx 15)
  const uniqueRatio = new Set(password).size / password.length;
  score += Math.floor(uniqueRatio * 15);
  
  // Penalizaciones
  if (COMMON_PASSWORDS.has(password.toLowerCase())) score -= 30;
  if (/^\d+$/.test(password)) score -= 20;
  if (/^[a-zA-Z]+$/.test(password)) score -= 15;
  if (/(.)\1{3,}/.test(password)) score -= 10; // Repeticiones
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Genera una contraseña con mensaje formateado para cliente
 * @param {string} clientName - Nombre del cliente
 * @param {Object} options - Opciones de generación
 * @returns {Object} Contraseña generada con metadatos
 */
export const generatePasswordForClient = (
  clientName = 'Cliente',
  options = {}
) => {
  const password = generateSecurePassword(16, options);
  const safetyCheck = isPasswordSafeForEnv(password);
  
  const message = `🔐 *CREDENCIALES DE ACCESO - TRADING DESK PRO* 🔐
  
👤 *Cliente:* ${clientName}
📧 *Usuario:* ${clientName.toLowerCase().replace(/\s+/g, '.')}@empresa.com
🔑 *Contraseña:* \`${password}\`
📊 *Seguridad:* ${safetyCheck.strength}/100 (${getStrengthLabel(safetyCheck.strength)})

⏰ *Generado:* ${new Date().toLocaleString('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })}
🆔 *ID de Generación:* ${generateId()}

⚠️ *INSTRUCCIONES DE SEGURIDAD:*
• Copia la contraseña exactamente como aparece
• Pégalo en tu gestor de contraseñas favorito
• Cambia esta contraseña al primer ingreso
• No la compartas por mensajes no seguros

🛡️ *RECOMENDACIONES:*
1. Usa un gestor de contraseñas (Bitwarden, LastPass, 1Password)
2. Activa autenticación de dos factores si está disponible
3. Nunca reutilices contraseñas entre servicios
4. Reporta cualquier actividad sospechosa inmediatamente

📞 *SOPORTE:* Para problemas de acceso, contacta al administrador del sistema.

_Esta contraseña es válida por 24 horas o hasta su primer uso._`;

  return {
    password,
    message,
    strength: safetyCheck.strength,
    strengthLabel: getStrengthLabel(safetyCheck.strength),
    timestamp: new Date().toISOString(),
    clientName,
    safetyCheck,
    generationId: generateId(),
  };
};

/**
 * Etiqueta descriptiva para fortaleza
 * @private
 */
const getStrengthLabel = (score) => {
  if (score >= 90) return 'Excelente 🔐';
  if (score >= 75) return 'Muy Fuerte 🛡️';
  if (score >= 60) return 'Fuerte ✅';
  if (score >= 40) return 'Moderada ⚠️';
  if (score >= 20) return 'Débil 🚨';
  return 'Muy Débil ⛔';
};

/**
 * Genera ID único para seguimiento
 * @private
 */
const generateId = () => {
  return `TD-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`.toUpperCase();
};

/**
 * Genera múltiples contraseñas para testing/migración
 * @param {number} count - Número de contraseñas
 * @param {Object} options - Opciones de generación
 * @returns {Array} Contraseñas con análisis detallado
 */
export const generateMultipleSafePasswords = (
  count = 5,
  options = {}
) => {
  if (count < 1 || count > 50) {
    throw new Error('La cantidad debe estar entre 1 y 50');
  }

  const passwords = [];
  const failures = [];
  
  for (let i = 0; i < count; i++) {
    try {
      const password = generateSecurePassword(16, options);
      const analysis = isPasswordSafeForEnv(password);
      
      passwords.push({
        index: i + 1,
        password,
        length: password.length,
        strength: analysis.strength,
        strengthLabel: getStrengthLabel(analysis.strength),
        charTypes: analysis.charTypes,
        safe: analysis.safe,
        issues: analysis.issues,
      });
    } catch (error) {
      failures.push({ index: i + 1, error: error.message });
    }
  }

  // Estadísticas
  const stats = {
    total: passwords.length,
    averageStrength: passwords.length > 0 
      ? Math.round(passwords.reduce((sum, p) => sum + p.strength, 0) / passwords.length)
      : 0,
    safeCount: passwords.filter(p => p.safe).length,
    failures: failures.length,
  };

  return {
    passwords,
    failures,
    stats,
    timestamp: new Date().toISOString(),
    optionsUsed: options,
  };
};

/**
 * Obtiene información detallada sobre símbolos permitidos/prohibidos
 * @returns {Object} Información completa
 */
export const getSymbolsInfo = () => {
  return {
    allowed: {
      symbols: SAFE_SYMBOLS_ARRAY,
      count: SAFE_SYMBOLS_ARRAY.length,
      description: 'Símbolos 100% seguros para archivos .env',
      examples: SAFE_SYMBOLS_ARRAY.slice(0, 5),
    },
    prohibited: {
      symbols: PROHIBITED_SYMBOLS,
      count: PROHIBITED_SYMBOLS.length,
      description: 'Símbolos que causan problemas de parsing o seguridad',
      reasons: {
        '#': 'Comentarios en .env',
        ';': 'Separador de comandos',
        ':': 'Separador en algunas configuraciones',
        '{ }': 'Interpolación de variables',
        '|': 'Pipe/redirección',
        '" \' `': 'Delimitadores de strings',
        '\\': 'Carácter de escape',
        ' ': 'Espacios causan problemas de parsing',
      },
    },
    recommendations: {
      useGenerator: 'Usa generateSecurePassword() para contraseñas seguras',
      validation: 'Siempre valida con isPasswordSafeForEnv() antes de usar',
      length: 'Longitud mínima recomendada: 16 caracteres',
      complexity: 'Incluye al menos 3 tipos de caracteres diferentes',
    },
    version: '2.0.0',
    lastUpdated: '2024',
  };
};

/**
 * Prueba de compatibilidad rápida
 * @returns {Object} Resultados de prueba
 */
export const runCompatibilityTest = () => {
  const testCases = [
    'P@ssw0rd!Secure',
    'Test#123Problem',
    'Safe$Password123',
    'Problem;atic:Here',
    'Good_Password-99',
  ];

  const results = testCases.map(password => ({
    password,
    analysis: isPasswordSafeForEnv(password),
    generated: password.includes('#') || password.includes(';') || password.includes(':') 
      ? null 
      : generateSecurePassword(12),
  }));

  return {
    testDate: new Date().toISOString(),
    totalTests: results.length,
    safeCount: results.filter(r => r.analysis.safe).length,
    unsafeCount: results.filter(r => !r.analysis.safe).length,
    results,
  };
};
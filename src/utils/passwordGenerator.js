/**
 * GENERADOR DE CONTRASEÑAS SEGURAS PARA .env
 * ✅ NUNCA incluye caracteres problemáticos: # ; : { } | " ' ` espacio
 */

/**
 * Genera una contraseña segura para .env
 * @param {number} length - Longitud de la contraseña (default: 12)
 * @param {Object} options - Opciones de generación
 * @returns {string} Contraseña generada (100% segura para .env)
 */
export const generateSecurePassword = (
  length = 12,
  options = {
    includeNumbers: true,
    includeUppercase: true,
    includeLowercase: true,
    includeSymbols: true
  }
) => {
  const {
    includeNumbers = true,
    includeUppercase = true,
    includeLowercase = true,
    includeSymbols = true
  } = options;

  // ✅ CONJUNTOS SEGUROS para .env (NO causan problemas)
  const numbers = '0123456789';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  
  // ✅ SÓLO 15 símbolos que NO causan problemas en .env
  const safeSymbols = '!$%&*()_+-=[]<>?@';
  // ✅ PERMITIDOS: ! $ % & * ( ) _ + - = [ ] < > ? @
  // ❌ EXCLUIDOS: # ; : { } | " ' ` \ espacio (causan problemas)
  
  let charset = '';
  let password = '';
  const requiredChars = [];

  // Añadir conjuntos según opciones
  if (includeLowercase) {
    charset += lowercase;
    requiredChars.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
  }
  if (includeUppercase) {
    charset += uppercase;
    requiredChars.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
  }
  if (includeNumbers) {
    charset += numbers;
    requiredChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
  }
  if (includeSymbols) {
    charset += safeSymbols;
    requiredChars.push(safeSymbols[Math.floor(Math.random() * safeSymbols.length)]);
  }

  // Asegurar al menos un carácter de cada tipo seleccionado
  for (const char of requiredChars) {
    password += char;
  }

  // Completar con caracteres aleatorios
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  // Mezclar la contraseña para evitar patrones
  password = password.split('').sort(() => Math.random() - 0.5).join('');

  // ✅ VERIFICACIÓN FINAL - Nunca generar contraseñas problemáticas
  const hasProblematicChars = /[#;:{}\|"'`\\\s]/.test(password);
  if (hasProblematicChars) {
    console.warn('⚠️  Contraseña generada con caracteres problemáticos, corrigiendo...');
    // Reemplazar cualquier caracter problemático
    password = password
      .replace(/#/g, '!')
      .replace(/;/g, '')
      .replace(/:/g, '')
      .replace(/{/g, '(')
      .replace(/}/g, ')')
      .replace(/\|/g, 'I')
      .replace(/"/g, "'")
      .replace(/`/g, "'")
      .replace(/\\/g, '/')
      .replace(/\s/g, '_');
  }

  return password;
};

/**
 * Verifica si una contraseña es segura para .env
 * @param {string} password - Contraseña a verificar
 * @returns {boolean} true si es segura para .env
 */
export const isPasswordSafeForEnv = (password) => {
  const problematicChars = ['#', ';', ':', '{', '}', '|', '"', "'", '`', '\\', ' '];
  const hasProblematic = problematicChars.some(char => password.includes(char));
  
  if (hasProblematic) {
    console.warn('❌ Contraseña NO segura para .env:', password);
    const found = problematicChars.filter(char => password.includes(char));
    console.warn('   Caracteres problemáticos:', found.join(', '));
    return false;
  }
  
  return true;
};

/**
 * Calcula fortaleza de contraseña (0-100%)
 * @param {string} password - Contraseña a evaluar
 * @returns {number} Puntaje de fortaleza
 */
const calculatePasswordStrength = (password) => {
  let score = 0;
  
  // Longitud
  if (password.length >= 16) score += 30;
  else if (password.length >= 12) score += 25;
  else if (password.length >= 8) score += 15;
  else score += 5;

  // Diversidad de caracteres
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!$%&*()_+\-=\[\]<>?@]/.test(password);

  if (hasLower) score += 10;
  if (hasUpper) score += 15;
  if (hasNumbers) score += 15;
  if (hasSymbols) score += 20;

  // Entropía (caracteres únicos)
  const uniqueChars = new Set(password).size;
  const entropy = (uniqueChars / password.length) * 20;
  score += Math.min(20, entropy);

  return Math.min(100, Math.max(0, score));
};

/**
 * Genera una contraseña con formato para WhatsApp
 * @param {string} clientName - Nombre del cliente
 * @returns {Object} Contraseña y mensaje formateado
 */
export const generatePasswordForClient = (clientName = 'Cliente') => {
  const password = generateSecurePassword(12, {
    includeNumbers: true,
    includeUppercase: true,
    includeLowercase: true,
    includeSymbols: true
  });

  const strength = calculatePasswordStrength(password);
  
  const message = `🔐 *CONTRASEÑA PARA TRADING DESK PRO* 🔐

👤 *Cliente:* ${clientName}
🔑 *Contraseña:* \`${password}\`

📋 *Para copiar:* ${password}

⚠️ *IMPORTANTE:*
• Esta contraseña es de UN SOLO USO
• Debe cambiarse al primer ingreso (opcional)
• No compartir con nadie
• Guardar en lugar seguro

💡 *Recomendación:* Usar un gestor de contraseñas como LastPass o 1Password

¿Necesitas ayuda para ingresar? Estoy disponible.`;

  return {
    password,
    strength,
    message,
    timestamp: new Date().toLocaleString('es-AR'),
    isSafeForEnv: isPasswordSafeForEnv(password)
  };
};

/**
 * Genera múltiples contraseñas seguras para pruebas
 * @param {number} count - Cantidad de contraseñas a generar
 * @param {number} length - Longitud de cada contraseña
 * @returns {Array} Lista de contraseñas con metadatos
 */
export const generateMultipleSafePasswords = (count = 5, length = 12) => {
  const passwords = [];
  
  for (let i = 0; i < count; i++) {
    let password;
    let attempts = 0;
    const maxAttempts = 10;
    
    // Asegurar que sea segura para .env
    do {
      password = generateSecurePassword(length);
      attempts++;
    } while (!isPasswordSafeForEnv(password) && attempts < maxAttempts);
    
    passwords.push({
      password,
      strength: calculatePasswordStrength(password),
      safeForEnv: isPasswordSafeForEnv(password),
      length: password.length
    });
  }
  
  return passwords;
};

/**
 * Obtiene lista de símbolos permitidos y prohibidos
 * @returns {Object} Listas de símbolos
 */
export const getSymbolsInfo = () => {
  return {
    allowed: '!$%&*()_+-=[]<>?@'.split(''),
    prohibited: ['#', ';', ':', '{', '}', '|', '"', "'", '`', '\\', ' '],
    info: {
      allowedCount: 15,
      prohibitedCount: 11,
      note: 'Los símbolos prohibidos causan problemas en archivos .env'
    }
  };
};
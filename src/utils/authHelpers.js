import CryptoJS from 'crypto-js';

/**
 * Clave secreta para hashing (DEBE estar en variable de entorno en producción)
 * IMPORTANTE: Cambia esto en producción o usa VITE_HASH_SECRET
 */
const SECRET_KEY = import.meta.env.VITE_HASH_SECRET || 'fallback-secret-dev-only';

// Validación en desarrollo para recordar cambiar el secret
if (import.meta.env.DEV) {
  console.warn(
    '⚠️  Usando clave de hash de desarrollo. En producción, establece VITE_HASH_SECRET en .env'
  );
}

// Caracteres especiales permitidos para mayor seguridad
const ALLOWED_SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

/**
 * Hashea una contraseña usando SHA-256 con salt
 * @param {string} password - Contraseña en texto plano
 * @returns {string} Contraseña hasheada con timestamp
 */
export const hashPassword = (password) => {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  // Añadir timestamp para prevenir rainbow tables
  const timestamp = Date.now().toString(36);
  const saltedPassword = `${password}${SECRET_KEY}${timestamp}`;
  
  return CryptoJS.SHA256(saltedPassword).toString(CryptoJS.enc.Hex);
};

/**
 * Valida una contraseña según requisitos de seguridad
 * @param {string} password - Contraseña a validar
 * @returns {Object} Resultado detallado de validación
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      validations: {
        minLength: false,
        hasNumber: false,
        hasUppercase: false,
        hasLowercase: false,
        hasSpecialChar: false,
        noSequentialChars: false,
        noCommonPatterns: false
      },
      strength: 0,
      message: 'La contraseña no puede estar vacía'
    };
  }

  const validations = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecialChar: new RegExp(`[${ALLOWED_SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password),
    noSequentialChars: !/(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password),
    noCommonPatterns: !/(password|123456|qwerty|admin|welcome|letmein|monkey|dragon|sunshine|love|zaq1zaq1|qazwsx)/i.test(password)
  };

  const isValid = Object.values(validations).every(v => v);
  const strength = calculatePasswordStrength(password, validations);

  return {
    isValid,
    validations,
    strength,
    message: getPasswordMessage(validations, strength),
    recommendations: getPasswordRecommendations(validations)
  };
};

/**
 * Calcula la fortaleza de la contraseña (0-100) con métricas avanzadas
 */
const calculatePasswordStrength = (password, validations) => {
  let score = 0;
  
  // Longitud (máx 30 puntos)
  if (password.length >= 16) score += 30;
  else if (password.length >= 12) score += 25;
  else if (password.length >= 8) score += 15;
  else if (password.length >= 6) score += 5;

  // Complejidad de caracteres (máx 50 puntos)
  if (validations.hasNumber) score += 10;
  if (validations.hasUppercase) score += 10;
  if (validations.hasLowercase) score += 10;
  if (validations.hasSpecialChar) score += 15;
  if (validations.noSequentialChars) score += 3;
  if (validations.noCommonPatterns) score += 2;

  // Entropía y diversidad (máx 20 puntos)
  const charTypes = [
    /\d/.test(password),
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    new RegExp(`[${ALLOWED_SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)
  ].filter(Boolean).length;

  score += charTypes * 5; // 5 puntos por cada tipo de carácter

  // Penalizaciones
  if (password.length < 8) score -= 10;
  if (/(.)\1{2,}/.test(password)) score -= 15; // Caracteres repetidos
  if (/^\d+$/.test(password)) score -= 20; // Solo números
  if (/^[a-zA-Z]+$/.test(password)) score -= 15; // Solo letras

  return Math.max(0, Math.min(100, score));
};

/**
 * Obtiene mensaje descriptivo de la fortaleza
 */
const getPasswordMessage = (validations, strength) => {
  if (strength < 30) return '❌ Muy débil - Fácil de hackear';
  if (strength < 50) return '⚠️  Débil - Mejorable';
  if (strength < 70) return '✅ Aceptable - Seguridad básica';
  if (strength < 85) return '🛡️  Fuerte - Buena protección';
  if (strength < 95) return '🔐 Muy fuerte - Excelente seguridad';
  return '🛡️🔐 Extremadamente fuerte - Máxima seguridad';
};

/**
 * Proporciona recomendaciones específicas para mejorar la contraseña
 */
const getPasswordRecommendations = (validations) => {
  const recommendations = [];

  if (!validations.minLength) {
    recommendations.push('Usa al menos 8 caracteres');
  }
  if (!validations.hasNumber) {
    recommendations.push('Añade al menos un número (0-9)');
  }
  if (!validations.hasUppercase) {
    recommendations.push('Incluye una letra mayúscula (A-Z)');
  }
  if (!validations.hasLowercase) {
    recommendations.push('Incluye una letra minúscula (a-z)');
  }
  if (!validations.hasSpecialChar) {
    recommendations.push(`Añade un carácter especial: ${ALLOWED_SPECIAL_CHARS}`);
  }
  if (!validations.noSequentialChars) {
    recommendations.push('Evita secuencias como "123" o "abc"');
  }
  if (!validations.noCommonPatterns) {
    recommendations.push('Evita contraseñas comunes como "password"');
  }

  return recommendations;
};

/**
 * Genera una contraseña segura aleatoria
 * @param {number} length - Longitud de la contraseña (default: 12)
 * @returns {string} Contraseña segura generada
 */
export const generateSecurePassword = (length = 12) => {
  const charset = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    special: ALLOWED_SPECIAL_CHARS
  };

  // Asegurar al menos un carácter de cada tipo
  let password = [
    charset.lowercase[Math.floor(Math.random() * charset.lowercase.length)],
    charset.uppercase[Math.floor(Math.random() * charset.uppercase.length)],
    charset.numbers[Math.floor(Math.random() * charset.numbers.length)],
    charset.special[Math.floor(Math.random() * charset.special.length)]
  ];

  // Completar con caracteres aleatorios
  const allChars = Object.values(charset).join('');
  for (let i = password.length; i < length; i++) {
    password.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Mezclar la contraseña
  return password
    .sort(() => Math.random() - 0.5)
    .join('');
};

/**
 * Extrae usuarios del .env de forma segura
 * @returns {Array} Lista de usuarios con información limitada
 */
export const extractUsersFromEnv = () => {
  const users = [];
  
  try {
    // Admin (si existe)
    const adminUser = import.meta.env.VITE_ADMIN_USER;
    if (adminUser) {
      users.push({
        email: adminUser,
        role: 'admin',
        displayName: 'Administrador',
        isActive: true,
        hasPassword: !!import.meta.env.VITE_ADMIN_PASS,
        // No exponer la contraseña
        passwordHash: import.meta.env.VITE_ADMIN_PASS ? '[PROTECTED]' : null
      });
    }

    // Usuarios clientes (1-10)
    for (let i = 1; i <= 10; i++) {
      const userVar = import.meta.env[`VITE_USER_${i}`];
      if (userVar && typeof userVar === 'string') {
        const [email, password] = userVar.split(':');
        const trimmedEmail = email?.trim();
        
        if (trimmedEmail) {
          users.push({
            email: trimmedEmail,
            role: 'client',
            displayName: `Cliente ${i}`,
            isActive: !!password,
            hasPassword: !!password,
            // Solo en desarrollo mostrar info limitada
            passwordPreview: import.meta.env.DEV && password 
              ? `${password.substring(0, 2)}***${password.substring(password.length - 1)}`
              : '[PROTECTED]'
          });
        }
      }
    }

    // Log solo en desarrollo
    if (import.meta.env.DEV) {
      console.log(`🔍 Usuarios cargados: ${users.length}`);
    }

  } catch (error) {
    console.error('❌ Error extrayendo usuarios:', error);
    return [];
  }

  return users;
};

/**
 * Formatea email para mostrar manteniendo privacidad
 */
export const formatEmail = (email, showFull = false) => {
  if (!email || typeof email !== 'string') return '';
  
  if (showFull || import.meta.env.DEV) {
    return email;
  }

  const [name, domain] = email.split('@');
  if (!domain) return email;

  if (name.length <= 3) {
    return `***@${domain}`;
  }

  const visiblePart = name.substring(0, 3);
  const hiddenPart = '*'.repeat(Math.max(1, name.length - 3));
  return `${visiblePart}${hiddenPart}@${domain}`;
};

/**
 * Verifica si un usuario ya existe
 */
export const userExists = (email) => {
  const users = extractUsersFromEnv();
  return users.some(user => 
    user.email.toLowerCase() === email.toLowerCase().trim()
  );
};

/**
 * Valida formato de email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Crea un token temporal para operaciones seguras
 */
export const createTempToken = (data, expiresInMinutes = 5) => {
  const payload = {
    data,
    expires: Date.now() + (expiresInMinutes * 60 * 1000),
    nonce: Math.random().toString(36).substring(2)
  };
  
  return CryptoJS.AES.encrypt(
    JSON.stringify(payload),
    SECRET_KEY
  ).toString();
};

/**
 * Verifica y decodifica un token temporal
 */
export const verifyTempToken = (token) => {
  try {
    const bytes = CryptoJS.AES.decrypt(token, SECRET_KEY);
    const payload = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    
    if (payload.expires < Date.now()) {
      throw new Error('Token expirado');
    }
    
    return payload.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error verificando token:', error);
    }
    return null;
  }
};

/**
 * Limpia datos sensibles de objetos (para logging seguro)
 */
export const sanitizeForLog = (obj) => {
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
  const sanitized = JSON.parse(JSON.stringify(obj));
  
  const cleanObject = (obj) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (sensitiveKeys.some(sensitive => 
          key.toLowerCase().includes(sensitive.toLowerCase())
        )) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          cleanObject(obj[key]);
        }
      });
    }
    return obj;
  };
  
  return cleanObject(sanitized);
};
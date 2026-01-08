import CryptoJS from 'crypto-js';

// Clave secreta para hashing (en producción usar variable de entorno)
const SECRET_KEY = import.meta.env.VITE_HASH_SECRET || 'fallback-secret';

/**
 * Hashea una contraseña usando SHA-256
 * @param {string} password - Contraseña en texto plano
 * @returns {string} Contraseña hasheada
 */
export const hashPassword = (password) => {
  return CryptoJS.SHA256(password + SECRET_KEY).toString(CryptoJS.enc.Hex);
};

/**
 * Valida una contraseña según requisitos
 * @param {string} password - Contraseña a validar
 * @returns {Object} Resultado de validación
 */
export const validatePassword = (password) => {
  const validations = {
    minLength: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isValid = Object.values(validations).every(v => v);
  const strength = calculatePasswordStrength(password, validations);

  return {
    isValid,
    validations,
    strength,
    message: getPasswordMessage(validations, strength)
  };
};

/**
 * Calcula la fortaleza de la contraseña (0-100)
 */
const calculatePasswordStrength = (password, validations) => {
  let score = 0;
  
  // Longitud
  if (password.length >= 12) score += 30;
  else if (password.length >= 8) score += 20;
  else if (password.length >= 6) score += 10;

  // Complejidad
  if (validations.hasNumber) score += 15;
  if (validations.hasUppercase) score += 15;
  if (validations.hasLowercase) score += 10;
  if (validations.hasSpecialChar) score += 20;

  // Entropía básica
  const uniqueChars = new Set(password).size;
  score += Math.min(20, (uniqueChars / password.length) * 20);

  return Math.min(100, score);
};

/**
 * Obtiene mensaje descriptivo de la contraseña
 */
const getPasswordMessage = (validations, strength) => {
  if (strength < 40) return 'Muy débil';
  if (strength < 60) return 'Débil';
  if (strength < 80) return 'Buena';
  if (strength < 90) return 'Fuerte';
  return 'Muy fuerte';
};

/**
 * Extrae usuarios del .env en formato útil
 * @returns {Array} Lista de usuarios
 */
export const extractUsersFromEnv = () => {
  const users = [];
  
  // Admin
  const adminUser = import.meta.env.VITE_ADMIN_USER;
  const adminPass = import.meta.env.VITE_ADMIN_PASS;
  if (adminUser && adminPass) {
    users.push({
      email: adminUser,
      role: 'admin',
      displayName: 'Administrador',
      isActive: true
    });
  }

  // Usuarios clientes
  for (let i = 1; i <= 10; i++) {
    const userVar = import.meta.env[`VITE_USER_${i}`];
    if (userVar && userVar.includes(':')) {
      const [email, password] = userVar.split(':');
      if (email && password) {
        users.push({
          email,
          role: 'client',
          displayName: `Cliente ${i}`,
          isActive: true,
          hasPassword: true
        });
      }
    } else if (userVar && userVar.trim() !== '') {
      // Usuario sin contraseña configurada
      users.push({
        email: userVar,
        role: 'client',
        displayName: `Cliente ${i} (sin contraseña)`,
        isActive: false,
        hasPassword: false
      });
    }
  }

  return users;
};

/**
 * Formatea email para mostrar
 */
export const formatEmail = (email) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  if (name.length > 3) {
    return `${name.substring(0, 3)}***@${domain}`;
  }
  return `***@${domain}`;
}; 
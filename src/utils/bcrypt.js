import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Encriptar contraseña
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} Contraseña encriptada
 */
export const hashPassword = async (password) => {
  try {
    if (!password || typeof password !== 'string') {
      throw new Error('Contraseña inválida');
    }
    
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('Error encriptando contraseña:', error);
    throw new Error('Error procesando contraseña');
  }
};

/**
 * Verificar contraseña
 * @param {string} password - Contraseña en texto plano
 * @param {string} hashedPassword - Contraseña encriptada
 * @returns {Promise<boolean>} True si la contraseña es correcta
 */
export const comparePassword = async (password, hashedPassword) => {
  try {
    if (!password || !hashedPassword) {
      return false;
    }
    
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error verificando contraseña:', error);
    return false;
  }
};

/**
 * Validar fortaleza de contraseña
 * @param {string} password - Contraseña a validar
 * @returns {Object} Resultado de la validación
 */
export const validatePasswordStrength = (password) => {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('La contraseña es requerida');
    return { isValid: false, errors };
  }
  
  if (password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }
  
  if (password.length > 128) {
    errors.push('La contraseña no puede tener más de 128 caracteres');
  }
  
  // Verificar que no sea una contraseña común
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('La contraseña es muy común, elige una más segura');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

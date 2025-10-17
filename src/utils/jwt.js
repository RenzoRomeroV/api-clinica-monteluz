import jwt from 'jsonwebtoken';

// Clave JWT fija para simplificar
const JWT_SECRET = 'clinica_monteluz_2024_romero_super_secreto_jwt_xyz789';
const JWT_EXPIRES_IN = '24h';

/**
 * Generar token JWT
 * @param {Object} payload - Datos del usuario
 * @param {string} expiresIn - Tiempo de expiración
 * @returns {string} Token JWT
 */
export const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  } catch (error) {
    console.error('Error generando token JWT:', error);
    throw new Error('Error generando token de autenticación');
  }
};

/**
 * Verificar token JWT
 * @param {string} token - Token a verificar
 * @returns {Object} Payload decodificado
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    } else {
      throw new Error('Error verificando token');
    }
  }
};

/**
 * Decodificar token sin verificar (para obtener información)
 * @param {string} token - Token a decodificar
 * @returns {Object} Payload decodificado
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
};

/**
 * Extraer token del header Authorization
 * @param {string} authHeader - Header Authorization
 * @returns {string|null} Token extraído
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};



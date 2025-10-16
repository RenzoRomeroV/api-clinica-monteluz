import jwt from 'jsonwebtoken';

/**
 * Generar token JWT
 */
export const generarToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'RomeroValverde200324*',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Verificar token JWT
 */
export const verificarToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'RomeroValverde200324*');
  } catch (error) {
    return null;
  }
};

export default { generarToken, verificarToken };





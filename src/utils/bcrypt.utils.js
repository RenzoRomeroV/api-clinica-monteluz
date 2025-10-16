import bcrypt from 'bcryptjs';

/**
 * Encriptar contraseña
 */
export const encriptarPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Comparar contraseña
 */
export const compararPassword = async (password, passwordEncriptado) => {
  return await bcrypt.compare(password, passwordEncriptado);
};

export default { encriptarPassword, compararPassword };





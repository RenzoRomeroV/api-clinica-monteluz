import supabase from '../config/database.js';
import { encriptarPassword, compararPassword } from '../utils/bcrypt.utils.js';
import { generarToken } from '../utils/jwt.utils.js';

/**
 * Login de administrador
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar administrador por correo
    const { data: administrador, error } = await supabase
      .from('administradores')
      .select('*')
      .eq('correo', email)
      .single();

    if (error || !administrador) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar si está activo
    if (administrador.estado !== 1) {
      return res.status(401).json({
        error: 'Cuenta inactiva',
        message: 'Tu cuenta de administrador está inactiva'
      });
    }

    // Verificar contraseña
    const passwordValido = await compararPassword(password, administrador.contraseña);
    
    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Generar token
    const token = generarToken({
      id: administrador.id,
      email: administrador.correo,
      tipo: 'administrador',
      nombre: administrador.nombre,
      apellidos: administrador.apellidos
    });

    // Preparar respuesta del usuario
    const usuarioResponse = {
      id: administrador.id,
      nombre: administrador.nombre,
      apellidos: administrador.apellidos,
      correo: administrador.correo,
      dni: administrador.dni,
      tipo_usuario: 'administrador',
      estado: administrador.estado,
      created_at: administrador.created_at
    };

    res.json({
      message: 'Login de administrador exitoso',
      token,
      usuario: usuarioResponse
    });
  } catch (error) {
    console.error('Error en login de administrador:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: error.message
    });
  }
};

/**
 * Verificar token de administrador
 */
export const verificarTokenAdmin = async (req, res) => {
  try {
    // El middleware ya verificó el token, solo devolvemos los datos del administrador
    const { data: administrador, error } = await supabase
      .from('administradores')
      .select('id, nombre, apellidos, correo, dni, estado, created_at')
      .eq('id', req.usuario.id)
      .single();

    if (error || !administrador) {
      return res.status(404).json({
        error: 'Administrador no encontrado'
      });
    }

    // Verificar si está activo
    if (administrador.estado !== 1) {
      return res.status(401).json({
        error: 'Cuenta inactiva'
      });
    }

    const usuarioResponse = {
      ...administrador,
      tipo_usuario: 'administrador'
    };

    res.json({
      message: 'Token válido',
      usuario: usuarioResponse
    });
  } catch (error) {
    console.error('Error en verificación de administrador:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: error.message
    });
  }
};

export default { loginAdmin, verificarTokenAdmin };

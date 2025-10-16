import supabase from '../config/database.js';
import { encriptarPassword, compararPassword } from '../utils/bcrypt.utils.js';
import { generarToken } from '../utils/jwt.utils.js';

/**
 * Login de usuario
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const passwordValido = await compararPassword(password, usuario.password);
    
    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Generar token
    const token = generarToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    });

    // Remover password de la respuesta
    delete usuario.password;

    res.json({
      message: 'Login exitoso',
      token,
      usuario
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: error.message
    });
  }
};

/**
 * Registro de nuevo usuario
 */
export const register = async (req, res) => {
  try {
    const { email, password, nombre, apellido, telefono, rol = 'paciente' } = req.body;

    // Verificar si el email ya existe
    const { data: usuarioExistente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (usuarioExistente) {
      return res.status(400).json({
        error: 'Email ya registrado',
        message: 'Este email ya está en uso'
      });
    }

    // Encriptar contraseña
    const passwordEncriptado = await encriptarPassword(password);

    // Crear usuario
    const { data: nuevoUsuario, error } = await supabase
      .from('usuarios')
      .insert([{
        email,
        password: passwordEncriptado,
        nombre,
        apellido,
        telefono,
        rol,
        activo: true,
        created_at: new Date()
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Generar token
    const token = generarToken({
      id: nuevoUsuario.id,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol
    });

    // Remover password de la respuesta
    delete nuevoUsuario.password;

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      usuario: nuevoUsuario
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: error.message
    });
  }
};

/**
 * Logout de usuario
 */
export const logout = async (req, res) => {
  try {
    // En una implementación con tokens en base de datos, aquí se invalidaría el token
    res.json({
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: error.message
    });
  }
};

/**
 * Verificar token
 */
export const verificarTokenController = async (req, res) => {
  try {
    // El middleware ya verificó el token, solo devolvemos los datos del usuario
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id, email, nombre, apellido, rol, activo')
      .eq('id', req.usuario.id)
      .single();

    if (error || !usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      message: 'Token válido',
      usuario
    });
  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      message: error.message
    });
  }
};

export default { login, register, logout, verificarTokenController };





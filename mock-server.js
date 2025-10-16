import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Middlewares
app.use(cors({
  origin: ['http://localhost:4200', 'https://clinica-monteluz.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Base de datos en memoria (para pruebas)
const usuarios = [
  {
    id: '1',
    email: 'admin@monteluz.com',
    password: '$2a$12$rJGtftCyeQyB8WPx8GkFSurNzzFsPOTZEB0.F5jU8Oe1pSIzZ5eV.', // admin123
    nombre: 'Administrador',
    apellido: 'Sistema',
    rol: 'admin',
    telefono: '999999999',
    activo: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'doctor@monteluz.com',
    password: '$2a$12$rJGtftCyeQyB8WPx8GkFSurNzzFsPOTZEB0.F5jU8Oe1pSIzZ5eV.', // admin123
    nombre: 'Dr. Juan',
    apellido: 'Pérez',
    rol: 'doctor',
    telefono: '999999998',
    activo: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    email: 'paciente@monteluz.com',
    password: '$2a$12$rJGtftCyeQyB8WPx8GkFSurNzzFsPOTZEB0.F5jU8Oe1pSIzZ5eV.', // admin123
    nombre: 'María',
    apellido: 'García',
    rol: 'paciente',
    telefono: '999999997',
    activo: true,
    created_at: new Date().toISOString()
  }
];

// Función para generar token JWT
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Función para verificar token JWT
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏥 API Clínica Monteluz - Servidor Mock',
    version: '2.0.0',
    status: 'OK',
    timestamp: new Date().toISOString(),
    mode: 'MOCK'
  });
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba
app.get('/api/auth/test', (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint de autenticación funcionando',
    timestamp: new Date().toISOString()
  });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const usuario = usuarios.find(u => u.email === email && u.activo);
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar contraseña
    const passwordValid = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Generar token
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    });
    
    // Preparar respuesta
    const usuarioResponse = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      telefono: usuario.telefono,
      created_at: usuario.created_at
    };
    
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      usuario: usuarioResponse
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Login Admin
app.post('/api/auth/login-admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario admin
    const usuario = usuarios.find(u => u.email === email && u.rol === 'admin' && u.activo);
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales de administrador inválidas'
      });
    }
    
    // Verificar contraseña
    const passwordValid = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales de administrador inválidas'
      });
    }
    
    // Generar token
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    });
    
    // Preparar respuesta
    const usuarioResponse = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      telefono: usuario.telefono,
      created_at: usuario.created_at
    };
    
    res.json({
      success: true,
      message: 'Inicio de sesión de administrador exitoso',
      token,
      usuario: usuarioResponse
    });
    
  } catch (error) {
    console.error('Error en login-admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Registro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, nombre, apellido, telefono, rol } = req.body;
    
    // Verificar si el email ya existe
    const emailExists = usuarios.find(u => u.email === email);
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }
    
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Crear nuevo usuario
    const nuevoUsuario = {
      id: (usuarios.length + 1).toString(),
      email,
      password: hashedPassword,
      nombre,
      apellido,
      rol: rol || 'paciente',
      telefono: telefono || null,
      activo: true,
      created_at: new Date().toISOString()
    };
    
    usuarios.push(nuevoUsuario);
    
    // Generar token
    const token = generateToken({
      id: nuevoUsuario.id,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol
    });
    
    // Preparar respuesta
    const usuarioResponse = {
      id: nuevoUsuario.id,
      email: nuevoUsuario.email,
      nombre: nuevoUsuario.nombre,
      apellido: nuevoUsuario.apellido,
      rol: nuevoUsuario.rol,
      telefono: nuevoUsuario.telefono,
      created_at: nuevoUsuario.created_at
    };
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      usuario: usuarioResponse
    });
    
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Verificar token
app.post('/api/auth/verify', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token requerido'
      });
    }
    
    // Verificar token
    const decoded = verifyToken(token);
    
    // Buscar usuario
    const usuario = usuarios.find(u => u.id === decoded.id && u.activo);
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o usuario inactivo'
      });
    }
    
    // Preparar respuesta
    const usuarioResponse = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      telefono: usuario.telefono,
      created_at: usuario.created_at
    };
    
    res.json({
      success: true,
      message: 'Token válido',
      usuario: usuarioResponse
    });
    
  } catch (error) {
    console.error('Error en verify:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
🚀 Servidor Mock iniciado
📍 URL: http://localhost:${PORT}
🌍 Entorno: ${process.env.NODE_ENV || 'development'}
⏰ Iniciado: ${new Date().toISOString()}

👤 Usuarios de prueba:
   Admin: admin@monteluz.com / admin123
   Doctor: doctor@monteluz.com / admin123
   Paciente: paciente@monteluz.com / admin123
  `);
});

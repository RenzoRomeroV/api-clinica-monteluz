import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from '../src/routes/auth.routes.js';

// Configuración
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: true, // Permitir todos los orígenes temporalmente para solucionar el problema
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: '🏥 API Clínica Monteluz - Funcionando correctamente',
    version: '1.0.2',
    status: 'OK',
    lastUpdate: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  🚀 Servidor corriendo en puerto ${PORT}
  📍 URL: http://localhost:${PORT}
  🌍 Entorno: ${process.env.NODE_ENV || 'development'}
  `);
});

export default app;

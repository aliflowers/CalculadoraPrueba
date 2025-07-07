const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const operationsRoutes = require('./routes/operations');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configuración de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'https://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana de tiempo
  message: {
    error: 'Demasiadas solicitudes',
    message: 'Has excedido el límite de solicitudes. Intenta nuevamente en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// Rate limiting específico para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 intentos de login por IP
  message: {
    error: 'Demasiados intentos de autenticación',
    message: 'Has excedido el límite de intentos de login. Intenta nuevamente en 15 minutos.'
  }
});

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging básico
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Rutas principales
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/operations', operationsRoutes);

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor de calculadora científica funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta principal con información de la API
app.get('/', (req, res) => {
  res.json({
    message: 'API Backend - Calculadora Científica',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        verify: 'GET /api/auth/verify'
      },
      operations: {
        save: 'POST /api/operations',
        list: 'GET /api/operations',
        statistics: 'GET /api/operations/statistics',
        delete: 'DELETE /api/operations/:id',
        clearAll: 'DELETE /api/operations'
      }
    },
    documentation: 'Consulta la documentación completa en el README.md'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'GET /api/auth/verify',
      'POST /api/operations',
      'GET /api/operations',
      'GET /api/operations/statistics',
      'DELETE /api/operations/:id',
      'DELETE /api/operations'
    ]
  });
});

// Middleware de manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);

  // Error de JSON malformado
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: 'JSON inválido',
      message: 'El cuerpo de la solicitud contiene JSON malformado'
    });
  }

  res.status(500).json({
    error: 'Error interno del servidor',
    message: 'Ha ocurrido un error inesperado',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
  console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📋 Salud del servidor: http://localhost:${PORT}/health`);
  console.log(`📚 Documentación API: http://localhost:${PORT}/`);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Señal SIGTERM recibida, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Señal SIGINT recibida, cerrando servidor...');
  process.exit(0);
});

module.exports = app;

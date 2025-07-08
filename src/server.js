const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar rutas
const path = require('path');
const operationsRoutes = require('./routes/operations');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// CONFIGURACIÓN PARA RENDER - Trust proxy para compatibilidad con Render
app.set('trust proxy', 1);

// Middleware de seguridad
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configuración de CORS mejorada
app.use(cors({
    origin: process.env.FRONTEND_URL || [
        'http://localhost:3000',
        'https://localhost:3000',
        'https://*.onrender.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting SOLO para APIs - No aplicar a rutas estáticas
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana de tiempo
    message: {
        error: 'Demasiadas solicitudes',
        message: 'Has excedido el límite de solicitudes. Intenta nuevamente en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // No aplicar rate limiting a archivos estáticos y ruta principal
        return req.path === '/' || 
               req.path.startsWith('/css') || 
               req.path.startsWith('/js') || 
               req.path.startsWith('/images') ||
               req.path.endsWith('.html') ||
               req.path.endsWith('.css') ||
               req.path.endsWith('.js') ||
               req.path.endsWith('.png') ||
               req.path.endsWith('.jpg') ||
               req.path.endsWith('.ico');
    }
});

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

// SERVIR ARCHIVOS ESTÁTICOS CORRECTAMENTE - Configuración mejorada
app.use(express.static(path.join(__dirname, '../public'), {
    index: ['index.html'],
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// APLICAR RATE LIMITING SOLO A RUTAS API
app.use('/api', apiLimiter);

// Rutas API
app.use('/api/operations', operationsRoutes);
app.use('/api/auth', authLimiter, authRoutes);

// RUTA PRINCIPAL CORREGIDA - Devuelve HTML, no JSON
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'), (err) => {
        if (err) {
            console.error('Error serving index.html:', err);
            res.status(500).send('Error loading application');
        }
    });
});

// Ruta de salud del servidor (para monitoreo)
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor de calculadora científica funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API info endpoint (para desarrolladores)
app.get('/api', (req, res) => {
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

// RUTA COMODÍN PARA SPA - Manejo correcto para aplicaciones de una sola página
app.get('*', (req, res) => {
    // Solo redirigir rutas que no sean de API
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../public/index.html'), (err) => {
            if (err) {
                console.error('Error serving index.html for SPA route:', err);
                res.status(404).json({
                    error: 'Página no encontrada',
                    message: `La ruta ${req.path} no existe`
                });
            }
        });
    } else {
        // Para rutas de API que no existen
        res.status(404).json({
            error: 'Endpoint de API no encontrado',
            message: `La ruta de API ${req.method} ${req.originalUrl} no existe`,
            availableEndpoints: [
                'GET /api',
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
    }
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Ha ocurrido un error inesperado'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en puerto ${PORT}`);
    console.log(`📁 Sirviendo archivos estáticos desde: ${path.join(__dirname, '../public')}`);
    console.log(`🌐 Aplicación disponible en: http://localhost:${PORT}`);
    console.log(`📊 Health check disponible en: http://localhost:${PORT}/health`);
}); express = require('express');


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


// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging básico
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
});
// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '../public')));
// Rutas principales
app.use('/api/operations', operationsRoutes);
// Ruta principal para servir el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
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
app.listen(PORT, '0.0.0.0', () => {
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

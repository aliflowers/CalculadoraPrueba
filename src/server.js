const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const path = require('path');

// Importar rutas
const operationsRoutes = require('./routes/operations');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// CONFIGURACIÓN PARA RENDER - Trust proxy para compatibilidad con Render
app.set('trust proxy', 1);

// Middleware de seguridad
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
            "style-src": ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
            "font-src": ["'self'", "cdnjs.cloudflare.com"],
        },
    },
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

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging básico
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// SERVIR ARCHIVOS ESTÁTICOS CORRECTAMENTE
app.use(express.static(path.join(__dirname, '../public'), {
    index: ['index.html'],
    setHeaders: (res, path) => {
        if (path.endsWith('.html') || path.endsWith('.js')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// Rate limiting para APIs
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana de tiempo
    message: {
        error: 'Demasiadas solicitudes',
        message: 'Has excedido el límite de solicitudes. Intenta nuevamente en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
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

// APLICAR RATE LIMITING A RUTAS API
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter); // Aplicar el limiter más estricto a las rutas de auth

// Rutas API
app.use('/api/operations', operationsRoutes);
app.use('/api/auth', authRoutes);

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

// RUTA COMODÍN PARA SPA - Manejo para aplicaciones de una sola página
app.get('*', (req, res) => {
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
            message: `La ruta de API ${req.method} ${req.originalUrl} no existe`
        });
    }
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    // Error de JSON malformado
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'JSON inválido',
            message: 'El cuerpo de la solicitud contiene JSON malformado'
        });
    }
    res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Ha ocurrido un error inesperado',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
});

// Iniciar servidor
const startServer = async () => {
  await require('./config/initDb')();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📋 Salud del servidor: http://localhost:${PORT}/health`);
  });
};

startServer();

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

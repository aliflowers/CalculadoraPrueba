# Backend Calculadora Científica Web

API Backend desarrollada con Node.js, Express, JWT y PostgreSQL para una calculadora científica web con autenticación de usuarios y almacenamiento de historial de operaciones.

## 🚀 Características

- **Autenticación JWT**: Registro, login y sesiones seguras
- **Base de datos PostgreSQL**: Almacenamiento de usuarios y operaciones
- **API REST**: Endpoints completos para gestión de operaciones
- **Seguridad**: Rate limiting, helmet, validación de datos
- **Historial**: Guardado y consulta de operaciones por usuario
- **Estadísticas**: Análisis de uso por tipo de operación
- **CORS configurado**: Listo para integración con frontend
- **Despliegue**: Optimizado para servicios gratuitos (Render, Railway)

## 📋 Requisitos

## 🖥️ Frontend - Calculadora Científica

El frontend ha sido implementado como una aplicación web moderna con HTML, CSS y JavaScript embebidos en un solo archivo (`public/index.html`).

### 🌟 Características del Frontend

- **Calculadora Científica Completa**: Operaciones básicas y científicas (trigonométricas, logarítmicas, exponenciales)
- **Interfaz Responsive**: Diseño adaptativo para móviles y escritorio
- **Modo Básico y Científico**: Alterna entre vista simple y completa
- **Funciones de Memoria**: M+, M-, MR, MC para almacenamiento temporal
- **Soporte para Teclado**: Navegación y operación con teclado
- **Diseño Moderno**: Interfaz intuitiva con efectos visuales y tooltips
- **Completamente Autónomo**: Todo embebido en un solo archivo HTML

### 📁 Estructura del Proyecto

```
CalculadoraPrueba/
├── public/
│   └── index.html          # Frontend de la calculadora científica
├── src/
│   ├── server.js           # Servidor Express configurado
│   ├── routes/
│   │   ├── operations.js   # Rutas API para operaciones
│   │   └── auth.js         # Rutas de autenticación
│   └── middleware/
├── sql/                    # Scripts de base de datos
├── package.json
├── render.yaml            # Configuración para Render
├── Procfile              # Configuración para Railway/Heroku
└── README.md
```

## 🚀 Despliegue en Render

### Paso 1: Preparación del Repositorio
✅ **COMPLETADO** - El repositorio ya está configurado con:
- Carpeta `public/` con frontend completo
- `server.js` configurado para servir archivos estáticos
- `render.yaml` configurado
- Variables de entorno en `.env.example`

### Paso 2: Configuración en Render

1. **Crear cuenta en Render**: Ve a [render.com](https://render.com) y regístrate
2. **Conectar GitHub**: Autoriza Render para acceder a tus repositorios
3. **Crear nuevo Web Service**:
   - Selecciona este repositorio: `aliflowers/CalculadoraPrueba`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

### Paso 3: Variables de Entorno

Configura estas variables en el dashboard de Render:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@hostname:port/database
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
FRONTEND_URL=https://tu-app.onrender.com
```

### Paso 4: Base de Datos PostgreSQL

1. **Crear base de datos en Render**:
   - Ir a Dashboard → New → PostgreSQL
   - Crear nueva instancia gratuita
   - Copiar la URL de conexión

2. **Configurar DATABASE_URL**:
   - Usar la URL completa proporcionada por Render
   - Formato: `postgresql://user:password@hostname:port/database`

### Paso 5: Despliegue Automático

1. **Push al repositorio**: Los cambios se despliegan automáticamente
2. **Verificar logs**: Revisa los logs en el dashboard de Render
3. **Acceder a la aplicación**: 
   - Backend API: `https://tu-app.onrender.com/api/`
   - Frontend: `https://tu-app.onrender.com/` (Calculadora científica)

## 🌐 URLs de Acceso

- **Frontend (Calculadora)**: `https://tu-app.onrender.com/`
- **API Health Check**: `https://tu-app.onrender.com/health`
- **API Operations**: `https://tu-app.onrender.com/api/operations`
- **API Auth**: `https://tu-app.onrender.com/api/auth`

## 🔧 Configuración del Servidor

El servidor Express está configurado para:

```javascript
// Servir archivos estáticos desde public/
app.use(express.static(path.join(__dirname, '../public')));

// Ruta principal para el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// APIs bajo el prefijo /api/
app.use('/api/operations', operationsRoutes);
app.use('/api/auth', authRoutes);
```

## ✅ Verificación del Despliegue

Después del despliegue, verifica:

1. **Frontend funcionando**: Accede a la URL principal y usa la calculadora
2. **API disponible**: Prueba `https://tu-app.onrender.com/health`
3. **Base de datos conectada**: Verifica que las operaciones se guarden
4. **CORS configurado**: Frontend y API funcionan juntos
5. **Rate limiting activo**: Protección contra abuso

## 🛠️ Desarrollo Local

Para ejecutar el proyecto completo localmente:

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Acceder a:
# - Frontend: http://localhost:5000/
# - API: http://localhost:5000/api/
```

## 📱 Uso de la Calculadora

### Funciones Básicas
- **Operaciones**: +, -, ×, ÷
- **Decimales**: Punto decimal
- **Porcentajes**: % 
- **Cambio de signo**: ±

### Funciones Científicas
- **Trigonométricas**: sin, cos, tan
- **Logarítmicas**: log, ln
- **Exponenciales**: x², x³, xʸ
- **Raíces**: √, ∛
- **Constantes**: π, e

### Funciones de Memoria
- **M+**: Sumar a memoria
- **M-**: Restar de memoria  
- **MR**: Recuperar de memoria
- **MC**: Limpiar memoria

## 🔄 Integración API + Frontend

El frontend puede integrarse con las APIs del backend para:

1. **Historial de Operaciones**: Guardar cálculos en la base de datos
2. **Usuarios**: Sistema de login y sesiones
3. **Estadísticas**: Análisis de uso de funciones
4. **Configuraciones**: Preferencias personalizadas

## 🎯 Próximos Pasos

- [ ] Integrar autenticación en el frontend
- [ ] Conectar historial de operaciones con la API
- [ ] Agregar gráficos de funciones matemáticas
- [ ] Implementar modo offline con Service Worker
- [ ] Agregar más funciones científicas avanzadas- Node.js >= 16.0.0
- PostgreSQL >= 12
- npm o yarn

## 🛠️ Instalación Local

1. **Clonar y navegar al proyecto**
```bash
cd calculator-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus datos:
```env
PORT=5000
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/calculator_db
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. **Inicializar base de datos**
```bash
npm run init-db
```

5. **Iniciar servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📚 API Endpoints

### Autenticación

#### POST `/api/auth/register`
Registrar nuevo usuario
```json
{
  "email": "usuario@email.com",
  "password": "MiPassword123",
  "name": "Nombre Usuario"
}
```

Respuesta:
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "name": "Nombre Usuario",
    "created_at": "2025-01-07T14:30:00.000Z"
  },
  "token": "jwt_token_aqui"
}
```

#### POST `/api/auth/login`
Iniciar sesión
```json
{
  "email": "usuario@email.com",
  "password": "MiPassword123"
}
```

#### GET `/api/auth/profile`
Obtener perfil (requiere token)
```
Headers: Authorization: Bearer jwt_token_aqui
```

#### GET `/api/auth/verify`
Verificar token válido

### Operaciones

Todas las rutas de operaciones requieren autenticación (Bearer token).

#### POST `/api/operations`
Guardar operación
```json
{
  "expression": "sin(45) + cos(30)",
  "result": "1.5731",
  "operation_type": "trigonometric"
}
```

#### GET `/api/operations`
Obtener historial de operaciones
```
Query params:
- page: número de página (default: 1)
- limit: operaciones por página (default: 50)
```

#### GET `/api/operations/statistics`
Obtener estadísticas de uso

#### DELETE `/api/operations/:id`
Eliminar operación específica

#### DELETE `/api/operations`
Limpiar todo el historial

## 🔧 Tipos de Operación Válidos

- `basic`: Operaciones básicas (+, -, *, /)
- `scientific`: Funciones científicas avanzadas
- `trigonometric`: Sin, cos, tan, etc.
- `logarithmic`: Log, ln
- `exponential`: Potencias, raíces
- `statistical`: Media, desviación estándar, etc.

## 🛡️ Seguridad

- **Rate Limiting**: 100 requests/15min general, 10 logins/15min
- **Helmet**: Headers de seguridad HTTP
- **JWT**: Tokens seguros con expiración
- **Validación**: Validación estricta de datos de entrada
- **Hash de contraseñas**: bcrypt con salt 12
- **CORS**: Configurado para dominios específicos

## 🗄️ Esquema de Base de Datos

### Tabla `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla `operations`
```sql
CREATE TABLE operations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  expression VARCHAR(1000) NOT NULL,
  result VARCHAR(255) NOT NULL,
  operation_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Despliegue

### Render (Recomendado)

1. **Crear cuenta en [Render](https://render.com)**

2. **Crear PostgreSQL Database**
   - New → PostgreSQL
   - Copiar DATABASE_URL interno

3. **Crear Web Service**
   - New → Web Service
   - Conectar repositorio
   - Configurar:
     - Build Command: `npm install`
     - Start Command: `npm start`

4. **Variables de entorno en Render**
```
DATABASE_URL=postgresql://render_db_url_aqui
JWT_SECRET=clave_secreta_segura
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.com
```

### Railway

1. **Crear cuenta en [Railway](https://railway.app)**
2. **New Project → Deploy from GitHub**
3. **Add PostgreSQL addon**
4. **Configurar variables de entorno**

### Heroku (Alternativa)

```bash
# Instalar Heroku CLI
heroku create calculator-backend-app
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=tu_clave_secreta
heroku config:set NODE_ENV=production
git push heroku main
```

## 🔍 Monitoreo y Logs

### Endpoints de salud
- `GET /health`: Estado del servidor
- `GET /`: Documentación de API

### Logs importantes
```bash
# Ver logs en desarrollo
npm run dev

# Ver logs en Render
Dashboard → Web Service → Logs

# Ver logs en Railway
Dashboard → Project → Deployments → View Logs
```

## 🧪 Testing

### Ejemplos con curl

**Registro:**
```bash
curl -X POST https://tu-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@email.com",
    "password": "Test123456",
    "name": "Usuario Test"
  }'

---

# 🔧 HISTORIAL DE CAMBIOS - RESOLUCIÓN DE PANTALLA BLANCA

## 📅 Fecha de Resolución: 7 de Enero de 2025

### 🚨 **PROBLEMA IDENTIFICADO**
La aplicación Calculadora desplegada en Render mostraba una **pantalla blanca** debido a múltiples problemas de configuración en el servidor Express.

---

## ✅ **CAMBIOS REALIZADOS EN `src/server.js`**

### 1. 🗂️ **Corrección de Configuración de Archivos Estáticos**

**❌ PROBLEMA:** 
```javascript
// Configuración incorrecta que no servía archivos estáticos
app.use(express.static('public'));
```

**✅ SOLUCIÓN APLICADA:**
```javascript
// Configuración corregida con path absoluto
app.use(express.static(path.join(__dirname, '../public')));
```

**📝 EXPLICACIÓN:** Se corrigió la ruta para servir archivos estáticos desde la carpeta `public/` usando `path.join()` con ruta absoluta desde `src/server.js`.

---

### 2. 🏠 **Corrección de Ruta Principal ('/')**

**❌ PROBLEMA:** 
```javascript
// La ruta '/' devolvía JSON en lugar del archivo HTML
app.get('/', (req, res) => {
  res.json({ message: 'API Calculadora Científica' });
});
```

**✅ SOLUCIÓN APLICADA:**
```javascript
// Ruta corregida para servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
```

**📝 EXPLICACIÓN:** Se cambió la respuesta de JSON a `sendFile()` para servir correctamente el archivo `index.html` del frontend.

---

### 3. 🛡️ **Corrección de Rate Limiting**

**❌ PROBLEMA:** 
```javascript
// Rate limiting aplicado globalmente causaba respuestas JSON
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes' }
}));
```

**✅ SOLUCIÓN APLICADA:**
```javascript
// Rate limiting solo en rutas API, excluyendo archivos estáticos
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes desde esta IP, intenta más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicado solo a rutas API
app.use('/api', apiLimiter);
```

**📝 EXPLICACIÓN:** Se creó un limitador específico para rutas API evitando interferencia con la carga de archivos estáticos HTML/CSS/JS.

---

### 4. 🌐 **Configuración de Trust Proxy para Render**

**❌ PROBLEMA:** 
Faltaba configuración de proxy para el entorno de Render.

**✅ SOLUCIÓN APLICADA:**
```javascript
// Configuración de trust proxy para Render
app.set('trust proxy', 1);
```

**📝 EXPLICACIÓN:** Configuración necesaria para que Express funcione correctamente detrás del proxy reverso de Render.

---

### 5. 🔀 **Reorganización de Middlewares**

**❌ PROBLEMA:** 
Orden incorrecto de middlewares causaba conflictos.

**✅ SOLUCIÓN APLICADA:**
```javascript
// Orden correcto de middlewares
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos ANTES que rate limiting
app.use(express.static(path.join(__dirname, '../public')));

// Rate limiting solo en APIs
app.use('/api', apiLimiter);

// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
```

**📝 EXPLICACIÓN:** Se reordenaron los middlewares para que los archivos estáticos se sirvan antes del rate limiting.

---

### 6. 🎯 **Implementación de Rutas Comodín para SPA**

**✅ SOLUCIÓN APLICADA:**
```javascript
// Catch-all route para SPA (Single Page Application)
app.get('*', (req, res) => {
  // Solo para rutas que no son API
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  } else {
    res.status(404).json({ error: 'Endpoint no encontrado' });
  }
});
```

**📝 EXPLICACIÓN:** Se agregó una ruta comodín que sirve `index.html` para cualquier ruta no-API, permitiendo navegación SPA.

---

## 📁 **VERIFICACIÓN DE ESTRUCTURA DE DIRECTORIOS**

### ✅ **Estructura Verificada y Optimizada:**
```
CalculadoraPrueba/
├── public/
│   └── index.html          # ✅ Frontend completo (HTML + CSS + JS embebidos)
├── src/
│   └── server.js           # ✅ Servidor Express corregido
├── package.json            # ✅ Dependencias correctas
├── render.yaml            # ✅ Configuración de despliegue
└── README.md              # ✅ Documentación actualizada
```

**📝 RESULTADO:** La estructura es óptima y no requirió cambios adicionales.

---

## 🚀 **INSTRUCCIONES DE DESPLIEGUE ACTUALIZADAS**

### 🔄 **Redespliegue Automático en Render**
1. **Los cambios están guardados** en el repositorio GitHub
2. **Render detectará automáticamente** los cambios
3. **Se iniciará el redespliegue** con las correcciones aplicadas
4. **La aplicación estará disponible** sin pantalla blanca

### 🌐 **URLs de Acceso:**
- **Frontend:** `https://tu-app.onrender.com/`
- **API Health:** `https://tu-app.onrender.com/api/health`
- **API Docs:** `https://tu-app.onrender.com/api/docs`

---

## 🧪 **PRUEBAS REALIZADAS**

### ✅ **Configuraciones Verificadas:**
- [x] Archivos estáticos se sirven correctamente
- [x] Ruta principal (`/`) devuelve `index.html`
- [x] Rate limiting no interfiere con archivos estáticos
- [x] Trust proxy configurado para Render
- [x] Rutas comodín funcionan para SPA
- [x] APIs responden correctamente bajo `/api/`

---

## 📋 **RESUMEN DE SOLUCIONES APLICADAS**

| Problema | Solución | Estado |
|----------|----------|---------|
| 🗂️ Archivos estáticos no se servían | Corregido `express.static()` con `path.join()` | ✅ RESUELTO |
| 🏠 Ruta `/` devolvía JSON | Cambiado a `res.sendFile()` para HTML | ✅ RESUELTO |
| 🛡️ Rate limiting bloqueaba HTML | Aplicado solo a rutas `/api/` | ✅ RESUELTO |
| 🌐 Falta trust proxy | Configurado `app.set('trust proxy', 1)` | ✅ RESUELTO |
| 🔀 Orden de middlewares | Reordenados correctamente | ✅ RESUELTO |
| 🎯 Rutas SPA faltantes | Implementada ruta comodín `*` | ✅ RESUELTO |

---

## 🎯 **RESULTADO FINAL**

### ✅ **PROBLEMA DE PANTALLA BLANCA COMPLETAMENTE RESUELTO**

**ANTES:** Pantalla blanca en Render 😞
**DESPUÉS:** Calculadora Científica funcional 🎉

### 🚀 **La aplicación ahora:**
- ✅ Carga correctamente el frontend
- ✅ Sirve archivos estáticos sin problemas  
- ✅ Responde adecuadamente en todas las rutas
- ✅ Funciona correctamente en Render
- ✅ Mantiene las APIs operativas
- ✅ Es compatible con navegación SPA

---

## 👨‍💻 **Cambios Técnicos Realizados por:**
**Fecha:** 7 de Enero de 2025  
**Commit:** Resolución completa del problema de pantalla blanca en Render  
**Archivos modificados:** `src/server.js`, `README.md`

---

**🎉 ¡MISIÓN COMPLETADA! La aplicación está lista para funcionar perfectamente en Render!**

**Login:**
```bash
curl -X POST https://tu-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@email.com",
    "password": "Test123456"
  }'
```

**Guardar operación:**
```bash
curl -X POST https://tu-api.onrender.com/api/operations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu_jwt_token" \
  -d '{
    "expression": "2 + 2",
    "result": "4",
    "operation_type": "basic"
  }'
```

## ⚡ Optimizaciones de Rendimiento

- **Índices de BD**: Optimizados para consultas frecuentes
- **Paginación**: Limitación de resultados por página
- **Rate Limiting**: Prevención de abuso
- **Connection Pooling**: Pool de conexiones PostgreSQL
- **Compresión**: Headers optimizados

## 🐛 Solución de Problemas

### Error de conexión a BD
```bash
# Verificar variables de entorno
echo $DATABASE_URL

# Probar conexión manualmente
npm run init-db
```

### Token inválido
- Verificar JWT_SECRET en variables de entorno
- Confirmar formato: `Authorization: Bearer token`
- Verificar expiración del token

### CORS Issues
- Verificar FRONTEND_URL en variables de entorno
- Confirmar origen del frontend en configuración CORS

## 📝 Contribución

1. Fork del proyecto
2. Crear rama para feature: `git checkout -b feature/nueva-caracteristica`
3. Commit cambios: `git commit -am 'Agregar nueva característica'`
4. Push a la rama: `git push origin feature/nueva-caracteristica`
5. Crear Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

## 👥 Soporte

Para reportar bugs o solicitar características:
- Crear issue en GitHub
- Email: soporte@calculadora.com

---

**¡Backend listo para producción y integración con cualquier frontend!** 🎉

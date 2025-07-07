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

- Node.js >= 16.0.0
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
```

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

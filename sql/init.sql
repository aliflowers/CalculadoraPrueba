-- Script de inicialización manual de base de datos
-- Ejecutar en PostgreSQL para crear las tablas necesarias

-- Crear base de datos (ejecutar como superusuario)
-- CREATE DATABASE calculator_db;

-- Conectar a la base de datos calculator_db
-- \c calculator_db;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de operaciones
CREATE TABLE IF NOT EXISTS operations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    expression VARCHAR(1000) NOT NULL,
    result VARCHAR(255) NOT NULL,
    operation_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_operations_user_id ON operations(user_id);
CREATE INDEX IF NOT EXISTS idx_operations_created_at ON operations(created_at);
CREATE INDEX IF NOT EXISTS idx_operations_type ON operations(operation_type);

-- Insertar datos de prueba (opcional - comentar en producción)
/*
INSERT INTO users (email, password, name) VALUES 
('test@example.com', '$2a$12$hash_de_password_aqui', 'Usuario Test');

INSERT INTO operations (user_id, expression, result, operation_type) VALUES
(1, '2 + 2', '4', 'basic'),
(1, 'sin(45)', '0.7071', 'trigonometric'),
(1, 'log(100)', '2', 'logarithmic');
*/

-- Verificar que las tablas se crearon correctamente
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Mostrar estructura de las tablas
\d users;
\d operations;

// db.js
const { Pool } = require('pg');

// Crear una nueva instancia del Pool para conectar a la base de datos
const pool = new Pool({
    user: 'postgres',        // Reemplaza con tu usuario de PostgreSQL
    host: 'localhost',
    database: 'videogames_db',  // Reemplaza con el nombre de tu base de datos
    password: '1234', // Reemplaza con tu contraseña
    port: 5433,                // Puerto por defecto de PostgreSQL
});

module.exports = pool;

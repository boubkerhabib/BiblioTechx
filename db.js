const { Pool } = require('pg');
require('dotenv').config();

const dbPort = parseInt(process.env.DB_PORT, 10);

// Connexion à PostgreSQL via les variables d'environnement
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: isNaN(dbPort) ? 5432 : dbPort,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'bibliotech',
});

pool.on('connect', () => {
  console.log('Connecté à PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erreur de connexion PostgreSQL :', err.message);
});

module.exports = pool;

const fs = require('fs');
const path = require('path');
const pool = require('./database');

const initScript = fs.readFileSync(path.join(__dirname, '../../sql/init.sql')).toString();

const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    await client.query(initScript);
    client.release();
    console.log('Base de datos inicializada correctamente.');
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;

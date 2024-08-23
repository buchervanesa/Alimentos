// modelos/database.js
const mysql = require('mysql2');
const configuracion = require('../config.json');

const connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos.');
});

module.exports = connection;

const mysql = require('mysql');
const configuracion = require('../config.json');

const connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos.');
});

const metodos = {};

metodos.getAll = function (callback) {
  const consulta = 'SELECT * FROM paciente';
  connection.query(consulta, function (err, resultados) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, resultados);
  });
};



metodos.getByNSS = (nss, callback) => {
  const query = 'SELECT * FROM paciente WHERE nss = ?';
  connection.query(query, [nss], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

module.exports = metodos;

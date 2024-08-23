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



metodos.createIngreso = function (datosIngreso, callback) {
    const consulta = 'INSERT INTO ingreso (id_ingreso, fecha_ingreso, nro_habitacion, nro_cama, observaciones, nro_historia_paciente, matricula_medico) VALUES (?,?, ?, ?, ?, ?, ?)';
    const params = [
     datosIngreso.id_ingreso,
      datosIngreso.fecha_ingreso,
      datosIngreso.nro_habitacion,
      datosIngreso.nro_cama,
      datosIngreso.observaciones,
      datosIngreso.nro_historia_paciente,
      datosIngreso.matricula_medico
    ];
  
    connection.query(consulta, params, function (err, result) {
      if (err) {
        console.error('Error al crear ingreso:', err.message);
        callback(err);
        return;
      }
      callback(null, result);
    });
  };
metodos.getAllIngresos = function (callback) {
  const consulta = 'SELECT * FROM ingreso';
  connection.query(consulta, function (err, resultados) {
    if (err) {
      console.error('Error en la consulta de ingresos:', err.message);
      callback(err);
      return;
    }
    callback(null, resultados);
  });
};

module.exports = {metodos}

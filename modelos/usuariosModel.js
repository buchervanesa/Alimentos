const mysql = require('mysql');
const configuracion = require('../config.json');

const connection = mysql.createConnection(configuracion.database);

// Métodos para manejar usuarios
const metodos = {};

// Crear un nuevo usuario
metodos.createUsuario = (datosUsuario, callback) => {
    const consulta = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
    const params = [datosUsuario.nombre, datosUsuario.email, datosUsuario.password];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            console.error('Error al crear usuario:', err.message);
            callback(err);
            return;
        }
        callback(null, result);
    });
};

// Obtener usuario por email (para login)
metodos.getUsuarioByEmail = (email, callback) => {
    const consulta = 'SELECT * FROM usuarios WHERE email = ?';
    connection.query(consulta, [email], (err, resultados) => {
        if (err) {
            console.error('Error en la consulta del usuario por email:', err.message);
            callback(err);
            return;
        }
        if (resultados.length > 0) {
            callback(null, resultados[0]); // Devuelve el primer usuario encontrado
        } else {
            callback(null, null); // No encontró el usuario
        }
    });
};

// Obtener todos los usuarios
metodos.getAllUsuarios = (callback) => {
    const consulta = 'SELECT * FROM usuarios';
    connection.query(consulta, (err, resultados) => {
        if (err) {
            console.error('Error en la consulta de usuarios:', err.message);
            callback(err);
            return;
        }
        callback(null, resultados);
    });
};
metodos.createHijo = (hijoData, callback) => {
    const consulta = 'INSERT INTO hijos (nombre, edad, usuario_id) VALUES (?, ?, ?)';
    connection.query(consulta, [hijoData.nombre, hijoData.edad, hijoData.usuario_id], (err, result) => {
        if (err) {
            console.error('Error al agregar el hijo:', err.message);
        }
        callback(err, result);
    });
  };  
  metodos.getHijos = (usuario_id, callback) => {
    const consulta = 'SELECT * FROM hijos WHERE usuario_id = ?';
    connection.query(consulta, [usuario_id], (err, results) => {
        if (err) {
            console.error('Error al obtener los hijos:', err.message);
            callback(err, null);
        }
        callback(null, results);
    });
};
module.exports = { metodos, connection };  


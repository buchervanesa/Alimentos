const mysql = require('mysql');
const configuracion = require('../config.json');

const connection = mysql.createConnection(configuracion.database);

// Métodos para manejar productos
const metodos = {};

// Crear un nuevo producto
metodos.createProducto = (datosProducto, callback) => {
    const consulta = 'INSERT INTO productos (nombre, precio, descripcion) VALUES (?, ?, ?)';
    const params = [datosProducto.nombre, datosProducto.precio, datosProducto.descripcion];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            console.error('Error al crear producto:', err.message);
            callback(err);
            return;
        }
        callback(null, result);
    });
};

// Obtener todos los productos
metodos.getAllProductos = (callback) => {
    const consulta = 'SELECT * FROM productos';
    connection.query(consulta, (err, resultados) => {
        if (err) {
            console.error('Error en la consulta de productos:', err.message);
            callback(err);
            return;
        }
        callback(null, resultados);
    });
};

module.exports = { metodos };





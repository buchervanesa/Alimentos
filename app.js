const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const configuracion = require('./config.json');

app.use(express.json());
app.use(morgan('tiny'));

app.use(cors());

// Rutas para manejar productos
app.use('/api/producto', require('./controladores/productoController.js'));
// Rutas para manejar usuarios
app.use('/api/usuario', require('./controladores/usuarioController.js'));
// Rutas para manejar pedidos
app.use('/api/pedido', require('./controladores/pedidosController.js'));

// Rutas para manejar detalles de pedidos
app.use('/api/detalle', require('./controladores/detalleController.js'));

app.listen(configuracion.server.port, (err) => {
    if (err) {
        console.log('Error al iniciar servidor:', err);
    } else {
        console.log(`Servidor encendido en el puerto ${configuracion.server.port}`);
   
      }
    });

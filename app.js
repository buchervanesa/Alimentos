const express = require('express');
const morgan = require('morgan');
const app = express();

const configuracion = require('./config.json');

app.use(express.json());
app.use(morgan('tiny'));


app.use('/api/paciente', require('./controladores/pacienteController.js'));
app.use('/api/medico', require('./controladores/medicoController.js'));
app.use('/api/ingreso', require('./controladores/ingresoController.js'));


app.listen(configuracion.server.port, (err) => {
  if (err) {
    console.log('Error al iniciar servidor:', err);
  } else {
    console.log(`Servidor encendido en el puerto ${configuracion.server.port}`);
  }
});


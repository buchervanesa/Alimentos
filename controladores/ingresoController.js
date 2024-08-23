const express = require('express');
const router = express.Router();
const ingresoBD = require('../modelos/ModeloIngreso');

router.post('/create', (req, res) => {
  ingresoBD.metodos.createIngreso(req.body, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(201).json({ message: 'Ingreso creado con éxito', result });
    }
  });
});

router.get('/list', (req, res) => {
  ingresoBD.metodos.getAllIngresos((err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const personaController = require("../data/data.js");

// Ruta para manejar la solicitud de contacto
router.get("/", personaController.obtenerDatos); // Cambiado de POST a GET para obtener datos
router.get("/", (req, res) => {
    res.send("Ruta de Datos");
});

module.exports = router;

const express = require("express");
const router = express.Router();
const personaController = require("../controllers/personaController.js");

// Ruta para manejar la solicitud de contacto
router.post("/", personaController.enviarFormulario);
router.get("/", (req, res) => {
    res.send("Ruta de Persona");
});

module.exports = router;

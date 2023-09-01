const express = require("express");
const router = express.Router();
const contactoController = require("../controllers/contactoController.js");

// Ruta para manejar la solicitud de contacto
router.post("/contacto", contactoController.enviarMensaje);

module.exports = router;

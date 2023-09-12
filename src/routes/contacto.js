const express = require("express");
const router = express.Router();
const contactoController = require("../controllers/contactoController.js");

// Ruta para manejar la solicitud de contacto
router.post("/", contactoController.enviarMensaje);
router.get("/", (req, res) => {
    res.send("Ruta de Contacto");
});

module.exports = router;

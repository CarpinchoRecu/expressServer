// routes/contacto.js
const express = require("express");
const router = express.Router();
const path = require("path");

// Ruta para manejar la solicitud de contacto
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/informacion/chaco.html"));
});

module.exports = router;

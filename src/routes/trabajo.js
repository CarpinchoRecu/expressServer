const express = require("express");
const router = express.Router();
const trabajoController = require("../controllers/trabajoController");

// Ruta para manejar la solicitud de trabajo
router.post("/trabajo", trabajoController);

module.exports = router;

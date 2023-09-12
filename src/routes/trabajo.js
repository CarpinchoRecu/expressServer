const express = require("express");
const router = express.Router();
const trabajoController = require("../controllers/trabajoController");

// Ruta para manejar la solicitud de trabajo
router.post("/", trabajoController);
router.get("/", (req, res) => {
  res.send("Ruta de Trabajo");
});

module.exports = router;

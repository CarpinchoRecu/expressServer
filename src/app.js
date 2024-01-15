const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");
const path = require("path"); // Añade esta línea para trabajar con rutas de archivos
const {whatsapp} = require("./config/whatsapp.js")

// Configuración de middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
dotenv.config({ path: "./.env" });

// Configuración de puerto
const PORT = process.env.PORT || 4000;

// Ruta para archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Importar rutas
const trabajoRoutes = require("./routes/trabajo.js");
const personaRoutes = require("./routes/persona.js");

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

// Montar rutas
app.use("/trabajo", trabajoRoutes); // Pasar el middleware multer a trabajoRoutes
app.use("/persona", personaRoutes);

app.options("*", function (req, res) {
  res.sendStatus(200);
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "No autorizado" });
  }
});

whatsapp
  .initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error durante la inicialización de WhatsApp:", error);
  });

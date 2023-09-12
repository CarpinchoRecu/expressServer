const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

// Configuración de middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
dotenv.config({ path: "./.env" });

// Configuración de puerto
const PORT = process.env.PORT || 4000;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 100, // 100 peticiones por 10 minutos para toda la API
  trustProxy: true,
  handler: (req, res) => {
    res.status(429).json({
      error: "Limite de peticiones por servidor, intentanlo en 10 minutos",
    });
  },
});

// Importar rutas
const contactoRoutes = require("./routes/contacto.js", limiter);
const trabajoRoutes = require("./routes/trabajo.js", limiter);

app.get("/", (req, res) =>
  res.send(`Servidor Express en funcionamiento en el puerto ${PORT}`)
);

// Montar rutas
app.use("/contacto", contactoRoutes);
app.use("/trabajo", trabajoRoutes); // Pasar el middleware multer a trabajoRoutes

app.options("*", function (req, res) {
  res.sendStatus(200);
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "No autorizado" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});

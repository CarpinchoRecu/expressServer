const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");
const path = require("path");
const logger = require('./config/logger.js');
const { whatsapp, whatsappEmitter } = require('./config/whatsapp.js');

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
app.get('/qr', (req, res) => {
  // Escuchar el evento 'qrCode'
  whatsappEmitter.once('qrCode', (qrDataURL) => {
    // Envia el código QR como respuesta a la solicitud GET
    res.send(`
      <html>
        <body>
          <img src="${qrDataURL}" alt="WhatsApp QR Code">
        </body>
      </html>
    `);
  });

  // Si el cliente está listo y ya tiene un código QR generado, emite el evento manualmente
  if (whatsapp.isReady) {
    whatsappEmitter.emit('qrCode', 'URL_DE_TU_CODIGO_QR_POR_DEFECTO');
  }
});

app.options("*", function (req, res) {
  res.sendStatus(200);
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "No autorizado" });
  }
});

app.listen(PORT, () => {
  logger.info(`Servidor en el puerto ${PORT}`);
});

whatsapp
  .initialize()
  .catch((error) => {
    logger.error("Error durante la inicialización de WhatsApp:", error);
  });

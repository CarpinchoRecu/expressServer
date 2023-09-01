const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");

// Configuración de middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
dotenv.config({ path: "./.env" });

// Importar rutas
const contactoRoutes = require("./routes/contacto.js");
const trabajoRoutes = require("./routes/trabajo.js");

// Montar rutas
app.use("/contacto", contactoRoutes);
app.use("/trabajo", trabajoRoutes); // Pasar el middleware multer a trabajoRoutes

// Otras rutas si es necesario

// Configuración de puerto
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});

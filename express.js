const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const helmet = require("helmet");

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

const app = express();
const port = process.env.PORT || 3000; // Puerto en el que se ejecutará el servidor

app.use(express.urlencoded({ extended: true }));

// Middleware de CORS
app.use(cors());

// Middleware de Compression
app.use(compression());

// Middleware de Helmet
app.use(helmet());

// Limite de uso de api
// en este caso son 2 peticones por minuto
const limiterContactanos = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/contactanos", limiterContactanos);

// Crear la conexión a la base de datos al iniciar el servidor
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos: ", err);
    return;
  }
  console.log("Conexión exitosa a la base de datos.");
});

app.post("/contactanos", (req, res) => {
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const edad = req.body.edad;
  const telefono = req.body.telefono;
  const email = req.body.email;
  const provincia = req.body.provincia;
  const localidad = req.body.localidad;

  const sqlContactanos =
    "INSERT INTO u352676213_form_contactos (nombre, apellido, edad, telefono, email, provincia, localidad) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const valuesContactanos = [
    nombre,
    apellido,
    edad,
    telefono,
    email,
    provincia,
    localidad,
  ];

  connection.query(sqlContactanos, valuesContactanos, (err, result) => {
    if (err) {
      console.error(
        "Error al insertar datos en la base de datos de contactos: ",
        err
      );
      res
        .status(500)
        .send("Error al insertar datos en la base de datos de contactos.");
      connection.end();
      return;
    }

    res.send(
      "Datos insertados correctamente en la base de datos de contactos."
    );
    connection.end();
  });
});

app.options("*", function (req, res) {
  res.sendStatus(200);
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "No autorizado" });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${port}`);
});

const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const fs = require("fs");

// Middleware de multer para la carga de archivos
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Renombrar el archivo
    },
});

const upload = multer({ storage: storage });

// Crear la conexión a la base de datos (asegúrate de configurar las variables de entorno)
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

// Ruta para manejar la solicitud de trabajo
router.post("/", upload.single("cv"), (req, res) => {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const edad = req.body.edad;
    const telefono = req.body.telefono;
    const email = req.body.email;
    const provincia = req.body.provincia;
    const localidad = req.body.localidad;
    const dni = req.body.dni;
    const domicilio = req.body.domicilio;
    const cvFile = req.file;

    if (!cvFile) {
        return res.status(400).send("Debe cargar un archivo de CV en formato .png");
    }

    const sqlTrabajo =
        "INSERT INTO trabajo (nombre, apellido, edad, telefono, email, provincia, localidad, dni, domicilio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const valuesTrabajo = [
        nombre,
        apellido,
        edad,
        telefono,
        email,
        provincia,
        localidad,
        dni,
        domicilio,
    ];

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(
                "Error al obtener una conexión de la base de datos trabajo: ",
                err
            );
            res
                .status(500)
                .send("Error al obtener una conexión de la base de datos trabajo.");
            return;
        }

        // Ejecutar la consulta en la conexión obtenida
        connection.query(sqlTrabajo, valuesTrabajo, (err, result) => {
            // Liberar la conexión una vez que hayamos terminado de usarla
            connection.release();

            if (err) {
                console.error(
                    "Error al insertar datos en la base de datos de trabajo: ",
                    err
                );
                res
                    .status(500)
                    .send("Error al insertar datos en la base de datos de trabajo.");
                return;
            }

            enviarCorreoElectronico(
                nombre,
                apellido,
                edad,
                telefono,
                email,
                provincia,
                localidad,
                dni,
                domicilio,
                cvFile,
                res
            );

            res.send(
                "Datos insertados correctamente en la base de datos de trabajo."
            );
        });
    });
});

function enviarCorreoElectronico(
    nombre,
    apellido,
    edad,
    telefono,
    email,
    provincia,
    localidad,
    dni,
    domicilio,
    cvFile,
    res
) {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: "cv@asessaludsrl.com",
        subject: "Solicitud de trabajo",
        text: `Nombre: ${nombre}
    Apellido: ${apellido}
    Edad: ${edad}
    Teléfono: ${telefono}
    Email: ${email}
    Provincia: ${provincia}
    Localidad: ${localidad}
    DNI: ${dni}
    Domicilio: ${domicilio}`,
        attachments: [
            {
                filename: cvFile.originalname,
                path: cvFile.path,
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error al enviar el correo electrónico:", error);
            res.status(500).send("Error al enviar el correo electrónico.");
        } else {
            console.log("Correo electrónico enviado:", info.response);
            res.send("Datos enviados y correo electrónico enviado correctamente.");
        }

        // Elimina el archivo temporal después de enviar el correo electrónico (si existe)
        fs.unlink(cvFile.path, (err) => {
            if (err) {
                console.error("Error al eliminar el archivo temporal:", err);
            }
        });
    });
}

module.exports = router;

const express = require('express');
const router = express.Router();
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const fs = require("fs");
const multer = require('multer');

const upload = multer({ dest: "uploads/" });

// Crear la conexión a la base de datos (asegúrate de configurar las variables de entorno)
const pool = mysql.createPool({
    connectionLimit: 200,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

router.post("/", upload.single("cv"), (req, res) => {
    const {
        nombre,
        apellido,
        edad,
        telefono,
        email,
        provincia,
        localidad,
        dni,
        domicilio
    } = req.body;

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
            console.error("Error al obtener una conexión de la base de datos trabajo: ", err);
            res.status(500).send("Error al obtener una conexión de la base de datos trabajo.");
            return;
        }

        connection.query(sqlTrabajo, valuesTrabajo, (err, result) => {
            connection.release();

            if (err) {
                console.error("Error al insertar datos en la base de datos de trabajo: ", err);
                res.status(500).send("Error al insertar datos en la base de datos de trabajo.");
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
    // Configuración de transporte y opciones de correo electrónico
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
        to: process.env.MAIL_USER,
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
        attachments: [{
            filename: cvFile.originalname,
            path: cvFile.path,
        }],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error al enviar el correo electrónico:", error);
            res.status(500).send("Error al enviar el correo electrónico.");
        } else {
            console.log("Correo electrónico enviado:", info.response);
            res.send("Datos enviados y correo electrónico enviado correctamente.");
        }

        fs.unlink(cvFile.path, (err) => {
            if (err) {
                console.error("Error al eliminar el archivo temporal:", err);
            }
        });
    });
}

module.exports = router;

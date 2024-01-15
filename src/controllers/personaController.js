const { whatsapp } = require('../config/whatsapp.js');
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    connectionLimit: 200,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

async function enviarFormulario(req, res) {
    let connection; // Declarar la variable connection aquí

    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const edad = req.body.edad;
    const telefono = req.body.telefono;
    const email = req.body.email;
    const provincia = req.body.provincia;
    const localidad = req.body.localidad;
    const regimen = req.body.regimen;
    const fechaDeEnvio = new Date().toISOString().slice(0, 10);

    if (!nombre || !apellido || !edad || !telefono || !email || !provincia || !localidad || !regimen || !fechaDeEnvio) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sqlContactanos = "INSERT INTO persona (nombre, apellido, edad, telefono, email, provincia, localidad, regimen, fechaDeEnvio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const valuesContactanos = [nombre, apellido, edad, telefono, email, provincia, localidad, regimen, fechaDeEnvio];

    try {
        connection = await pool.getConnection();

        // Utiliza la versión basada en promesas del método query
        await connection.query(sqlContactanos, valuesContactanos);

        // Enviar mensaje a WhatsApp
        const chatId = telefono.substring(1) + "@c.us";
        const mensaje = "Hola, gracias por enviar tu formulario a AsesSalud. ¿Cómo podemos ayudarte?";
        await whatsapp.sendMessage(chatId, mensaje);

        res.send("Datos insertados correctamente en la base de datos de persona y mensaje enviado a WhatsApp.");
        console.log("Datos de posible afiliado enviados correctamente a la base de datos y mensaje de WhatsApp enviado.");
    } catch (error) {
        console.error("Error al insertar datos o enviar mensaje: ", error);
        res.status(500).send("Error al procesar el formulario.");
    } finally {
        // Liberar la conexión una vez que hayamos terminado de usarla
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    enviarFormulario: enviarFormulario,
};


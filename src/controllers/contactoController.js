const mysql = require("mysql2");

// Crear la conexión a la base de datos (asegúrate de configurar las variables de entorno)
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

// Función para manejar la solicitud de contacto
function enviarMensaje(req, res) {
    // Obtener datos del formulario desde req.body
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const edad = req.body.edad;
    const telefono = req.body.telefono;
    const email = req.body.email;
    const provincia = req.body.provincia;
    const localidad = req.body.localidad;

    // Validar que los campos requeridos estén presentes
    if (
        !nombre ||
        !apellido ||
        !edad ||
        !telefono ||
        !email ||
        !provincia ||
        !localidad
    ) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Definir la consulta SQL para insertar en la base de datos
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

    // Ejecutar la consulta en la base de datos
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener una conexión de la base de datos contactanos: ", err);
            res
                .status(500)
                .send("Error al obtener una conexión de la base de datos contactanos.");
            return;
        }

        // Ejecutar la consulta en la conexión obtenida
        connection.query(sqlContactanos, valuesContactanos, (err, result) => {
            // Liberar la conexión una vez que hayamos terminado de usarla
            connection.release();

            if (err) {
                console.error(
                    "Error al insertar datos en la base de datos de contactos: ",
                    err
                );
                res
                    .status(500)
                    .send("Error al insertar datos en la base de datos de contactos.");
                return;
            }

            res.send(
                "Datos insertados correctamente en la base de datos de contactos."
            );
        });
    });
}

module.exports = {
    enviarMensaje,
};

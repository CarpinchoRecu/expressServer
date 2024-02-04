const logger = require('../config/logger.js');
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    connectionLimit: 200,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

async function obtenerDatos(req, res) {
    let connection;

    try {
        connection = await pool.getConnection();

        // Utiliza la versión basada en promesas del método query
        const [results] = await connection.query('SELECT * FROM trabajo');

        res.json(results); // Devuelve todos los datos en formato JSON
        logger.info("Datos obtenidos correctamente");
    } catch (error) {
        logger.error("Error al obtener datos: ", error);
        res.status(500).send("Error al obtener datos");
    } finally {
        // Liberar la conexión una vez que hayamos terminado de usarla
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    obtenerDatos: obtenerDatos,
};

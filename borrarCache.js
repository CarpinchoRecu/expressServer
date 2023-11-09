const fs = require("fs");

const folderPath = "uploads"; // Ruta de la carpeta que deseas limpiar

// Función para realizar la limpieza
function limpiarCarpeta() {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error("Error al leer el directorio:", err);
            return;
        }

        if (folderPath) {
            console.log("Script preparado para eliminar cache")
            // Recorre los archivos y elimínalos uno por uno
            files.forEach((file) => {
                const filePath = `${folderPath}/${file}`;
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error al eliminar ${file}:`, err);
                    } else {
                        console.log(`Se eliminó ${file} con éxito.`);
                    }
                });
            });
        }
    });
}

// Ejecuta la limpieza inicialmente
limpiarCarpeta();

// Programa la limpieza cada 24 horas (86400000 milisegundos)
setInterval(limpiarCarpeta, 86400000);

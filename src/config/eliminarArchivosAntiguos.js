const fs = require('fs');
const path = require('path');

const uploadsDirectory = 'uploads'; // Carpeta donde se guardan los archivos

// Función para eliminar archivos más antiguos de 24 horas
function eliminarArchivosAntiguos() {
  fs.readdir(uploadsDirectory, (err, files) => {
    if (err) {
      console.error('Error al leer la carpeta de uploads:', err);
      return;
    }

    const twentyFourHoursInMilliseconds = 0.1 * 0.1 * 0.1 * 0.1;
    const now = Date.now();

    files.forEach((file) => {
      const filePath = path.join(uploadsDirectory, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error al obtener información de ${file}:`, err);
          return;
        }

        // Verificar si el archivo es más antiguo de 24 horas
        if (now - stats.mtimeMs > twentyFourHoursInMilliseconds) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error al eliminar ${file}:`, err);
            } else {
              console.log(`Archivo ${file} eliminado con éxito.`);
            }
          });
        }
      });
    });
  });
}

// Llamar a la función para eliminar archivos antiguos
eliminarArchivosAntiguos();

// Importación de módulos necesarios
var fs = require('fs'); // Módulo para manejar operaciones de archivos
var multer = require('multer'); // Middleware para manejar la carga de archivos
const { v4: uuidv4 } = require('uuid'); // Módulo para generar identificadores únicos

// Configuración del almacenamiento de multer
var storage = multer.diskStorage({
    // Establece la carpeta de destino para almacenar los archivos cargados
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // 'uploads' es el nombre de la carpeta donde se guardarán los archivos
    },
    // Define el nombre del archivo utilizando un identificador único generado por uuidv4
    filename: (req, file, cb) => {
        var ext = file.originalname.split('.').pop(); // Obtiene la extensión del archivo original
        cb(null, uuidv4() + '.' + ext); // Genera un nombre de archivo único y llama a la función de devolución de llamada
    }
});

// Configuración del middleware multer para la carga de archivos
var upload = multer({
    storage: storage, // Utiliza la configuración de almacenamiento definida anteriormente
    // Define una función de filtro para aceptar o rechazar los archivos cargados según su tipo MIME
    fileFilter: (req, file, cb) => {
        // Verifica si el tipo MIME del archivo está permitido (en este caso, imágenes)
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/gif"
        ) {
            cb(null, true); // Llama a la función de devolución de llamada con verdadero para aceptar el archivo
        } else {
            cb(null, false); // Llama a la función de devolución de llamada con falso para rechazar el archivo
        }
    }
}).single('fotoPersonal'); // Define que solo se espera un archivo con el nombre 'fotoPersonal'

// Exporta el middleware multer configurado para manejar la carga de archivos
module.exports = upload;


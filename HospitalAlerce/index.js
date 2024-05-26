var mongoose = require('mongoose'); // Importa el módulo Mongoose para la conexión con la base de datos MongoDB
var app = require('./app'); // Importa la aplicación Express que configuraste anteriormente

var port = 3001; // Puerto en el que se ejecutará el servidor

// Conexión a la base de datos MongoDB utilizando Mongoose
mongoose.connect('mongodb+srv://gonzalomellaom:gM8viBC7bwDsc9IO@pmnu1-c0.nsnw3zk.mongodb.net/hospital_alerce?retryWrites=true&w=majority&appName=PMNU1-C0').then(() => {
    console.log('Conexión a Mongoose establecida'); // Mensaje de éxito si la conexión es exitosa

    // Inicia el servidor Express en el puerto especificado
    app.listen(port, () => {
        console.log('Servidor ejecutándose en el puerto ' + port); // Mensaje de éxito cuando el servidor se inicia correctamente
    });
});

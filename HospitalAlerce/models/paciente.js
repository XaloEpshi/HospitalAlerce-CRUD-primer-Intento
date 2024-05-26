var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Definición del esquema para el modelo Paciente
var pacienteSchema = new Schema({
  rut: { type: String, required: true }, // Campo para el RUT del paciente, requerido
  nombre: { type: String, required: true }, // Campo para el nombre del paciente, requerido
  edad: { type: Number, required: true }, // Campo para la edad del paciente, requerido
  sexo: { type: String, required: true }, // Campo para el sexo del paciente, requerido
  fotoPersonal: String, // Campo para la foto personal del paciente (opcional)
  fechaIngreso: { type: Date, default: Date.now }, // Campo para la fecha de ingreso del paciente, por defecto la fecha actual
  enfermedad: { type: String, required: true }, // Campo para la enfermedad del paciente, requerido
  revisado: { type: Boolean, default: true } // Campo para indicar si el paciente ha sido revisado, por defecto true
});

// Exportación del modelo Paciente basado en el esquema definido
module.exports = mongoose.model('Paciente', pacienteSchema);

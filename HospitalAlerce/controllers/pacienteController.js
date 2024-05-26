//CONTROLADOR DE GUARDADO DE DCTOS

var validator = require("validator");
var Paciente = require("../models/paciente");

const fs = require("fs");
const path = require("path");

var controllers = {
  // Controlador para agregar un nuevo paciente
  nuevoPaciente: async (req, res) => {
    // Obtener los parámetros del cuerpo de la solicitud
    var params = req.body;

    // Validación de datos del paciente
    try {
      // Validar que los campos obligatorios no estén vacíos y cumplan con ciertos criterios
      var rutValido = !validator.isEmpty(params.rut);
      var nombreValido = !validator.isEmpty(params.nombre);
      var edadValida =
        !validator.isEmpty(params.edad) &&
        validator.isInt(params.edad, { min: 0 });
      var sexoValido = !validator.isEmpty(params.sexo);
      var enfermedadValida = !validator.isEmpty(params.enfermedad);

      // Verificar si los datos del paciente son válidos
      if (
        rutValido &&
        nombreValido &&
        edadValida &&
        sexoValido &&
        enfermedadValida
      ) {
        // Crear un nuevo objeto paciente utilizando el modelo Paciente
        var paciente = new Paciente({
          rut: params.rut,
          nombre: params.nombre,
          edad: params.edad,
          sexo: params.sexo,
          fotoPersonal: params.fotoPersonal || null, // Asignar null si no se proporciona fotoPersonal
          enfermedad: params.enfermedad,
          // fechaIngreso y revisado se establecen por defecto en el modelo
        });

        // Guardar el paciente en la base de datos
        var pacienteGuardado = await paciente.save();

        // Enviar respuesta exitosa con el paciente guardado
        return res.status(200).send({
          status: "success",
          paciente: pacienteGuardado,
        });
      } else {
        // Enviar respuesta de error si los datos del paciente no son válidos
        return res.status(400).send({
          status: "error",
          message: "Los datos no son válidos",
        });
      }
    } catch (err) {
      // Enviar respuesta de error si ocurre algún problema al guardar el paciente en la base de datos
      return res.status(500).send({
        status: "error",
        message: "No se pudo guardar el paciente en la base de datos",
      });
    }
  },

  // Controlador para actualizar un paciente existente
  update: async (req, res) => {
    // Obtener el ID del paciente de los parámetros de la solicitud
    var id = req.params.id;
    // Obtener los parámetros del cuerpo de la solicitud
    var params = req.body;

    // Validación de los datos del paciente
    try {
      // Validar que los campos obligatorios no estén vacíos y cumplan con ciertos criterios
      var rutValido = !validator.isEmpty(params.rut);
      var nombreValido = !validator.isEmpty(params.nombre);
      var edadValida =
        !validator.isEmpty(params.edad) &&
        validator.isInt(params.edad, { min: 0 });
      var sexoValido = !validator.isEmpty(params.sexo);
      var enfermedadValida = !validator.isEmpty(params.enfermedad);

      // Verificar si los datos del paciente son válidos
      if (
        rutValido &&
        nombreValido &&
        edadValida &&
        sexoValido &&
        enfermedadValida
      ) {
        // Actualizar el paciente con los nuevos datos proporcionados
        var pacienteActualizado = await Paciente.findOneAndUpdate(
          { _id: id },
          params,
          { new: true }
        ).exec();
        // Verificar si se encontró y actualizó correctamente el paciente
        if (!pacienteActualizado) {
          return res.status(404).send({
            status: "error",
            message: "No existe un paciente con id: " + id,
          });
        }
        // Enviar respuesta exitosa con el paciente actualizado
        return res.status(200).send({
          status: "success",
          paciente: pacienteActualizado,
        });
      } else {
        // Enviar respuesta de error si la validación de los datos del paciente falla
        return res.status(400).send({
          status: "error",
          message: "La validación de los datos falló",
        });
      }
    } catch (err) {
      // Enviar respuesta de error si ocurre algún problema al actualizar el paciente
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar",
      });
    }
  },

  // Controlador para deshabilitar un paciente (marcarlo como revisado: false)
delete: async (req, res) => {
  // Obtener el ID del paciente de los parámetros de la solicitud
  var id = req.params.id;

  try {
    // Actualizar el paciente estableciendo el campo 'revisado' en false
    var pacienteInhabilitado = await Paciente.findByIdAndUpdate(
      id,
      { revisado: false }, // Establecer el campo 'revisado' en false
      { new: true } // Devolver el paciente actualizado
    ).exec();

    // Verificar si se encontró y deshabilitó correctamente el paciente
    if (!pacienteInhabilitado) {
      return res.status(404).send({
        status: "error",
        message: "No se encontró el paciente con id: " + id,
      });
    }

    // Enviar respuesta exitosa con el paciente deshabilitado
    return res.status(200).send({
      status: "success",
      paciente: pacienteInhabilitado,
    });
  } catch (err) {
    // Enviar respuesta de error si ocurre algún problema al deshabilitar el paciente
    return res.status(500).send({
      status: "error",
      message: "Error al inhabilitar",
    });
  }
},


  // Controlador para obtener un paciente por su ID
  getPaciente: async (req, res) => {
    // Obtener el ID del paciente de los parámetros de la solicitud
    var id = req.params.id;

    // Verificar si se proporcionó el ID del paciente
    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Se debe proporcionar el _id del documento",
      });
    }

    try {
      // Buscar el paciente por su ID
      var paciente = await Paciente.findById(id).exec();

      // Verificar si se encontró el paciente
      if (!paciente) {
        return res.status(404).send({
          status: "error",
          message: "Paciente con id: " + id + " no encontrado",
        });
      }

      // Enviar respuesta exitosa con el paciente encontrado
      return res.status(200).send({
        status: "success",
        paciente,
      });
    } catch (err) {
      // Enviar respuesta de error si ocurre algún problema al recuperar el paciente
      return res.status(500).send({
        status: "error",
        message: "Error al recuperar el paciente",
      });
    }
  },

  // Controlador para obtener pacientes
  getPacientes: async (req, res) => {
    // Construir la consulta para buscar pacientes que aún no han sido revisados o que ya han sido revisados
    var query = Paciente.find({
      $or: [{ revisado: { $exists: false } }, { revisado: true }],
    });

    // Verificar si se proporciona el parámetro getLastPacientes en la solicitud
    var getLastPacientes = req.params.getLastPacientes;
    if (getLastPacientes) {
      // Si se proporciona, limitar el número de pacientes devueltos a 5
      query.limit(5);
    }

    try {
      // Ejecutar la consulta y ordenar los pacientes por el ID de forma descendente
      var pacientes = await query.sort("-_id").exec();

      // Verificar si se encontraron pacientes
      if (!pacientes || pacientes.length === 0) {
        // Si no se encontraron pacientes, devolver un error 404
        return res.status(404).send({
          status: "error",
          message: "No se encontraron pacientes en la colección",
        });
      }

      // Si se encontraron pacientes, devolver una respuesta exitosa con los pacientes encontrados
      return res.status(200).send({
        status: "success",
        pacientes,
      });
    } catch (err) {
      // Si ocurre un error durante la ejecución de la consulta, devolver un error 500
      return res.status(500).send({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  },

  // Controlador para obtener pacientes marcados como eliminados (revisado false)
  getPacientesEliminados: async (req, res) => {
    try {
      // Buscar pacientes con el campo 'revisado' establecido en false (marcados como eliminados)
      var pacientesEliminados = await Paciente.find({ revisado: false })
        .sort("-_id") // Ordenar los pacientes por ID de forma descendente
        .exec();

      // Verificar si se encontraron pacientes marcados como eliminados
      if (!pacientesEliminados || pacientesEliminados.length === 0) {
        // Si no se encontraron pacientes, devolver un error 404
        return res.status(404).send({
          status: "error",
          message: "No se encontraron pacientes marcados como eliminados",
        });
      }

      // Si se encontraron pacientes marcados como eliminados, devolver una respuesta exitosa con los pacientes encontrados
      return res.status(200).send({
        status: "success",
        pacientes: pacientesEliminados,
      });
    } catch (err) {
      // Si ocurre un error durante la búsqueda de pacientes eliminados, devolver un error 500
      return res.status(500).send({
        status: "error",
        message: "Error interno del servidor al recuperar pacientes eliminados",
      });
    }
  },

  // Controlador para buscar pacientes por criterio de búsqueda
  search: async (req, res) => {
    // Obtener el criterio de búsqueda de los parámetros de la solicitud
    var search = req.params.search;

    try {
      // Buscar pacientes que coincidan con el criterio de búsqueda en los campos 'sexo' y 'enfermedad'
      var pacientes = await Paciente.find({
        $or: [
          { sexo: { $regex: search, $options: "i" } }, // Buscar coincidencias en el campo 'sexo'
          { enfermedad: { $regex: search, $options: "i" } }, // Buscar coincidencias en el campo 'enfermedad'
        ],
      })
        .sort({ fechaIngreso: "descending" }) // Ordenar los resultados por fecha de ingreso en orden descendente
        .exec(); // Ejecutar la consulta de búsqueda

      // Verificar si se encontraron pacientes que coinciden con el criterio de búsqueda
      if (!pacientes || pacientes.length === 0) {
        // Si no se encontraron pacientes, devolver un error 404
        return res.status(404).send({
          status: "error",
          message: "No se encontraron pacientes con el criterio: " + search,
        });
      }

      // Si se encontraron pacientes que coinciden con el criterio de búsqueda, devolver una respuesta exitosa con los pacientes encontrados
      return res.status(200).send({
        status: "success",
        pacientes,
      });
    } catch (err) {
      // Si ocurre un error durante la búsqueda de pacientes, devolver un error 500
      return res.status(500).send({
        status: "error",
        message: "Error al buscar pacientes: " + err.message,
      });
    }
  },

  // Controlador para cargar una imagen y actualizar la foto de un paciente
  upload: async (req, res) => {
    // Obtener el archivo subido desde la solicitud
    const file = req.file;
    // Obtener el ID del paciente desde los parámetros de la solicitud
    var id = req.params.id;

    // Verificar si se ha proporcionado un archivo
    if (!file) {
      return res.status(404).send({
        status: "error",
        message:
          "El archivo no puede estar vacío o la extensión del archivo no está permitida",
      });
    }

    // Obtener el nombre temporal del archivo subido
    var tempFileName = file.filename; // Asegúrate de que 'filename' es la propiedad correcta

    // Verificar si se proporcionó un ID de paciente
    if (id) {
      try {
        // Actualizar la foto del paciente con el nombre del archivo cargado
        var pacienteActualizado = await Paciente.findByIdAndUpdate(
          { _id: id },
          { fotoPersonal: tempFileName },
          { new: true }
        ).exec();

        // Verificar si se pudo actualizar el paciente
        if (!pacienteActualizado) {
          return res.status(400).send({
            status: "error",
            message:
              "La imagen no pudo ser guardada en el documento con _id: " + id,
          });
        }

        // Devolver una respuesta exitosa con el mensaje y la información actualizada del paciente
        return res.status(200).send({
          status: "success",
          message: "Archivo cargado y foto del paciente actualizada con éxito!",
          fileName: tempFileName,
          paciente: pacienteActualizado,
        });
      } catch (err) {
        // Si ocurre un error durante la actualización de la foto del paciente, devolver un error 500
        return res.status(500).send({
          status: "error",
          message: "Error al actualizar la foto del paciente",
        });
      }
    } else {
      // Si no se proporcionó un ID de paciente, devolver una respuesta exitosa con el nombre del archivo cargado
      return res.status(200).send({
        status: "success",
        message: "Archivo cargado con éxito",
        tempFileName,
      });
    }
  },

  getPhoto: (req, res) => {
    // Obtener el nombre del archivo de imagen desde los parámetros de la ruta
    var file = req.params.filename;
    // Construir la ruta completa del archivo
    var pathFile = "uploads/" + file;

    // Verificar si el archivo existe en el sistema de archivos
    if (fs.existsSync(pathFile)) {
      // Si el archivo existe, enviar el archivo de imagen como respuesta
      return res.sendFile(path.resolve(pathFile));
    } else {
      // Si el archivo no existe, enviar un mensaje de error
      return res.status(404).send({
        status: "error",
        message: "La imagen con el nombre: " + file + " no fue encontrada",
      });
    }
  },
};

module.exports = controllers;

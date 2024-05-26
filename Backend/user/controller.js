//CONTROLADOR DE GUARDADO DE DCTOS

var validator = require('validator');
var User = require('./model');

const fs = require('fs');
const path = require('path');

var controllers = {

    new: async (req, res) => {
        var params = req.body;
        
        // Validación de datos
        try {
            var fullnameValid = !validator.isEmpty(params.fullname);
            var emailValid = !validator.isEmpty(params.email) && validator.isEmail(params.email);
    
            if (fullnameValid && emailValid) {
                var user = new User({
                    fullname: params.fullname,
                    email: params.email,
                    photo: params.photo || null
                });
    
                // Guardado del usuario
                var userStored = await user.save();
                return res.status(200).send({
                    status: 'success',
                    user: userStored
                });
            } else {
                return res.status(400).send({
                    status: 'error',
                    message: 'Los datos no son válidos'
                });
            }
        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'No se pudo guardar el usuario en la base de datos'
            });
        }
    },
    

    update: async (req, res) => {
        var id = req.params.id;
        var params = req.body;
    
        // Validación de datos
        try {
            var fullnameValid = !validator.isEmpty(params.fullname);
            var emailValid = !validator.isEmpty(params.email) && validator.isEmail(params.email);
    
            if (fullnameValid && emailValid) {
                // Actualización del usuario
                var userUpdated = await User.findOneAndUpdate({_id: id}, params, {new: true}).exec();
                if (!userUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe un usuario con id: ' + id
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });
            } else {
                return res.status(400).send({
                    status: 'error',
                    message: 'La validación de los datos falló'
                });
            }
        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al actualizar'
            });
        }
    },

    delete: async (req, res) => {
        var id = req.params.id;
    
        try {
            var userRemoved = await User.findOneAndDelete({_id: id}).exec();
            if (!userRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontró el usuario con id: ' + id
                });
            }
            return res.status(200).send({
                status: 'success',
                user: userRemoved
            });
        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al eliminar'
            });
        }
    },
    

    getUser: async (req, res) => {
        var id = req.params.id;
        if (!id) {
            return res.status(400).send({
                status: 'error',
                message: 'Document _id must be provided'
            });
        }
    
        try {
            var user = await User.findById(id).exec();
            if (!user) {
                return res.status(404).send({
                    status: 'error',
                    message: 'User with id: ' + id + ' not found'
                });
            }
            return res.status(200).send({
                status: 'success',
                user
            });
        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error retrieving user'
            });
        }
    },
    

    getUsers: async (req, res) => {
    var query = User.find({});
    var getLastusers = req.params.getLastusers;
    if (getLastusers) {
        query.limit(5);
    }

    try {
        var users = await query.sort('-_id').exec();
        if (!users || users.length === 0) {
            return res.status(404).send({
                status: 'error',
                message: 'No se encontraron usuarios en la colección'
            });
        }
        return res.status(200).send({
            status: 'success',
            users
        });
    } catch (err) {
        return res.status(500).send({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
    },

    search: async (req, res) => {
        var search = req.params.search;
    
        try {
            var users = await User.find({
                "$or": [
                    {"email": {"$regex": search, "$options": "i"}},
                    {"fullname": {"$regex": search, "$options": "i"}}
                ]
            }).sort({'createdAt': 'descending'});
    
            if (!users || users.length === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No users found with: ' + search + ' criteria'
                });
            }
    
            return res.status(200).send({
                status: 'success',
                users
            });
        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error while looking for documents: ' + err.message
            });
        }
    },
    

    upload: async (req, res) => {
        const file = req.file;
        var id = req.params.id;
    
        if (!file) {
            return res.status(404).send({
                status: 'error',
                message: 'El archivo no puede estar vacío o la extensión del archivo no está permitida'
            });
        }
    
        var tempFileName = file.filename; // Asegúrate de que 'filename' es la propiedad correcta
    
        if (id) {
            try {
                var userUpdated = await User.findByIdAndUpdate({_id: id}, {photo: tempFileName}, {new: true}).exec();
                if (!userUpdated) {
                    return res.status(400).send({
                        status: 'error',
                        message: 'La imagen no pudo ser guardada en el documento con _id: ' + id
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    message: 'Archivo cargado y foto de usuario actualizada con éxito!',
                    fileName: tempFileName,
                    user: userUpdated
                });
            } catch (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al actualizar la foto del usuario'
                });
            }
        } else {
            return res.status(200).send({
                status: 'success',
                message: 'Archivo cargado con éxito',
                tempFileName
            });
        }
    },

    getPhoto: (req, res) => {
        var file = req.params.filename;
        var pathFile = 'uploads/' + file;
    
        if(fs.existsSync(pathFile)){
            return res.sendFile(path.resolve(pathFile));
        }else{
            return res.status(404).send({
                status: 'error',
                message: 'Image with image: '+ file + ' was not found'
            });
        }
    }
    
        
};


module.exports = controllers;

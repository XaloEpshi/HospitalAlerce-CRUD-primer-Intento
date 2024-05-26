var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    fullname: String,
    email: String,
    createAt: { type: Date, default: Date.now }, // Corrección aquí
    photo: String,
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', userSchema);

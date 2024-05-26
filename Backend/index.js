var mongoose = require('mongoose');
var app = require('./app');

var port = 3001;

mongoose.connect('mongodb+srv://gonzalomellaom:gM8viBC7bwDsc9IO@pmnu1-c0.nsnw3zk.mongodb.net/user?retryWrites=true&w=majority&appName=PMNU1-C0').then(() => {
    console.log('Mongoose is connected'); 

    app.listen(port, () => {
        console.log('Server is Running');
    });
});
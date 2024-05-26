var express = require('express')
var controller = require('./controller')
var upload = require('./multer_config')
var router = express.Router()

router.get('/', (req, res)=>{return res.send('Ruta de Prueba')}) //http://localhost:3000/api

router.post('/user', controller.new)
router.get('/users/:last?', controller.getUsers)
router.get('/user/:id', controller.getUser)
router.put('/user/:id', controller.update)
router.delete('/user/:id', controller.delete)
router.get('/user/search/:search', controller.search)

router.post('/users/photo/:id?', upload, controller.upload)
router.get('/user/photo/:filename', controller.getPhoto)

module.exports = router


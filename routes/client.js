'use strict'

var express = require('express');
var clientController = require('../controllers/clientController');

var api = express.Router();
var auth = require('../middlewares/auth')

api.post('/registro_cliente', clientController.registro_cliente);
api.post('/login_client', clientController.login_client);
api.post('/registro_cliente_admin', auth.auth, clientController.registro_cliente_admin);

api.get('/listar_cliente_filtro_admin/:tipo/:filtro?', auth.auth , clientController.listar_cliente_filtro_admin);
api.get('/obtener_cliente_admin/:id', auth.auth, clientController.obtener_cliente_admin);
api.put('/actualizar_cliente_admin/:id', auth.auth, clientController.actualizar_cliente_admin);
api.delete('/eliminar_cliente_admin/:id', auth.auth, clientController.eliminar_cliente_admin);


module.exports = api;

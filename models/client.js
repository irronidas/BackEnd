'use strict'

var mongoose = require ('mongoose')
var Schema = mongoose.Schema;

var ClientSchema = Schema({
    nombres: {type:String, require:true},
    apellidos: {type:String, require:true},
    pais: {type:String, require:false},
    email: {type:String, require:true},
    password: {type:String, require:true},
    perfil: {type:String, default:'perfil.png', require:true},
    telefono: {type:String, require:false},
    genero: {type:String, require:false},
    fec_nacimiento: {type:String, require:true},
    dni: {type:String, require:false},
    createdAt:{type:Date, default:Date.now, require:true}

});

module.exports = mongoose.model('client', ClientSchema);
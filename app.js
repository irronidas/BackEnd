'use strict'

var express = require ('express');
var app = express();

require ('dotenv').config();
var mongoose = require ('mongoose');
//var port = process.env.PORT || 4201;

var admin_route = require('./routes/admin');
var client_route = require('./routes/client');
var producto_route = require('./routes/producto');

//var cors = require('cors')

// ecommerce nombre de mi BD en mongoDB
var mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI,{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{
  console.log('conexion a bd atlas exitosa');
  app.listen(4201,()=>{
    console.log('servideor escuchando 4201')
  });
})
.catch(err=>{
  console.error('no se puedo conectar', err)
});

//app.listen(port, () => {
//    console.log('Servidor iniciado en el puerto '+ port);
  //});

app.use(express.urlencoded({extended:true}));
app.use(express.json({limit:'50mb', extended:true}));

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api', /*cors(),*/ client_route);
app.use('/api', admin_route);
app.use('/api', producto_route);

module.exports = app;
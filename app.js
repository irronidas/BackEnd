'use strict'

var express = require ('express');
var app = express();
var mongoose = require ('mongoose');
var port = process.env.PORT || 4201;

var admin_route = require('./routes/admin');
var client_route = require('./routes/client');
var producto_route = require('./routes/producto');

//var cors = require('cors')

// ecommerce nombre de mi BD en mongoDB
mongoose.set('strictQuery', false)
mongoose.connect('mongodb+srv://jaimebustamante300:ikki2008@clusterecommerce.kmlhkjj.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(db => console.log('BD conectada'))
.catch (error => console.log(error))

app.listen(port, () => {
    console.log('Servidor iniciado en el puerto '+ port);
  });

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
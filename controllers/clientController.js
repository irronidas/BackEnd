'use strict'
var client = require('../models/client')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('../helpers/jwt')


  const registro_cliente = async (req,res) => {

      var data = req.body;
      var clientsArr =[];

      clientsArr = await client.find({email:data.email});
      if(clientsArr.length == 0){
        //
        if(data.password){
          bcrypt.hash(data.password,null,null, async function (err,hash){
            if(hash){
              data.password = hash;
              var reg = await client.create(data);
              res.status(200).send({data:reg});
            }else{
              res.status(200).send({message:'Error en el servidor', data:undefined});
            }
          })
        }else{
          res.status(200).send({message:'No hay contraseña', data:undefined});
        }

      }else{
      res.status(200).send({message:'email is exits', data:undefined})
   }
  }

  const login_client = async (req,res)=>{
    var data = req.body;
    var clientsArr =[];

    clientsArr = await client.find({email:data.email});

    if(clientsArr.length==0){
      res.status(200).send({message:"Correo no existe", data:undefined})
    }else{
      let user = clientsArr[0];

      bcrypt.compare(data.password, user.password, async function(error,check){
        if(check){
          res.status(200).send({
            data:user,
            jwt:jwt.createToken(user)
          });
          }else{
            res.status(200).send({message:"Contraseña no coincide", data:undefined})
          }
      });
    }
  }

  const listar_cliente_filtro_admin = async (req,res)=>{
    
    if(req.user){
      if(req.user.role == 'admin'){
        let tipo = req.params['tipo'];
        let filtro= req.params['filtro'];
    
    
        if(tipo == null || tipo == 'null'){
          let reg = await client.find();
          res.status(200).send({data:reg});
        }else{
          if(tipo == 'apellidos'){
            let reg = await client.find({apellidos:new RegExp(filtro,'i')});
            res.status(200).send({data:reg});
    
          }else if(tipo == 'email'){
            let reg = await client.find({email:new RegExp(filtro,'i')});
            res.status(200).send({data:reg});
          }
        }
    
      }else{
        res.status(500).send({message:'No Access'});
      }
    }else{
      res.status(500).send({message:'No Access'});
    }

  }

  const registro_cliente_admin = async (req,res)=>{
    if(req.user){
      if(req.user.role == 'admin'){
        var data = req.body;

        bcrypt.hash('123456789', null,null, async function(err,hash){
          if(hash){
            data.password = hash;
            let reg = await client.create(data);
            res.status(200).send({data:reg});

          }else{
            res.status(200).send({message: 'No existe una contraseña', data:undefined});
          }
        })

      }else{
        res.status(500).send({message:'No Access'});
      }
    }else{
      res.status(500).send({message:'No Access'});
    }
  }

  const obtener_cliente_admin = async (req,res)=>{
    if(req.user){
      if(req.user.role == 'admin'){
        
        var id = req.params['id'];

        try {
          var reg = await client.findById({_id:id});
          res.status(200).send({data:reg});
        } catch (error) {
          res.status(200).send({data:undefined});
        }


      }else{
        res.status(500).send({message:'No Access'});
      }
    }else{
      res.status(500).send({message:'No Access'});
    }
  }

  const actualizar_cliente_admin = async (req,res)=>{
    if(req.user){
      if(req.user.role == 'admin'){
        
        var id = req.params['id'];
        var data = req.body;

        var reg = await client.findByIdAndUpdate({_id:id},{

          nombres: data.nombres,
          apellidos: data.apellidos,
          email: data.email,
          telefono: data.telefono,
          genero: data.genero,
          fec_nacimiento: data.fec_nacimiento,
          dni: data.dni

        })
        res.status(200).send({data:reg});

      }else{
        res.status(500).send({message:'No Access'});
      }
    }else{
      res.status(500).send({message:'No Access'});
    }
  }

  const eliminar_cliente_admin = async (req,res)=>{
    if(req.user){
      if(req.user.role == 'admin'){
        
        var id = req.params['id'];
        //var data = req.body;

        let reg = await client.findByIdAndRemove({_id:id});
        res.status(200).send({data:reg});



      }else{
        res.status(500).send({message:'No Access'});
      }
    }else{
      res.status(500).send({message:'No Access'});
    }
  }




module.exports = {
  registro_cliente,
  login_client,
  listar_cliente_filtro_admin,
  registro_cliente_admin,
  obtener_cliente_admin,
  actualizar_cliente_admin,
  eliminar_cliente_admin
}
'use strict'
var admin = require('../models/admin');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt')

const registro_admin = async (req,res) => {

    var data = req.body;
    var AdminArr =[];

    AdminArr = await admin.find({email:data.email});
    if(AdminArr.length == 0){
      //
      if(data.password){
        bcrypt.hash(data.password,null,null, async function (err,hash){
          if(hash){
            data.password = hash;
            var reg = await admin.create(data);
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

const login_admin = async (req,res)=>{
  var data = req.body;
  var adminArr =[];

  adminArr = await admin.find({email:data.email});

  if(adminArr.length==0){
    res.status(200).send({message:"Correo no existe", data:undefined})
  }else{
    let user = adminArr[0];

    bcrypt.compare(data.password, user.password, async function(error,check){
      if(check){
        res.status(200).send({
          data:user,
          token:jwt.createToken(user)
        });
        }else{
          res.status(200).send({message:"Contraseña no coincide", data:undefined})
        }
    });
  }
}

module.exports = {
registro_admin,
login_admin
}
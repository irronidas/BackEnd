'use strict'

var Producto = require('../models/producto');
var Inventario = require('../models/inventario');
var fs = require('fs');
var path = require('path');
//var bcrypt = require('bcrypt-nodejs')
//var jwt = require('../helpers/jwt')


  const registro_producto_admin = async (req,res)=>{
    if(req.user){
      if(req.user.role == 'admin'){
        let data = req.body;

        var img_path = req.files.portada.path;
        var name = img_path.split('\\');
        var portada_name = name[2];

        data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')
        data.portada = portada_name;
        let reg = await Producto.create(data);

        let inventario = await Inventario.create({
          admin: req.user.sub,
          cantidad: data.stock,
          proveedor: 'primer registro',
          producto: reg._id
        });

        res.status(200).send({data:reg,inventario:inventario})
      }else{
        res.status(500).send({message:'No Access'});
      }
    }else{
      res.status(500).send({message:'No Access'});
    }
  }

  const listar_productos_admin = async (req,res)=>{
  
    if(req.user){
      if(req.user.role == 'admin'||req.user.role=='user'){
       // let tipo = req.params['tipo'];
        let filtro= req.params['filtro'];
        let reg = await Producto.find({titulo:new RegExp(filtro,'i')});
        res.status(200).send({data:reg});

    
      }else{
        res.status(500).send({message:'No Access'});
      }
    }else{
      res.status(500).send({message:'No Access'});
    }
  
  }

  const obtener_portada = async (req,res)=>{
    var img = req.params['img'];

    fs.stat('./uploads/productos/'+img, function(err){
      if(!err){
        let path_img = './uploads/productos/'+img;
        res.status(200).sendFile(path.resolve(path_img));
      }else{
        let path_img = './uploads/default.jpg';
        res.status(200).sendFile(path.resolve(path_img));
      }
    })
  }

  const obtener_producto_admin = async (req,res)=>{
    if(req.user){
      if(req.user.role == 'admin'){
        
        var id = req.params['id'];

        try {
          var reg = await Producto.findById({_id:id});
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

  const actualizar_producto_admin = async (req,res)=>{
    if(req.user){
      if(req.user.role == 'admin'){
        let id = req.params['id'];
        let data = req.body;

        if(req.files){
          //
          var img_path = req.files.portada.path;
          var name = img_path.split('\\');
          var portada_name = name[2];

          let reg = await Producto.findByIdAndUpdate({_id:id},{
            titulo: data.titulo,
            stock: data.stock,
            precio: data.precio,
            categoria: data.categoria,
            descripcion: data.descripcion,
            contenido: data.contenido,
            portada: portada_name,
          });

          fs.stat('./uploads/productos/'+reg.portada, function(err){
            if(!err){
              fs.unlink('./uploads/productos/'+reg.portada,(err)=>{
                if(err) throw err;
              });
            }
          })
          res.status(200).send({data:reg})

        }else{
          let reg = await Producto.findByIdAndUpdate({_id:id},{
            titulo: data.titulo,
            stock: data.stock,
            precio: data.precio,
            categoria: data.categoria,
            descripcion: data.descripcion,
            contenido: data.contenido,
          });
          res.status(200).send({data:reg})
        }
        //data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')
        //data.portada = portada_name;
        //let reg = await producto.create(data);

      }else{
        res.status(500).send({message:'No Access'});
      }
    }else{
      res.status(500).send({message:'No Access'});
    }
  }

  const eliminar_producto_admin = async (req,res)=>{
    if(req.user){
      if(req.user.role == 'admin'){
        
        var id = req.params['id'];
        //var data = req.body;

        let reg = await Producto.findByIdAndRemove({_id:id});
        res.status(200).send({data:reg});



      }else{
        res.status(500).send({message:'No Access'});
      }
    }else{
      res.status(500).send({message:'No Access'});
    }
  }

  const listar_inventario_producto_admin = async (req,res)=>{
  
    if(req.user){
      if(req.user.role == 'admin'){
       
        var id = req.params['id'];

        var reg = await Inventario.find({producto: id}).populate('admin').sort({createdAt:-1 });
        res.status(200).send({data:reg});

    
      }else{
        res.status(500).send({message:'No Access'});
      }
    }else{
      res.status(500).send({message:'No Access'});
    }
  
  }

  const eliminar_inventario_producto_admin = async (req,res)=>{
    if(req.user){
      if(req.user.role == 'admin'){
        //obtiene id del producto
        var id = req.params['id'];

        //elimina el inventario
        let reg = await Inventario.findByIdAndRemove({_id: id});

        //obtiene el registro de producto
        let prod = await Producto.findById({_id:reg.producto});

        //calcula nuevo stock
        let nuevo_stock = parseInt(prod.stock) - parseInt(reg.cantidad);

        //actualiza el stock nuevo del producto
        let producto = await Producto.findByIdAndUpdate({_id:reg.producto},{
          stock: nuevo_stock
        })
        res.status(200).send({data:producto});   
      }else{
        res.status(500).send({message:'No Access'});
      }
    }else{
      res.status(500).send({message:'No Access'});
    }
  }

  const registro_inventario_producto_admin = async (req,res)=> {
    if(req.user){
      if(req.user.role == 'admin'){

        let data = req.body;
        let reg = await Inventario.create(data);

        //obtiene el registro de producto
        let prod = await Producto.findById({_id:reg.producto});
        //calcula nuevo stock
        let nuevo_stock = parseInt(prod.stock) + parseInt(reg.cantidad);
        //actualiza el stock nuevo del producto
        let producto = await Producto.findByIdAndUpdate({_id:reg.producto},{
          stock: nuevo_stock
        })

        res.status(200).send({data:reg});   
      }else{
        res.status(500).send({message:'No Access'});
      }
    }else{
      res.status(500).send({message:'No Access'});
    }
  
  }


module.exports = {
    registro_producto_admin,
    listar_productos_admin,
    obtener_portada,
    obtener_producto_admin,
    actualizar_producto_admin,
    eliminar_producto_admin,
    listar_inventario_producto_admin,
    eliminar_inventario_producto_admin,
    registro_inventario_producto_admin
}
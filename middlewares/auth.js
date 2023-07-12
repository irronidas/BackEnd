'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'JBP';

exports.auth = (req,res,next)=>{

    if(!req.headers.authorization){
        return res.status(403).send({message:'No headers error'})
    }

    var token = req.headers.authorization.replace(/['"]+/g,'');
    var segment = token.split('.');
    

    if(segment.length != 3){
        return res.status(403).send({message:'Invalid Token'})
    }else{
        try {
            var payload = jwt.decode(token,secret);
            
            if(payload.exp <= moment().unix()){
                return res.status(403).send({message:'Expired Token'})
            }
        } catch (error) {
            return res.status(403).send({message:'Invalid Token'})
        }
    }

    req.user = payload;

    next();
}


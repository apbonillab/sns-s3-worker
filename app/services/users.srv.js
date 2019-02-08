'use strict'

const mysql = require('mysql');
const connection = require('../../db');
const security = require('../services/security.srv');

module.exports.crearAdmin = (nombre,segundonombre,apellido,segundoapellido,correo,contrasena,success,error)=>{
    let userData = [[nombre,segundonombre,apellido,segundoapellido,correo,contrasena]];
    connection.query(`insert into usuario (nombre,segundo_nombre,apellido,segundo_apellido,correo,contrasena) values ? `,
    [userData],function(err,result,fields){
        if(err){
            error(err);
        }
        success(result);
    })
}


module.exports.autenticarAdmin = (correo, contrasena, success, error) => {
    let query = `select * from usuario where correo= "${correo}"`;
    connection.query(query,function(err,result,fields){
        if(err){
                throw err;
        }
        if(result[0]!=undefined){
            if (result[0].contrasena === contrasena) {
                let user = result[0].idusuario;
                security.generateToken(correo).then(function(result){
                    success({'exito':true,'token':result,'user':user});
              });
                
            }else{
                success(403);
            }
        }else{
            success(403);
        }
       
        
    })
}

module.exports.mostrarTodos = (success,error)=>{
    connection.query(`select * from usuario`,function(err,result,fields){
        if(err){
            error(err);
        }
        success(result);
    })
}

module.exports.mostrarUsuarioXid = (idusuario,success,error)=>{
    connection.query(`select * from usuario where idusuario = ${idusuario}`,function(err,result,fields){
        if(err){
            error(err);
        }
        success(result);
    })
}

    module.exports.mostrarUsuarioXemail = (correo,success,error)=>{
        connection.query(`select * from usuario where correo = ${correo}`,function(err,result,fields){
            if(err){
                error(err);
            }
            success(result);
        })
}    
        
module.exports.eliminar = (idusuario,success,error)=>{
    connection.query(`delete from usuario where idusuario = ${idusuario}`,function(err,result,fields){
        if(err){
            error(err);
        }
        success(result);
    })
}

module.exports.editar = (idusuario,nombre,segundonombre,apellido,segundoapellido,correo,contrasena,success,error)=>{
    connection.query(`update usuario set nombre = "${nombre}",segundo_nombre="${segundonombre}",
    apellido="${apellido}",segundo_apellido="${segundoapellido}",correo="${correo}",
    contrasena=${contrasena} where idusuario = ${idusuario}`,function(err,result,fields){
         if(err){
             error(err);
         }
         success(result);
     });
 }
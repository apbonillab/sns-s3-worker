'use strict'

const mysql = require('mysql');
const connection = require('../../db');
const security = require('../services/security.srv');

module.exports.crearAdmin = (nombre,segundonombre,apellido,segundoapellido,correo,contrasena,success,error)=>{
    let userData = [[nombre,segundonombre,apellido,segundoapellido,correo,contrasena]];
    connection.query(`insert into administrador (nombre,segundo_nombre,apellido,segundo_apellido,correo,contrasena) values ? `,
    [userData],function(err,result,fields){
        if(err){
            console.log(err);
            error(err);
        }else{
            success(result);
        }
     
    })
}


module.exports.autenticarAdmin = (correo, contrasena, success, error) => {
    let query = `select * from administrador where correo= "${correo}"`;
    connection.query(query,function(err,result,fields){
        if(err){
                throw err;
        }
        if(result[0]!=undefined){
            if (result[0].contrasena === contrasena) {
                let user = result[0].idcuenta;
                let correo = result[0].correo;
                security.generateToken(correo).then(function(result){
                    success({'exito':true,'JWToken':result,'iduser':user,'correo':correo});
              });
                
            }else{
                error({'exito':false,'message': 'Contraseña errada'});
            }
        }else{
            error({'exito':false,'message': 'Correo no registrado'});
        }
       
        
    })
}

module.exports.mostrarTodos = (success,error)=>{
    connection.query(`select * from administrador`,function(err,result,fields){
        if(err){
            error(err);
        }else{
            success(result);
        }
        
    })
}

module.exports.mostrarUsuarioXid = (idcuenta,success,error)=>{
    connection.query(`select * from administrador where idcuenta = ${idcuenta}`,function(err,result,fields){
        if(err){
            error(err);
        }else{
            success(result);
        }
    
    })
}

module.exports.mostrarUsuarioXemail = (correo,success,error)=>{
        connection.query(`select * from administrador where correo = "${correo}"`,function(err,result,fields){
            if(err){
                error(err);
            }else{
                success(result);
            }
           
        })
}    
        
module.exports.eliminar = (idcuenta,success,error)=>{
    connection.query(`delete from administrador where idcuenta = ${idcuenta}`,function(err,result,fields){
        if(err){
            error(err);
        }else{
            success(result);
        }
     
    })
}

module.exports.editar = (idcuenta,nombre,segundonombre,apellido,segundoapellido,correo,contrasena,success,error)=>{
    connection.query(`update administrador set nombre = "${nombre}",segundo_nombre="${segundonombre}",
    apellido="${apellido}",segundo_apellido="${segundoapellido}",correo="${correo}",
    contrasena=${contrasena} where idcuenta = ${idcuenta}`,function(err,result,fields){
         if(err){
             error(err);
         }else{
            success(result);
         }
        
     });
 }
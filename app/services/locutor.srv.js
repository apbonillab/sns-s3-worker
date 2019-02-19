'use strict'

const mysql = require('mysql');
const connection = require('../../db');
const security = require('../services/security.srv');

module.exports.crearLocutor = (nombre,segundonombre,apellido,segundoapellido,correo,success,error)=>{
    let userData = [[nombre,segundonombre,apellido,segundoapellido,correo]];
    connection.query(`select * from locutor where correo = '${correo}'`,function(err,result,fields){
        if(err)
            error(err);
        else{
            if(result.length==0){
                console.log("result");
                connection.query(`insert into locutor (nombre,segundo_nombre,apellido,segundo_apellido,correo) values ? `,
                [userData],function(err,result,fields){
                    if(err){
                        error(err);
                    }else{
                        success(result);
                    }
                 
                })
            }else{
                connection.query(`update locutor set nombre = "${nombre}",segundo_nombre =  "${segundonombre}",
                apellido =  "${apellido}",segundo_apellido =   "${segundoapellido}"
                where idlocutor= ${result[0].idlocutor}`,function(err,result,fields){
                    if(err){
                        error(err);
                    }else{
                        console.log("se actualizo")
                        success(result);
                    }
                 
                })
            }
        }
    })
    
}


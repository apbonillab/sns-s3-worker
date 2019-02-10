'use strict'

const mysql = require('mysql');
const connection = require('../../db');
const security = require('../services/security.srv');

module.exports.crearLocutor = (nombre,segundonombre,apellido,segundoapellido,correo,success,error)=>{
    let userData = [[nombre,segundonombre,apellido,segundoapellido,correo]];
    connection.query(`insert into locutor (nombre,segundo_nombre,apellido,segundo_apellido,correo) values ? `,
    [userData],function(err,result,fields){
        if(err){
            error(err);
        }else{
            success(result);
        }
     
    })
}
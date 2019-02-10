'use strict'

const mysql = require('mysql');
const connection = require('../../db');
const moment = require('moment');

module.exports.crearArchivo = (observaciones,idlocutor,voz_inicial,concurso,extension,success,error)=>{
    let d = new Date();
    let dateAudit =  moment(d).format("YYYY-MM-DD HH:mm:ss");
    let voz_convertida= null;
    let estado = 1;
    if(extension.toLowerCase() ==='mp3'){
        voz_convertida= voz_inicial;
        estado = 2;
    }
    let userData = [[observaciones,idlocutor,estado,voz_inicial,concurso,dateAudit,extension,voz_convertida]];
    connection.query(`insert into archivos (observaciones,usuario,estado,voz_inicial,concurso,fecha,ext_voz_inicial,voz_convertida) values ? `,
    [userData],function(err,result,fields){
        if(err){
            error(err);
        }else{
            success(result);
        }
     
    })
}


module.exports.obtenerArchxConcurso = (idconcurso,success,error)=>{
    connection.query(`Select a.idarchivos 'idarchivos',
    a.observaciones 'observaciones', l.correo 'correo',
    l.nombre 'nombre',
    l.segundo_nombre 'segundo_nombre' ,
    l.apellido 'apellido',
    l.segundo_apellido 'segundo_apellido',
    a.voz_inicial 'voz_inicial',
    a.voz_convertida 'voz_convertida',
    a.concurso 'concurso',
    a.ext_voz_inicial 'extension'
    from archivos as a
    inner join locutor as l on l.idlocutor = a.usuario
    where a.concurso = ${idconcurso}`,function(err,result,fields){
        if(err){
            error(err);
        }else{
            success(result);
        }

    })
}
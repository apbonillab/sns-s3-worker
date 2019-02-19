'use strict'

const mysql = require('mysql');
const connection = require('../../db');
const moment = require('moment');
var nodemailer = require('nodemailer');
var concursoSrv = require('../services/concurso.srv.js');

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

module.exports.obtenerArchxConcursoURL = (urlConcurso,success,error)=>{
    connection.query(`Select a.idarchivos 'idarchivos',
    a.observaciones 'observaciones', l.correo 'correo',
    a.estado 'estado',
    e.nombre 'estado_nombre',
    l.nombre 'nombre',
    l.segundo_nombre 'segundo_nombre' ,
    l.apellido 'apellido',
    l.segundo_apellido 'segundo_apellido',
    a.voz_inicial 'voz_inicial',
    a.voz_convertida 'voz_convertida',
    a.concurso 'concurso',
    a.ext_voz_inicial 'extension',
    a.fecha 'fecha'
    from archivos as a
    inner join concursos as c on c.idconcursos=a.concurso
    inner join locutor as l on l.idlocutor = a.usuario
    inner join estado as e on e.idestado = a.estado
    where c.url = '${urlConcurso}' order by  a.fecha DESC`,function(err,result,fields){
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
    a.estado 'estado',
    e.nombre 'estado_nombre',
    l.nombre 'nombre',
    l.segundo_nombre 'segundo_nombre' ,
    l.apellido 'apellido',
    l.segundo_apellido 'segundo_apellido',
    a.voz_inicial 'voz_inicial',
    a.voz_convertida 'voz_convertida',
    a.concurso 'concurso',
    a.ext_voz_inicial 'extension',
    a.fecha 'fecha'
    from archivos as a
    inner join locutor as l on l.idlocutor = a.usuario
    inner join estado as e on e.idestado = a.estado
    where a.concurso = ${idconcurso} order by  a.fecha DESC`,function(err,result,fields){
        if(err){
            error(err);
        }else{
            success(result);
        }

    })
}

module.exports.actualizarEstado = (idarchivos,voz_convertida,correo,idconcurso,success,error)=>{
    connection.query(`update archivos set estado = 2,voz_convertida="${voz_convertida}"
     where idarchivos = ${idarchivos}`,function(err,result,fields){
         if(err){
             error(err);
         }else{            
            envioCorreo(correo,idconcurso);
            success("ok");
         }
        
     });
 }


 var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'grupo8.cloud@gmail.com',
        pass: 'grupo8.cloud123'
    }
});

function envioCorreo (correo,idconcurso){
    concursoSrv.mostrarConcursoXid(idconcurso,function(concurso){
        var mailOptions = {
            from: 'TheVoice',
            to: correo,
            subject: 'Voz Procesada',
            text: `Tú voz ha sido procesada, en el concurso: ${concurso.url} ..lista para concursar!!`
         };
    
         transporter.sendMail(mailOptions, function(error, info){
            if (error){
                console.log(error);
            } else {
                console.log("Email sent");
                return;
            }
        });
    }, function(err){

    })
    
 }
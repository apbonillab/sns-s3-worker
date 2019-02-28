'use strict'

const mysql = require('mysql');
const connection = require('../../db');
const moment = require('moment');
var nodemailer = require('nodemailer');
var concursoSrv = require('../services/concurso.srv.js');

var conf = require('../../config.js');
const RUTA_GESTOR_ARCHIVOS = conf.get('ruta_gestion_archivos')
const uuidv4 = require('uuid/v4');


module.exports.crearArchivo = (observaciones, idlocutor, concurso, file, success, error) => {
    var archivo = file;
    var nombreCompleto = archivo.name.split('.');
    var extension = nombreCompleto[nombreCompleto.length - 1];
    let idarchivo=uuidv4();
    archivo.mv(RUTA_GESTOR_ARCHIVOS + concurso + '/inicial/' + archivo.name + "_" + concurso +"_"+idarchivo + "." + extension, function (err) {
        if (err)
            error(err)
    });
    let d = new Date();
    let dateAudit = moment(d).format("YYYY-MM-DD HH:mm:ss");
    let voz_convertida = null;
    let estado = 1;
    if (extension.toLowerCase() === 'mp3') {
        archivo.mv(RUTA_GESTOR_ARCHIVOS + concurso + '/convertida/'+ concurso + "_" + idlocutor + "_" + idarchivo + "." + extension, function (err) {
            if (err) {
                console.log(err)
                error(err)
            }
        });
        voz_convertida = concurso + "_" + idlocutor + "_" + idarchivo;
        estado = 2;
    }
    let userData = [[observaciones, idlocutor, estado, archivo.name + "_" + concurso + "." + extension, concurso, dateAudit, extension, voz_convertida]];
    connection.query(`insert into archivos (observaciones,usuario,estado,voz_inicial,concurso,fecha,ext_voz_inicial,voz_convertida) values ? `,
        [userData], function (err, result, fields) {
            if (err) {
                console.log(err)
                error(err);
            } else {
                console.log(result)
                success(result);
            }

        })
}

module.exports.obtenerArchxConcursoURL = (urlConcurso,start,limit, success, error) => {
    let startNum = start;
    let LimitNum = limit;
    if(start == '' || limit == ''){
        startNum = 0;
        LimitNum = 20;
    }
    connection.query(`Select a.idarchivos 'idarchivos',
    a.observaciones 'observaciones', l.correo 'correo',
    a.estado 'estado',
    e.nombre 'estado_nombre',
    l.nombre 'nombre',
    l.segundo_nombre 'segundo_nombre' ,
    l.apellido 'apellido',
    l.segundo_apellido 'segundo_apellido',
    l.correo 'correo',
    a.voz_inicial 'voz_inicial',
    a.voz_convertida 'voz_convertida',
    a.concurso 'concurso',
    a.ext_voz_inicial 'extension',
    a.fecha 'fecha'
    from archivos as a
    inner join concursos as c on c.idconcursos=a.concurso
    inner join locutor as l on l.idlocutor = a.usuario
    inner join estado as e on e.idestado = a.estado
    where c.url = '${urlConcurso}' order by  a.fecha DESC limit ${LimitNum} OFFSET ${startNum}`, function (err, result, fields) {
            if (err) {
                error(err);
            } else {
                success(result);
            }

        })
}


module.exports.obtenerArchxConcurso = (idconcurso,start,limit, success, error) => {
    let startNum = start;
    let LimitNum = limit;
    if(start == '' || limit == ''){
        startNum = 0;
        LimitNum = 50;
    }
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
    where a.concurso = ${idconcurso} order by  a.fecha DESC limit ${LimitNum} OFFSET ${startNum}`, function (err, result, fields) {
            if (err) {
                error(err);
            } else {
                success(result);
            }
        })
}

    module.exports.actualizarEstado = (idarchivos, voz_convertida, correo, idconcurso, success, error) => {
        connection.query(`update archivos set estado = 2,voz_convertida="${voz_convertida}"
     where idarchivos = ${idarchivos}`, function (err, result, fields) {
                if (err) {
                    error(err);
                } else {
                    envioCorreo(correo, idconcurso);
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

    function envioCorreo(correo, url) {
        var mailOptions = {
            from: 'TheVoice',
            to: correo,
            subject: 'Voz Procesada',
            text: `Tú voz ha sido procesada, en el concurso: 172.24.42.30:8080/concurso/url/${url} ..lista para concursar!!`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent");
                return;
            }
        });

    }
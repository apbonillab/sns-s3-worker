'use strict'
var express = require('express')
var locutorServices = require('../services/locutor.srv.js');
const fileUpload = require('express-fileupload');
var routr = express();
routr.use(fileUpload());
var archivosServices = require('../services/archivos.srv.js');

routr.post('/creacion',(req, res) => {
    if (!req.files) {
        return res.status(400).send('no se adjunto ningun audio');
      }
    locutorServices.crearLocutor(
        req.body.nombre,
        req.body.segundo_nombre,
        req.body.apellido,
        req.body.segundo_apellido,
        req.body.correo,
        function (locutor) {
            console.log(locutor);
            archivosServices.crearArchivo(
                req.body.observaciones,
                locutor,
                req.body.concurso,
                req.files.audio,
                req.body.correo,
                function(archivo){
                    //console.log(res)
                    res.status(201).send({'exito':true,'message':'locutor OK','locutorId':locutor});
                },function(error){
                    res.status(500).send({'message':'Error en la creacion del archivo'+error});
                }
            )
        },function(error){
            res.status(500).send({'message':'Error en la creacion del locutor'+error});
            
        }
    )

})
module.exports = routr;
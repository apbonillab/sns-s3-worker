'use strict'
var express = require('express')
const fileUpload = require('express-fileupload');
var routr = express();
routr.use(fileUpload());
var archivosServices = require('../services/archivos.srv.js');

routr.post('/creacion',(req, res) => {
    if (!req.files) {
        return res.status(400).send('no se adjunto ningun audio');
      }
        archivosServices.crearArchivo(
                req.body.observaciones,
                req.body.nombre,
                req.body.segundo_nombre,
                req.body.apellido,
                req.body.segundo_apellido,
                req.body.concurso,
                req.body.url,
                req.files.audio,
                req.body.correo,
                function(archivo){
                    res.status(201).send({'exito':true,'message':'archivo OK'});
                },function(error){
                    res.status(500).send({'message':'Error en la creacion del archivo'+error});
                }
            )

})
module.exports = routr;

routr.post('/creacion-pruebas',(req, res) => {
    if (!req.files) {
        return res.status(400).send('no se adjunto ningun audio');
      }
    
            for(var i=0;i<req.body.cantidad;i++){
                archivosServices.crearArchivo(
                    req.body.observaciones,
                    req.body.nombre,
                    req.body.segundo_nombre,
                    req.body.apellido,
                    req.body.segundo_apellido,
                    req.body.concurso,
                    req.body.url,
                    req.files.audio,
                    req.body.correo,
                    function(archivo){
                    },function(error){
                        res.status(500).send({'message':'Error en la creacion del archivo'+error});
                    }
                )
            }
            res.status(201).send({'exito':true,'message':'locutor OK','locutorId':locutor});            
})
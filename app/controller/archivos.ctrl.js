'use strict'
var express = require('express')
var routr = express.Router();
var archivosServices = require('../services/archivos.srv.js');
var convertirServices = require('../services/conversor.srv.js');

routr.post('/creacion',(req, res) => {
    archivosServices.crearArchivo(
        req.body.observaciones,
        req.body.idlocutor,
        req.body.voz_inicial,
        req.body.concurso,
        req.body.extension,
        function (concurso) {
            res.status(201).send({'message':'Archivo creado exitosamente'})
        },function(error){
            console.log(error);
            res.status(500).send(error);
            
        }
    )

})

routr.get('/obtener/concurso/:concurso', (req, res) => {
    archivosServices.obtenerArchxConcurso(
        req.params.concurso,
        function (archivos) {
            res.status(200).send(archivos)
        },function(error){
            console.log(error);
            res.status(500).send({'message':'Error al obtener todos las voces por concurso'});
        }
    )

})

var cron = require('node-cron');
 
cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
  convertirServices.convertirAudio(function (success) {
            archivosServices.actualizarEstado(success.idarchivos,success.voz_inicial+'_final',success.correo,
            function(archivo){
                console.log("OK envio correo y actualizacion estado de archivo ");
            },function(error){
                console.log('error actualizacion y envio correo'+error);
            })
    },function (error){
        console.log('error'+error);

  })
});



module.exports = routr;
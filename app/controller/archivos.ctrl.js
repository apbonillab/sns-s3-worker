'use strict'
var express = require('express')
var routr = express.Router();
var archivosServices = require('../services/archivos.srv.js');

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
            res.status(500).send({'message':'Error en la creacion del archivo'});
            
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

module.exports = routr;
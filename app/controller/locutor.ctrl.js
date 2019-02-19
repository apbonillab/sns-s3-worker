'use strict'
var express = require('express')
var routr = express.Router();
var locutorServices = require('../services/locutor.srv.js');


routr.post('/creacion',(req, res) => {
    locutorServices.crearLocutor(
        req.body.nombre,
        req.body.segundo_nombre,
        req.body.apellido,
        req.body.segundo_apellido,
        req.body.correo,
        function (locutor) {
            res.status(201).send({'message':'Locutor creado exitosamente','idlocutor':locutor.insertId})
        },function(error){
            res.status(500).send({'message':'Error en la creacion del locutor'+error});
            
        }
    )

})
module.exports = routr;
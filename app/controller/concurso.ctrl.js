'use strict'
var express = require('express')
var routr = express.Router();
var concursoSrv = require('../services/concurso.srv.js');

routr.post('/creacion', (req, res) => {
    concursoSrv.crear(
        req.body.nombre,
        req.body.fecha_inicio,
        req.body.fecha_fin,
        req.body.valor,
        req.body.guion,
        req.body.recomendaciones,
        req.body.url,
        req.body.banner,
        req.body.idusuario,
        function (concurso) {
            res.status(201).send(concurso)
        },function(error){
            res.status(500).send(error);
            
        }
    )

})


routr.post('/obtener/todos', (req, res) => {
    concursoSrv.mostrarTodos(
        function (user) {
            res.status(200).send(user)
        },function(error){
            res.sendStatus(500)
        }
    )

})

routr.get('/obtener/admin/:idadmin', (req, res) => {
    concursoSrv.mostrarConcursosXUsuario(
        req.params.idadmin,
        function (concurso) {
            res.status(200).send(concurso)
        },function(error){
            res.sendStatus(500)
        }
    )

})

routr.get('/obtener/id/:id', (req, res) => {
    concursoSrv.mostrarConcursoXid(
        req.params.id,
        function (concurso) {
            res.status(200).send(concurso)
        },function(error){
            res.sendStatus(500)
        }
    )

})


routr.delete('/eliminar/:id', (req, res) => {
    concursoSrv.eliminarArchivosXconcurso(
        req.params.id,
        function (concurso) {
            res.status(200).send(concurso)
        },function(error){
            res.sendStatus(500)
        }
    )

})


module.exports = routr;
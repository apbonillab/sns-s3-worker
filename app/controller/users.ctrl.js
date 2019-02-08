'use strict'
var express = require('express')
var routr = express.Router();
var usersServices = require('../services/users.srv.js');

routr.post('/creacion', (req, res) => {
    usersServices.crearAdmin(
        req.body.nombre,
        req.body.segundo_nombre,
        req.body.apellido,
        req.body.segundo_apellido,
        req.body.correo,
        req.body.contrasena,
        function (user) {
            res.status(201).send(user)
        },function(error){
            if(error.code === 'ER_DUP_ENTRY')//valida si el correo ya existe
                res.status(400).send(error);
            res.status(500).send(error);
            
        }
    )

})


routr.put('/edicion', (req, res) => {
    usersServices.editar(
        req.body.idusuario,
        req.body.nombre,
        req.body.segundo_nombre,
        req.body.apellido,
        req.body.segundo_apellido,
        req.body.correo,
        req.body.contrasena,
        function (user) {
            res.status(200).send(user)
        },function(error){
            res.status(500).send(error);
            
        }
    )

})


routr.post('/login', (req, res) => {
    usersServices.autenticarAdmin(
        req.body.correo,
        req.body.contrasena,
        function (user) {
            res.status(200).send(user)
        },function(error){
            res.sendStatus(403)
        }
    )

})


routr.get('/obtener/todos', (req, res) => {
    usersServices.mostrarTodos(
        function (user) {
            res.status(200).send(user)
        },function(error){
            res.sendStatus(500)
        }
    )

})

routr.get('/obtener/email/:email', (req, res) => {
    usersServices.mostrarUsuarioXemail(
        req.params.email,
        function (user) {
            res.status(200).send(user)
        },function(error){
            res.sendStatus(500)
        }
    )

})

routr.get('/obtener/id/:id', (req, res) => {
    usersServices.mostrarUsuarioXid(
        req.params.id,
        function (user) {
            res.status(200).send(user)
        },function(error){
            res.sendStatus(500)
        }
    )

})

routr.delete('/eliminar/:id', (req, res) => {
    usersServices.eliminar( req.params.id,
        function (user) {
            res.status(200).send(user)
        },function(error){
            res.sendStatus(500)
        }
    )

})



module.exports = routr;
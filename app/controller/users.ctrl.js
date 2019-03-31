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
        function (iduser) {
            usersServices.autenticarAdmin(
                req.body.correo,
                req.body.contrasena,
                function (user) {
                    res.status(201).send(user);
                },function(error){
                    res.status(403).send(error);
                }
            )

        },function(error){
            if(error.code === 'ER_DUP_ENTRY'){
                res.status(400).send({'message':'Ya existe un registro con ese correo'});
            }else{
                res.status(500).send({'message':'Error al crear administrador'});
            }
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
            res.status(500).send(error)
        }
    )

})

module.exports = routr;
'use strict'
var express = require('express')
var routr = express.Router();
var usersServices = require('../services/users.srv.js');
const security = require('../services/security.srv');

routr.post('/creacion', (req, res) => {
    usersServices.crearAdmin(
        req.body.nombre,
        req.body.segundo_nombre,
        req.body.apellido,
        req.body.segundo_apellido,
        req.body.correo,
        req.body.contrasena,
        function (user) {
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


routr.put('/edicion',ensureToken, (req, res) => {
    usersServices.editar(
        req.body.idusuario,
        req.body.nombre,
        req.body.segundo_nombre,
        req.body.apellido,
        req.body.segundo_apellido,
        req.body.correo,
        req.body.contrasena,
        function (user) {
            res.status(200).send({'message':'Actualizacion correcta'})
        },function(error){
            res.status(500).send({'message':'Error en la actualizacion: '+error.sqlMessage});
            
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


routr.get('/obtener/todos', (req, res) => {
    usersServices.mostrarTodos(
        function (user) {
            res.status(200).send(user)
        },function(error){
            res.status(500).send({'message':'Error al obtener todos los administradores'});
        }
    )

})

routr.get('/obtener/email/:email', (req, res) => {
    usersServices.mostrarUsuarioXemail(
        req.params.email,
        function (user) {
            res.status(200).send(user);
        },function(error){
            res.status(500).send({'message':'Error al obtener registro por email'});
        }
    )

})

routr.get('/obtener/id/:id', (req, res) => {
    usersServices.mostrarUsuarioXid(
        req.params.id,
        function (user) {
            res.status(200).send(user)
        },function(error){
            res.status(500).send({'message':'Error al obtener administrador por id'});
        }
    )

})

routr.delete('/eliminar/:id',ensureToken, (req, res) => {
    usersServices.eliminar( req.params.id,
        function (user) {
            res.status(200).send({'message':'Se elimino con exito el registro'})
        },function(error){
            res.status(500).send({'message':'Error al eliminar registro'});
        }
    )

})

function ensureToken(req,res,next){
    const beareheader = req.headers['authorization'];
    console.log('bearerheader: '+beareheader);
    if(typeof beareheader != 'undefined'){
        const bearer = beareheader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        security.verifyToken(req.token).then(()=>{
            next();
        },()=>{
            res.status(403).send({'message':'Token incorrecto',});
        }
        )
       
    }else{
        res.status(403).send({'message':'No tiene token de autenticacion',});
    }
    
}

module.exports = routr;
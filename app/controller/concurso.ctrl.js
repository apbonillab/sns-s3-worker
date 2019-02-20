'use strict'
var express = require('express')
const fileUpload = require('express-fileupload');
var routr = express.Router();
var concursoSrv = require('../services/concurso.srv.js');
const security = require('../services/security.srv');

routr.use(fileUpload());

routr.post('/creacion',ensureToken,(req, res) => {

    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
      }
    concursoSrv.crear(
        req.body.nombre,
        req.body.fecha_inicio,
        req.body.fecha_fin,
        req.body.valor,
        req.body.guion,
        req.body.recomendaciones,
        req.body.url,
        req.files.banner,
        req.body.idusuario,
        function (concurso) {
                res.status(201).send({'exito':true,'message':'Concurso creado exitosamente'})
        },function(error){
            res.status(500).send({'exito':false,'message':'Error en la creacion del concurso'});
            
        }
    )

})


routr.get('/obtener/todos', (req, res) => {
    concursoSrv.mostrarTodos(
        function (user) {
            res.status(200).send(user)
        },function(error){
            res.status(500).send({'message':'Error al obtener todos los concursos'})
        }
    )

})

routr.get('/obtener/todosvigentes', (req, res) => {
    concursoSrv.mostrarTodosVigentes(
        function (user) {
            res.status(200).send(user)
        },function(error){
            res.status(500).send({'message':'Error al obtener todos los concursos'})
        }
    )

})


routr.get('/obtener/admin/:idadmin', (req, res) => {
    concursoSrv.mostrarConcursosXUsuario(
        req.params.idadmin,
        function (concurso) {
            res.status(200).send(concurso)
        },function(error){
            res.status(500).send({'message':'Error al obtener concurso por creador'})
        }
    )

})

routr.get('/obtener/url/:url',(req, res) => {
    concursoSrv.mostrarConcursoXURL(
        req.params.url,
        function (concurso) {
            res.status(200).send(concurso)
        },function(error){
            res.status(500).send({'message':'Error al obtener concurso por url'});
        }
    )

})


routr.delete('/eliminar/:id',ensureToken, (req, res) => {
    concursoSrv.eliminarArchivosXconcurso(
        req.params.id,
        function (concurso) {
            res.status(200).send({'message':'Se elimino exitosamente el concurso'})
        },function(error){
            res.status(500).send({'message':'Error al eliminar concurso'});
        }
    )

})

routr.post('/editar',ensureToken,(req, res) => {
    concursoSrv.editar(
        req.body.idconcurso,
        req.body.nombre,
        new Date(req.body.fecha_inicio),
        new Date(req.body.fecha_fin),
        req.body.valor,
        req.body.guion,
        req.body.recomendaciones,
        req.body.url,
        req.body.banner,
        function (concurso) {
            res.status(200).send({'exito':true,'message':'Concurso actualizado exitosamente'})
        },function(error){
            res.status(500).send({'exito':false,'message':'Error al actualizar concurso'});
            
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

routr.put('/seleccion_ganador',ensureToken, (req, res) => {
    concursoSrv.seleccionganador(
        req.body.idarchivo,
        req.body.idconcurso,
        function (user) {
            res.status(200).send({'message':'Actualizacion correcta'})
        },function(error){
            res.status(500).send({'message':'Error en la actualizacion: '+error.sqlMessage});
            
        }
    )

})


module.exports = routr;
'use strict'
var express = require('express')
const fileUpload = require('express-fileupload');
var routr = express.Router();
var concursoSrv = require('../services/concurso.srv.js');
const security = require('../services/security.srv');

routr.use(fileUpload());

routr.post('/creacion',ensureToken,(req, res) => {

    let banner
    if (!req.files) {
        banner = null;
    }
    else{
        banner=req.files.banner
    }
    concursoSrv.crear(
        req.body.nombre,
        req.body.fecha_inicio,
        req.body.fecha_fin,
        req.body.valor,
        req.body.guion,
        req.body.recomendaciones,
        req.body.url,
        banner,
        req.body.idusuario,
        function (concurso) {
                res.status(201).send({'exito':true,'message':'Concurso creado exitosamente'})
        },function(error){
            res.status(500).send({'exito':false,'message':'Error en la creacion del concurso'});
            
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
            console.log(error)
            res.status(500).send({'message':'Error al obtener concurso por url'});
        }
    )

})


routr.delete('/eliminar/:id/:idadmin',ensureToken, (req, res) => {
    concursoSrv.eliminarArchivosXconcurso(
        req.params.id,
        req.params.idadmin,
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
        new Date(req.body.fecha_inicio).toDateString(),
        new Date(req.body.fecha_fin).toDateString(),
        req.body.valor,
        req.body.guion,
        req.body.recomendaciones,
        req.body.url,
        req.body.banner,
        "1ecf4a8b-2c3a-4ead-92ca-007d980bff7d",
        function (concurso) {
            res.status(200).send({'exito':true,'message':'Concurso actualizado exitosamente'})
        },function(error){
            console.log(error)
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


module.exports = routr;
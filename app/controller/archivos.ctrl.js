'use strict'
var express = require('express')
const fileUpload = require('express-fileupload');
//var fs  = require('fs');
// default options
var app = express();
app.use(fileUpload());

//var routr = express.Router();
var archivosServices = require('../services/archivos.srv.js');
var convertirServices = require('../services/conversor.srv.js');

app.post('/creacion',(req, res) => {

    // var idCurso  = 13;
    // // vididacion para generar un nuevo directerio con el nombre del archivo 
    //  var  destination= function (req, file, callback) {
    //     var dir = './uploads';
    //     if (!fs.existsSync(dir)) {
    //       fs.mkdirSync(dir);
    //     }
    //     callback(null, dir);
    // }

    if (!req.files) {
        return res.status(400).send('no se adjunto ningun audio');
      }
      var archivo =  req.files.audio;

      // para validar la extencion 
    //   var nombreCompleto =  archivo.name.split('.'); 
    //   var  extencion = nombreCompleto[ nombreCompleto.length - 1];

      // modificar nombre de archivo 

      archivo.mv('./uploads/' + archivo.name, function(err) {
        if (err)
          return res.status(500).send(err);
        res.send({respuesta:'se subio el audio ', body :req.body });
      });

       console.log(req.body)
    //   return res.status(200).send(extencion);
    // archivosServices.crearArchivo(
    //     req.body.observaciones,
    //     req.body.idlocutor,
    //     req.body.voz_inicial,
    //     req.body.concurso,
    //     req.body.extension,
    //     function (concurso) {
    //         res.status(201).send({'message':'Archivo creado exitosamente'})
    //     },function(error){
    //         console.log(error);
    //         res.status(500).send(error);
            
    //     }
    // )

})

app.get('/obtener/concurso/:concurso', (req, res) => {
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

app.get('/obtener/concurso/url/:url', (req, res) => {
    archivosServices.obtenerArchxConcursoURL(
        req.params.url,
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
  console.log('corriendo cron');
  convertirServices.convertirAudio(function (success) {
            archivosServices.actualizarEstado(success.idarchivos,success.voz_inicial+'_final',success.correo,
            function(archivo){
                console.log("OK envio correo y actualizacion estado de archivo "+success.idarchivos);
            },function(error){
                console.log('error actualizacion y envio correo'+error);
            })
    },function (error){
        console.log('error '+error);

  })
});



module.exports = app;
'use strict'
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config( {path: "./cron.env"});

var cron = require('node-cron');
var convertirServices = require('./conversor.srv.js');

var taskTest = cron.schedule('*/5 * * * * *',() => {
  console.log('cron: ', Date.now());
  },
  { scheduled:false}
);


const convertir = () => {
  console.log('corriendo cron');

  convertirServices.convertirAudio(function (success) {
    convertirServices.actualizarEstado(success.idarchivos,success.voz_inicial+'_final',success.correo,
            success.url,
            function(archivo){
                console.log("OK envio correo y actualizacion estado de archivo "+success.idarchivos);
            },function(error){
                console.log('error actualizacion y envio correo '+error);
            })
    },function (error){
        console.log('error '+error);

  })
}


var task = cron.schedule('* * * * *', convertir, {scheduled:true});


var app = express();
app.options('*', cors());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var http = require('http');
var server = http.createServer(app);
server.listen(8080, '0.0.0.0');
server.on('listening', function() {
  console.log('Express server started on port %s at %s at %s', server.address().port, server.address().address,process.env.HOST);
});

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('/start', (req,res) => {
  convertir();
  task.start();
  res.send('Cron iniciado')
})

app.get('/stop', (req,res) => {
  task.stop();
  res.send('Cron detenido')
})
module.exports = app;

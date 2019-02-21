var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt  = require('jsonwebtoken');
var serveIndex = require('serve-index');


const usersController = require('./app/controller/users.ctrl.js');
const concursosController = require('./app/controller/concurso.ctrl.js');
const locutorController = require('./app/controller/locutor.ctrl.js');
const archivosController = require('./app/controller/archivos.ctrl.js');

var app = express();
app.options('*', cors());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var http = require('http');
var server = http.createServer(app);
server.listen(8080, '0.0.0.0');
server.on('listening', function() {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/Voces', serveIndex(path.join(__dirname, 'Voces')));
app.use('/Voces', express.static(path.join(__dirname, 'Voces')));

app.use('/api/admin', [usersController]);
app.use('/api/concurso', [concursosController]);
app.use('/api/locutor', [locutorController]);
app.use('/api/archivo', [archivosController]);
app.use(express.static(path.join(__dirname, 'front/build')));
app.get('/*', function(req, res) {
    console.log('estatico')
    res.sendFile(path.join(__dirname, 'front/build', 'index.html'));
  });
//app.use('/Voces',express.directory(path.join(__dirname, './Voces')));
module.exports = app;

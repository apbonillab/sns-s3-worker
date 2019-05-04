'use strict'
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
var path = require('path');
const sqsConsumer = require('./sqs');

var app = express();
app.options('*', cors());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var http = require('http');
var server = http.createServer(app);
server.listen(process.env.PORT||8080, '0.0.0.0');
server.on('listening', function() {
  console.log('Worker server started on port %s at %s at %s', server.address().port, server.address().address,process.env.HOST);
});

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('/start', (req,res) => {
  sqsConsumer.start()
  res.send('Worker iniciado')
})

app.get('/status', (req,res) => {
  res.send('Worker isRunnnig? '+sqsConsumer.isRunning)
})

app.get('/stop', (req,res) => {
  sqsConsumer.stop()
  res.send('Worker detenido')
})

app.use('/logs', express.static(path.join(__dirname, './info.log')));

sqsConsumer.start()

module.exports = app;

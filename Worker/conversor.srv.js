var ffmpeg = require('fluent-ffmpeg');
var conf = require('./config.js');
const RUTA_GESTOR_ARCHIVOS = conf.get('ruta_gestion_archivos');
let date = require('date-and-time');
const winston = require('winston');
var AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.ACCES_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});
var ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2018-03-24' });
const s3 = require('./s3Storage');
const URLS3 = conf.get('URLS3');
var fs = require('fs');
const archivos = require('./archivos.srv');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'info.log',
      level: 'info'
    }),
    new winston.transports.File({
      filename: 'combined.log'
    })
  ]
});
module.exports.convertirAudio = (url, success, error) => {
  //var nombreCompleto = archivo.voz_inicial.split('.');
  //var voz = nombreCompleto[0];
  //var bucket = `voces-thevoice/concurso-${archivo.idconcurso}`;
  //var rutas3 = `${URLS3}/${bucket}/inicial/${archivo.voz_inicial}`;
  let trama = url.split(';')
  let urlArchivo = trama[0].split('/');
  let bucket = urlArchivo[3];
  let concurso = urlArchivo[4];
  let fileName = urlArchivo[6].split('.')[0];
  let extension_inicial = urlArchivo[6].split('.')[1];
  var proc = new ffmpeg({
    source: trama[0],
    nolog: true
  });
  //fs.mkdirSync(RUTA_GESTOR_ARCHIVOS)
  if(!fs.existsSync(RUTA_GESTOR_ARCHIVOS + concurso)){
    fs.mkdirSync(RUTA_GESTOR_ARCHIVOS + concurso)
    if(!fs.existsSync(RUTA_GESTOR_ARCHIVOS + concurso + '//convertida')){
      fs.mkdirSync(RUTA_GESTOR_ARCHIVOS + concurso + '//convertida')
    }
  }
  console.log('Ruta S3: ', url);
  //var proc = new ffmpeg({ source: RUTA_GESTOR_ARCHIVOS+archivo.concurso+'//inicial//'+archivo.voz_inicial, nolog: true })
  var isWin = process.platform === 'win32';
  var path = isWin ? 'C:\\ffmpeg\\bin\\ffmpeg.exe' : '/usr/local/bin/ffmpeg';
  let start = new Date();
  //let filename = `concurso-${archivo.idconcurso}/convertida/${voz}.mp3`;
  date.format(start, 's');
  //logger.info("concurso: "+archivo.concurso+" ,start: "+start);
  proc.setFfmpegPath(path)
    .toFormat('mp3')
    .on('error', (err) => {
      return error(err.message);
    })
    .on('progress', (progress) => {
      console.log('Processing: ' + progress.targetSize + ' KB converted ' + concurso);
    })
    .on('end', () => {
      let finish = new Date();
      date.format(finish, 's');
      //logger.info("concurso: "+voz+" ,finish: "+finish);
      let time = date.subtract(finish, start).toSeconds();
      logger.info('concurso: ' + concurso + ' ,Tiempo conversion:  ' + time + 's \n');
      //var file = fs.createReadStream(RUTA_GESTOR_ARCHIVOS + archivo.concurso + '//convertida//' + voz + '.mp3');
      fs.readFile(RUTA_GESTOR_ARCHIVOS + concurso + '//convertida//' + fileName + '.mp3', (err, data) => {
        if (err) {
          console.log('Error al leer');
          console.error(err);
        }
        let nameConvertido = `${concurso}/convertida/${fileName}.mp3`;
        s3.saveFileToS3(nameConvertido, data,false,() => {
          archivos.actualizarEstado(trama[1],`${fileName}.mp3`,trama[3],concurso,trama[2],success,()=>{
            console.log('ERROR: ',err)
          })
        });
      });
      /*fs.unlink(RUTA_GESTOR_ARCHIVOS + archivo.concurso + '//convertida//' + voz + '.mp3',function(err){
                if(err) throw err;
                console.log('File deleted!');
            });*/
    })
    .saveToFile(RUTA_GESTOR_ARCHIVOS + concurso + '//convertida//' + fileName + '.mp3'); //path where you want to save your file   
};
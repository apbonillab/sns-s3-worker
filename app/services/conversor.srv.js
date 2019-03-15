
var ffmpeg = require('fluent-ffmpeg');
const mysql = require('mysql');
const connection = require('../../db');
var conf = require('../../config.js');
const RUTA_GESTOR_ARCHIVOS = conf.get('ruta_gestion_archivos')
let date = require('date-and-time');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log', level: 'info' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
module.exports.convertirAudio = (success,error)=>{
    connection.query(`select a.*,l.*,c.* from archivos a
                     inner join locutor as l on l.idlocutor = a.usuario
                     inner join concursos as c on c.idconcursos = a.concurso
                     where estado = 1`,function(err,result,fields){
        if(err){
            error(err);

        }else{
            result.forEach(archivo => {
                var nombreCompleto = archivo.voz_inicial.split('.');
                var voz = nombreCompleto[0];
                var proc = new ffmpeg({ source: RUTA_GESTOR_ARCHIVOS+archivo.concurso+'//inicial//'+archivo.voz_inicial, nolog: true })
                var isWin = process.platform === "win32";
                var path = isWin?"C:\\ffmpeg\\bin\\ffmpeg.exe":'/usr/bin/ffmpeg';
                let start= new Date();
                date.format(start,'s');
                logger.info("concurso: "+archivo.concurso+" ,start: "+start);
                proc.setFfmpegPath(path)
                .toFormat('mp3')
                 .on('error', (err) => {
                     return error(err.message);
                 })
                 .on('progress', (progress) => {
                     console.log('Processing: ' + progress.targetSize + ' KB converted' + archivo.concurso);
                    })
                 .on('end', () => {
                     let finish= new Date();
                     date.format(finish,'s');
                     //logger.info("concurso: "+voz+" ,finish: "+finish);
                     let time=date.subtract(finish,start).toSeconds();
                     logger.info("concurso: "+voz+" ,Tiempo conversion:  "+time + "s \n");
                    success(archivo);                     
                 })
                 .saveToFile(RUTA_GESTOR_ARCHIVOS+archivo.concurso+'//convertida//'+voz+'.mp3');//path where you want to save your file
                       
            });
        }
    
   })
}


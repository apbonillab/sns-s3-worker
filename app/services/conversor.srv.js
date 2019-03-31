
var ffmpeg = require('fluent-ffmpeg');
var conf = require('../../config.js');
const RUTA_GESTOR_ARCHIVOS = conf.get('ruta_gestion_archivos')
let date = require('date-and-time');
const winston = require('winston');
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    accessKeyId:process.env.ACCES_KEY_ID,
    secretAccessKey:process.env.SECRET_ACCESS_KEY
});
var ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2018-03-24'});
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log', level: 'info' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
module.exports.convertirAudio = (success,error)=>{
    var params = {
        TableName: 'archivos',
        FilterExpression : "estado = :estado",
        ExpressionAttributeValues : {":estado": "Sin convertir"} 
      };
      ddb.scan(params,function(err,result){
        if(err){
            error(err);
        }else{
            
            result.Items.forEach(archivo => {
                var nombreCompleto = archivo.voz_inicial.split('.');
                var voz = nombreCompleto[0];
                var proc = new ffmpeg({ source: RUTA_GESTOR_ARCHIVOS+archivo.idconcurso+'//inicial//'+archivo.voz_inicial, nolog: true })
                var isWin = process.platform === "win32";
                var path = isWin?"C:\\ffmpeg\\bin\\ffmpeg.exe":'/usr/bin/ffmpeg';
                let start= new Date();
                date.format(start,'s');
                //logger.info("concurso: "+archivo.concurso+" ,start: "+start);
                proc.setFfmpegPath(path)
                .toFormat('mp3')
                 .on('error', (err) => {
                     return error(err.message);
                 })
                 .on('progress', (progress) => {
                     console.log('Processing: ' + progress.targetSize + ' KB converted' + archivo.idconcurso);
                    })
                 .on('end', () => {
                     let finish= new Date();
                     date.format(finish,'s');
                     //logger.info("concurso: "+voz+" ,finish: "+finish);
                     let time=date.subtract(finish,start).toSeconds();
                     logger.info("concurso: "+voz+" ,Tiempo conversion:  "+time + "s \n");
                    success(archivo);                     
                 })
                 .saveToFile(RUTA_GESTOR_ARCHIVOS+archivo.idconcurso+'//convertida//'+voz+'.mp3');//path where you want to save your file
                       
            });
        }
    
   })
}


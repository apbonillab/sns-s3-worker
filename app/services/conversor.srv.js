
var ffmpeg = require('fluent-ffmpeg');
const mysql = require('mysql');
const connection = require('../../db');
var conf = require('../../config.js');
const RUTA_GESTOR_ARCHIVOS = conf.get('ruta_gestion_archivos')

module.exports.convertirAudio = (success,error)=>{
    connection.query(`select a.*,l.* from archivos a
                     inner join locutor as l on l.idlocutor = a.usuario
                     where estado = 1`,function(err,result,fields){
        if(err){
            error(err);

        }else{
            result.forEach(archivo => {
                convertirVozFinal(archivo.voz_inicial,archivo.concurso,archivo.ext_voz_inicial,archivo.correo);
                success(archivo);
            });
        }
    
   })
}
   convertirVozFinal = function(voz,idconcurso,extension,correo){
       var proc = new ffmpeg({ source: RUTA_GESTOR_ARCHIVOS+idconcurso+'//inicial//'+voz+"."+extension, nolog: true })
       proc.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe")
       .toFormat('mp3')
        .on('error', (err) => {
            console.log('An error occurred: ' + err.message);
        })
        .on('progress', (progress) => {
            // console.log(JSON.stringify(progress));
            console.log('Processing: ' + progress.targetSize + ' KB converted');
        })
        .on('end', () => {
            console.log('Processing finished !');
        })
        .saveToFile(RUTA_GESTOR_ARCHIVOS+idconcurso+'//convertida//'+voz+'_final.mp3');//path where you want to save your file
   }

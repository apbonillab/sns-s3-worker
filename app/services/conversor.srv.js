
var ffmpeg = require('fluent-ffmpeg');
const mysql = require('mysql');
const connection = require('../../db');
var conf = require('../../config.js');
const RUTA_GESTOR_ARCHIVOS = conf.get('ruta_gestion_archivos')

module.exports.convertirAudio = (success,error)=>{
    connection.query(`select a.*,l.*,c.* from archivos a
                     inner join locutor as l on l.idlocutor = a.usuario
                     inner join concursos as c on c.idconcursos = a.concurso
                     where estado = 1`,function(err,result,fields){
        if(err){
            error(err);

        }else{
            result.forEach(archivo => {
                var proc = new ffmpeg({ source: RUTA_GESTOR_ARCHIVOS+archivo.concurso+'//inicial//'+archivo.voz_inicial, nolog: true })
                var isWin = process.platform === "win32";
                var path = isWin?"C:\\ffmpeg\\bin\\ffmpeg.exe":'/usr/bin/ffmpeg';
                proc.setFfmpegPath(path)
                .toFormat('mp3')
                 .on('error', (err) => {
                     return error(err.message);
                 })
                 .on('progress', (progress) => {
                     console.log('Processing: ' + progress.targetSize + ' KB converted' + archivo.concurso);
                    })
                 .on('end', () => {
                     console.log('Processing finished !');
                    success(archivo);                     
                 })
                 .saveToFile(RUTA_GESTOR_ARCHIVOS+archivo.concurso+'//convertida//'+archivo.voz_inicial+'_final.mp3');//path where you want to save your file
                       
            });
        }
    
   })
}



var ffmpeg = require('fluent-ffmpeg');
const mysql = require('mysql');
const connection = require('./db');
var conf = require('./config.js');
const RUTA_GESTOR_ARCHIVOS = conf.get('ruta_gestion_archivos');
let date = require('date-and-time');
var AWS = require('aws-sdk');
var uuid = require('uuid');


AWS.config.update({
    region: 'us-east-1',
    accessKeyId:process.env.ACCES_KEY_ID,
    secretAccessKey:process.env.SECRET_ACCESS_KEY
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });


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
                let start= new Date();
                date.format(start,'s');
                console.log("Start: ",start);
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
                     console.log("finish: ",finish);
                     let time=date.subtract(finish,start).toSeconds();
                     console.log("Tiempo para conversion: ", time, " s");
                     console.log('Processing finished !');
                    success(archivo);                     
                 })
                 .saveToFile(RUTA_GESTOR_ARCHIVOS+archivo.concurso+'//convertida//'+archivo.voz_inicial+'_final.mp3');//path where you want to save your file
                       
            });
        }
    
   })
}

module.exports.actualizarEstado = (idarchivos, voz_convertida, correo, idconcurso, success, error) => {
    connection.query(`update archivos set estado = 2,voz_convertida="${voz_convertida}"
 where idarchivos = ${idarchivos}`, function (err, result, fields) {
            if (err) {
                error(err);
            } else {
                envioCorreo(correo, idconcurso);
                success("ok");
            }

        });
}

function envioCorreo(correo, url) {
    var params = {
        Destination: { 
        ToAddresses: [
            correo,
        ]
        },
        Source: 'grupo8.cloud@gmail.com',
        Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data:
                  "<html><body><h1>Voz Procesada!!</h1> <p>Tú voz ha sido procesada, en el concurso: http://3.18.70.221:8080/concurso/url/"+url+" ..lista para concursar!!'</p></body></html>"
              },
              Text: {
                Charset: "UTF-8",
                Data: "Hello Charith Sample description time 1517831318946"
              }
            },
            Subject: {
              Charset: "UTF-8",
              Data: "Voz procesada exitosamente"
            }
          }
    };
    const sendEmail = ses.sendEmail(params).promise();

    sendEmail
    .then(data => {
        console.log("email enviado SES", data);
    })
    .catch(error => {
        console.log(error);
    });

}




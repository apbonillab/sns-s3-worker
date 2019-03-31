'use strict'
const moment = require('moment');
var conf = require('../../config.js');
const RUTA_GESTOR_ARCHIVOS = conf.get('ruta_gestion_archivos')
const uuidv4 = require('uuid/v4');
var AWS = require('aws-sdk');
var uuid = require('uuid');


AWS.config.update({
    region: 'us-east-1',
    accessKeyId:process.env.ACCES_KEY_ID,
    secretAccessKey:process.env.SECRET_ACCESS_KEY
});
var ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2018-03-24'});
const ses = new AWS.SES({ apiVersion: "2010-12-01" });


module.exports.crearArchivo = (observaciones, nombre,segundonombre,apellido,segundoapellido, concurso,url,file,correo, success, error) => {
    var archivo = file;
    var nombreCompleto = archivo.name.split('.');
    var extension = nombreCompleto[nombreCompleto.length - 1];
    let idarchivo=uuidv4();
    //archivo.mv(RUTA_GESTOR_ARCHIVOS + concurso + '/inicial/' + archivo.name + "_" + concurso +"_"+idarchivo + "." + extension, function (err) {
    archivo.mv(RUTA_GESTOR_ARCHIVOS + concurso + '/inicial/' + idarchivo + "." + extension, function (err) {
        if (err)
            error(err)
        else{
            let d = new Date();
            let dateAudit = moment(d).format("YYYY-MM-DD HH:mm:ss");
            let voz_convertida = null;
            let estado = "Sin convertir";
            if (extension.toLowerCase() === 'mp3') {
                archivo.mv(RUTA_GESTOR_ARCHIVOS + concurso + '/convertida/'+ idarchivo + "." + extension, function (err) {
                    if (err) {
                        console.log(err)
                        error(err)
                    }else{
                        save(observaciones, nombre,segundonombre,apellido,segundoapellido, estado, idarchivo + "." + extension, concurso, dateAudit, extension, voz_convertida,correo,url,error,success);
                    }
                });
                voz_convertida = concurso  + "_" + idarchivo+".mp3";
                estado = "Convertida";
                envioCorreo(correo, url);
            }else{
               save(observaciones, nombre,segundonombre,apellido,segundoapellido, estado, idarchivo + "." + extension, concurso, dateAudit, extension, voz_convertida,correo,url,error,success);
            }
            
           
        }
    });
    
}

function save( observaciones, nombre,segundonombre,apellido,segundoapellido, estado, voz_inicial, concurso, dateAudit, extension, voz_convertida,correo,url,error,success ){
    let idarchivo = uuidv4();
    var params = {
        TableName: 'archivos',
        Item: {
            idarchivos: idarchivo,
            observaciones: observaciones,
            nombre: nombre,
            apellido: apellido,
            segundonombre:segundonombre?segundonombre:null,
            segundoapellido:segundoapellido?segundoapellido:null,
            estado:estado,
            voz_inicial: voz_inicial,
            idconcurso: concurso,
            fecha: dateAudit,
            ext_voz_inicial:extension,
            voz_convertida: voz_convertida,
            correo,correo,
            ruta: url
          }
      };

      ddb.put(params,function(err,result){
      if(err){
          console.log(err)
          error(err);
      }else{
        success(result);
      }
    });
}

module.exports.obtenerArchxConcursoURL = (urlConcurso,start,limit, success, error) => {
    let startNum = start;
    let LimitNum = limit;
    if(start == '' || limit == ''){
        startNum = 0;
        LimitNum = 20;
    }

    var params = {
        TableName: 'archivos',
        FilterExpression : "ruta = :url",
        ExpressionAttributeValues : {":url": urlConcurso} 
      };
      ddb.scan(params,function(err,result){
        if(err){
            error(err);
        }else{
            console.log("-- archivosXurl "+JSON.stringify(result));
            success(result);
        }
    
    })

}


module.exports.obtenerArchxConcurso = (idconcurso,start,limit, success, error) => {
    let startNum = start;
    let LimitNum = limit;
    if(start == '' || limit == ''){
        startNum = 0;
        LimitNum = 50;
    }

    var params = {
        TableName: 'archivos',
        FilterExpression : "idconcurso = :idconcurso",
        ExpressionAttributeValues : {":idconcurso": idconcurso} 
      };
      ddb.scan(params,function(err,result){
        if(err){
            error(err);
        }else{
            console.log("-- archivosXcONCURSO"+JSON.stringify(result));
            result.url = result.ruta;
            console.log("-- archivosXcONCURSO_____"+JSON.stringify(result));
            success(result);
        }
    
    })
}

    module.exports.actualizarEstado = (idarchivos, voz_convertida, correo, ruta,idconcurso, success, error) => {
        var nombreCompleto = voz_convertida.split('.');
        var params = {
            TableName: 'archivos',
            Key:{
                idarchivos: idarchivos,
                idconcurso: idconcurso
            },
            UpdateExpression : "set estado = :estado, voz_convertida = :convertida",
            ExpressionAttributeValues : {
                ":estado": "Convertida",
                ":convertida":nombreCompleto[0]+'.mp3'
            },
            "ReturnValues" : "ALL_NEW"
          };

          ddb.update(params,function(err,result){
            if(err){
                console.log(err)
                error(err);
            }else{
                console.log("--  ACTUALIZAR ESTADO:"+JSON.stringify(result));
                envioCorreo(correo, ruta);
                success("ok");
            }
        
        })
    }


    module.exports.actualizarRuta = (ruta,idconcurso,success, error) => {
        var params = {
            TableName: 'archivos',
            FilterExpression : "idconcurso = :idconcurso",
            ExpressionAttributeValues : {":idconcurso": idconcurso} 
          };
        
          ddb.scan(params,function(err,result){
            if(err){
                console.log(err)
                error(err);
            }else{
                console.log("trajo datos --- "+JSON.stringify(result));
                if(result.Items.length>0){
                    for(var i=0;i<result.Items.length;i++){
               
                        var params = {
                            TableName: 'archivos',
                            Key:{
                                idarchivos: result.Items[i].idarchivos,
                                idconcurso: idconcurso
                            },
                            UpdateExpression : "set ruta = :ruta",
                            ExpressionAttributeValues : {
                                ":ruta": ruta
                            },
                            "ReturnValues" : "ALL_NEW"
                          };
                
                          ddb.update(params,function(err,result){
                            if(err){
                                console.log(err)
                                error(err);
                            }else{
                                console.log("--  ACTUALIZAR ESTADO:"+JSON.stringify(result));
                                success("ok");
                            }
                        
                        })
                    }  
                }else{
                    success("ok");
                }
                       
            }
        
        })
   }


    module.exports.prueba=(success,error)=>{
        envioCorreo("correo", "idconcurso");
        success("ok");
    }


    function envioCorreo(correo, urlConcurso) {
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
                      `<html><body><h1>Voz Procesada!!</h1> <p>Tú voz ha sido procesada, en este <a href ="http://34.201.182.142:8080/concurso/url/${urlConcurso}"> Concurso</a> ..Está lista para concursar!!'</p></body></html>`
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
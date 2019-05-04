'use strict';
var conf = require('./config.js');
const uuidv4 = require('uuid/v4');
var AWS = require('aws-sdk');
var guardarEnS3= require('./s3Storage');


AWS.config.update({
  region: 'us-east-1',
  accessKeyId:process.env.ACCES_KEY_ID,
  secretAccessKey:process.env.SECRET_ACCESS_KEY
});
var ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2018-03-24'});
var email = require('sendgrid')(process.env.SENDGRID_API_KEY);

const actualizarEstado = (idarchivos, voz_convertida, correo, ruta,idconcurso, success, error) => {
  var nombreCompleto = voz_convertida.split('.');
  var params = {
    TableName: 'archivos',
    Key:{
      idarchivos: idarchivos,
      idconcurso: idconcurso
    },
    UpdateExpression : 'set estado = :estado, voz_convertida = :convertida',
    ExpressionAttributeValues : {
      ':estado': 'Convertida',
      ':convertida':nombreCompleto[0]+'.mp3'
    },
    'ReturnValues' : 'ALL_NEW'
  };

  ddb.update(params,function(err,result){
    if(err){
      console.log(err);
      error(err);
    }else{
      console.log('--  ACTUALIZAR ESTADO:'+JSON.stringify(result));
      envioCorreo(correo, result.Attributes.ruta);
      success('ok');
    }
        
  });
};


const actualizarRuta = (ruta,idconcurso,success, error) => {
  var params = {
    TableName: 'archivos',
    FilterExpression : 'idconcurso = :idconcurso',
    ExpressionAttributeValues : {':idconcurso': idconcurso} 
  };
        
  ddb.scan(params,function(err,result){
    if(err){
      console.log(err);
      error(err);
    }else{
      console.log('trajo datos --- '+JSON.stringify(result));
      if(result.Items.length>0){
        for(var i=0;i<result.Items.length;i++){
               
          var params = {
            TableName: 'archivos',
            Key:{
              idarchivos: result.Items[i].idarchivos,
              idconcurso: idconcurso
            },
            UpdateExpression : 'set ruta = :ruta',
            ExpressionAttributeValues : {
              ':ruta': ruta
            },
            'ReturnValues' : 'ALL_NEW'
          };
                
          ddb.update(params,function(err,result){
            if(err){
              console.log(err);
              error(err);
            }else{
              console.log('--  ACTUALIZAR ESTADO:'+JSON.stringify(result));
            }
                        
          });
        }  
        success('ok');
      }else{
        success('ok');
      }
                       
    }
        
  });
};




function envioCorreo(correo, urlConcurso) {
  var request = email.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: 'grupo8.cloud@gmail.com',
            },
          ],
          subject: 'Voz procesada exitosamente',
        },
      ],
      from: {
        email: correo,
      },
      content: [
        {
          type: 'text/plain',
          value: `<html><body><h1>Voz Procesada!!</h1> <p>Tú voz ha sido procesada, en este <a href ="http://LoadBalancerWebServerD-480062229.us-east-1.elb.amazonaws.com/concurso/url/${urlConcurso}"> Concurso</a> ..Está lista para concursar!!'</p></body></html>` ,
        },
      ],
    },
  });


  

}

module.exports = {actualizarEstado,actualizarRuta};
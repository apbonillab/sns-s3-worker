'use strict'

const security = require('../services/security.srv');
const uuidv4 = require('uuid/v4');
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'us-east-1',
    accessKeyId:process.env.ACCES_KEY_ID,
    secretAccessKey:process.env.SECRET_ACCESS_KEY
});
var ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2018-03-24'});

module.exports.crearAdmin = (nombre,segundonombre,apellido,segundoapellido,correo,contrasena,success,error)=>{
    
    let idadmin = uuidv4();
    var params = {
        TableName: 'administrador',
        Item: {
            idadmin: idadmin,
            correo: correo,
            nombre: nombre,
            apellido: apellido,
            segundonombre:segundonombre?segundonombre:null,
            segundoapellido:segundoapellido?segundoapellido:null,
            contrasena:contrasena
          }
      };

      ddb.put(params,function(err,result){
      if(err){
          console.log(err)
          error(err);
      }else{
        success(idadmin);
      }
    });
}


module.exports.autenticarAdmin = (correo, contrasena, success, error) => {
    var params = {
        TableName: 'administrador',
        FilterExpression : "correo = :correo",
        ExpressionAttributeValues : {":correo": correo} 
      };
    ddb.scan(params,function(err,result){
        if(err){
            error(err);
        }else{
            if(result.Items[0]!=undefined){
                if (result.Items[0].contrasena === contrasena) {
                    let user = result.Items[0].idadmin;
                    let correo = result.Items[0].correo;
                    security.generateToken(correo).then(function(result){
                        success({'exito':true,'JWToken':result,'iduser':user,'correo':correo});
                  });
                    
                }else{
                    error({'exito':false,'message': 'Contraseña errada'});
                }
            }else{
                error({'exito':false,'message': 'Correo no registrado'});
            } 
        }
    
    })

}
   
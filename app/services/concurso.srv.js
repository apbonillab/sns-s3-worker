'use strict'

var fs = require('fs');
var conf = require('../../config.js');
const archivos = require('../services/archivos.srv');
const RUTA_GESTOR_ARCHIVOS = conf.get('ruta_gestion_archivos')
const RUTA_GESTOR_ARCHIVOS_RAIZ = conf.get('ruta_gestion_archivos_raiz')
const uuidv4 = require('uuid/v4');
var AWS = require('aws-sdk');
var memcach = require('../../memcached');
// Set the region 
AWS.config.update({
    region: 'us-east-1',
    accessKeyId:process.env.ACCES_KEY_ID,
    secretAccessKey:process.env.SECRET_ACCESS_KEY
});
var ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2018-03-24'});
const s3 = require('../../s3Storage');
const URLS3 = conf.get('URLS3')

module.exports.crear = (nombre,fecha_inicio,fecha_fin,valor,guion,recomendaciones,url,banner,idcuentaadmin,success,error)=>{
    let nameBanner
    banner===null?nameBanner='no-image':nameBanner=banner.name;
    let idconcurso = uuidv4();
   
var params = {
    TableName: 'concursos',
    Item: {
        idconcurso: idconcurso,
        fecha_inicio : fecha_inicio,
        fecha_fin : fecha_fin,
        valor : valor,
        guion : guion,
        recomendaciones : recomendaciones,
        ruta : url,
        banner : nameBanner,
        nombre : nombre,
        admin : idcuentaadmin
      }
  };

  ddb.put(params,function(err,data){
      console.log("entro");
    if(err){
        console.log(err)
        error(err);
    }else{
       /* //Si es correcto se crea la carpeta del concurso para la gestion de archivos
                if(!fs.existsSync(RUTA_GESTOR_ARCHIVOS_RAIZ))
                     fs.mkdirSync(RUTA_GESTOR_ARCHIVOS_RAIZ);
                fs.mkdirSync(RUTA_GESTOR_ARCHIVOS+idconcurso);
                fs.mkdirSync(RUTA_GESTOR_ARCHIVOS+idconcurso+'//inicial');
                fs.mkdirSync(RUTA_GESTOR_ARCHIVOS+idconcurso+'//convertida');
                if(banner!==null){
                    let filename=`concurso-${idconcurso}/${banner.name}`;
                    s3.saveFileToS3(filename,banner.data,false,);
                    /*banner.mv(RUTA_GESTOR_ARCHIVOS+idconcurso+`//${banner.name}`,function(err){
                        if(err){
                            return res.status(500).send(err);
                        }
                        success(idconcurso);
                    });
                    success(idconcurso);
                }
                else{
                    success(idconcurso);
                }*/
        if(banner!==null){
            let filename=`concurso-${idconcurso}/${banner.name}`;
            s3.saveFileToS3(filename,banner.data,false,"","","",success);        
        }
    }       
    })
}


module.exports.mostrarConcursoXURL = (urlconcurso,success,error)=>{
    var params = {
        TableName: 'concursos',
        FilterExpression : "ruta = :url",
        ExpressionAttributeValues : {":url": urlconcurso} 
    };
    ddb.scan(params,function(err,result){
        if(err){
            error(err);
        }else{
            if(result.Items.length>0){
                result.Items[0]['url']=result.Items[0].ruta;
            }            
            success(result);
        }
    
    })
    
}

module.exports.mostrarConcursosXUsuario = (idcuentaadmin,success,error)=>{

   var params = {
        TableName: 'concursos',
        FilterExpression : "admin = :creador",
        ExpressionAttributeValues : {":creador": idcuentaadmin}
      };
    
      ddb.scan(params,function(err,result){
        if(err){
            error(err);
        }else{
            for(var i=0;i<result.Items.length;i++){
                result.Items[i]['url']=result.Items[i].ruta;
            }
            success(result);
        }
    
    })
}

module.exports.mostrarConcursos = (success,error)=>{
    var params = {
        TableName: 'concursos',
    };
    ddb.scan(params,async function(err,result){
        if(err){
            error(err);
        }else{
            for(var i=0;i<10;i++){
                result.Items[i]['url']=result.Items[i].ruta;
                let item={nombre:result.Items[i].nombre,
                    url:result.Items[i].url}
                console.log("resultado: ",item);
                //memcach.putCache(i.toString(), JSON.stringify(item));
                await memcach.putCache(result.Items[i].url, result.Items[i].nombre);
            }

            success(result);
        }
    })
    
}

module.exports.eliminarArchivosXconcurso = (idconcursos,idadmin,success,error)=>{
    var params = {
        TableName: 'concursos',
        Key:{
            idconcurso: idconcursos,
            admin: idadmin
        }
      };
    
    ddb.delete(params,function(err,result){
        if(err){
            error(err);
        }else{
            deleteFolderRecursive(RUTA_GESTOR_ARCHIVOS+idconcursos);
            let route=`concurso-${idconcursos}`;
            console.log("concurso a borrar :", route);
            s3.deleteBucketFolder(route);
            success(result);
        }

    })
}

const deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
    var curPath = path + "/" + file;
    if(fs.lstatSync(curPath).isDirectory()) { // recurse
    deleteFolderRecursive(curPath);
          } else { // delete file
    fs.unlinkSync(curPath);
          }
        });
    fs.rmdirSync(path);
      }
    };

module.exports.editar = (idconcursos,nombre,fecha_inicio,fecha_fin,valor,guion,recomendaciones,url,banner,idadmin,success,error)=>{
   console.log(fecha_inicio)
    var params = {
        TableName: 'concursos',
        Key:{
            idconcurso: idconcursos,
            admin: idadmin
        },
        UpdateExpression : "set nombre = :nombre, fecha_inicio = :fecha_inicio, fecha_fin=:fecha_fin, valor=:valor, guion=:guion, recomendaciones=:recomendaciones, ruta=:url, banner=:banner",
        ExpressionAttributeValues : {
            ":nombre": nombre,
            ":fecha_inicio":fecha_inicio,
            ":fecha_fin": fecha_fin,
            ":valor" : valor,
            ":guion" : guion,
            ":recomendaciones":recomendaciones,
            ":url":url,
            ":banner":banner        
        },
        "ReturnValues": "ALL_NEW"
      };
    
      ddb.update(params,function(err,result){
        if(err){
            error(err);
        }else{
            archivos.actualizarRuta(url,idconcursos, function (archivos) {
                success("ok");  
            },function(error){
                console.log(error);
                  
            })
    
        }
    })
}

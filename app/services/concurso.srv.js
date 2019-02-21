'use strict'

const mysql = require('mysql');
const connection = require('../../db');
const security = require('./security.srv');
var fs = require('fs');
var conf = require('../../config.js');
const RUTA_GESTOR_ARCHIVOS = conf.get('ruta_gestion_archivos')
const RUTA_GESTOR_ARCHIVOS_RAIZ = conf.get('ruta_gestion_archivos_raiz')

module.exports.crear = (nombre,fecha_inicio,fecha_fin,valor,guion,recomendaciones,url,banner,idcuentaadmin,success,error)=>{
    let nameBanner
    banner===null?nameBanner='no-image':nameBanner=banner.name;
    let userData = [[nombre,fecha_inicio,fecha_fin,valor,guion,recomendaciones,url,nameBanner]];
    connection.query(`insert into concursos (nombre,fecha_inicio,fecha_fin,valor,guion,recomendaciones,url,banner) values ? `,
    [userData],function(err,result,fields){
        if(err){
            error(err);
        }
        let idconcurso = result.insertId;
        let concurso = [[idconcurso,idcuentaadmin]];
        connection.query(`insert into gestion_concurso (concursos,creador) values ? `,
        [concurso],function(err,result,fields){
            if(err){
                error(err);
            }else{
                //Si es correcto se crea la carpeta del concurso para la gestion de archivos
                console.log(RUTA_GESTOR_ARCHIVOS+idconcurso);
                if(!fs.existsSync(RUTA_GESTOR_ARCHIVOS_RAIZ))
                     fs.mkdirSync(RUTA_GESTOR_ARCHIVOS_RAIZ);
                fs.mkdirSync(RUTA_GESTOR_ARCHIVOS+idconcurso);
                fs.mkdirSync(RUTA_GESTOR_ARCHIVOS+idconcurso+'//inicial');
                fs.mkdirSync(RUTA_GESTOR_ARCHIVOS+idconcurso+'//convertida');
                if(banner!==null){
                    banner.mv(RUTA_GESTOR_ARCHIVOS+idconcurso+`//${banner.name}`,function(err){
                        if(err){
                            return res.status(500).send(err);
                        }
                        success(result);
                    });
                }
                else{
                    success(result);
                }
            }
         
            
        })
    })
}


module.exports.mostrarTodos = (success,error)=>{
    connection.query(`select * from concursos`,function(err,result,fields){
        if(err){
            error(err);
        }else{
            success(result);
        }
    
    })
}

module.exports.mostrarTodosVigentes = (success,error)=>{
    connection.query(`select c.* from concursos c
     inner join gestion_concurso as gc on gc.concursos = c.idconcursos
     where gc.archivo_ganador is null and
     fecha_fin > curdate() and fecha_inicio<fecha_fin;`,function(err,result,fields){
        if(err){
            error(err);
        }else{
            success(result);
        }
    
    })
}

module.exports.seleccionganador = (idarchivo,idconcurso,success,error)=>{
    connection.query(`update gestion_concurso set archivo_ganador = ${idarchivo} where concursos = ${idconcurso}`
    ,function(err,result,fields){
        if(err){
            error(err);
            console.log(err);
        }else{
            success(result);
        }

    })
}

module.exports.mostrarConcursoXURL = (urlconcurso,success,error)=>{
    connection.query(`select * from concursos where url = '${urlconcurso}'`,function(err,result,fields){
        if(err){
            error(err);
            console.log(err);
        }else{
            success(result);
        }

    })
}

module.exports.mostrarConcursoXid = (idconcurso,success,error)=>{
    connection.query(`select * from concursos where idconcursos = '${idconcurso}'`,function(err,result,fields){
        if(err){
            error(err);
            console.log(err);
        }else{
            success(result);
        }

    })
}

module.exports.mostrarConcursosXUsuario = (idcuentaadmin,success,error)=>{
    connection.query(`Select c.idconcursos 'idconcurso',
    c.fecha_inicio 'fecha_inicio', c.fecha_fin 'fecha_fin',
    c.valor 'valor',
    c.guion 'guion' ,
    c.recomendaciones 'recomendaciones',
    c.url 'url',
    c.banner 'banner',
    c.nombre 'nombre'
    from gestion_concurso as gc
    inner join concursos as c on c.idconcursos = gc.concursos
    where gc.creador = ${idcuentaadmin}`,function(err,result,fields){
        if(err){
            error(err);
        }else{
            success(result);
        }

    })
}

        

module.exports.eliminarArchivosXconcurso = (idconcursos,success,error)=>{
    connection.query(`delete from archivos where concurso = ${idconcursos}`,function(err,result,fields){
        if(err){
            error(err);
        }
        connection.query(`delete from gestion_concurso where concursos = ${idconcursos}`,function(err,result,fields){
            if(err){
                error(err);
            }
            connection.query(`delete from concursos where idconcursos = ${idconcursos}`,function(err,result,fields){
                if(err){
                    error(err);
                }else{
                    deleteFolderRecursive(RUTA_GESTOR_ARCHIVOS+idconcursos);
                    success(result);
                }
            })
        })
    })
}

  var deleteFolderRecursive = function(path) {
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

module.exports.editar = (idconcursos,nombre,fecha_inicio,fecha_fin,valor,guion,recomendaciones,url,banner,success,error)=>{
    let data = [nombre,fecha_inicio,fecha_fin,valor,guion,recomendaciones,url,banner,idconcursos];
    connection.query(`update concursos set nombre=?, fecha_inicio = ?, fecha_fin=?, valor=?, guion=?, recomendaciones=?, url=?, banner=? where idconcursos = ?`,
    data,function(err,result,fields){
         if(err){
             console.log(err);
             error(err);
         }else{
             console.log(result)
            success(result);
         }
        
     });
 }

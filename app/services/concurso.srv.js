'use strict'

const mysql = require('mysql');
const connection = require('../../db');
const security = require('./security.srv');
var fs = require('fs');
var conf = require('../../config.js');
const RUTA_GESTOR_ARCHIVOS = conf.get('ruta_gestion_archivos')
const RUTA_GESTOR_ARCHIVOS_RAIZ = conf.get('ruta_gestion_archivos_raiz')


module.exports.crear = (nombre,fecha_inicio,fecha_fin,valor,guion,recomendaciones,url,banner,idcuentaadmin,success,error)=>{
    let userData = [[nombre,fecha_inicio,fecha_fin,valor,guion,recomendaciones,url,banner]];
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
                success(result);
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
                    success(result);
                }
            })
        })
    })
}

module.exports.editar = (idconcursos,nombre,fecha_inicio,fecha_fin,valor,guion,recomendaciones,url,banner,success,error)=>{
    connection.query(`update concursos set
    nombre="${nombre}",
    fecha_inicio = "${fecha_inicio}",
    fecha_fin="${fecha_fin}",
    valor="${valor}",
    guion="${guion}",
    correo="${correo}",
    recomendaciones=${recomendaciones},
    url=${url},
    banner=${banner},
    where idconcursos = ${idconcursos}`,function(err,result,fields){
         if(err){
             error(err);
         }else{
            success(result);
         }
        
     });
 }

'use strict'

const mysql = require('mysql');
const connection = require('../../db');
const security = require('./security.srv');

module.exports.crear = (nombre,fecha_inicio,fecha_fin,valor,guion,recomendaciones,url,banner,idusuario,success,error)=>{
    let userData = [[nombre,fecha_inicio,fecha_fin,valor,guion,recomendaciones,url,banner]];
    connection.query(`insert into concursos (nombre,fecha_inicio,fecha_fin,valor,guion,recomendaciones,url,banner) values ? `,
    [userData],function(err,result,fields){
        if(err){
            error(err);
        }
        let userData = [[result.idconcurso,idusuario]];
        connection.query(`insert into gestion_concurso (concursos,creador) values ? `,
        [userData],function(err,result,fields){
            if(err){
                error(err);
            }
            success(result);
        })
    })
}


module.exports.mostrarTodos = (success,error)=>{
    connection.query(`select * from concursos`,function(err,result,fields){
        if(err){
            error(err);
        }
        success(result);
    })
}

module.exports.mostrarConcursoXid = (idconcursos,success,error)=>{
    connection.query(`select * from concursos where idconcursos = ${idconcursos}`,function(err,result,fields){
        if(err){
            error(err);
        }
        success(result);
    })
}

module.exports.mostrarConcursosXUsuario = (idusuario,success,error)=>{
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
    where gc.creador = ${idusuario}`,function(err,result,fields){
        if(err){
            error(err);
        }
        success(result);
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
                }
                success(result);
            })
        })
    })
}


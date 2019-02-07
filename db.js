'use strict';

const mysql = require('mysql');
var conf = require('./config.js');

let connection;
var dbParams;
dbParams = conf.get('db');


function connectDB(){
    if(!connection){
        connection = mysql.createConnection({
            host: dbParams.host,
            user: dbParams.user,
            password: dbParams.password,
            database: dbParams.database,
            timeoutBeforeReconnection: dbParams.timeoutBeforeReconnection
          });
        connection.connect((err)=>{
            if(!err)
                console.log(`Conexion BD ${dbParams.database} OK`);
            else
                console.log(`Conexion errada BD ${dbParams.database}: ` + err);
        })
    }
    return connection;
}


  module.exports = connectDB();

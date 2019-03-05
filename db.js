'use strict';

const mysql = require('mysql');
var conf = require('./config.js');

let connection;
var dbParams;
dbParams = conf.get('db');


function connectDB(){
    console.log( process.env.HOST)
    if(!connection){
        
        connection = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            port: process.env.PORT,
            password: process.env.PASSWORD_DB,
            database: process.env.DATABASE,
            timeoutBeforeReconnection: process.env.timeoutBeforeReconnection
          });
        connection.connect((err)=>{
            if(!err)
                console.log(`Conexion BD ${process.env.DATABASE} OK`);
            else
                console.log(`Conexion errada BD ${process.env.DATABASE}: ` + err);
        })
    }
    return connection;
}


  module.exports = connectDB();

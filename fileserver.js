var http = require("http");
var fs = require("fs");
var path = require ("path");

http.createServer(function(req, res){
    console.log(`${req.method} request for ${req.url}`);
    if(req.url === '/'){
        fs.readFile("../front/src/App.js", function (err, js) {
            res.writeHead(200, {"Content-Type":"text/html"});
            res.end(js);
        });
    }else{
        res.writeHead(404,{"Content-Type":"text/plain"});
        res.end("404 File Not Found");
    }
}).listen(3000);
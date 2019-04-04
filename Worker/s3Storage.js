var AWS = require('aws-sdk');
const s3empty = require('s3-bucket-empty');


AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.ACCES_KEY_ID_S3,
  secretAccessKey: process.env.SECRET_ACCESS_KEY_S3
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01'
});

const s3Conf = {
  "S3_SECRET": process.env.SECRET_ACCESS_KEY_S3,
  "S3_ACCESS_KEY": process.env.ACCES_KEY_ID_S3,
  "S3_REGION": 'us-east-1'
};

module.exports.guardarArchivoEnS3 = (route, name, file) => {
  console.log("bucket: ", route);
  console.log("key: ", name);
  s3.createBucket({
    Bucket: route
  }, function (err, data) {
    if (err) {
      console.log(err);
      return 0;
    }
    if(!s3.getBucketCors){
      configureCors(route);
    }
    let params = {
      Bucket: route,
      Key: name,
      ACL: 'public-read',
      Body: file,
    };
    s3.putObject(params, function (err, data) {
      if (err) {
        console.log(err);
        return 0;
      }

      const textResponse = 'Successfully uploaded data to ' + route + '/' + name;
      console.log(textResponse);
    });

  });
}

const configureCors = (bucket)=>{
  var params = {
    Bucket: bucket, 
    CORSConfiguration: {
     CORSRules: [
        {
       AllowedHeaders: [
          "*"
       ], 
       AllowedMethods: [
          "PUT", 
          "POST", 
          "DELETE"
       ], 
       AllowedOrigins: [
          "*"
       ], 
       ExposeHeaders: [
          "x-amz-server-side-encryption"
       ], 
       MaxAgeSeconds: 3000
      }, 
        {
       AllowedHeaders: [
          "Authorization"
       ], 
       AllowedMethods: [
          "GET"
       ], 
       AllowedOrigins: [
          "*"
       ], 
       MaxAgeSeconds: 3000
      }
     ]
    }, 
    ContentMD5: ""
   };
   s3.putBucketCors(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     //else     console.log(data);           // successful response
   });

}

module.exports.borrarBucket = (route,callback) => {
    /*console.log("Entra a borrar");
    clearBucket(s3,route);
    
    s3.listObjects(route,function(err,data){
      console.log("contenido del bucket a borrar: ",data);
      if(data.Contents){
        console.log("contenido del bucket a borrar: ",data.Contents);
        clearBucket(s3,route);
        borrarBucket(route);
      }else{
        s3.deleteBucket(params,function(err,data){
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log("Bucket borrado: ",data);
        });
      }
    });*/
    let params ={
      Bucket : route,
    };
    console.log("Bucket a borrar: ",params.Bucket);
    s3empty.empty(s3Conf, route)
       .then(() => {
        console.log('s3empty done');
        s3.deleteBucket(params,function(err,data){
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log("Bucket borrado: ",data);
        });

    });
    
}

module.exports.listarBucket = (route) => {
  let params = {
    Bucket: route,
  };

  s3.listObjects(params, function (err, data) {
      if (err) return callback(err);
      console.log("Lista de objetos en bucket: ",data);
      console.log("Numero de objetos: ",data.Contents.length);
      if (data.Contents.length == 0) callback();
      params.Delete = {
        Objects: []
      };
      data.Contents.forEach(function (content) {
        params.Delete.Objects.push({
          Key: content.Key
        });
      });
  });
}

const clearBucket =(client, bucket) => {
  var self = this;
  client.listObjects({Bucket: bucket}, function (err, data) {
      if (err) {
          console.log("error listing bucket objects "+err);
          return;
      }
      var items = data.Contents;
      console.log("items :", items);
      for (var i = 0; i < items.length; i += 1) {
          var deleteParams = {Bucket: bucket, Key: items[i].Key};
          //self.deleteObject(client, deleteParams);
          s3.deleteObject(deleteParams, function(err,data){
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          })
      }
  });
}
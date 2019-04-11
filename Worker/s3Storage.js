var AWS = require('aws-sdk');
var aws_sqs = require ('./sqs')
var conf= require('./config/config.json')
const dotenv = require('dotenv');

dotenv.config( {path: './environments/worker.env'});

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.ACCES_KEY_ID_S3,
  secretAccessKey: process.env.SECRET_ACCESS_KEY_S3
});

console.log('Variables de entorno',process.env);

const s3 = new AWS.S3({
  apiVersion: '2006-03-01'
});

const s3Conf = {
  "S3_SECRET": process.env.SECRET_ACCESS_KEY_S3,
  "S3_ACCESS_KEY": process.env.ACCES_KEY_ID_S3,
  "S3_REGION": 'us-east-1'
};

module.exports.saveFileToS3 = (name, file, toSqs) => {
  let bucketname= 'voces-thevoice'
  console.log("key: ", name);
  console.log("Bucket name: ", bucketname);
  s3.createBucket({
    Bucket: bucketname
  }, function (err, data) {
    if (err) {
      console.log("error de bucket: ",err);
      return 0;
    }
    console.log("CORS del bucket :",s3.getBucketCors.data);
    if(!s3.getBucketCors.data){
      configureCors(bucketname);
    }
    let params = {
      Bucket: bucketname,
      Key: name,
      ACL: 'public-read',
      Body: file,
    };
    s3.putObject(params, function (err, data) {
      if (err) {
        console.log(err);
        return 0;
      }
      const textResponse = 'Successfully uploaded data to ' + bucketname + '/' + name;
      console.log(textResponse);
    });
    let urlSqs=`${conf.URLS3}/${bucketname}/${name}`;
    if(toSqs){
      console.log("url sqs: ",urlSqs);
      aws_sqs.inQueue(urlSqs);
    }
    listBucketKeys(name);

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

module.exports.deleteBucketFolder = (raiz) => {

  let split = raiz.split('/');
  let dir =split[0]+"/";
  emptyBucket(dir);    
}

const listBucketKeys = (key)=>{
  var split = key.split('/');
  var raiz = split[0];
  console.log("directorio raiz: ", raiz);
  let params={
    Bucket: 'voces-thevoice',
    Prefix: raiz,
  }
  s3.listObjectsV2(params,function(err,data){
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

const emptyBucket = (dir) =>{
  let currentData;
  let bucketname ='voces-thevoice';
  let params = {
      Bucket: bucketname,
      Prefix: dir
  };

  return s3.listObjects(params).promise().then(data => {
      if (data.Contents.length === 0) {
          throw new Error('List of objects empty.');
      }

      currentData = data;

      params = {Bucket: bucketname};
      params.Delete = {Objects:[]};

      currentData.Contents.forEach(content => {
          params.Delete.Objects.push({Key: content.Key});
      });

      return s3.deleteObjects(params).promise();
  }).then(() => {
      if (currentData.Contents.length === 1000) {
          emptyBucket(dir, callback);
      } else {
          return true;
      }
  });
}
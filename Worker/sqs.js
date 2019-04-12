var AWS = require ('aws-sdk');
var conversorService = require('./conversor.srv');
const dotenv = require('dotenv');

dotenv.config( {path: './environments/worker.env'});

AWS.config.update({
  region: 'us-east-2',
  accessKeyId:process.env.ACCES_KEY_ID_SQS,
  secretAccessKey:process.env.SECRET_ACCESS_KEY_SQS,
});

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const queueURL = 'https://sqs.us-east-2.amazonaws.com/760376241675/WorkerSQS.fifo';

module.exports.inQueue = (urlInicial) =>{
  var params = {
    MessageGroupId: 'Voces',
    MessageBody: urlInicial,
    QueueUrl: queueURL
  };
  sqs.sendMessage(params, function(err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Success', data.MessageId);
    }
  });
};

const deQueue = () =>{
  var params = {
    AttributeNames: [
      'SentTimestamp'
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
      'All'
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 20
  };
   
  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.log('Receive Error', err);
    } else if (data.Messages) {
      console.log('Mensaje: ',data.Messages[0]);
      convertirVoz(data.Messages[0]);
    }
  });
};

const convertirVoz = (message) =>{
  let urlS3 = message.Body;
  let receiptHandle = message.ReceiptHandle;
  //console.log('URL array: ',urlS3.split('/'));
  conversorService.convertirAudio(urlS3,() => {
    console.log('success');
    onVoiceProcessed(receiptHandle);
  },
  (msg) =>{
    console.log('ERROR: ',msg);
  });
};

const onVoiceProcessed = (handle) => {
  var deleteParams = {
    QueueUrl: queueURL,
    ReceiptHandle: handle
  };
  sqs.deleteMessage(deleteParams, function(err, data) {
    if (err) {
      console.log('Delete Error', err);
    } else {
      console.log('Message Deleted', data);
    }
  });
};

deQueue();
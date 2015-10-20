import fs from 'fs';
import config from '../../config/config.js';
import path from 'path';
import express from 'express';
import streamBuffers from 'stream-buffers';

import stream from 'stream';

import multipart from 'connect-multiparty';
let router = express.Router(),
  multipartMiddleware = multipart(),
  db = null,
  flow = null,
  ACCESS_CONTROLL_ALLOW_ORIGIN = true;

module.exports = function (app, createClient, Flow) {
  app.use('/', router);
  db = createClient();
  flow = Flow;
};


// Handle uploads through Flow.js
router.post('/upload', multipartMiddleware, function (req, res) {
  flow.post(req, function (status, filename, original_filename, identifier) {
    console.log('POST', status, original_filename, identifier);
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }
    if (status === 'done') {
      if (!config.useRiak) {
        let destination = config.storageDir + '/' + identifier;
        let writeFile = fs.createWriteStream(destination);
        flow.write(identifier, writeFile);
        writeFile.on('finish', function () {

          flow.clean(identifier);
        })
      } else {
        var myWritableStreamBuffer = new streamBuffers.WritableStreamBuffer();
        flow.write(identifier, myWritableStreamBuffer);
        myWritableStreamBuffer.on('finish', function(){
          db.storeValue({
            bucket: 'images',
            key: identifier,
            value: myWritableStreamBuffer.getContentsAsString('utf-8')
          }, function(err, rslt){
            if (!err){
              res.status(201).send();
            }
          });
        })

      }
    }
    res.status(status).send();
  });
});

router.options('/upload', function (req, res) {
  console.log('OPTIONS');
  if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.status(200).send();
});

// Handle status checks on chunks through Flow.js
router.get('/upload', function (req, res) {
  flow.get(req, function (status, filename, original_filename, identifier) {
    console.log('GET', status);
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }

    if (status == 'found') {
      status = 200;
    } else {
      status = 204;
    }

    res.status(status).send();
  });
});

router.get('/download/:identifier', function (req, res) {

  if (!config.useRiak) {
    res.status(200).sendFile(path.resolve(config.storageDir + '/' + req.params.identifier));
  } else {
    db.fetchValue({
      bucket: 'images',
      key: req.params.identifier,

    }, function(err, rslt){
      let rObj = rslt.values.shift();
      let content = rObj.value;
      res.send(content.toString());
    })
  }

});

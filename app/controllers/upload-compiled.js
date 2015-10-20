'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _configConfigJs = require('../../config/config.js');

var _configConfigJs2 = _interopRequireDefault(_configConfigJs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _connectMultiparty = require('connect-multiparty');

var _connectMultiparty2 = _interopRequireDefault(_connectMultiparty);

var router = _express2['default'].Router(),
    multipartMiddleware = (0, _connectMultiparty2['default'])(),
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
      if (!_configConfigJs2['default'].useRiak) {
        var destination = _configConfigJs2['default'].storageDir + '/' + identifier;
        var writeFile = _fs2['default'].createWriteStream(destination);
        flow.write(identifier, writeFile);
        writeFile.on('finish', function () {

          flow.clean(identifier);
        });
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

  if (!_configConfigJs2['default'].useRiak) {
    res.status(200).sendFile(_path2['default'].resolve(_configConfigJs2['default'].storageDir + '/' + req.params.identifier));
  }
});

//# sourceMappingURL=upload-compiled.js.map
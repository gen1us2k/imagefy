

var express = require('express'),
  config = require('./config/config'),
  flow = require('./libs/flow-node.js')('tmp');

var app = express();

require('./config/express')(app, config, flow);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});


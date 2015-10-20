'use strict';

var express = require('express'),
    config = require('./config/config'),
    flow = require('./libs/flow-node.js')('tmp');

var babel = require('babel/register');

var app = express();

require('./config/express')(app, config, flow);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

//# sourceMappingURL=app-compiled.js.map
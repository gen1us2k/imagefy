var http = require('http')
	, formidable = require('formidable')
	, fs = require('fs')
	, qs = require('querystring')
	, util = require('util')
	, uploads = {};

http.createServer(function(req, res){
	if(req.method == 'GET') {
		if(req.url != '/favicon.ico') {
			
			res.writeHead(200, {'Content-Type' : resolveType(req)});

			var url = __dirname;
			if(req.url != '/') url += '/public' + req.url;
			else url += '/views/index.html';

			var readStream = fs.createReadStream(url)
				.pipe(res)
				.on('error', function(o_O){
					console.log(o_O);
				});
		} else {
			res.end();
		}
	}
	if(req.method == 'POST') {
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files){
			if (err) {
				console.error(err.message);
				return;
			}
			res.writeHead(200, {'content-type': 'text/plain'});
			if(fields.name) {
				
				if(!uploads[fields.name]) { // new upload
					console.log('new upload ', fields.name);
					
					uploads[fields.name] = {
						chunk: 0,
						size: fields.size,
						content: '',
						total: fields.size / 272144
					};

				} else {
					console.log('got chunk ', uploads[fields.name].chunk);
					uploads[fields.name].chunk++;
					console.log(fields);
					uploads[fields.name].content += fields.data;
				}
				if(uploads[fields.name].chunk < uploads[fields.name].total) {
					console.log('requesting ', uploads[fields.name].chunk, ' out of ', uploads[fields.name].total);
					res.end('chunk' + uploads[fields.name].chunk);
				}
				else {
					console.log('complete');
					
					res.end('upload complete');
				}
			}
		});
	}

}).listen(3000, function(){
	console.log("Express server listening on port 3000");
});

var resolveType = function(req) {
	var extension = req.url.split('.');
	extension = extension[extension.length-1];
	if(extension == 'js') return 'text/javascript';
	else if(extension == 'css') return 'text/css';
		else return 'text/html';
};
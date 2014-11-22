var http = require('http');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');

http.createServer(function (req, res) {

	var reqUrl = req.url;
	//console.log(req);
	
	switch(reqUrl){
		case '/api':
			//POSTare su questi url le richieste alla API per ottenere risposte in json
			//console.log('api request');
			//console.log(req);
			
			var POST = "";

			req.on("data", function(chunk) {
				POST += chunk;
				console.log(POST);
				
				if (POST.length > 1e6){
					req.end("Too much data!");
				}
                		
				var post = qs.parse(POST);
				console.log(post);
				
				var data = require('./include/'+post.file+'.js');
				switch(post.action){
					case 'save':
						//GESTIRE QUI AUTENTICAZIONE
						var resObj = data.saveRecord(post.class, post.data);
					break;
					
					case 'filter':
						var resObj = data.filterRecords(post.class, post.id, post.field, post.key);
					break;
					
					default:
						var resObj = data.getRecords(post.class, post.id);
				}
				
				res.writeHeader(200, {"Content-Type": "text/plain"});  
				//res.write(data.resObj);
				res.write(resObj);
				res.end();
			});
			
		break;
		
		default:
			var filePath = './client' + reqUrl;
			console.log('Serving template: '+filePath);
			
			if ((filePath == './client') || (filePath == './client/')){
				filePath = './client/index.html';
			}
				
		
			var extname = path.extname(filePath);
			var contentType = 'text/html';
			switch (extname) {
				case '.html':
					contentType = 'text/html';
					break;
				case '.js':
					contentType = 'text/javascript';
					break;
				case '.css':
					contentType = 'text/css';
					break;
				case '.json':
					contentType = 'application/json';
					break;
				default:
					contentType = 'text/plain';
					
				
			}
	
			fs.exists(filePath, function(exists) {
	
				if (exists) {
					fs.readFile(filePath, function(error, content) {
						if (error) {
							res.writeHead(500);
							res.end();
						}
						else {
							res.writeHead(200, { 'Content-Type': contentType });
							res.end(content, 'utf-8');
						}
					});
				}
				else {
					res.writeHead(404);
					res.end();
				}
			});
	}

	
	
	
	
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

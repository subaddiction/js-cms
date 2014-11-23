var http = require('http');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var sqlite3 = require('sqlite3').verbose();

var file = "data.db";
var exists = fs.existsSync(file);
var db = new sqlite3.Database(file);

//db.serialize(function() {
//    db.run("CREATE TABLE IF NOT EXISTS people (id INT(11), name TEXT)");
//});

//var sql = require('./include/sqlite3.js');



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
				
				switch(post.action){
					case 'insert':
						//GESTIRE QUI AUTENTICAZIONE [CHECK TOKEN]
						//var resObj = sql.insert(db, post.table, post.data);
					break;
					
					case 'update':
						//GESTIRE QUI AUTENTICAZIONE [CHECK TOKEN]
						//var resObj = sql.update(db, post.table, post.data);
					break;
					
					default:
					
						//INSERIRE CONTROLLO TABELLE INTERROGABILI
						
						//var resObj = sql.select(db, post.table, post.data);
						if(post.data){
							var data = JSON.parse(post.data);
						}
						//console.log(typeof(data));
						if(!data){
							var q = "SELECT * FROM "+post.table+" WHERE 1";
							console.log(q);
						} else {
			
							var q = "SELECT * FROM "+post.table+" WHERE ";
							for(i in data){
								// INSERIRE CONTROLLO CAMPI INTERROGABILI?
								q+= i+"="+"'"+data[i]+"'";
								q+= " AND ";
								//console.log(data[i])
							}
							q += "1";
			
							console.log(q);
						}
						
						if(!post.limit || post.limit >100){
							q += " LIMIT 100";	
						} else {
							q += " LIMIT "+parseInt(post.limit);
						}
						
						var result = Array();
						db.each(q, function(err, row) {
							//console.log(row);
							result.push(row);
							
			
						}, function(){
							//console.log(result);
							res.writeHeader(200, {"Content-Type": "text/plain"});
							res.write(JSON.stringify(result));
							res.end();
						});
				}
				
				
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

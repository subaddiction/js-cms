var http = require('http');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var sqlite3 = require('sqlite3').verbose();
var sql = require('./include/sqlite3.js');

var file = "data.db";
var exists = fs.existsSync(file);
var db = new sqlite3.Database(file);

var userToken = 'secrettoken';
var adminToken = 'supersecrettoken';


//db.serialize(function() {
//    db.run("CREATE TABLE IF NOT EXISTS people (id INT(11), name TEXT)");
//});

//var sql = require('./include/sqlite3.js');



http.createServer(function (req, res) {

	var reqUrl = req.url;
	//console.log(reqUrl);
	var reqArr = reqUrl.split("/");
	//console.log(reqArr);
	
	switch(reqArr[1]){
		case 'api':
			//POSTare su questi url le richieste alla API per ottenere risposte in json
			//console.log('api request');
			//console.log(req);
			
			var POST = "";

			req.on("data", function(chunk) {
				POST += chunk;
				//console.log(POST);
				
				if (POST.length > 1e6){
					req.end("Too much data!");
				}
                		
				var post = qs.parse(POST);
//				console.log(post);
//				var data = false;
//				if(post.data){
//					data = JSON.parse(post.data);
//				}
				
				
				var auth = false;
				if(post.token == userToken){
					auth = 512;
					var user = {id:1,name:'user'}
				}
				
				if(post.token == adminToken){
					auth = 1024;
					var user = {id:0,name:'admin'}
				}
				
				//GESTIONE LIVELLI ACCESSO QUI ??
				switch(post.table){
					case 'people':
					case 'events':
						//PUBLIC READABLE, USER WRITABLE
						if(post.action && !auth){
							res.writeHeader(401);
							res.end();
						}
					break;
					
					case 'orders':
						//PUBLIC WRITABLE, ADMIN READABLE, USER CAN READ OWN RECORDS
						if(!post.action){
							if(auth <= 512){
								post.where = {user:+user.id};
							}
							//post
							
						} else {
							if(post.action == 'insert'){
							
							} else if(auth < 1024){
								res.writeHeader(401);
								res.end();
							}
						
						}
					break;
					
					case 'users':
						//ADMIN READABLE/WRITABLE
						if(auth < 1024){
							res.writeHeader(401);
							res.end();
						}
					break;
					
					default:
						res.writeHeader(401);
						res.end();
				}
				
				var limit = parseInt(post.limit) || 10;
				
				switch(post.action){
					case 'insert':
						//GESTIRE QUI AUTENTICAZIONE [CHECK TOKEN] ?
						sql.insert(res, db, post.table, post);

					break;
					
					case 'update':
						//GESTIRE QUI AUTENTICAZIONE [CHECK TOKEN] ?
						sql.update(res, db, post.table, post);
						
					break;
					
					default:
						sql.select(res, db, post.table, limit, post);
						//console.log(result);
						
						
						
						//INSERIRE CONTROLLO TABELLE INTERROGABILI?
						
						
						/****************************************************************
						if(!data){
							var q = "SELECT * FROM "+post.table+" WHERE 1";
						} else {
			
							var q = "SELECT * FROM "+post.table+" WHERE ";
							for(i in data){
								// INSERIRE CONTROLLO CAMPI INTERROGABILI?
								q+= i+"="+"'"+data[i]+"'";
								q+= " AND ";
								//console.log(data[i])
							}
							q += "1";
						}
						
						if(!post.limit || post.limit >100){
							q += " LIMIT 100";	
						} else {
							q += " LIMIT "+parseInt(post.limit);
						}
						
						console.log(q);
						
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
						***********************************************************/
				}
				
				
			});
			
		break;
		
		case 'api2':
			switch(reqArr[2]){
			
				case 'get':
					switch(reqArr[3]){
						default:
						res.writeHeader(401);
						res.end();
						
					}
				break;
				
				case 'post':
					switch(reqArr[3]){
						default:
						res.writeHeader(401);
						res.end();
						
					}
					
					
				break;
				
				default:
					
			}
		break;
		
		default:
			var filePath = './client' + reqUrl;
			console.log('Template: '+filePath);
			
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

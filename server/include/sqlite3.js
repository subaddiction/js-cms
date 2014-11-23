

var resObjStatic = "[{\"name\":\"marco\"},{\"name\":\"paolo\"}]";


module.exports = {
	
//	writeResponse: function(result){
//		console.log(result);
//	},
	
	select: function(res, db, table, limit, post){
		
		//data = JSON.parse(data);
		//console.log(typeof(data));
		//console.log(data)
		var columnData = Array();
		
		for(i in post){
			if (i.substr(0,5) === "where"){
				var column = "";
				var fieldLength = i.length -7;
				var column = i.substr(6,fieldLength);
				
				columnData[column] = post[i];
				//console.log(data[i])
			}
		}
			
		if(!columnData){
			var q = "SELECT * FROM "+table+" WHERE 1";
		} else {
			
			var q = "SELECT * FROM "+table+" WHERE ";
			for(i in columnData){
				q+= i+"="+"'"+columnData[i]+"'";
				q+= " AND ";
				//console.log(data[i])
			}
			q += "1";
		}
		
		
		q += " LIMIT "+limit;
		
		console.log(q);
		
		
		var result = Array();
		
		
		db.each(q, function(err, row) {
			//console.log(row);
			result.push(row);
		
		}, function(e, n){
			//console.log(e);
			//console.log(n);
			//console.log(result);
			
			res.writeHeader(200, {"Content-Type": "text/plain"});
			res.write(JSON.stringify(result));
			res.end();
			//return result;
		});
		
//		function writeResponse(rows){
//			console.log(rows);
//			result = JSON.stringify(rows);
//			return result;
//		}
		
		
		
	},
	
	insert: function(res, db, table, post){
		
		var columnData = Array();
		
		for(i in post){
			if (i.substr(0,4) === "data"){
				var column = "";
				var fieldLength = i.length -6;
				var column = i.substr(5,fieldLength);
				
				columnData[column] = post[i];
				//console.log(data[i])
			}
		}
		
		
	
		if(!columnData){
		
		} else {
		
		}
		
		res.writeHeader(200, {"Content-Type": "text/plain"});
		res.write("{id:1}");
		res.end();
		
	},
	
	update: function(res, db, table, post){
		
		var columnData = Array();
		
		if(!columnData){
		
		} else {
		
		}
		
		res.writeHeader(200, {"Content-Type": "text/plain"});
		res.write("{id:1}");
		res.end();
		
	}
	
	
};

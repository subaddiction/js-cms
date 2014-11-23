

var resObjStatic = "[{\"name\":\"marco\"},{\"name\":\"paolo\"}]";


module.exports = {
	
	select: function(db, table, data){
		
		data = JSON.parse(data);
		//console.log(typeof(data));
			
		if(!data){
			var q = "SELECT * FROM "+table+" WHERE 1";
		} else {
			
			var q = "SELECT * FROM "+table+" WHERE ";
			for(i in data){
				q+= i+"="+"'"+data[i]+"'";
				q+= " AND ";
				//console.log(data[i])
			}
			q += "1";
			
			console.log(q);
		}
		
		
		var result = Array();
		var response = db.each(q, function(err, row) {
			//console.log(row);
			result.push(row);
			//console.log(result);
			
		}, function(){
			console.log(result);
		});

		console.log(response);
		//AAAAAAAAAAAAAAAAARRRGH!!!
		return resObjStatic;
		
		
		
	},
	
	insert: function(db, table, data){
		data = JSON.parse(data);
		if(!data){
		
		} else {
		
		}
		
		return "{id:1}"
	},
	
	update: function(db, table, data){
		data = JSON.parse(data);
		if(!data){
		
		} else {
		
		}
		
		return "{id:1}"
	}
	
	
};

function tmplData(apiReq, template, target){

	$(target).html('');
	$.post('/api', apiReq, function(data){
		
		var dataObj = JSON.parse(data);
		
		$.get('tmpl/'+template, function(markup){
			$.tmpl( markup, dataObj ).appendTo( target );
		});
	});
}

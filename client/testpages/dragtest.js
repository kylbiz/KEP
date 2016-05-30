// $(function(){ 
// 	$('.jq22').dad();
// });

Template.dragtest.onRendered(function () {
	$('.jq22').dad({
		draggable: 'span'
	});
	$('.jq11').dad({
		draggable: 'a'
	});
});

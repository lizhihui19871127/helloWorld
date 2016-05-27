define('common:widget/tips/tips.js', function(require, exports, module){ var tips = (function(){
	
	var defaults = {
		title: '提示',
		content: '欢迎使用Tips！',	//换行请用<br />
		type: 'normal', //['alert','error','correct','normal']
      	position : 'right' //['bottom','top','right','left']
	};
	
	var initOptions = function(opts){
		return $.extend(defaults, opts);
	};
	
	var initStyle = function(obj, opts){
		
		var obj_position = obj.position(),
			obj_width = obj.width(),
			obj_height = obj.height(),
			position = 'left:'+(obj_position.left+obj_width+10)+'px;top:'+obj_position.top+'px;';
		
		if(opts.position == 'bottom'){
			position = 'left:'+obj_position.left+'px;top:'+(obj_position.top+obj.height()+10)+'px;';
		}
		if(opts.position == 'top'){
			position = 'left:'+obj_position.left+'px;bottom:'+(obj_position.top+obj.height()+10)+'px;';
		};
		if(opts.position == 'left'){
			position = 'right:'+(obj_position.left+obj_width+10)+'px;top:'+obj_position.top+'px;';
		};
		
		return position;
	};
	
	var createTips = function(obj, opts){
		var id = 'tips-box-'+Math.ceil(Math.random()*10000000),
			position = initStyle(obj, opts),
			_dom = '<div id="'+id+'" class="tips-box tips-'+opts.type+'" style="'+position+'">';
		
		_dom += '<span class="tips-title">'+opts.title+'</span>';
		_dom += '<p>'+opts.content+'</p>';
		_dom += '<em class="tips-ico"></em>';
		_dom += '<em class="tips-arrow-'+opts.position+'"></em>';
		_dom += '</div>';
		
		if(obj.next().is('.tips-box')){
			obj.next('.tips-box').replaceWith(_dom);
		}else{
			obj.after(_dom);
		};
	}
	
	var showTips = function(obj, opts){
		obj = $(obj);
		
		var obj_display = obj.css("display"),
			tag = 'div';
		
		if(!obj.parents().is('div')){
			tag = 'body';
		};
		obj.parent().closest(tag).css('position','relative');
		
		opts = initOptions(opts);
		createTips(obj, opts);
	};
	
	var hideTips = function(obj){
		obj = $(obj);
		obj.next('.tips-box').remove();
	};
	
	return {
		show: showTips,
		hide: hideTips
	};
})();

module.exports = tips;
 
});
define('common:widget/dialog/dialog.js', function(require, exports, module){ var dialog = (function(){

	var _opts = {
		showCover : true,
		disableScroll : true,
		blurHide : true,
		coverOpacity : 0.5,
		backgroundColor : "#000",
		width : 400,
		height : 100,
        beforeCloseCallback : function(){},
        afterCloseCallback : function(){}
	};

	var _hideDialog = function(){
        _opts.beforeCloseCallback(); 

		_cover.hide();
		_scroll.enable();
		_dialog.hide();

        _opts.afterCloseCallback();
	};
	
	var _scroll = (function(){
		var _disableEvent = function(e){
				e.preventDefault();
		};
		var _disable = function(){
			$("body").on("mousewheel",_disableEvent);
		};
		var _enable = function(){
			$("body").off("mousewheel",_disableEvent);
		};
		return {
			enable : _enable,
			disable : _disable
		};
	})();

	var _cover = (function(){
		var _dom = $("<div class='cover'></div>");
		var _initStyle = function(){

            var height = $("body").height() > $(window).height() ? $("body").height() : $(window).height();

			$(_dom).css({
				"height" : height,
				"width" : $("body").width(),
				"opacity" : _opts.coverOpacity,
				"backgroundColor" : _opts.backgroundColor,
				"zIndex" : 1023
			});

			//bind the close event
			if(_opts.blurHide){
				$(_dom).on('click',_hideDialog);
			}
		};
		var _show = function(){
			_initStyle();
			$("body").append(_dom);
		};
		var _hide = function(){
			$(_dom).remove();
		};

		return {
			show : _show,
			hide : _hide,
			initStyle : _initStyle
		};
	})();

	var _dialog = (function(){
		var _dom = $("<div class='dialog'><a href='javascript:void(0)' class='close'></a><h2 class='title'></h2><p class='content'></p></div>");
		
		var _initStyle = function(){
			/*
			$(_dom).css({
				"height" : _opts.height,
				"width" : _opts.width,
				"left" : ($(window).width() - _opts.width) / 2,
				"top" : ($(window).height() - _opts.height) / 2
			});
			*/
			$(_dom).css({
				"left" : ($(window).width() - $(_dom).width()) / 2,
				"top" : ($(window).height() - $(_dom).height()) / 2
			});
		};
		var _show = function(title,content){

			$(_dom).find("h2.title").html(title);
			$(_dom).find("p.content").html(content);

			//_initStyle();
            //bind the close button event
            $(_dom).find("a.close").on("click",_hideDialog);
	

			$("body").append(_dom);
			setTimeout(_initStyle,1);

		};
		var _hide = function(){
			$(_dom).remove();
		};

	
		return {
			show : _show,
			hide : _hide,
			initStyle : _initStyle
		};
	})();

	var _showDialog = function(title,content,opts){

		$.extend(_opts,opts || {});	

		_scroll.disable();

		if(_opts.showCover){
			_cover.show();
		}

		_dialog.show(title,content);
	};
	
	

	return {
		show : _showDialog,
		refreshStyle : _dialog.initStyle,
        close : _hideDialog
	};
})();

module.exports = dialog;
 
});
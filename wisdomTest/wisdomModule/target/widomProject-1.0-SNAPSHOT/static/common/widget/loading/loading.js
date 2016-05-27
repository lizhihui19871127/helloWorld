define('common:widget/loading/loading.js', function(require, exports, module){ var Loading = (function(){
	
	var createShade = function(){
		var shade = document.createElement('div'),
			scrollTop = document.documentElement.scrollTop
				|| document.body.scrollTop,
			h = window.innerHeight
				|| document.documentElement.clientHeight
				|| document.body.clientHeight;
			
		h = h<480?'100%':(scrollTop + h + 'px');
				
		shade.id = 'Loading-shade';
		shade.className = 'Loading-opacity3';
		//shade.style.height = h;		
		
		document.body.appendChild(shade);
	};
	
	var creareLoading = function(){
		var loading = document.createElement('div'),
			scrollTop = document.documentElement.scrollTop
				|| document.body.scrollTop,
			h = window.innerHeight
				|| document.documentElement.clientHeight
				|| document.body.clientHeight;
		
		h = h<480?'40%':(scrollTop+(h-80)/2)+'px';		
		
		loading.id = 'Loading-gif';
		//loading.style.top = h;
		document.body.appendChild(loading);
	};
	
	var _start = function(opts){
		opts = opts ? opts : {shade:true};
		this.shade = "boolean" == typeof opts.shade ? opts.shade : true;
		if(this.shade){
			if(!document.getElementById('Loading-shade')){
				createShade();
			};
		};
		if(!document.getElementById('Loading-gif')){
			creareLoading();
		};
	};
	
	var _end = function(){
		if(document.getElementById('Loading-shade')){
			document.body.removeChild(document.getElementById('Loading-shade'));
		};
		if(document.getElementById('Loading-gif')){
			document.body.removeChild(document.getElementById('Loading-gif'));
		};
	};
	
	return {
		start : _start,
		end : _end
	};
})();

module.exports = Loading; 
});
define('common:widget/verifyCode/verifyCode.js', function(require, exports, module){ var $ = require("common:widget/jquery/jquery.js");

var verifyCode = (function(){
	var _url;

	var _reloadCode = function(){
		$(".verifyCodePanel").removeClass("hide");
		$('.verifyCodePanel img.verifyCodeImg').attr('src', _url + "?rnd=" + new Date().getTime() + parseInt(Math.random() * (10000)));	
	};
	
	var _bindEvent = function(){
		$(".verifyCodePanel a.reloadBtn").on("click",_reloadCode);
	};

	var _init = function(opts){
		opts = opts || {};
		_url = opts.url || "/verifycode/VerifyCodeAction.do";			
		_bindEvent();
	};

	return {
		init : _init,
		reload : _reloadCode
	};
})();

module.exports = verifyCode;
 
});
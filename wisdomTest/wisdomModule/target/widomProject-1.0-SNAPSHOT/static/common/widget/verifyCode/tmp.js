define('common:widget/verifyCode/tmp.js', function(require, exports, module){ var $ = require('common:widget/jquery/jquery.js');

var verifyCode = (function(){
	
	function init(){
		btnBindEvent();
	};
	function btnBindEvent(){
		$('#changeVerifyCodeBtn').click(function(){
			_reload();
		});
	};
	function _reload(){
		$('#_verifycode , #changeVerifyCodeBtn').show();
		$('#_verifycode').attr('src', "/verifycode/VerifyCodeAction.do?rnd=" + new Date().getTime() + parseInt(Math.random() * (10000)));
	};
	
	init();
	return {
		reload: _reload
	};
})();

module.exports = verifyCode; 
});
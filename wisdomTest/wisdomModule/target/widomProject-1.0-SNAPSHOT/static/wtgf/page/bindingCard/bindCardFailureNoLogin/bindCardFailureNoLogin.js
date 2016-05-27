var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js"),
	dialog = require("common:widget/dialog/dialog.js");
var main = (function(){
    var _init = function(){

    };

    var bindEvent = function(){

    };
	
    return {
        init : _init,
		bindEvent:bindEvent
    }
})();

$(function(){
    main.init();
	main.bindEvent();
    addWebtrends();
});

//页面嵌码
function addWebtrends(){
    var verifyBusiness = $("#verifyBusiness").val();
    var si_n = "添加银行卡";
    var si_x = "绑卡失败";
    if(verifyBusiness == "changeCard"){
        si_n = "银行卡换卡";
        si_x = "换卡失败";
    }else if(verifyBusiness == "webSign"){
        si_n = "网银签约";
        si_x = "网银签约失败";
    }
    var verifyMethod = $("#verifyMethod").val();
    if(verifyMethod == "D"){
        verifyMethod = "快捷";
    }else{
        verifyMethod = "网银";
    }
    window.WTjson = {
        "WT.si_n":si_n,
        "WT.si_x":si_x,
        "WT.pn_sku":$("#bankName").val(),
        "WT.pc":verifyMethod,
        "WT.err_type":$("#returnmsg").val()
    }
}


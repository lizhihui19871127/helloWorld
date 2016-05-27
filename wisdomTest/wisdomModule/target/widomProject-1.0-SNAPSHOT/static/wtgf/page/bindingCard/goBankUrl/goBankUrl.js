var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js"),
	dialog = require("common:widget/dialog/dialog.js");
var main = (function(){
    var _init = function(){
        loadData();
    };

    var bindEvent = function(){
    };
    return {
        init : _init,
		bindEvent:bindEvent
    }
})();

function loadData(){
    $("#frm").submit();
}

$(function(){
    main.init();
	main.bindEvent();
    addWebtrends();
});

//页面嵌码
function addWebtrends(){
    var verifyBusiness = $("#verifyBusiness").val();
    var si_n = "添加银行卡";
    if(verifyBusiness == "changeCard"){
        si_n = "银行卡换卡";
    }else if(verifyBusiness == "webSign"){
        si_n = "网银签约";
    }else if(verifyBusiness == "reCharge"){
        si_n = "钱袋子充值";
    }else if(verifyBusiness == "buyFund"){
        si_n = "基金认申购";
    }
    window.WTjson = {
        "WT.si_n":si_n,
        "WT.si_x":"验证银行卡"
    }
}


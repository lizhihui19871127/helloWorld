var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js");
	dialog = require("common:widget/dialog/dialog.js");
var $containerBank = $('.container-bank');
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


//ҳ��Ƕ��
function addWebtrends(){
    var verifyBusiness = $("#verifyBusiness").val();
    var si_n = "�������п�";
    var si_x = "�󿨳ɹ�";
    if(verifyBusiness == "changeCard"){
        si_n = "���п�����";
        si_x = "�����ɹ�";
    }else if(verifyBusiness == "webSign"){
        si_n = "����ǩԼ";
        si_x = "����ǩԼ�ɹ�";
    }
    var verifyMethod = $("#verifyMethod").val();
    if(verifyMethod == "D"){
        verifyMethod = "���";
    }else{
        verifyMethod = "����";
    }
    window.WTjson = {
        "WT.si_n":si_n,
        "WT.si_x":si_x,
        "WT.pn_sku":$("#bankName").val(),
        "WT.pc":verifyMethod
    }
}
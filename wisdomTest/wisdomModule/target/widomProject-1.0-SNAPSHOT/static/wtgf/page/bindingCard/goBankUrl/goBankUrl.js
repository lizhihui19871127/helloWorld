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

//ҳ��Ƕ��
function addWebtrends(){
    var verifyBusiness = $("#verifyBusiness").val();
    var si_n = "������п�";
    if(verifyBusiness == "changeCard"){
        si_n = "���п�����";
    }else if(verifyBusiness == "webSign"){
        si_n = "����ǩԼ";
    }else if(verifyBusiness == "reCharge"){
        si_n = "Ǯ���ӳ�ֵ";
    }else if(verifyBusiness == "buyFund"){
        si_n = "�������깺";
    }
    window.WTjson = {
        "WT.si_n":si_n,
        "WT.si_x":"��֤���п�"
    }
}


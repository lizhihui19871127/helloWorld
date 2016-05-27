var util = require("common:widget/util/util.js"),
    datepicker = require("common:widget/datepicker/datepicker.js"),
    juicer = require("common:widget/juicer/juicer.js"),
    dialog = require("common:widget/dialog/dialog.js"),
    menuCookie = require("wtgf:widget/menuCookie/menuCookie.js"),
    btn = require("common:widget/btn/btn.js");
var main = (function(){
    var _init = function(){
        menuCookie.cookie.menu();
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
    var si_n = "";
    var si_x = "";
    var fundCode = $("#fundCode").val();
    var fundName = $("#fundName").val();
    var amount = $("#amount").val();
    var payentry = "";
    var requestdate = $("#requestdate").val();
    if(requestdate != ""){
        var year = requestdate.split(".")[0];
        var month = requestdate.split(".")[1];
        var day = requestdate.split(".")[2];
        requestdate = month+"/"+day+"/"+year;
    }
    var bankName = $("#bankName").val();
    if(fundCode == "000509" || fundName == "�㷢Ǯ���ӻ���"){
        si_n = "Ǯ���ӳ�ֵ";
        si_x = "��ֵ�ɹ�";
    }else{
        si_n = "�������깺";
        si_x = "���깺�ɹ�";
    }
    var bankAcco = $("#bankAcco").val();
    if(bankAcco == "Ǯ����"){
        payentry = "Ǯ����";
        bankName = "Ǯ����";
    }else{
        payentry = "���п�";
    }
    window.WTjson = {
        "WT.si_n":si_n,
        "WT.si_x":si_x,
        "WT.pn_sku":fundCode,
        "WT.pc":fundName,
        "WT.tx_s":amount,
        "WT.tx_i":"",
        "WT.tx_id":requestdate,
        "WT.tx_it":"",
        "WT.payentry":payentry,
        "WT.paytype":"",
        "WT.paybank":bankName
    }
}
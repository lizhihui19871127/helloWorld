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
    if(verifyBusiness == "reCharge"){
        si_n = "Ǯ���ӳ�ֵ";
        si_x = "��ֵʧ��";
    }else if(verifyBusiness == "buyFund"){
        si_n = "�������깺";
        si_x = "���깺ʧ��";
    }

    window.WTjson = {
        "WT.si_n":si_n,
        "WT.si_x":si_x,
        "WT.pn_sku":"",
        "WT.pc":"",
        "WT.tx_s":"",
        "WT.tx_i":"",
        "WT.tx_id":"",
        "WT.tx_it":"",
        "WT.payentry":"",
        "WT.paytype":"",
        "WT.paybank":"",
        "WT.err_type":$("#returnmsg").val()
    }
}
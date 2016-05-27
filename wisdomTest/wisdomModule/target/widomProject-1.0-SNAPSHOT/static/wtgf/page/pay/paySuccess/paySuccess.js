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

//页面嵌码
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
    if(fundCode == "000509" || fundName == "广发钱袋子货币"){
        si_n = "钱袋子充值";
        si_x = "充值成功";
    }else{
        si_n = "基金认申购";
        si_x = "认申购成功";
    }
    var bankAcco = $("#bankAcco").val();
    if(bankAcco == "钱袋子"){
        payentry = "钱袋子";
        bankName = "钱袋子";
    }else{
        payentry = "银行卡";
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
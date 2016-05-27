var FormValidator = require("common:widget/validate/validate.js");

//页面初始化
function init(){

}

//页面绑定方法
function bindEvent() {
    $("input[id^=bankShowKey]").click(function(){
        $('input[id^=selectedBankImg]').attr("disabled","disabled");
        $('#selectedBankImg_'+ this.value).removeAttr("disabled");
        if(typeof(dcsPageTrack)=="function"){
            dcsPageTrack("WT.si_n","银行卡绑定",true,"WT.si_x","银行卡信息输入",true, "WT.paybank","xxx银行名字",true);
        }
    })

    $("input#bankShowKey:first").click();
}

//每个页面拷贝这个方法
$(function(){
    init();
    bindEvent();
});



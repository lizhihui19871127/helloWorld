define('wtgf:widget/sendMsg/sendMsg.js', function(require, exports, module){ var util = require("common:widget/util/util.js"),
    btn = require("common:widget/btn/btn.js"),
    modal = require("wtgf:widget/modal/modal.js");
var nIntervId;
var secondCount = 90;
var smsVFCodeTipsObj;
var main = (function(){
    var _init = function(){
    };

    var bindEvent = function(){
        //点击事件
        $("#verifyCodeBtn").click(function(e){
            sendMsg();
        });
    };

    var verifyCode = function(obj,mobilePhone,verifyCode,returnFunction){
        btn.setDisabled(obj);
        $.ajax({
            type: "post",
            url: "/main/checkVerifyCode",
            async: false,
            data: {"mobileNo": mobilePhone, "verifyCode": verifyCode},
            success: function (msg) {
                var msgJson = msg;
                btn.setEnabled(obj);
                if (!msgJson.issuccess) {
                    //验证失败
                    modal.showModal(msgJson.returnmsg);
                } else {
                    returnFunction();
                }
            }
        });
    };

    var clearCountDown = function(){
        btn.enable($("#verifyCodeBtn"));
        if(smsVFCodeTipsObj != undefined){
            $(smsVFCodeTipsObj).html('');
        }
        clearInterval(nIntervId);
        secondCount = 90;
    };

    return {
        init : _init,
        bindEvent:bindEvent,
        verifyCode:verifyCode,
        clearCountDown:clearCountDown
    }
})();

$(function(){
    main.init();
    main.bindEvent();
});

module.exports = main;

//发送短信
function sendMsg(){
    //如果手机号码不符合格式，就不会进行发送短信
    var telPhoneRegex = /^1\d{10}$/;
    var mobilePhone = $("#mobilePhone").val();
    if(mobilePhone == null || util.string.trim(mobilePhone) == ""){
        modal.showModal("手机号码不能为空。");
        return;
    }else if(!telPhoneRegex.test(mobilePhone)){
        modal.showModal("手机号码格式不对，请重新输入。");
        return;
    }
    $("#verifyCodeMsg").hide();
    smsVFCodeTipsObj = btn.disable($("#verifyCodeBtn"),{
        color:          '#C0C0C0',     //disable后字体的颜色
        height:'28px',
        setBtnLoad:     false        //是否显示Loading的gif图片
    });
    $.ajax({
        type: "post",
        url: "/main/register/verifyCode",
        data: {"mobilePhone":$('#mobilePhone').val()},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                //发送失败
                modal.showModal(msgJson.returnmsg);
                btn.enable($("#verifyCodeBtn"));
            } else {
                $("#verifyCodeMsg").show();
                $(smsVFCodeTipsObj).html('（'+(secondCount--)+'秒后重新获取）');
                nIntervId = setInterval(CountDown, 1000);
            }
        }
    });
}

//短信90秒倒计时
function CountDown(){
    $(smsVFCodeTipsObj).html('（'+secondCount+'秒后重新获取）');
    if(--secondCount<0){
        clearCountDown();
    }
}
//清除短信90秒倒计时任务
function clearCountDown(){
    btn.enable($("#verifyCodeBtn"));
    if(smsVFCodeTipsObj != undefined){
        $(smsVFCodeTipsObj).html('');
    }
    clearInterval(nIntervId);
    secondCount = 90;
} 
});
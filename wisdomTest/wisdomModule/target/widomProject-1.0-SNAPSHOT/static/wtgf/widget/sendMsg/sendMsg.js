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
        //����¼�
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
                    //��֤ʧ��
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

//���Ͷ���
function sendMsg(){
    //����ֻ����벻���ϸ�ʽ���Ͳ�����з��Ͷ���
    var telPhoneRegex = /^1\d{10}$/;
    var mobilePhone = $("#mobilePhone").val();
    if(mobilePhone == null || util.string.trim(mobilePhone) == ""){
        modal.showModal("�ֻ����벻��Ϊ�ա�");
        return;
    }else if(!telPhoneRegex.test(mobilePhone)){
        modal.showModal("�ֻ������ʽ���ԣ����������롣");
        return;
    }
    $("#verifyCodeMsg").hide();
    smsVFCodeTipsObj = btn.disable($("#verifyCodeBtn"),{
        color:          '#C0C0C0',     //disable���������ɫ
        height:'28px',
        setBtnLoad:     false        //�Ƿ���ʾLoading��gifͼƬ
    });
    $.ajax({
        type: "post",
        url: "/main/register/verifyCode",
        data: {"mobilePhone":$('#mobilePhone').val()},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                //����ʧ��
                modal.showModal(msgJson.returnmsg);
                btn.enable($("#verifyCodeBtn"));
            } else {
                $("#verifyCodeMsg").show();
                $(smsVFCodeTipsObj).html('��'+(secondCount--)+'������»�ȡ��');
                nIntervId = setInterval(CountDown, 1000);
            }
        }
    });
}

//����90�뵹��ʱ
function CountDown(){
    $(smsVFCodeTipsObj).html('��'+secondCount+'������»�ȡ��');
    if(--secondCount<0){
        clearCountDown();
    }
}
//�������90�뵹��ʱ����
function clearCountDown(){
    btn.enable($("#verifyCodeBtn"));
    if(smsVFCodeTipsObj != undefined){
        $(smsVFCodeTipsObj).html('');
    }
    clearInterval(nIntervId);
    secondCount = 90;
} 
});
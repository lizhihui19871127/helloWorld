var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js"),
	dialog = require("common:widget/dialog/dialog.js"),
    btn = require("common:widget/btn/btn.js"),
    FormValidator = require("common:widget/validate/validate.js");
var verifyToken;
//验证表单
var validateForm = null;
var main = (function(){
    var _init = function(){
        //初始化表单验证
        validateForm = new FormValidator(
            'frm',
            [{
                name:'agreeCheckbox',
                rules: 'callback_agreeProx',
                posTarget:$("#xyTips")
            },{
                name : 'mobileNo',
                display:'手机号码',
                rules : 'required|valid_tel_phone',
                posTarget:$("#mobileTips")
            },{
                name : 'verifyCode',
                display:'验证码',
                rules : 'required|numeric',
                posTarget:$("#getValidCode")
            }
            ],
            {
                success : function(datas,evt){  //异步提交请求
                    return  true
                },
                autoSubmit : true
            }
        );

        //必须同意协议
        validateForm.registerCallback('agreeProx',function(value){
            var v= $('#agreeCheckbox').prop("checked");
            if(!v){
                return false;
            }
            return true;
        });
        validateForm.setMessage('agreeProx','请阅读《广发基金快捷支付协议》');
    };

    var bindEvent = function(){
        $("#getValidCode").on('click',function(){
            smsVFCodeBtnClick();
        });
    };

    return {
        init : _init,
		bindEvent:bindEvent
    }
})();

$(function(){
    main.init();
	main.bindEvent();
});

//发送短信验证码
function smsVFCodeBtnClick() {
    if(validateForm.validateField('mobileNo') !=0)
    {
        return;
    }
    smsVFCodeTipsObj = btn.disable($("#getValidCode"),{
        color:          '#C0C0C0',     //disable后字体的颜色
        setBtnLoad:     false        //是否显示Loading的gif图片
    });
    $.ajax({
        type: "post",
        url: "/main/sms/send",
        data: {"bankNo": $('#bankNo').val(),"capitalMode":$('#capitalMode').val(),
            "bankAcco": $('#bankCardNo').val(),"mobileNo":$('#mobileNo').val(),
        "tradeAcco":$('#tradeAcco').val()},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                //发送失败
                $("#showInfoMsg").html(msgJson.returnmsg);
                $("#modal").modal('show');
                btn.enable($("#getValidCode"));
            } else {
                verifyToken = msgJson.verifyToken;
                $("#verifyToken").val(verifyToken);
                CountDown(90);
            }
        }
    });
}

// 倒计时
function CountDown(secs){
    $(smsVFCodeTipsObj).html('<span class="text-red text-fontsize16">（'+secs+'秒后重新获取）</span>');
    if(--secs>0){
        setTimeout("CountDown("+secs+")",1000);
    } else {
        btn.enable($("#getValidCode"));
        $(smsVFCodeTipsObj).html('');
    }
}

var util = require("common:widget/util/util.js"),
    btn = require("common:widget/btn/btn.js"),
    sendMsg = require("wtgf:widget/sendMsg/sendMsg.js"),
    modal = require("wtgf:widget/modal/modal.js"),
    FormValidator = require("common:widget/validate/validate.js");
var validateForm;
var main =(function(){
	var _init = function(){
        var identityNoAvailable = $("#identityNoAvailable").val();
        if(identityNoAvailable){
            validateForm = new FormValidator(
                'frm',
                [
                    {
                        name:'verifyCode',
                        display:'短信验证码',
                        rules: 'required|numeric|exact_length[6]',
                        posTarget : $("#verifyCodeBtn")
                    },
                    {
                        name:'identityNo',
                        display:'证件号码',
                        rules: 'required'
                    }
                ],
                {
                    success : function(datas,evt){  //异步提交请求
                        mobileValidate();
                        return  false;
                    },
                    autoSubmit:false
                }
            );
        }else{
            validateForm = new FormValidator(
                'frm',
                [{
                    name:'verifyCode',
                    display:'短信验证码',
                    rules: 'required|numeric|exact_length[6]',
                    posTarget : $("#verifyCodeBtn")
                }
                ],
                {
                    success : function(datas,evt){  //异步提交请求
                        mobileValidate();
                        return  false;
                    },
                    autoSubmit:false
                }
            );
        }
        initMobilePhone();
	};
	var bindEvent = function(){

	}
	return{
		init:_init,
		bindEvent:bindEvent
	}
})();

$(function(){
	main.init();
    main.bindEvent();
});

//初始化填充手机号码
function initMobilePhone(){
    $("#mobilePhone").attr("readonly",true);
    $("#mobilePhoneLabel").css("display","none");
}

//验证原来手机号码
function mobileValidate() {
    btn.setDisabled($('#nextBtn'));
    $.ajax({
        type: "post",
        url: "/main/resetPwd/mobileNoVaildate",
        async: false,
        data: {"mobileNo": $('#mobilePhone').val(), "verifyCode": $("#verifyCode").val(),"identityNo":$("#identityNo").val()},
        success: function (msg) {
            var msgJson = msg;
            btn.setEnabled($('#nextBtn'));
            if (!msgJson.issuccess) {
                //验证失败
                modal.showModal(msgJson.returnmsg);
                sendMsg.clearCountDown();
            } else {
                window.location.href="/main/resetLoginPwd/toResetLoginPwd";
            }
        }
    });
}
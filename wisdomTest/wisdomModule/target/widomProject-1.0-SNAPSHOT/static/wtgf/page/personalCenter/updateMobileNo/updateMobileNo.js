var util = require("common:widget/util/util.js"),
    btn = require("common:widget/btn/btn.js"),
    sendMsg = require("wtgf:widget/sendMsg/sendMsg.js"),
    modal = require("wtgf:widget/modal/modal.js"),
    FormValidator = require("common:widget/validate/validate.js");
var validateForm;
var main =(function(){
    var _init = function(){
        validateForm = new FormValidator(
            'frm',
            [
                {
                    name:'mobilePhone',
                    display:'手机号码',
                    rules: 'required|valid_tel_phone'
                },
                {
                    name:'verifyCode',
                    display:'短信验证码',
                    rules: 'required|numeric|exact_length[6]',
                    posTarget : $("#verifyCodeBtn")
                }
            ],
            {
                success : function(datas,evt){  //异步提交请求
                    checkVerifyCode();
                    return  false;
                }
            }
        );
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

//验证原来手机号码
function checkVerifyCode() {
    btn.setDisabled($('#next'));
    $.ajax({
        type: "post",
        url: "/main/personalCenter/changeMobileNo",
        async: false,
        data: {"mobileNo": $('#mobilePhone').val(), "verifyCode": $("#verifyCode").val()},
        success: function (msg) {
            var msgJson = msg;
            btn.setEnabled($('#next'));
            if (!msgJson.issuccess) {
                //验证失败
                modal.showModal(msgJson.returnmsg);
                sendMsg.clearCountDown();
            } else {
                window.location.href="/main/personalCenter/changeMobilePhoneSuccess";
            }
        }
    });
}

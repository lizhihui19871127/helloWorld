var util = require("common:widget/util/util.js"),
btn = require("common:widget/btn/btn.js"),
modal = require("wtgf:widget/modal/modal.js"),
verifyCode = require('common:widget/verifyCode/verifyCode.js'),
FormValidator = require("common:widget/validate/validate.js");
//验证表单
var validateForm = null;
var main = (function(){
    var _init = function(){
        //初始化表单验证
        validateForm = new FormValidator(
            'frm',
            [
                {
                    name : 'userName',
                    display:'账户名',
                    rules : 'required'
                },{
                    name : 'verifyCode',
                    display:'验证码',
                    rules : 'required'
                }
            ],
            {
                success : function(datas,evt){  //异步提交请求
                    checkUserName();
                },
                autoSubmit : false
            }
        );

        //验证码
        if($("#verifyCode")){
            verifyCode.init();
            verifyCode.reload();
            var isNew = false;
            $("#yanzm .reloadBtn").click(function(){
                isNew = true;
            });
            $("#verifyCode").on("focus",function(){
                if(!isNew){
                    verifyCode.reload();
                }else{
                    isNew = false;
                }
            });
        }
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
});

//验证原来手机号码
function checkUserName() {
    btn.setDisabled($('#nextbtn'));
    $.ajax({
        type: "post",
        url: "/main/resetPwd/checkUserName",
        async: false,
        data: {"userName": $('#userName').val(), "verifyCode": $("#verifyCode").val()},
        success: function (msg) {
            var msgJson = msg;
            btn.setEnabled($('#nextbtn'));
            if (!msgJson.issuccess) {
                //验证失败
                modal.showModal(msgJson.returnmsg);
            } else {
                window.location.href="/main/resetPwd/toSelectRestPwdStyle";
            }
        }
    });
}
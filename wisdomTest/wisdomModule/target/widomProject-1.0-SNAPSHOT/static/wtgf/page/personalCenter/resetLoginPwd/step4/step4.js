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
            [{
                name:'password',
                display:'登录密码',
                rules :  'required|no_blank|alpha_dash|min_length[6]|max_length[20]|callback_passwords'
            },{
                name:'passwordAgain',
                display:'重复登录密码',
                rules :  'required|matches[password]'
            }
            ],
            {
                success : function(datas,evt){  //异步提交请求
                    btn.setDisabled($('#nextBtn'));
                    resetPwd();
                },
                autoSubmit:false
            }
        );
        //交易密码不能含特殊字符
        validateForm.registerCallback('passwords',function(value){
            if("-".indexOf(value)>-1){
                return false;
            }
            //若全是字母
            if (/^\D+$/gi.test(value)) {
                if (/(\D)\1{2,}/g.test(value)) {
                    //msg = "不允许有3位或3位以上连续相同字符。（如：4个’a’）";  // 全一样
                    return false;
                }
            } else if (/^\d+$/gi.test(value)) {//全是数字
                if (/(\d)\1{2,}/g.test(value)) {
                    //msg = "不允许有3位或3位以上连续相同字符。（如：不允许3个’1’）";  // 全一样
                    return false;
                }
                for (var i = 0; i < value.length - 2; i++) {
                    var _first = parseInt(value.charAt(i));
                    var _middle = parseInt(value.charAt(i + 1));
                    var _end = parseInt(value.charAt(i + 2));
                    if ((_first + 1 == _middle) && (_middle + 1 == _end)) {
                        //msg = "密码全是数字时不允许有3位或3位以上连续数字.（如:不允许’123’）";
                        return false;
                    }
                    if ((_first - 1 == _middle) && (_middle - 1 == _end)) {
                        //msg = "密码全是数字时不允许有3位或3位以上连续数字.（如:不允许’543’）";
                        return false;
                    }
                }
            }
            return true;
        });
        validateForm.setMessage('passwords','密码只能是6-20位字母、数字或下划线组合，不能为简单密码');

        //交易密码，两次密码必须相等
        validateForm.registerCallback('passwords_equal',function(value){
            var v= $("#tradePasswdConfirm").val();
            if(v != value){
                return false;
            }
            return true;
        });
        validateForm.setMessage('passwords_equal','两次输入的密码不一致');
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

//重置登录密码
function resetPwd() {
    btn.setDisabled($('#nextBtn'));
    $.ajax({
        type: "post",
        url: "/main/resetPwd/resetPwd",
        async: false,
        data: {"password": $('#password').val()},
        success: function (msg) {
            var msgJson = msg;
            btn.setEnabled($('#nextBtn'));
            if (!msgJson.issuccess) {
                //验证失败
                modal.showModal(msgJson.returnmsg);
            } else {
                window.location.href = "/main/resetLoginPwd/resetPwdSuccess";
            }
        }
    });
}

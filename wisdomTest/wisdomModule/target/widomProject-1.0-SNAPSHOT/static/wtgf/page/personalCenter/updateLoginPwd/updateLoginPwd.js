var util = require("common:widget/util/util.js"),
    btn = require("common:widget/btn/btn.js"),
    modal = require("wtgf:widget/modal/modal.js"),
    FormValidator = require("common:widget/validate/validate.js");
var validateForm;
var main =(function(){
	var _init = function(){
		validateForm = new FormValidator(
            'frm',
            [
                {
                    name:'loginPwd',
                    display:'当前登录密码',
                    rules: 'required|no_blank|alpha_dash|min_length[6]|max_length[20]',
                    posTarget : $("#forgetPwd")
                },
                {
                    name:'newLoginPwd',
                    display:'新登录密码',
                    rules : 'required|no_blank|alpha_dash|min_length[6]|max_length[20]|callback_passwords',
                    posTarget:$("#tishi")
                },
                {
                    name:'againNewLoginPwd',
                    display:'确认新登录密码',
                    rules : 'required|matches[newLoginPwd]'
                }
            ],
            {
                success : function(datas,evt){  //异步提交请求
                    changePassword();
                    return  false;
                },
                autoSubmit:false
            });
            //登录密码不能含特殊字符
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
                var v= $("#newLoginPwd").val();
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

//修改登录密码
function changePassword() {
    btn.setDisabled($('#next'));
    $.ajax({
        type: "post",
        url: "/main/personalCenter/changePassword",
        async: false,
        data: {"oldPassword": $('#loginPwd').val(), "newPassword": $("#newLoginPwd").val()},
        success: function (msg) {
            var msgJson = msg;
            btn.setEnabled($('#next'));
            if (!msgJson.issuccess) {
                modal.showModal(msgJson.returnmsg);
            } else {
                modal.showModal("密码修改成功!");
                $("password").val("");
            }
        }
    });
}
var util = require("common:widget/util/util.js"),
btn = require("common:widget/btn/btn.js"),
modal = require("wtgf:widget/modal/modal.js"),
FormValidator = require("common:widget/validate/validate.js");
var verifyToken = "";
var nIntervId;
var secondCount = 90;
//验证表单
var validateForm = null;
var smsVFCodeTipsObj;
var main = (function(){
    var _init = function(){
        //初始化表单验证
        validateForm = new FormValidator(
            'frm',
            [
                {
                    name : 'mobilePhone',
                    display:'手机号码',
                    posTarget:$("#telNote"),
                    rules : 'required|valid_tel_phone'
                },{
                    name : 'verifyCode',
                    display:'验证码',
                    posTarget:$("#verifyCodeBtn"),
                    rules : 'required|numeric'
                },{
                    name : 'loginPassWord',
                    display:'登录密码',
                    posTarget:$("#pwdNote"),
                    rules :  'required|no_blank|min_length[6]|max_length[20]|callback_passwords'
                },{
                    name : 'loginPasswdConfirm',
                    display:'确认密码',
                    rules :  'required|matches[loginPassWord]'
                },
                {
                    name:'agreeCheckbox',
                    rules: 'callback_agreeProx',
                    posTarget:$("#qyxy")
                }
            ],
            {
                success : function(datas,evt){  //异步提交请求
                    if(checkTelExiste()){
                        return false;
                    }
                    submitForm();
                },
                autoSubmit : false
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
        validateForm.setMessage('passwords','6-20位数字、字母、符号等组合（分大小写）');

        //交易密码，两次密码必须相等
        validateForm.registerCallback('passwords_equal',function(value){
            var v= $("#loginPasswdConfirm").val();
            if(v != value){
                return false;
            }
            return true;
        });
        validateForm.setMessage('passwords_equal','两次输入的密码不一致');

        //必须同意协议
        validateForm.registerCallback('agreeProx',function(value){
            var v= $('#agreeCheckbox').prop("checked");
            if(!v){
                return false;
            }
            return true;
        });
        validateForm.setMessage('agreeProx','请阅读《广发基金服务协议》');
    };

    var bindEvent = function(){
        $("#verifyCodeBtn").click(function(){
            if(!checkTelExiste()){
                smsVFCodeBtnClick();
            }
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

//判断手机号码是否已经注册
function checkTelExiste(){
    var b = false;
    $.ajax({
        type: "post",
        url: "/main/register/checkTelExiste",
        async:false,
        data: {"mobilePhone":$("#mobilePhone").val()},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                modal.showModal(msgJson.returnmsg);
                b = true;
            }else{
                if(msgJson.isExiste){
                    modal.showModal("该手机号码已经注册。");
                    b = true;
                }
            }
        }
    });
    return b;
}

//发送短信验证码
function smsVFCodeBtnClick() {
    if(validateForm.validateField('mobilePhone') !=0)
    {
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
                verifyToken = "1";
                $("#verifyToken").val(verifyToken);
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

//提交
function submitForm(){
    if(verifyToken == null || verifyToken == ""){
        modal.showModal("请获取短信验证码。");
        return false;
    }else{
        btn.setDisabled($('#J_submitButton'));
        var type = 0;//默认是0(0:直销用户注册一账通；1:外部合作客户注册一账通)
        var url = "/main/register/addUser";
        var dataT = {"mobilePhone":$('#mobilePhone').val(),"verifyCode":$("#verifyCode").val(),"loginPassWord":$("#loginPassWord").val()};
        //这里判断是直销用户注册，还是外部合作用户注册
        var name = $("#name").val();
        if(name != null && name != ""){
            type = 1;
            url = "/main/register/otherAccountRegister";
            var name = $("#name").val();
            dataT = {"mobilePhone":$('#mobilePhone').val(),"verifyCode":$("#verifyCode").val(),"loginPassWord":$("#loginPassWord").val(),
                    "name":name,"identityType":$("#identityType").val(),"identityNo":$("#identityNo").val()};
        }
        $.ajax({
            type: "post",
            url: url,
            data:dataT,
            success: function (msg) {
                var msgJson = msg;
                if (!msgJson.issuccess) {
                    //注册失败
                    modal.showModal(msgJson.returnmsg);
                    btn.setEnabled($("#J_submitButton"));
                } else {
                    if(type == 0){
                        var id = msgJson.id;
                        window.location.href = "/main/register/success?id="+id;
                    }else{
                        window.location.href = "/main/register/otherAccountRegisterSuccess";
                    }
                }
            }
        });
    }
}
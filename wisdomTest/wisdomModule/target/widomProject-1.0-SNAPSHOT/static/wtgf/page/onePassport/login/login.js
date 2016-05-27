var util = require("common:widget/util/util.js"),
    verifyCode = require('common:widget/verifyCode/verifyCode.js'),
    btn = require("common:widget/btn/btn.js"),
    changePwd = require("wtgf:widget/changePwd/changePwd.js"),
    modal = require("wtgf:widget/modal/modal.js");
var _submitParam = {
    "loginType" : '0',
    "userName" : '',
    "tradePassword" : ''
};
var main = (function(){
    var _init = function(){
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
        //登录按钮点击事件
        $("#login").click(function(){
            submit();
        });

        $("#loginType").change(function(){
            var type = $(this).val();
            if(type == 0){
                $("#userName").attr("placeholder","手机号/证件号/昵称");
            }else{
                $("#userName").attr("placeholder","基金账号");
            }
        });

        //bind the enter key event
        $("#frm").on("keydown",function(e){
            if(e.keyCode == 13){
                submit();
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

var _enableSubmit = function(){
    btn.setEnabled($("#login"));
    $("#login").val("登录");
};

var _disabledSubmit = function(){
    //登录按钮置灰
    $("#login").attr("disabled","disabled");
    $("#login").css("background","#eeeeee");
    $("#login").css("border","0px");
    $("#login").css("background-image","url('/static/wtgf/img/pay/loading.gif')");
    $("#login").css("background-repeat","no-repeat");
    $("#login").css("background-position","133px 5px");
    $("#login").val("");
};

//判断表单内容
function checkForm(){
    var userName = $("#userName").val();
    var tradePassword = $("#tradePassword").val();
    userName = util.string.trim(userName);
    tradePassword = util.string.trim(tradePassword);
    if(userName == ""){
        modal.showModal("请输入账号号码。");
        return false;
    }
    if(tradePassword == ""){
        modal.showModal("请输入登录密码。");
        return false;
    }
    return true;
}

//提交表单
function submit(){
    //记录登陆时长
    var loginBeginTime = (new Date).getTime();
    util.cookie.set("loginBeginTime",loginBeginTime);
    _disabledSubmit();
    if(checkForm()){
        //表单验证通过
        _submitParam.loginType = $("#loginType").val();
        $("#userName").val(util.string.trim($("#userName").val()));
        _submitParam.userName = $("#userName").val();
        _submitParam.tradePassword = $("#tradePassword").val();
        _submitParam.goUrl = $.getUrlParam("gourl");

        if($("#yanzm").attr("display") != "none"){
            _submitParam.verifyCode = $("#verifyCode").val();
        }

        $.post("/main/login",_submitParam,function(ret){
            //记录登陆Controller所用时间
            var loginTime = (new Date()).getTime() - loginBeginTime;
            util.cookie.set("loginTime",loginTime);

            if(!ret){
                modal.showModal("登录失败，请稍后再试。");
                $("#yanzm").css("display","");
            }

            if(ret.errno == '0'){
                goToMain();
            }else if(ret.errno == '9990'){
                //纯一账通用户，也可以跳转至主页
                window.location.href="/main/main?from=login";
                return;
            }else if(ret.errno == '2021'){
                //金正用户修改密码
                changePwd.init();
                if(ret.data.mobileNum){
                    $("#changePwd .step2 .changePwd-mobileNum").html(ret.data.mobileNum);
                }
            }else{
                if(ret.data && ret.data.errMsg){
                    modal.showModal(ret.data.errMsg);
                }else{
                    modal.showModal("登录失败，请稍后再试。");
                }
                $("#yanzm").css("display","");
            }
            _enableSubmit();
        });

    }else{
        _enableSubmit();
        return false;
    }
}

//记录页面加载时间
window.onload = function(){
    if(window.GF_VIEWINFO.pageInitTime){
        var loginPageTime = (new Date()).getTime() - window.GF_VIEWINFO.pageInitTime;
        util.cookie.set("loginPageTime",loginPageTime);
    }
};

//登录成功，跳转到主页面
function goToMain(){
    var returnUrl = $.getUrlParam("gourl");

    if(returnUrl){
        returnUrl = "&goUrl=" + encodeURIComponent(returnUrl);
    }else{
        returnUrl = "";
    }

    //记录跳转到mainController之前的时间，用来统计mainController所用时间
    util.cookie.set("mainControllerBeginTime",(new Date()).getTime());
    window.location.href="/main/main?from=login" + returnUrl;

    return;
}


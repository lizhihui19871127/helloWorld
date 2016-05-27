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
        //��֤��
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
        //��¼��ť����¼�
        $("#login").click(function(){
            submit();
        });

        $("#loginType").change(function(){
            var type = $(this).val();
            if(type == 0){
                $("#userName").attr("placeholder","�ֻ���/֤����/�ǳ�");
            }else{
                $("#userName").attr("placeholder","�����˺�");
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
    $("#login").val("��¼");
};

var _disabledSubmit = function(){
    //��¼��ť�û�
    $("#login").attr("disabled","disabled");
    $("#login").css("background","#eeeeee");
    $("#login").css("border","0px");
    $("#login").css("background-image","url('/static/wtgf/img/pay/loading.gif')");
    $("#login").css("background-repeat","no-repeat");
    $("#login").css("background-position","133px 5px");
    $("#login").val("");
};

//�жϱ�����
function checkForm(){
    var userName = $("#userName").val();
    var tradePassword = $("#tradePassword").val();
    userName = util.string.trim(userName);
    tradePassword = util.string.trim(tradePassword);
    if(userName == ""){
        modal.showModal("�������˺ź��롣");
        return false;
    }
    if(tradePassword == ""){
        modal.showModal("�������¼���롣");
        return false;
    }
    return true;
}

//�ύ��
function submit(){
    //��¼��½ʱ��
    var loginBeginTime = (new Date).getTime();
    util.cookie.set("loginBeginTime",loginBeginTime);
    _disabledSubmit();
    if(checkForm()){
        //����֤ͨ��
        _submitParam.loginType = $("#loginType").val();
        $("#userName").val(util.string.trim($("#userName").val()));
        _submitParam.userName = $("#userName").val();
        _submitParam.tradePassword = $("#tradePassword").val();
        _submitParam.goUrl = $.getUrlParam("gourl");

        if($("#yanzm").attr("display") != "none"){
            _submitParam.verifyCode = $("#verifyCode").val();
        }

        $.post("/main/login",_submitParam,function(ret){
            //��¼��½Controller����ʱ��
            var loginTime = (new Date()).getTime() - loginBeginTime;
            util.cookie.set("loginTime",loginTime);

            if(!ret){
                modal.showModal("��¼ʧ�ܣ����Ժ����ԡ�");
                $("#yanzm").css("display","");
            }

            if(ret.errno == '0'){
                goToMain();
            }else if(ret.errno == '9990'){
                //��һ��ͨ�û���Ҳ������ת����ҳ
                window.location.href="/main/main?from=login";
                return;
            }else if(ret.errno == '2021'){
                //�����û��޸�����
                changePwd.init();
                if(ret.data.mobileNum){
                    $("#changePwd .step2 .changePwd-mobileNum").html(ret.data.mobileNum);
                }
            }else{
                if(ret.data && ret.data.errMsg){
                    modal.showModal(ret.data.errMsg);
                }else{
                    modal.showModal("��¼ʧ�ܣ����Ժ����ԡ�");
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

//��¼ҳ�����ʱ��
window.onload = function(){
    if(window.GF_VIEWINFO.pageInitTime){
        var loginPageTime = (new Date()).getTime() - window.GF_VIEWINFO.pageInitTime;
        util.cookie.set("loginPageTime",loginPageTime);
    }
};

//��¼�ɹ�����ת����ҳ��
function goToMain(){
    var returnUrl = $.getUrlParam("gourl");

    if(returnUrl){
        returnUrl = "&goUrl=" + encodeURIComponent(returnUrl);
    }else{
        returnUrl = "";
    }

    //��¼��ת��mainController֮ǰ��ʱ�䣬����ͳ��mainController����ʱ��
    util.cookie.set("mainControllerBeginTime",(new Date()).getTime());
    window.location.href="/main/main?from=login" + returnUrl;

    return;
}


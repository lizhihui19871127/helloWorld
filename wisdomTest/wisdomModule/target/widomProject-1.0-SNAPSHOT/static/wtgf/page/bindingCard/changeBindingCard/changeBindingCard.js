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
        var method = $("#method").val();
        if(method == "W"){
            //网银
            //初始化表单验证
            validateForm = new FormValidator(
                'frm',
                [{
                    name : 'newBankCardNo',
                    display:'银行卡号',
                    rules : 'required'
                }],
                {
                    success : function(datas,evt){  //异步提交请求
                        $("#newBankCardNo").val($("#newBankCardNo").val().replace(/[^\d]/g,''));
                        if(!checkBankCardExiste()){
                            return false;
                        }
                        submitForm(method);
                        return true;
                    },
                    autoSubmit:true
                }
            );
        }else if(method == "D"){
            //快捷
            //初始化表单验证
            validateForm = new FormValidator(
                'frm',
                [{
                    name : 'newBankCardNo',
                    display:'银行卡号',
                    rules : 'required'
                },{
                    name:'agreeCheckbox',
                    rules: 'callback_agreeProx',
                    posTarget:$("#xyTips")
                },{
                    name : 'mobileNo',
                    display:'手机号码',
                    posTarget:$("#mobileTips"),
                    rules : 'required|valid_tel_phone'
                },{
                    name : 'verifyCode',
                    display:'验证码',
                    rules : 'required|numeric',
                    posTarget:$("#getValidCode")
                }],
                {
                    success : function(datas,evt){  //异步提交请求
                        $("#newBankCardNo").val($("#newBankCardNo").val().replace(/[^\d]/g,''));
                        if(!checkBankCardExiste()){
                            return false;
                        }
                        submitForm(method);
                    }
                }
            );
        }
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
            $("#newBankCardNo").val($("#newBankCardNo").val().replace(/[^\d]/g,''));
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
    addWebtrends();
});

//页面嵌码
function addWebtrends(){
    window.WTjson = {
        "WT.si_n":"银行卡换卡",
        "WT.si_x":"确认银行卡信息"
    }
}

//发送短信验证码
function smsVFCodeBtnClick() {
    if(validateForm.validateField('newBankCardNo') != 0 ||
        validateForm.validateField('mobileNo') !=0)
    {
        return;
    }
    smsVFCodeTipsObj = btn.disable($("#getValidCode"),{
        color:          '#C0C0C0',     //disable后字体的颜色
        setBtnLoad:     false        //是否显示Loading的gif图片
    });
    if(typeof(dcsPageTrack)=="function"){
        dcsPageTrack("WT.si_n","银行卡换卡",true,"WT.si_x","验证银行卡",true);
    }
    $.ajax({
        type: "post",
        url: "/main/bankCards/verifyCode",
        data: {"bankNo": $('#bankNo').val(),"capitalMode":$('#capitalMode').val(),
            "bankCardNo": $('#newBankCardNo').val(),"mobilePhone":$('#mobileNo').val()},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                //发送失败
                $("#showInfoMsg").html(msgJson.returnmsg);
                $("#modal").modal('show');
                btn.enable($("#getValidCode"));
            } else {
                verifyToken = msgJson.verifySequence;
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

function submitForm(method){
    var oldBankCardNo = $("#oldBankCardNo").val();
    var newBankCardNo = $("#newBankCardNo").val();
    if(oldBankCardNo == newBankCardNo){
        //新卡号不能和旧卡号一样
        $("#showInfoMsg").html("换卡后的卡号不能和换卡前卡号一致。");
        $("#modal").modal('show');
        validateForm.autoSubmit = false;
        btn.setEnabled($('#subChange'));
    }else{
        var tradeAcco = $("#tradeAcco").val();
        if(method == "D"){
            validateForm.autoSubmit = false;
            $.ajax({
                type: "post",
                url: "/main/bankCards/"+tradeAcco+"/changeCard",
                data:{"tradeAcco":$("#tradeAcco").val(),"bankNo": $('#bankNo').val(),"bankCardNo": $('#newBankCardNo').val(),
                    "capitalMode":$('#capitalMode').val(),"verifyMethod":$("#method").val(),"verifyCode":$("#verifyCode").val(),
                    "verifySequence":$('#verifyToken').val(),"mobilePhone":$("#mobileNo").val(),"oldBankCardNo":$("#oldBankCardNo").val()},
                success: function (msg) {
                    var msgJson = msg;
                    if(msgJson.issuccess){
                        var verifySequence = $('#verifyToken').val();
                        window.location.href="/main/bankCards/"+verifySequence+"/success";
                    }else{
                        //失败了，要弹出失败框，展示失败原因
                        var returnmsg = msgJson.returnmsg;
                        $("#showInfoMsg").html(returnmsg);
                        $("#modal").modal('show');
                        btn.setEnabled($('#subChange'));
                    }
                }
            });
        }else if(method == "W"){
            validateForm.autoSubmit = true;
            $("#frm").attr("action","/main/bankCards/"+tradeAcco+"/changeCard");
            btn.setEnabled($('#subChange'));
        }
    }
}

function checkBankCardExiste(){
    btn.setDisabled($('#subChange'));
    var b = false;
    var bankCardNo = $('#newBankCardNo').val();
    var capitalMode = $('#capitalMode').val();
    $.ajax({
        type: "get",
        url: "/main/bankCards/"+bankCardNo+"/"+capitalMode+"/isExists",
        async:false,
        success: function (msg) {
            var msgJson = msg;
            if(!msgJson.issuccess){
                $("#showInfoMsg").html(msgJson.returnmsg);
                $("#modal").modal('show');
                b = false;
                btn.setEnabled($('#subChange'));
            }else if (msgJson.isExists) {
                //卡已经存在
                $("#showInfoMsg").html("该卡已绑定，不能重复绑卡。");
                $("#modal").modal('show');
                b = false;
                btn.setEnabled($('#subChange'));
            }else{
                //如果是快捷，判断是否已经获得正确的短信验证码。
                var verifyMethod = $("#method").val();
                if(verifyMethod == "D"){
                    if(verifyToken == null || verifyToken == ""){
                        $("#showInfoMsg").html("请获取短信验证码。");
                        $("#modal").modal('show');
                        b = false;
                        btn.setEnabled($('#subChange'));
                    }else{
                        b = true;
                    }
                }else{
                    b = true;
                }
            }
        }
    });
    return b;
}
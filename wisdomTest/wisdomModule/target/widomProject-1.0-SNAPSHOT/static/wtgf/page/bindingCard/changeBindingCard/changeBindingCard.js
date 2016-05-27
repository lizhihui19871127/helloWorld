var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js"),
	dialog = require("common:widget/dialog/dialog.js"),
    btn = require("common:widget/btn/btn.js"),
    FormValidator = require("common:widget/validate/validate.js");
var verifyToken;
//��֤��
var validateForm = null;
var main = (function(){
    var _init = function(){
        var method = $("#method").val();
        if(method == "W"){
            //����
            //��ʼ������֤
            validateForm = new FormValidator(
                'frm',
                [{
                    name : 'newBankCardNo',
                    display:'���п���',
                    rules : 'required'
                }],
                {
                    success : function(datas,evt){  //�첽�ύ����
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
            //���
            //��ʼ������֤
            validateForm = new FormValidator(
                'frm',
                [{
                    name : 'newBankCardNo',
                    display:'���п���',
                    rules : 'required'
                },{
                    name:'agreeCheckbox',
                    rules: 'callback_agreeProx',
                    posTarget:$("#xyTips")
                },{
                    name : 'mobileNo',
                    display:'�ֻ�����',
                    posTarget:$("#mobileTips"),
                    rules : 'required|valid_tel_phone'
                },{
                    name : 'verifyCode',
                    display:'��֤��',
                    rules : 'required|numeric',
                    posTarget:$("#getValidCode")
                }],
                {
                    success : function(datas,evt){  //�첽�ύ����
                        $("#newBankCardNo").val($("#newBankCardNo").val().replace(/[^\d]/g,''));
                        if(!checkBankCardExiste()){
                            return false;
                        }
                        submitForm(method);
                    }
                }
            );
        }
        //����ͬ��Э��
        validateForm.registerCallback('agreeProx',function(value){
            var v= $('#agreeCheckbox').prop("checked");
            if(!v){
                return false;
            }
            return true;
        });
        validateForm.setMessage('agreeProx','���Ķ����㷢������֧��Э�顷');
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

//ҳ��Ƕ��
function addWebtrends(){
    window.WTjson = {
        "WT.si_n":"���п�����",
        "WT.si_x":"ȷ�����п���Ϣ"
    }
}

//���Ͷ�����֤��
function smsVFCodeBtnClick() {
    if(validateForm.validateField('newBankCardNo') != 0 ||
        validateForm.validateField('mobileNo') !=0)
    {
        return;
    }
    smsVFCodeTipsObj = btn.disable($("#getValidCode"),{
        color:          '#C0C0C0',     //disable���������ɫ
        setBtnLoad:     false        //�Ƿ���ʾLoading��gifͼƬ
    });
    if(typeof(dcsPageTrack)=="function"){
        dcsPageTrack("WT.si_n","���п�����",true,"WT.si_x","��֤���п�",true);
    }
    $.ajax({
        type: "post",
        url: "/main/bankCards/verifyCode",
        data: {"bankNo": $('#bankNo').val(),"capitalMode":$('#capitalMode').val(),
            "bankCardNo": $('#newBankCardNo').val(),"mobilePhone":$('#mobileNo').val()},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                //����ʧ��
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

// ����ʱ
function CountDown(secs){
    $(smsVFCodeTipsObj).html('<span class="text-red text-fontsize16">��'+secs+'������»�ȡ��</span>');
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
        //�¿��Ų��ܺ;ɿ���һ��
        $("#showInfoMsg").html("������Ŀ��Ų��ܺͻ���ǰ����һ�¡�");
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
                        //ʧ���ˣ�Ҫ����ʧ�ܿ�չʾʧ��ԭ��
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
                //���Ѿ�����
                $("#showInfoMsg").html("�ÿ��Ѱ󶨣������ظ��󿨡�");
                $("#modal").modal('show');
                b = false;
                btn.setEnabled($('#subChange'));
            }else{
                //����ǿ�ݣ��ж��Ƿ��Ѿ������ȷ�Ķ�����֤�롣
                var verifyMethod = $("#method").val();
                if(verifyMethod == "D"){
                    if(verifyToken == null || verifyToken == ""){
                        $("#showInfoMsg").html("���ȡ������֤�롣");
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
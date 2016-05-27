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
        //��ʼ������֤
        validateForm = new FormValidator(
            'frm',
            [{
                name:'agreeCheckbox',
                rules: 'callback_agreeProx',
                posTarget:$("#xyTips")
            },{
                name : 'mobileNo',
                display:'�ֻ�����',
                rules : 'required|valid_tel_phone',
                posTarget:$("#mobileTips")
            },{
                name : 'verifyCode',
                display:'��֤��',
                rules : 'required|numeric',
                posTarget:$("#getValidCode")
            }
            ],
            {
                success : function(datas,evt){  //�첽�ύ����
                    return  true
                },
                autoSubmit : true
            }
        );

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
});

//���Ͷ�����֤��
function smsVFCodeBtnClick() {
    if(validateForm.validateField('mobileNo') !=0)
    {
        return;
    }
    smsVFCodeTipsObj = btn.disable($("#getValidCode"),{
        color:          '#C0C0C0',     //disable���������ɫ
        setBtnLoad:     false        //�Ƿ���ʾLoading��gifͼƬ
    });
    $.ajax({
        type: "post",
        url: "/main/sms/send",
        data: {"bankNo": $('#bankNo').val(),"capitalMode":$('#capitalMode').val(),
            "bankAcco": $('#bankCardNo').val(),"mobileNo":$('#mobileNo').val(),
        "tradeAcco":$('#tradeAcco').val()},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                //����ʧ��
                $("#showInfoMsg").html(msgJson.returnmsg);
                $("#modal").modal('show');
                btn.enable($("#getValidCode"));
            } else {
                verifyToken = msgJson.verifyToken;
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

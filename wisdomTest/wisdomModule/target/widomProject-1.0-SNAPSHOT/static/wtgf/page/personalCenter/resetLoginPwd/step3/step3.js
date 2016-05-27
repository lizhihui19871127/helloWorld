var util = require("common:widget/util/util.js"),
    btn = require("common:widget/btn/btn.js"),
    sendMsg = require("wtgf:widget/sendMsg/sendMsg.js"),
    modal = require("wtgf:widget/modal/modal.js"),
    FormValidator = require("common:widget/validate/validate.js");
var validateForm;
var main =(function(){
	var _init = function(){
        var identityNoAvailable = $("#identityNoAvailable").val();
        if(identityNoAvailable){
            validateForm = new FormValidator(
                'frm',
                [
                    {
                        name:'verifyCode',
                        display:'������֤��',
                        rules: 'required|numeric|exact_length[6]',
                        posTarget : $("#verifyCodeBtn")
                    },
                    {
                        name:'identityNo',
                        display:'֤������',
                        rules: 'required'
                    }
                ],
                {
                    success : function(datas,evt){  //�첽�ύ����
                        mobileValidate();
                        return  false;
                    },
                    autoSubmit:false
                }
            );
        }else{
            validateForm = new FormValidator(
                'frm',
                [{
                    name:'verifyCode',
                    display:'������֤��',
                    rules: 'required|numeric|exact_length[6]',
                    posTarget : $("#verifyCodeBtn")
                }
                ],
                {
                    success : function(datas,evt){  //�첽�ύ����
                        mobileValidate();
                        return  false;
                    },
                    autoSubmit:false
                }
            );
        }
        initMobilePhone();
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

//��ʼ������ֻ�����
function initMobilePhone(){
    $("#mobilePhone").attr("readonly",true);
    $("#mobilePhoneLabel").css("display","none");
}

//��֤ԭ���ֻ�����
function mobileValidate() {
    btn.setDisabled($('#nextBtn'));
    $.ajax({
        type: "post",
        url: "/main/resetPwd/mobileNoVaildate",
        async: false,
        data: {"mobileNo": $('#mobilePhone').val(), "verifyCode": $("#verifyCode").val(),"identityNo":$("#identityNo").val()},
        success: function (msg) {
            var msgJson = msg;
            btn.setEnabled($('#nextBtn'));
            if (!msgJson.issuccess) {
                //��֤ʧ��
                modal.showModal(msgJson.returnmsg);
                sendMsg.clearCountDown();
            } else {
                window.location.href="/main/resetLoginPwd/toResetLoginPwd";
            }
        }
    });
}
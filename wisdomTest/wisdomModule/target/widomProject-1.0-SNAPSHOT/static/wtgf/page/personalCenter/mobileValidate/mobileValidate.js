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
    btn.setDisabled($('#next'));
    $.ajax({
        type: "post",
        url: "/main/personalCenter/mobileValidate",
        async: false,
        data: {"mobileNo": $('#mobilePhone').val(), "verifyCode": $("#verifyCode").val()},
        success: function (msg) {
            var msgJson = msg;
            btn.setEnabled($('#next'));
            if (!msgJson.issuccess) {
                //��֤ʧ��
                modal.showModal(msgJson.returnmsg);
                sendMsg.clearCountDown();
            } else {
                window.location.href="/main/personalCenter/toUpdateMobileNo";
            }
        }
    });
}
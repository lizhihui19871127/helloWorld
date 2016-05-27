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
                name:'name',
                display:'����',
                rules: 'required'
            },{
                name:'identityNo',
                display:'֤������',
                rules: 'required'
            }
        ],
            {
                success : function(datas,evt){  //�첽�ύ����
                    bankValidate();
                },
                autoSubmit:false
            }
        );
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

//У��������֤�������Ƿ���ȷ
function bankValidate() {
    btn.setDisabled($('#nextBtn'));
    $.ajax({
        type: "post",
        url: "/main/resetPwd/bankValidate/checkIdentityNo",
        async: false,
        data: {"identityNo": $('#identityNo').val(), "name": $("#name").val()},
        success: function (msg) {
            var msgJson = msg;
            btn.setEnabled($('#nextBtn'));
            if (!msgJson.issuccess) {
                //��֤ʧ��
                modal.showModal(msgJson.returnmsg);
            } else {
                //��ת��������У������ window.location.href="";
            }
        }
    });
}
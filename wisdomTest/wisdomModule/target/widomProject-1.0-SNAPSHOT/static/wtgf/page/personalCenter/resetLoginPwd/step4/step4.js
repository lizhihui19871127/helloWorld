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
                name:'password',
                display:'��¼����',
                rules :  'required|no_blank|alpha_dash|min_length[6]|max_length[20]|callback_passwords'
            },{
                name:'passwordAgain',
                display:'�ظ���¼����',
                rules :  'required|matches[password]'
            }
            ],
            {
                success : function(datas,evt){  //�첽�ύ����
                    btn.setDisabled($('#nextBtn'));
                    resetPwd();
                },
                autoSubmit:false
            }
        );
        //�������벻�ܺ������ַ�
        validateForm.registerCallback('passwords',function(value){
            if("-".indexOf(value)>-1){
                return false;
            }
            //��ȫ����ĸ
            if (/^\D+$/gi.test(value)) {
                if (/(\D)\1{2,}/g.test(value)) {
                    //msg = "��������3λ��3λ����������ͬ�ַ������磺4����a����";  // ȫһ��
                    return false;
                }
            } else if (/^\d+$/gi.test(value)) {//ȫ������
                if (/(\d)\1{2,}/g.test(value)) {
                    //msg = "��������3λ��3λ����������ͬ�ַ������磺������3����1����";  // ȫһ��
                    return false;
                }
                for (var i = 0; i < value.length - 2; i++) {
                    var _first = parseInt(value.charAt(i));
                    var _middle = parseInt(value.charAt(i + 1));
                    var _end = parseInt(value.charAt(i + 2));
                    if ((_first + 1 == _middle) && (_middle + 1 == _end)) {
                        //msg = "����ȫ������ʱ��������3λ��3λ������������.����:������123����";
                        return false;
                    }
                    if ((_first - 1 == _middle) && (_middle - 1 == _end)) {
                        //msg = "����ȫ������ʱ��������3λ��3λ������������.����:������543����";
                        return false;
                    }
                }
            }
            return true;
        });
        validateForm.setMessage('passwords','����ֻ����6-20λ��ĸ�����ֻ��»�����ϣ�����Ϊ������');

        //�������룬��������������
        validateForm.registerCallback('passwords_equal',function(value){
            var v= $("#tradePasswdConfirm").val();
            if(v != value){
                return false;
            }
            return true;
        });
        validateForm.setMessage('passwords_equal','������������벻һ��');
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

//���õ�¼����
function resetPwd() {
    btn.setDisabled($('#nextBtn'));
    $.ajax({
        type: "post",
        url: "/main/resetPwd/resetPwd",
        async: false,
        data: {"password": $('#password').val()},
        success: function (msg) {
            var msgJson = msg;
            btn.setEnabled($('#nextBtn'));
            if (!msgJson.issuccess) {
                //��֤ʧ��
                modal.showModal(msgJson.returnmsg);
            } else {
                window.location.href = "/main/resetLoginPwd/resetPwdSuccess";
            }
        }
    });
}

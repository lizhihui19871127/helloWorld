var util = require("common:widget/util/util.js"),
    btn = require("common:widget/btn/btn.js"),
    modal = require("wtgf:widget/modal/modal.js"),
    FormValidator = require("common:widget/validate/validate.js");
var validateForm;
var main =(function(){
	var _init = function(){
		validateForm = new FormValidator(
            'frm',
            [
                {
                    name:'loginPwd',
                    display:'��ǰ��¼����',
                    rules: 'required|no_blank|alpha_dash|min_length[6]|max_length[20]',
                    posTarget : $("#forgetPwd")
                },
                {
                    name:'newLoginPwd',
                    display:'�µ�¼����',
                    rules : 'required|no_blank|alpha_dash|min_length[6]|max_length[20]|callback_passwords',
                    posTarget:$("#tishi")
                },
                {
                    name:'againNewLoginPwd',
                    display:'ȷ���µ�¼����',
                    rules : 'required|matches[newLoginPwd]'
                }
            ],
            {
                success : function(datas,evt){  //�첽�ύ����
                    changePassword();
                    return  false;
                },
                autoSubmit:false
            });
            //��¼���벻�ܺ������ַ�
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
                var v= $("#newLoginPwd").val();
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

//�޸ĵ�¼����
function changePassword() {
    btn.setDisabled($('#next'));
    $.ajax({
        type: "post",
        url: "/main/personalCenter/changePassword",
        async: false,
        data: {"oldPassword": $('#loginPwd').val(), "newPassword": $("#newLoginPwd").val()},
        success: function (msg) {
            var msgJson = msg;
            btn.setEnabled($('#next'));
            if (!msgJson.issuccess) {
                modal.showModal(msgJson.returnmsg);
            } else {
                modal.showModal("�����޸ĳɹ�!");
                $("password").val("");
            }
        }
    });
}
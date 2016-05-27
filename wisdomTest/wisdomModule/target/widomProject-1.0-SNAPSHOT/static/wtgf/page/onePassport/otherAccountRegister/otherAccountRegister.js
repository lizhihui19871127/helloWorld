var util = require("common:widget/util/util.js"),
btn = require("common:widget/btn/btn.js"),
modal = require("wtgf:widget/modal/modal.js"),
FormValidator = require("common:widget/validate/validate.js");
//��֤��
var validateForm = null;
var main = (function(){
    var _init = function(){
        //��ʼ������֤
        validateForm = new FormValidator(
            'frm',
            [
                {
                    name : 'name',
                    display:'����',
                    rules : 'required'
                },
                {
                    name : 'identityNo',
                    display:'֤������',
                    rules : 'required'
                }
            ],
            {
                success : function(datas,evt){  //�첽�ύ����
                    if(check()){
                        return true;
                    }
                },
                autoSubmit : true
            }
        );
    };

    var bindEvent = function(){

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

//�ύ���
function check(){
    var name = $("#name").val();
    var identityNo = $("#identityNo").val();
    var identityType = $("#identityType").val();
    btn.setDisabled($("#J_submitButton"));
    var b = false;
    var name = $("#name").val();
    $.ajax({
        type: "post",
        url: "/main/register/canRegister",
        async:false,
        data: {"name":name,"identityNo":$("#identityNo").val(),"identityType":$("#identityType").val()},
        success: function (msg) {
            var msgJson = msg;
            if(msgJson.issuccess && msgJson.canRegister){
                //�����ɹ������ҿ���ע��
                b = true;
            }else{
                modal.showModal(msgJson.returnmsg);
                btn.setEnabled($("#J_submitButton"));
            }
        }
    });
    return b;
}
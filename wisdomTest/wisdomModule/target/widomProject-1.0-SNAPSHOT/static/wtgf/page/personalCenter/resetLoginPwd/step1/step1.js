var util = require("common:widget/util/util.js"),
btn = require("common:widget/btn/btn.js"),
modal = require("wtgf:widget/modal/modal.js"),
verifyCode = require('common:widget/verifyCode/verifyCode.js'),
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
                    name : 'userName',
                    display:'�˻���',
                    rules : 'required'
                },{
                    name : 'verifyCode',
                    display:'��֤��',
                    rules : 'required'
                }
            ],
            {
                success : function(datas,evt){  //�첽�ύ����
                    checkUserName();
                },
                autoSubmit : false
            }
        );

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

//��֤ԭ���ֻ�����
function checkUserName() {
    btn.setDisabled($('#nextbtn'));
    $.ajax({
        type: "post",
        url: "/main/resetPwd/checkUserName",
        async: false,
        data: {"userName": $('#userName').val(), "verifyCode": $("#verifyCode").val()},
        success: function (msg) {
            var msgJson = msg;
            btn.setEnabled($('#nextbtn'));
            if (!msgJson.issuccess) {
                //��֤ʧ��
                modal.showModal(msgJson.returnmsg);
            } else {
                window.location.href="/main/resetPwd/toSelectRestPwdStyle";
            }
        }
    });
}
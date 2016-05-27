var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js"),
	dialog = require("common:widget/dialog/dialog.js"),
    FormValidator = require("common:widget/validate/validate.js");
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

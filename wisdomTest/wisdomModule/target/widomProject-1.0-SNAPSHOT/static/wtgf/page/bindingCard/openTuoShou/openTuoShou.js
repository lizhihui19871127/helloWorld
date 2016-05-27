var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js"),
	dialog = require("common:widget/dialog/dialog.js"),
    FormValidator = require("common:widget/validate/validate.js");
//验证表单
var validateForm = null;
var main = (function(){
    var _init = function(){
        //初始化表单验证
        validateForm = new FormValidator(
            'frm',
            [{
                name:'agreeCheckbox',
                rules: 'callback_agreeProx',
                posTarget:$("#xyTips")
            }
            ],
            {
                success : function(datas,evt){  //异步提交请求
                    return  true
                },
                autoSubmit : true
            }
        );

        //必须同意协议
        validateForm.registerCallback('agreeProx',function(value){
            var v= $('#agreeCheckbox').prop("checked");
            if(!v){
                return false;
            }
            return true;
        });
        validateForm.setMessage('agreeProx','请阅读《广发基金快捷支付协议》');
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

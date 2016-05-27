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
                display:'姓名',
                rules: 'required'
            },{
                name:'identityNo',
                display:'证件号码',
                rules: 'required'
            }
        ],
            {
                success : function(datas,evt){  //异步提交请求
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

//校验姓名、证件号码是否正确
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
                //验证失败
                modal.showModal(msgJson.returnmsg);
            } else {
                //跳转到银行主校验流程 window.location.href="";
            }
        }
    });
}
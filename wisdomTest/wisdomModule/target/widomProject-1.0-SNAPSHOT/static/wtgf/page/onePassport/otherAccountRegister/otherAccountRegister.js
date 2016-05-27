var util = require("common:widget/util/util.js"),
btn = require("common:widget/btn/btn.js"),
modal = require("wtgf:widget/modal/modal.js"),
FormValidator = require("common:widget/validate/validate.js");
//验证表单
var validateForm = null;
var main = (function(){
    var _init = function(){
        //初始化表单验证
        validateForm = new FormValidator(
            'frm',
            [
                {
                    name : 'name',
                    display:'姓名',
                    rules : 'required'
                },
                {
                    name : 'identityNo',
                    display:'证件号码',
                    rules : 'required'
                }
            ],
            {
                success : function(datas,evt){  //异步提交请求
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

//提交检查
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
                //操作成功，并且可以注册
                b = true;
            }else{
                modal.showModal(msgJson.returnmsg);
                btn.setEnabled($("#J_submitButton"));
            }
        }
    });
    return b;
}
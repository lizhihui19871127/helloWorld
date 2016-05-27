define('wtgf:widget/changePwd/changePwd.js', function(require, exports, module){ var $ = require("common:widget/jquery/jquery.js"),
	dialog = require("common:widget/dialog/dialog.js"),
	//tips = require("common:widget/tips/tips.js"),
	validator = require("common:widget/validator/validator.js"),
	btn = require("common:widget/btn/btn.js");

var changePwd = (function(){

	var _sendSMS = function(){
		var identityNo = $("#identityNo").val(),
			identityType = $("#identityType").val();

		TradeSMSDwrUtil.sendDecodeFromMobileJZ(identityNo,identityType,function(data){
			if("" != data){
				alert(data);
			}else{
				_toStep(2);	
			}
            //callback && callback();
		});
	};

    var _resendSMS = function(){
        var timer = null,
            count = 60,
            self = this;

        _sendSMS(); 

        btn.disableBtn(self); 

        timer = setInterval(function(){
            if(count == 0){
                clearInterval(timer);
                $(self).html("重新发送");
                btn.enableBtn(self);
            }else{
                $(self).html("重新发送(" + count + ")");
                count--;
            }
        },1000);

        $("#changePwd .step2 .resendSMSWrap-changePhoneNum").removeClass("hide");
    };

	var _confirmVerifyCode = function(){
		var verifyCode = $("#changePwd .changePwd-verifyCode").val(),
			dxpatterns = /^[A-Za-z0-9]{2,8}$/,
			identityNo = $("#identityNo").val(),
			identityType = $("#identityType").val();
		
		if(!dxpatterns.test(verifyCode)){
			alert("请输入合法的手机动态码!");
			return;
		}

		TradeSMSDwrUtil.authMobileDecodeJZ(verifyCode,identityNo,identityType,function(data){
			if("" != data){
				alert(data);
			}else{
				_toStep(3);
			}
		});
	};

	var _confirmChange = function(){
		//check the password
		var firstPwd = $("#changePwd input.changePwd-firstpwd").val(),
			secondPwd = $("#changePwd input.changePwd-secondpwd").val(),
            identityNo = $("#identityNo").val(),
            identityType = $("#identityType").val();

		if(firstPwd.length == ""){
            alert("请输入交易密码");
			return ;
		}

		if(secondPwd.length == ""){
            alert("请输入确认交易密码");
			return ;
		}

		if(firstPwd != secondPwd){
			alert("两次输入的新密码不一致");
			return;
		}

		var errMsg = validator.password(firstPwd);
		if(errMsg != ""){
			alert(errMsg);
			return;
		}

		//begin to send change commands
        KDAccountModifyDwrUtil.modfiyPwd(firstPwd,identityNo,identityType,function(data){
            if ("succ" == data){
                _toStep(4);
            }else{
                alert(data);
            }
        });
	};

    var _close = function(){
        dialog.close();
        window.location.reload();
    };

	var _toStep = function(num){
		$("#changePwd .changePwdPanel").hide();
		$("#changePwd .step" + num).show();

		setTimeout(function(){
			dialog.refreshStyle();
		},1);
	};

	var _bindEvent = function(){
		$("#changePwd .changePwd-beginChange").on("click",_sendSMS);
		$("#changePwd .changePwd-verifyCodeConfirm").on("click",_confirmVerifyCode);
		$("#changePwd .changePwd-confirm").on("click",_confirmChange);
		$("#changePwd .changePwd-resendSMS").on("click",_resendSMS);
		$("#changePwd .changePwd-close").on("click",_close);
	};

	var _init = function(){

		_bindEvent();

		dialog.show("短信验证",$("#changePwd"),{
			blurHide : false,
            beforeCloseCallback : function(){
                $("body").append($("#changePwd"));
            }
		});	

		$("#changePwd").show();
	};

	return {
		init : _init
	};
})();

module.exports = changePwd;
 
});
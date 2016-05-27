var $ = require('common:widget/jquery/jquery.js'),
	verifyCode = require('common:widget/verifyCode/verifyCode.js'),
	dialog = require("common:widget/dialog/dialog.js"),
	tips = require("common:widget/tips/tips.js"),
	softkeyboard = require("common:widget/softkeyboard/softkeyboard.js"),
	changePwd = require("wtgf:widget/changePwd/changePwd.js"),
	util = require("common:widget/util/util.js");
    btn = require("common:widget/btn/btn.js");

var Index = (function(){

	var Slider = (function(){
		var slides = null,
			currentIndex = -1,
			timer = -1,
			slideControl = $("<ul class='slider-control'></ul>");

		var changeSlide = function(index){
		//ֻ��һ��ͼƬ������Ҫ�����л��ˣ�����Ժ���Ҫ�л�����ע�͵Ĵ��뼴�ɡ�
			var currentSlide = $(slides).get(currentIndex);
			$(currentSlide).fadeIn();
		/*
			var currentSlide = null;

			if(currentIndex != -1){
				var currentSlide = $(slides).get(currentIndex);
				$(currentSlide).fadeOut();
			}

			$($(slides).get(index)).fadeIn(function(){
				if(currentIndex != -1){
					$($(slides).get(index)).removeClass("current");
				}
				currentIndex = index;
				$(this).addClass("current");
			});

			$($(slideControl).find("li a").each(function(){
				$(this).removeClass("current");
			}).get(index)).addClass("current");
*/
		};

		var setSlideTimer = function(){
			if(timer != -1){
				clearInterval(timer);
			}

			timer = setInterval(function(){
				changeSlide((currentIndex + 1) % slides.length);	
			},2500);
		};

		var init = function(){
			slides = $(".login-slider .slider");

			//create the control button
			for(var i = 0,len = slides.length; i < len; i ++){
				$(slideControl).append("<li><a href='javascript:void(0)' data-index=" + i + " class='slide-control'></a></li>");
			}

			$(".login-slider").append(slideControl);
	
			//bind the slide event
			$(slideControl).on('click',function(e){
				changeSlide($(e.target).data('index'));
				setSlideTimer();
			});

			//begin the auto slide
			changeSlide((currentIndex + 1) % slides.length);
			setSlideTimer();
		};
		
		return {
			init : init
		};
	})();

	var login = (function(){
		var _submitParam = {
			"logonType" : '1',
			"identityType" : '0',
			"tradePassword" : '',
			"autoLoginFlag" : '',
			"nickName" : '',
			"fundAcco" : '',
			"identityNo" : ''
		};

		var _changeLoginType = function(){
            tips.hide($("#identityNo"));

			$(".login-loginForm .loginType").removeClass("current");
			_submitParam.logonType = '1';

			if($("#identityType").val() == "FundAcco"){
				_submitParam.logonType = '0';
				$(".login-loginForm .loginForm-fundAccoRow").addClass("current");
			}else if($("#identityType").val() == "B"){
				$(".login-loginForm .loginForm-nickNameRow").addClass("current");
			}else{
				$(".login-loginForm .loginForm-identityNoRow").addClass("current");
			}
            $(".login-loginForm .loginForm-fundAccoRow input").val("");
            $(".login-loginForm .loginForm-nickNameRow input").val("");
            $(".login-loginForm .loginForm-identityNoRow input").val("");
            $("#tradePassword").val("");
		};

		var _validateIdentity = function(CardNo){
			var Wi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
			var Ai = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');

			if (CardNo.length != 18 && CardNo.length != 15){
				return false;	
			} else if (CardNo.length == 18){

				CardNo = CardNo.substr(0, 18);
				if (CardNo.charAt(17) == 'x')
				{
					CardNo = CardNo.replace("x", "X");
				}

				var checkDigit = CardNo.charAt(17);
				var cardNoSum = 0;

				for (var i = 0; i < CardNo.length - 1; i++)
				{
					cardNoSum = cardNoSum + CardNo.charAt(i) * Wi[i];
				}
				var seq = cardNoSum % 11;
				var getCheckDigit = Ai[seq];

				if (checkDigit != getCheckDigit)
				{
					return false;	
				}
			} 
			return true;
		};

		var _checkForm = function(){
			var errMsg = "";

			if($("#identityType").val() == 'FundAcco'){
				if($("#fundAcco").val() == ""){
					errMsg += "����������˺�\n";
				}
			}else if($("#identityType").val() == 'B'){
				if($("#nickName").val() == ""){
					errMsg += "�������ǳ�\n";
				}
			}else{
				if($("#identityNo").val() == ""){
					errMsg += "������֤������\n";
				}
				if($("#identityType").val() == '0' && $("#identityNo").val() != "" && !_validateIdentity($("#identityNo").val())){
					errMsg += "��������ȷ�����֤����\n";
				}
			}

			if($("#tradePassword").val() == ""){
				errMsg += "�������¼����\n";
			}
            if(!$("#verifyCodeWrap").hasClass("hide") && $("#verifyCode").val() == ""){
                errMsg += "��������֤��\n";
            }

			if(errMsg != ""){
				alert(errMsg);
				return false;
			}
			return true;
		};

		var _submitForm = function(){
            //��¼��½ʱ��
            var loginBeginTime = (new Date).getTime();
            util.cookie.set("loginBeginTime",loginBeginTime);

			_disableSubmit();

			if(_checkForm()){

				_submitParam.identityType = $("#identityType").val();
				_submitParam.tradePassword = $("#tradePassword").val();
				_submitParam.autoLoginFlag = $("#autoLoginFlag").get(0).checked ? 1 : 0;
				_submitParam.nickName = $("#nickName").val();
				_submitParam.fundAcco = $("#fundAcco").val();
				_submitParam.identityNo = $("#identityNo").val();
                _submitParam.goUrl = $.getUrlParam("gourl"); 

				if(!$("#verifyCodeWrap").hasClass("hide")){
					_submitParam.verifyCode = $("#verifyCode").val();	
				}
				
				$.post("/main/login",_submitParam,function(ret){
                    //��¼��½Controller����ʱ��
                    var loginTime = (new Date()).getTime() - loginBeginTime;
                    util.cookie.set("loginTime",loginTime);

                    if(!ret){
                        dialog.show("��Ϣ��ʾ","��¼ʧ�ܣ����Ժ�����");
                    }

					if(ret.errno == '0'){
                        var returnUrl = $.getUrlParam("gourl");

                        if(returnUrl){
                            returnUrl = "&goUrl=" + encodeURIComponent(returnUrl);
                        }else{
                            returnUrl = "";
                        }

        
                        //��¼��ת��mainController֮ǰ��ʱ�䣬����ͳ��mainController����ʱ��
                        util.cookie.set("mainControllerBeginTime",(new Date()).getTime());
                        window.location.href="/main/main?from=login" + returnUrl;

                        return;
					}else if(ret.errno == '9990'){
                        location.href="/main/account/openaccount/notBindCard"; 
                        return;
                    }else if(ret.errno == '2021'){
						//�����û��޸�����
						changePwd.init();
                        if(ret.data.mobileNum){
                            $("#changePwd .step2 .changePwd-mobileNum").html(ret.data.mobileNum);
                        }
					}else{
						if(ret.data && ret.data.errMsg){
							dialog.show("��Ϣ��ʾ",ret.data.errMsg);
						}else{
							dialog.show("��Ϣ��ʾ","��¼ʧ�ܣ����Ժ�����");
						}
					}
                    $("#verifyCodeWrap").removeClass("hide");
                    _enableSubmit();
				});

			}else{
				_enableSubmit();
			}
		};

		var _disableSubmit = function(){
			//$("#btnLoginSubmit").addClass("disable").off("click",_submitForm);
            btn.disable($("#btnLoginSubmit"),{
                setBtnLoad : true
            });
		};

		var _enableSubmit = function(){
			//$("#btnLoginSubmit").removeClass("disable").on("click",_submitForm);
            btn.enable($("#btnLoginSubmit"));
		};

		var _detectKeyCode = function(e){
			var keyCode = e.keyCode || e.which,
				isShift = e.shiftKey || (keyCode == 16) || false;

			if (((keyCode >= 65 && keyCode <= 90 ) && !isShift) || ((keyCode >= 65 && keyCode <= 90 ) && isShift))
			{
				tips.show(this,{
					title : '��д�����Ѵ�',
					content : '���ִ�д�����򿪿��ܻ�ʹ�������������롣<br/>����������ǰ����Ӧ��"Capslock"������رա�',
					type : 'alert',
					position: 'bottom'
				});
			}else{
				_hideKeyCodeDetect.call(this);
			}
		};

		var _hideKeyCodeDetect = function(e){
			tips.hide(this);
		};

		var _init = function(){
			//bind the event
			$("#identityType").on("change",_changeLoginType);
			//bind the identity validate function
			$("#identityNo").on("blur",function(){
				if($("#identityType").val() == '0' && $(this).val() != "" && !_validateIdentity($(this).val())){
					//alert("��������ȷ�����֤����");
					tips.show($("#identityNo"),{
						title : '��������ȷ�����֤����',
						content : '',
						type : 'error',
						position : 'right'
					});
				}else{
					tips.hide($("#identityNo"));
				}
			});
			//bind the login submit event
			//$("#btnLoginSubmit").on("click",_submitForm)
			$("#btnLoginSubmit").on("click",function(){
                //��¼��ǰ�õĵ�½���ͣ��´��Զ�����
                util.cookie.set("identityType",$("#identityType").val());
                _submitForm();
            });
            //��һ����û�е�½���͵�cookie���Զ�����һ��
            var identityType = util.cookie.get("identityType");
            if(identityType){
                var identityTypes = $("#identityType").get(0).options;
                for(var i = 0,len = identityTypes.length; i < len; i ++){
                    if(identityTypes[i].value == identityType){
                        identityTypes[i].selected = 'selected';
                        _changeLoginType();
                        break;
                    }
                }
            }
            //bind the enter key event
            $(".login-loginForm").on("keydown",function(e){
                if(e.keyCode == 13){
                    _submitForm();
                }
            });

			//bind the detect capslock event
			$("#tradePassword").on("keypress",_detectKeyCode);
			$("#tradePassword").on("blur",_hideKeyCodeDetect);

			//bind the verifyCode event
			if($("#verifyCode")){
				verifyCode.init();				
                var isNew = false;
                $("#verifyCodeWrap .reloadBtn").click(function(){
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
		return {
			init : _init
		};
	})();


	return {
		initSlider : Slider.init,
		initLogin : login.init
	};
})();

$(function(){
	Index.initSlider();	
	Index.initLogin();	
	//changePwd.init();

	softkeybd = document.getElementById("wjmm");
	board(softkeybd);
	softkeybd.onmousedown = Function("password1=document.getElementById('tradePassword');showkeyboard();document.getElementById('tradePassword').readOnly=1;Calc.password.value=''");
	softkeybd.onkeyup = Function("if(event.keyCode==9){password1=document.getElementById('tradePassword');showkeyboard();document.getElementById('tradePassword').readOnly=1;Calc.password.value=''}");
	softkeybd.onKeyDown = Function("Calc.password.value=document.getElementById('tradePassword').value;");
});

//��¼ҳ�����ʱ��
window.onload = function(){
    if(window.GF_VIEWINFO.pageInitTime){
        var loginPageTime = (new Date()).getTime() - window.GF_VIEWINFO.pageInitTime;
        util.cookie.set("loginPageTime",loginPageTime);
    }
};



var FormValidator = require("common:widget/validate/validate.js"),
	btn = require("common:widget/btn/btn.js");

var url = window.location.href,
	param = url.split('?')[1],
	msgValue =param.split('=')[1],
	validateForm = '';

var main =(function(){

	var _init = function(){
		validateForm = new FormValidator(
            'sendFrom',
            [{
                name:'phoneNum',
                display:'�ֻ���֤��',
                rules: 'require|numeric|exact_length[6]',
                posTarget:$("#getCheck")
            }
            ],
            {
                success : function(datas,evt){  //�첽�ύ����
                    
                    submitForm();
                    return  false;
                }
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
});

function submitForm(){
	console.log('tijiao');
}

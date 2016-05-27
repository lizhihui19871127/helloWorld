var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js"),
    menuCookie = require("wtgf:widget/menuCookie/menuCookie.js"),
	dialog = require("common:widget/dialog/dialog.js");
var $containerBank = $('.container-bank');
var main = (function(){
    var _init = function(){
        menuCookie.cookie.menu();
    };

    var bindEvent = function(){
        // 选择银行卡
        $containerBank.on('click', '.bank-sel', function(){
            $containerBank.find('.bank-list').show();
        });

        // 选中银行卡
        $containerBank.on('click', '.bank-list li', function(){
            var str = $(this).html();

            $containerBank.find('.bank-list').hide();
            $containerBank.find('.bank-sel').html(str);
        });

        // 是否同意业务协议
        $containerBank.on('change', 'label.agreen input', function(){
            if($(this).is(':checked')){
                $(this).parent().addClass('active');
            }else{
                $(this).parent().removeClass('active');
            }
        });

        // 输入银行卡
        $containerBank.on('focus', '.in-card-num', function(){
            $(this).parent().find('.bank-card-num').show();
        });

        $containerBank.on('blur', '.in-card-num', function(){
            $(this).parent().find('.bank-card-num').hide();
        });

        $containerBank.on('keyup', '.in-card-num', function(){
            var v = $(this).val().replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,'$1 ');

            $(this).parent().find('.bank-card-num').html(v);
        });

        // 银行卡预留手机提示，2s后自动消失
        var phoneTipsTime;
        $containerBank.on('mouseenter', '.js-phone-tips', function(){
            $(this).find('.phone-tips').show();
            clearTimeout(phoneTipsTime);
        });

        $containerBank.on('mouseleave', '.js-phone-tips', function(){
            var $this = $(this);

            phoneTipsTime = setTimeout(function(){
                $this.find('.phone-tips').hide();
            },2000);
        });

        // 我的银行卡-显示全部卡片
        $containerBank.on('click', '.my-bank-content .down', function(){
            $(this).hide().parent().find('ul').addClass('show-all');
        });
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

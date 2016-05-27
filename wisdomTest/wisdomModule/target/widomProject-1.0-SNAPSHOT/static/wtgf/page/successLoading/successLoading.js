var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js"),
    menuCookie = require("wtgf:widget/menuCookie/menuCookie.js"),
	dialog = require("common:widget/dialog/dialog.js");
var $containerBank = $('.container-bank');
var main = (function(){
    var _init = function(){
        menuCookie.cookie.menu();
        loadData();
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

function loadData(){
    //5秒钟后页面将自动关闭
    CountDown(5);
}

// 倒计时
function CountDown(secs){
    $("#seconds").html(secs);
    if(--secs>0){
        setTimeout("CountDown("+secs+")",1000);
    } else {
        window.opener=null;
        window.open('','_self');
        window.close();
    }
}

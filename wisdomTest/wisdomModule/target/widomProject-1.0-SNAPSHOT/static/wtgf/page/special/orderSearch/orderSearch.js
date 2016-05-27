var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js");
	dialog = require("common:widget/dialog/dialog.js");

var main = (function(){
    var _init = function(){
    };

	var bindEvent = function(){
		$(".f").click(function(e){
			var errorMsg = $(this).parent().find("input:eq(0)").val();
            alert( "抱歉！您的协议触发失败：" + errorMsg );
		});

        $(".cancelYY").click(function(e){
            if ( confirm( "确定撤销该预约认购交易吗？" ) )
            {
                var protocol = $(this).parent().find("input:eq(0)").val();
                var tradeAcco = $(this).parent().find("input:eq(1)").val();
                $.get("/main/orderSearch/orderCancel?protocol="+protocol+"&tradeAcco="+tradeAcco,function(data){
                    if ( data.data == "" )
                    {
                        alert( "预约认购交易撤销成功！" );
                        window.location = "/main/orderSearch/orderSearch";
                    } else
                    {
                        alert( data.data );
                    }
                });
            }
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

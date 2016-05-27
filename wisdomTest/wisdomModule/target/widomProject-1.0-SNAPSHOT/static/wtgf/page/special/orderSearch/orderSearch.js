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
            alert( "��Ǹ������Э�鴥��ʧ�ܣ�" + errorMsg );
		});

        $(".cancelYY").click(function(e){
            if ( confirm( "ȷ��������ԤԼ�Ϲ�������" ) )
            {
                var protocol = $(this).parent().find("input:eq(0)").val();
                var tradeAcco = $(this).parent().find("input:eq(1)").val();
                $.get("/main/orderSearch/orderCancel?protocol="+protocol+"&tradeAcco="+tradeAcco,function(data){
                    if ( data.data == "" )
                    {
                        alert( "ԤԼ�Ϲ����׳����ɹ���" );
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

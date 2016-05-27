var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js");
	dialog = require("common:widget/dialog/dialog.js");

var main = (function(){
    var _init = function(){

    };

	var bindEvent = function(){

		$("#home").click(function(e){
			$("#pageNo").attr("value",1);
			$("#queryForm").submit();
		});
		
		$("#before").click(function(e){
			var t = $("#pageNo").val();
			if(t<=1){
				$("#pageNo").attr("value",1);
			}else{
				$("#pageNo").attr("value",parseInt(t)-1);
			}
			$("#queryForm").submit();
		});
		
		$("#next").click(function(e){
			var t = $("#pageNo").val();
			var lastNo = $("#lastNo").val();
			if(parseInt(t)>=parseInt(lastNo)){
				$("#pageNo").attr("value",lastNo);
			}else{
				$("#pageNo").attr("value",parseInt(t)+1);
			}
			$("#queryForm").submit();
		});
		
		$("#last").click(function(e){
			var action = $("#queryForm").attr("action");
			$("#pageNo").attr("value",$("#lastNo").val());
			$("#queryForm").submit();
		});
		
        $(".showContent").click(function(e){
            var title = $(this).parent().find("input:eq(0)").val();
            var content = $(this).parent().find("div").html();
            var myModalLabel = $("#myModalLabel");
            var contentInner = $("#content");
            myModalLabel.html(title);
            contentInner.html(content);
            $("#modal").modal('show');
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

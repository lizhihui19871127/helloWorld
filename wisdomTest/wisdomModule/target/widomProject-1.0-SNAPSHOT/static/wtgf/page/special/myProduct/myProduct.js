var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js");
	dialog = require("common:widget/dialog/dialog.js");

var main = (function(){
    var _init = function(){

    };

	var bindEvent = function(){
		$(".redeemBtn").click(function(e){
            var fundCode = $(this).parent().find("input:eq(0)").val();
            var shareType = $(this).parent().find("input:eq(1)").val();
            var tradeAcco = $(this).parent().find("input:eq(2)").val();
            var bankCardNo = $(this).parent().find("input:eq(3)").val();
            var capitalMode = $(this).parent().find("input:eq(4)").val();

            $("#shareType").val(shareType);
            $("#fundCode").val(fundCode);
            $("#tradeAcco").val(tradeAcco);
            $("#bankCardNo").val(bankCardNo+capitalMode);

            $("#redeemForm").submit();
		});

        $(".addBuy").click(function(){
            var fundCode = $(this).parent().find("input:eq(0)").val();
            $("#buyFundCode").val(fundCode);
            $("#modal").modal('show');
        });

        $("#toBuy").click(function(){
            $.post("/main/specialBuy/qrycontract",{fundcode:$("#buyFundCode").val()},function(result){
                if(result.errno=="00000"){

                    if(null!=result.data && undefined!=result.data && ''!=result.data && result.data.issupport=="0"){
                        $("#buyForm").attr("action","/main/specialBuy/buyContractBuy");

                        $("#buyForm").submit();

                    }else{
                        $("#buyForm").attr("action","/main/specialBuy/buyPre");
                        $("#buyForm").submit();
                    }

                } else{
                    modalStatusError(result.errMsg,true);

                }
            });
            //$("#buyForm").submit();
        });

        $("#showJJ").click(function(){
            $("#showNoAaviable").toggle();
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

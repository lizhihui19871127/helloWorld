var main = (function(){
	var bindEvent = function(){
        getIncomeInfo();
        //申购
        $(".buyProduct").click(function(e){

            var fundCode = $(this).parent().find("input:eq(0)").val();
            var buinessCode = $(this).parent().find("input:eq(1)").val();
            $("#buyFundCode").val(fundCode);
            $("#buyBusinCode").val(buinessCode);
            $.post("/main/specialBuy/checkOpenNetTrade",null,function(data){
                if (data.errno != '00000') {
                    alert("判断用户是否开通了网上交易失败。");
                }else if(data.msg != "OK"){
                    $("#modal5").modal('show');
                }else{
                    $("#modal4").modal('show');
                }
            });
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


        });

        //认购
        $(".prebuyProduct").click(function(e){
            var fundCode = $(this).parent().find("input:eq(0)").val();
            window.open("../../trade/SpecialBuyAction.do?method=orderPre&fundCode="+fundCode+"&orderFlag=0&applyMoney=&modifyFlag=");
        });
        //增加手机号码
        $("#addTel").click(function(){
            window.open("../../account/modifyaccountinfo.jsp","_blank");
        });

        //展示提醒预约信息框体
        $(".modaltx").each(function(){
            $(this).click(function(){
                $(this).css("display", "none");
                var fundCode = $(this).parent().find("input:eq(0)").val();
                var tel = $(this).parent().find("input:eq(1)").val();
                var buySegDate = $(this).parent().find("input:eq(2)").val();
                if(tel == ""){
                    $("#modal2").modal('show');
                    $(this).removeAttr("style");
                }else{
                    if(buySegDate != ""){
                        buySegDate = buySegDate.substring(0,4)+"-"+buySegDate.substring(5,7)+"-"+buySegDate.substring(8,10);
                    }
                    var obj = {"fundCode":fundCode, "sellDate":buySegDate};
                    $.post("/main/specialBuy/addSpecialNote",obj,function(data){
                        if(data.addSpecialNote != -1){
                            $("#cancelId").val(data.addSpecialNote);
                            $("#modal1").modal('show');
                        }else{
                            alert("短信提醒失败。");
                        }
                        $("#modaltx"+fundCode).removeAttr("style");
                    });
                }
            })
        });

        //取消提醒
        $("#cancelNote").click(function(){
            var cancelId = $("#cancelId").val();
            var obj = {"cancelId":cancelId,"recsmsflag":0};
            $.post("/main/specialBuy/cancelSpecialNote",obj,function(data){
                if(data.cancelSpecialNote == true){
                    $("#modal1").modal('hide');
                    $("#modal3").modal('show');
                }else{
                    alert("取消短信提醒失败。");
                }
            });
        });

        //启用提醒
        $("#reNote").click(function(){
            var cancelId = $("#cancelId").val();
            var obj = {"cancelId":cancelId,"recsmsflag":1};
            $.post("/main/specialBuy/cancelSpecialNote",obj,function(data){
                if(data.cancelSpecialNote == true){
                    alert("启用短信提醒成功。");
                    $("#modal3").modal('hide');
                }else{
                    alert("启用短信提醒失败。");
                }
            });
        });

        //修改手机号码
        $("#updateTel").click(function(){
            window.open("../../account/modifyaccountinfo.jsp","_blank");
        });

        //充值
        $("#recharge").click(function(){
            window.open("../../wallet/recharging.jsp","_blank");
        });
        //充值
        $("#recharge2").click(function(){
            window.open("../../wallet/recharging.jsp","_blank");
        });

        function getIncomeInfo(){
            var Income = $("#Income").val();
            $.ajax({type:"GET",
                    url: "/main/special/getHotProduct?Income="+Income,
                    dataType: "json",
                    success: function (data) {
                        var htmlContent="";
                        if(null==data.specialFund && undefined== data.specialFund) {
                            return false;
                        }
                        for(var i=0;i<data.specialFund.length;i++){
                            var j=i+1;
                            var fileSrc = "";
                            if(data.specialFund[i].contractFile != ""){
                                fileSrc = "<a href='/special/downloadcontract.jsp?fundCode="+data.specialFund[i].fundCode+"'>"+data.specialFund[i].fundName+"</a>";
                            }else{
                                fileSrc = data.specialFund[i].fundName;
                            }
                            htmlContent+="<tr>" +
                                "<td>"+data.specialFund[i].fundCode+"</td>"+
                                "<td>"+fileSrc+"</td>"+
                                "<td>"+data.specialFund[i].productManager+"</td>"+
                                "<td>"+data.specialFund[i].inCome+"</td>"+
                                "<td>"+data.specialFund[i].navDate+"</td>"+
                                "<td>"+data.specialFund[i].nav+"</td>"+
                                "<td>"+data.specialFund[i].productState+"</td>"+
                                "</tr>";
                        }
                        $("#fundShowId").html(htmlContent);
                    }}
            );
        }

        $("#Income").change(function(){
            getIncomeInfo();
        });

        $.post("/main/special/qrycontractinfo",null,function(result){
            if(result.errno=="00000"){
                //加载完成
                if(result.data.length>0){
                    $("#contract").show();
                }else{
                    $("#contract").hide();
                }
            }else{
                $("#contract").hide();
            }
        });
    };
	
    return {
		bindEvent:bindEvent
    }
})();

$(function(){
	main.bindEvent();
});

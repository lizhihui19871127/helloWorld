var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js");
	dialog = require("common:widget/dialog/dialog.js");

var main = (function(){
    var _init = function(){
		//设置结束日期
		$("#endDateTextPicker").datepicker({
            dateFormat : "yy-mm-dd",
            changeYear : true,
            changeMonth : true,
			currentText: "Now"
        });
		
		//初始化一个月后为结束日期
		//$( "#endDateTextPicker" ).datepicker( "setDate", new Date());
		//setDate("endDateTextPicker","endDate");
		
		//设置开始日期
		$("#startDatePicker").datepicker({
            dateFormat : "yy-mm-dd",
            changeYear : true,
            changeMonth : true,
			currentText: "Now"
        });
		//初始化当天
		//$( "#startDatePicker" ).datepicker( "setDate", getEndDate($( "#endDateTextPicker" ).val(),2));
		//这里是设置隐藏域日期，便于传输到后台。下同。
		//setDate("startDatePicker","startDate");
		$("[data-toggle='tooltip']").tooltip();

       var bussinse = eval('(' + $("#bussinessList").val() + ')');
       var tradeCaptal = eval('(' + $("#tradeCaptalList").val() + ')');

      var lioption="<ul style='padding-left:5px;margin:0px;'> <li   tradekey='' ><a  tradekey=''  href='javascript:;'>全部</a></li>";

        for(var i=0;i<tradeCaptal.length;i++){

                lioption+=("<li  tradekey='"+tradeCaptal[i].value+"' ><a  tradekey='"+tradeCaptal[i].value+"'  href='javascript:;'>"+tradeCaptal[i].name+"</a></li>")

        }
        lioption+="</ul>";

        $("#tradeCaptal").append(lioption);


        var bussoption="<ul style='padding-left:5px;margin:0px;'> <li   busskey='' ><a  busskey=''  href='javascript:;'>全部</a></li>";
        var bussinoption="";
        var common="充值,钱袋子快速取现,钱袋子取现,钱袋子申购基金,申购,钱袋子认购基金,认购,赎回,转换";

        for(var i=0;i<bussinse.length;i++){
            if(common.indexOf(bussinse[i].caption)>-1){
                bussoption+=("<li  busskey='"+bussinse[i].value+"' ><a  busskey='"+bussinse[i].value+"'  href='javascript:;'>"+bussinse[i].caption+"</a></li>");
            }else{
                bussinoption+= ("<li  busskey='"+bussinse[i].value+"' ><a  busskey='"+bussinse[i].value+"'  href='javascript:;'>"+bussinse[i].caption+"</a></li>");
            }
        }


        bussoption+=bussinoption+"</ul>";

        $("#busslist").append(bussoption);


    };
	//将隐藏域日期设置的和选择的日期控件一致。
	var setDate = function(datePicVar,dateVar){
		var t = $("#"+datePicVar).val();

        $("#"+dateVar).val(t);


	};
	//计算结束日期；如果type为1，则最近一周；如果type为2，则最近一个月；如果type为3，则最近3个月；如果type为4，则最近半年；如果type为5，则最近一年。
	var getEndDate = function (date,type) {
            var arr = date.split('-');
            var year = arr[0]; //获取当前日期的年份
            var month = arr[1]; //获取当前日期的月份
            var day = arr[2]; //获取当前日期的日
            var days = new Date(year, month, 0);
            days = days.getDate(); //获取当前日期中的月的天数
            var year2 = year;
			var monthCount = 0;
			if(type == 1){
				if(parseInt(day)<=7){
					//如果当前日小于等于7,则跨月到上一个月,暂且不管日,下面会处理
					monthCount = -1;
					day = parseInt(day);
				}else{
					day = parseInt(day);
				}
			}else if(type == 2){
				monthCount = -1;
			}else if(type == 3){
				monthCount = -3;
			}else if(type == 4){
				monthCount = -6;
			}else if(type == 5){
				monthCount = -12;
			}
            var month2 = parseInt(month) + monthCount;
            if (month2 <= 0) {
                year2 = parseInt(year2) - 1;
                month2 = 12+month2;
            }
			if (month2 < 10) {
                month2 = '0' + month2;
            }
			var day2 = day;
			if(type == 1){
				//上一个星期，需要重新计算日
				if(day2<=7){
					var days2 = new Date(year2, month2, 0);
					days2 = days2.getDate();
					day2 = days2 + day2 - 7;
				}else{
					day2 = day2 - 7;
				}
				if(day2 < 10){
					day2 = '0'+day2;
				}
			}else{
                var days3= new Date(year2, month2, 0);
                var maxday=days3.getDate();
                if(maxday<day){
                    day2=maxday;
                }
            }
        
            var t2 = year2 + '-' + month2 + '-' + day2;
            return t2;
    };
	//时间轴
	var timeLineVar = [	
		"<table cellspacing ='0' cellpadding='0' style='width:516px;border-collapse:collapse;border:0px'>",
			"<tr>",
				"{@each timeLineInfo as item,index}",
					"<td align='center' valign='top' style='width:!{item.width*2+12}px;max-width:!{item.width*2+12}px;padding:0px; margin:0px'>",
						"{@if item.segNum == 0}",
							"<img src='/static/wtgf/img/u60.png' style='margin-left:!{item.width}px' />",
							"<img src='/static/wtgf/img/u625_line.png' style='width:!{item.width}px;height:2px' />",
							"<br>!{item.dispMsg}<br>!{item.datetime}",
						"{@else if item.segNum == 1}",
							"{@if item.finished == true}",
								"<img src='/static/wtgf/img/u625_line.png' style='width:!{item.width}px;height:2px' />",
								"<img src='/static/wtgf/img/u60.png' style='margin-right:!{item.width}px' />",
							"{@else if item.finished == false}",
								"<img src='/static/wtgf/img/u919_line.png' style='width:!{item.width}px;height:2px' />",
								"<img src='/static/wtgf/img/u64.png' style='margin-right:!{item.width}px' />",
							"{@/if}",
							"<br>!{item.dispMsg}<br>!{item.datetime}",
						"{@else if item.segNum == 2}",
							"{@if item.finished == true}",
								"<img src='/static/wtgf/img/u625_line.png' style='width:!{item.width}px;height:2px' />",
								"<img src='/static/wtgf/img/u60.png' />",
								"<img src='/static/wtgf/img/u625_line.png' style='width:!{item.width}px;height:2px' />",
							"{@else if item.finished == false}",
								"<img src='/static/wtgf/img/u919_line.png' style='width:!{item.width}px;height:2px' />",
								"<img src='/static/wtgf/img/u64.png'/>",
								"<img src='/static/wtgf/img/u919_line.png' style='width:!{item.width}px;height:2px' />",
							"{@/if}",
							"<br>!!{item.dispMsg}<br>!{item.datetime}",
						"{@/if}",
					"</td>",
				"{@/each}",
			"</tr>",
		"</table>"
	].join("");
	
	//申购模板
	var tp1 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">业务类型：</td><td style=\"text-align:left\">!{businType}</td><td style=\"text-align:right\">基金名称：</td><td style=\"text-align:left\">!{fundName}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">申请记录</td></tr>",
							"<tr><td style=\"text-align:right\">下单日期：</td><td style=\"text-align:left\">!{orderDate}</td><td style=\"text-align:right\">下单时间：</td><td style=\"text-align:left\">!{orderTime}</td></tr>",
							"<tr><td style=\"text-align:right\">申请金额：</td><td style=\"text-align:left\">!{requestBalance}元</td><td style=\"text-align:right\">支付渠道：</td><td style=\"text-align:left\">!{payMode}</td></tr>",
							"<tr><td style=\"text-align:right\">收费方式：</td><td style=\"text-align:left\">!{shareType}</td><td style=\"text-align:right\">申请单编号：</td><td style=\"text-align:left\">!{delegateNo}</td></tr>",
							"<tr><td style=\"text-align:right\">申请状态：</td><td style=\"text-align:left\">!{state}</td><td></td><td></td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">确认结果</td></tr>",
							"{@each transInInfo as item,index}",
								"<tr><td style=\"text-align:right\">确认金额：</td><td style=\"text-align:left\">",
								"{@if item.confirmBalance != ''}",
								"!{item.confirmBalance}元",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">手续费：</td><td style=\"text-align:left\">",
								"{@if item.confirmFee != ''}",
								"!{item.confirmFee}元",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">确认份额：</td><td style=\"text-align:left\">",
								"{@if item.confirmShare != ''}",
								"!{item.confirmShare}份",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">确认日期：</td><td style=\"text-align:left\">",
								"{@if item.confirmDate != ''}",
								"!{item.confirmDate}",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">当日净值：</td><td style=\"text-align:left\">",
								"{@if item.dateJz != ''}",
								"!{item.dateJz}",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">确认结果：</td><td style=\"text-align:left\">!{item.confirmState}</td></tr>",
							"{@/each}",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	//认购模板
	var tp2 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">业务类型：</td><td style=\"text-align:left\">!{businType}</td><td style=\"text-align:right\">基金名称：</td><td style=\"text-align:left\">!{fundName}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">申请记录</td></tr>",
							"<tr><td style=\"text-align:right\">下单日期：</td><td style=\"text-align:left\">!{orderDate}</td><td style=\"text-align:right\">下单时间：</td><td style=\"text-align:left\">!{orderTime}</td></tr>",
							"<tr><td style=\"text-align:right\">申请金额：</td><td style=\"text-align:left\">!{requestBalance}元</td><td style=\"text-align:right\">支付渠道：</td><td style=\"text-align:left\">!{payMode}</td></tr>",
							"<tr><td style=\"text-align:right\">申请单编号：</td><td style=\"text-align:left\">!{delegateNo}</td>",
							"<td style=\"text-align:right\">申请状态：</td><td style=\"text-align:left\">!{state}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">确认结果</td></tr>",
							"{@each transInInfo as item,index}",
								"<tr><td style=\"text-align:right\">认购行为确认：</td><td style=\"text-align:left\">!{item.subBehaviorConfirmDate}</td><td></td><td></td></tr>",
								"<tr><td style=\"text-align:right\">确认金额：</td><td style=\"text-align:left\">",
								"{@if item.confirmBalance != ''}",
								"!{item.confirmBalance}元",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">手续费：</td><td style=\"text-align:left\">",
								"{@if item.confirmFee != ''}",
								"!{item.confirmFee}元",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">确认份额：</td><td style=\"text-align:left\">",
								"{@if item.confirmShare != ''}",
								"!{item.confirmShare}份",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">份额确认日期：</td><td style=\"text-align:left\">",
								"{@if item.confirmDate != ''}",
								"!{item.confirmDate}",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">当日净值：</td><td style=\"text-align:left\">",
								"{@if item.dateJz != ''}",
								"!{item.dateJz}",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">确认结果：</td><td style=\"text-align:left\">!{item.confirmState}</td></tr>",
							"{@/each}",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	//赎回模板
	var tp3 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">业务类型：</td><td style=\"text-align:left\">!{businType}</td><td style=\"text-align:right\">基金名称：</td><td style=\"text-align:left\">!{fundName}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">申请记录</td></tr>",
							"<tr><td style=\"text-align:right\">下单日期：</td><td style=\"text-align:left\">!{orderDate}</td><td style=\"text-align:right\">下单时间：</td><td style=\"text-align:left\">!{orderTime}</td></tr>",
							"<tr><td style=\"text-align:right\">申请份额：</td><td style=\"text-align:left\">!{requestShare}份</td><td style=\"text-align:right\">收款账户：</td><td style=\"text-align:left\">!{payMode}</td></tr>",
							"<tr><td style=\"text-align:right\">申请单编号：</td><td style=\"text-align:left\">!{delegateNo}</td>",
							"<td style=\"text-align:right\">申请状态：</td><td style=\"text-align:left\">!{state}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">确认结果</td></tr>",
                            "{@if confirmReward == ''}",
                                "<tr><td style=\"text-align:right\">确认金额：</td><td style=\"text-align:left\">",
                                "{@if confirmBalance != ''}",
                                "!{confirmBalance}元",
                                "{@else}--{@/if}",
                                "</td><td style=\"text-align:right\">手续费：</td><td style=\"text-align:left\">",
                                "{@if confirmFee != ''}",
                                "!{confirmFee}元",
                                "{@else}--{@/if}",
                                "</td></tr>",
                                "<tr><td style=\"text-align:right\">确认份额：</td><td style=\"text-align:left\">",
                                "{@if confirmShare != ''}",
                                "!{confirmShare}份",
                                "{@else}--{@/if}",
                                "</td><td style=\"text-align:right\">确认日期：</td><td style=\"text-align:left\">",
                                "{@if confirmDate != ''}",
                                "!{confirmDate}",
                                "{@else}--{@/if}",
                                "</td></tr>",
                                "<tr><td style=\"text-align:right\">当日净值：</td><td style=\"text-align:left\">",
                                "{@if dateJz != ''}",
                                "!{dateJz}",
                                "{@else}--{@/if}",
                                "</td><td style=\"text-align:right\">确认结果：</td><td style=\"text-align:left\">!{confirmState}</td></tr>",
                                "<tr><td style=\"text-align:right\">预计到账时间：</td><td style=\"text-align:left\">",
                                "{@if onAccountDate != ''}",
                                "!{onAccountDate}",
                                "{@else}--{@/if}",
                                "</td><td></td><td></td></tr>",
                            "{@else}",
                                "<tr><td style=\"text-align:right\">确认金额：</td><td style=\"text-align:left\">",
                                "{@if confirmBalance != ''}",
                                "!{confirmBalance}元",
                                "{@else}--{@/if}",
                                "</td><td style=\"text-align:right\">手续费：</td><td style=\"text-align:left\">",
                                "{@if confirmFee != ''}",
                                "!{confirmFee}元",
                                "{@else}--{@/if}",
                                "</td></tr>",
                                "<tr><td style=\"text-align:right\">确认份额：</td><td style=\"text-align:left\">",
                                "{@if confirmShare != ''}",
                                "!{confirmShare}份",
                                "{@else}--{@/if}",
                                "</td><td style=\"text-align:right\">业绩报酬：</td><td style=\"text-align:left\">",
                                "{@if confirmReward != ''}",
                                "!{confirmReward}",
                                "{@else}--{@/if}",
                                "</td></tr>",
                                "<tr><td style=\"text-align:right\">当日净值：</td><td style=\"text-align:left\">",
                                "{@if dateJz != ''}",
                                "!{dateJz}",
                                "{@else}--{@/if}",
                                "</td><td style=\"text-align:right\">确认日期：</td><td style=\"text-align:left\">",
                                "{@if confirmDate != ''}",
                                "!{confirmDate}",
                                "{@else}--{@/if}",
                                "</td></tr>",
                                "<tr><td style=\"text-align:right\">预计到账时间：</td><td style=\"text-align:left\">",
                                "{@if onAccountDate != ''}",
                                "!{onAccountDate}",
                                "{@else}--{@/if}",
                                "</td><td style=\"text-align:right\">确认结果：</td><td style=\"text-align:left\">!{confirmState}</td></tr>",
                            "{@/if}",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	//转换模板
	var tp4 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">业务类型：</td><td style=\"text-align:left\">!{businType}</td><td style=\"text-align:right\">基金名称：</td><td style=\"text-align:left\">!{fundName}->!{otherFundCode}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">申请记录</td></tr>",
							"<tr><td style=\"text-align:right\">下单日期：</td><td style=\"text-align:left\">!{orderDate}</td><td style=\"text-align:right\">下单时间：</td><td style=\"text-align:left\">!{orderTime}</td></tr>",
							"<tr><td style=\"text-align:right\">申请份额：</td><td style=\"text-align:left\">!{requestShare}份</td><td style=\"text-align:right\">支付渠道：</td><td style=\"text-align:left\">!{payMode}</td></tr>",
							"<tr><td style=\"text-align:right\">收费方式：</td><td style=\"text-align:left\">!{shareType}</td><td style=\"text-align:right\">申请单编号：</td><td style=\"text-align:left\">!{delegateNo}</td></tr>",
							"<tr><td style=\"text-align:right\">申请状态：</td><td style=\"text-align:left\">!{state}</td><td></td><td></td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">确认结果</td></tr>",
							"<tr style='background-color: rgb(244, 244, 244);'><td style=\"text-align:right\">转出基金：</td><td style=\"text-align:left\">!{outFundName}</td>",
							"<td style=\"text-align:right\">确认金额：</td>",
							"<td style=\"text-align:left\">",
							"{@if confirmBalance != ''}",
							"!{confirmBalance}元",
							"{@else}--{@/if}",
							"</td></tr>",
							"<tr><td style=\"text-align:right\">确认份额：</td><td style=\"text-align:left\">",
							"{@if confirmShare != ''}",
							"!{confirmShare}份",
							"{@else}--{@/if}",
							"</td>",
							"<td style=\"text-align:right\">确认日期：</td><td style=\"text-align:left\">",
							"{@if confirmDate != ''}",
							"!{confirmDate}",
							"{@else}--{@/if}",
							"</td></tr>",
							"<tr><td style=\"text-align:right\">当日净值：</td><td style=\"text-align:left\">",
							"{@if dateJz != ''}",
							"!{dateJz}",
							"{@else}--{@/if}",
							"</td>",
							"<td style=\"text-align:right\">确认结果：</td><td style=\"text-align:left\">!{confirmState}</td></tr>",
							"{@each transInInfo as item,index}",
								"<tr style='background-color: rgb(244, 244, 244);'><td style=\"text-align:right\">转入基金：</td><td style=\"text-align:left\">!{item.outFundName}</td>",
								"<td style=\"text-align:right\">确认金额：</td><td style=\"text-align:left\">",
								"{@if item.confirmBalance != ''}",
								"!{item.confirmBalance}元",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">确认份额：</td><td style=\"text-align:left\">",
								"{@if item.confirmShare != ''}",
								"!{item.confirmShare}份",
								"{@else}--{@/if}",
								"</td>",
								"<td style=\"text-align:right\">确认日期：</td><td style=\"text-align:left\">",
								"{@if item.confirmDate != ''}",
								"!{item.confirmDate}",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">当日净值：</td><td style=\"text-align:left\">",
								"{@if item.dateJz != ''}",
								"!{item.dateJz}",
								"{@else}--{@/if}",
								"</td>",
								"<td style=\"text-align:right\">确认结果：</td><td style=\"text-align:left\">!{item.confirmState}</td></tr>",
								"<tr><td style='text-align:right'>手续费：</td>",
								"<td style=\"text-align:left\">",
								"{@if confirmFee != ''}",
								"!{confirmFee}元",
								"{@else}--{@/if}",
								"</td><td></td><td></td></tr>",
							"{@/each}",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	//赎回转申购模板
	var tp5 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">业务类型：</td><td style=\"text-align:left\">!{businType}</td><td style=\"text-align:right\">基金名称：</td><td style=\"text-align:left\">!{fundName}->!{otherFundCode}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">申请记录</td></tr>",
							"<tr><td style=\"text-align:right\">下单日期：</td><td style=\"text-align:left\">!{orderDate}</td><td style=\"text-align:right\">下单时间：</td><td style=\"text-align:left\">!{orderTime}</td></tr>",
							"<tr><td style=\"text-align:right\">申请份额：</td><td style=\"text-align:left\">!{requestShare}份</td><td style=\"text-align:right\">支付渠道：</td><td style=\"text-align:left\">!{payMode}</td></tr>",
							"<tr><td style=\"text-align:right\">收费方式：</td><td style=\"text-align:left\">!{shareType}</td><td style=\"text-align:right\">申请单编号：</td><td style=\"text-align:left\">!{delegateNo}</td></tr>",
							"<tr><td style=\"text-align:right\">申请状态：</td><td style=\"text-align:left\">!{state}</td><td></td><td></td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">确认结果</td></tr>",
							"{@if businType == '赎回转认购'}",
							"<tr><td style=\"text-align:right\">认购行为确认：</td><td style=\"text-align:left\">!{subBehaviorConfirmDate}</td><td></td><td></td></tr>",
							"{@/if}",
							"<tr style='background-color: rgb(244, 244, 244);'><td style=\"text-align:right\">赎回基金：</td><td style=\"text-align:left\" colspan='3'>!{outFundName}</td></tr>",
							"<tr><td style=\"text-align:right\">确认金额：</td><td style=\"text-align:left\">",
							"{@if confirmBalance != ''}",
							"!{confirmBalance}元",
							"{@else}--{@/if}",
							"</td><td style=\"text-align:right\">手续费：</td><td style=\"text-align:left\">",
							"{@if confirmFee != ''}",
							"!{confirmFee}元",
							"{@else}--{@/if}",
							"</td></tr>",
							"<tr><td style=\"text-align:right\">确认份额：</td><td style=\"text-align:left\">",
							"{@if confirmShare != ''}",
							"!{confirmShare}份",
							"{@else}--{@/if}",
							"</td><td style=\"text-align:right\">确认日期：</td><td style=\"text-align:left\">",
							"{@if confirmDate != ''}",
							"!{confirmDate}",
							"{@else}--{@/if}",
							"</td></tr>",
							"<tr><td style=\"text-align:right\">当日净值：</td><td style=\"text-align:left\">",
							"{@if dateJz != ''}",
							"!{dateJz}",
							"{@else}--{@/if}",
							"</td><td style=\"text-align:right\">确认结果：</td><td style=\"text-align:left\">!{confirmState}</td></tr>",
							"{@each transInInfo as item,index}",
								"<tr style='background-color: rgb(244, 244, 244);'><td style=\"text-align:right\">申购基金：</td><td style=\"text-align:left\" colspan='3'>!{item.outFundName}</td></tr>",
								"<tr><td style=\"text-align:right\">确认金额：</td><td style=\"text-align:left\">",
								"{@if item.confirmBalance != ''}",
								"!{item.confirmBalance}元",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">手续费：</td><td style=\"text-align:left\">",
								"{@if item.confirmFee != ''}",
								"!{item.confirmFee}元",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">确认份额：</td><td style=\"text-align:left\">",
								"{@if item.confirmShare != ''}",
								"!{item.confirmShare}份",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">确认日期：</td><td style=\"text-align:left\">",
								"{@if item.confirmDate != ''}",
								"!{item.confirmDate}",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">当日净值：</td><td style=\"text-align:left\">",
								"{@if item.dateJz != ''}",
								"!{item.dateJz}",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">确认结果：</td><td style=\"text-align:left\">!{item.confirmState}</td></tr>",
							"{@/each}",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	//组合申购模板
	var tp6 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">业务类型：</td><td style=\"text-align:left\">!{businType}</td><td style=\"text-align:right\">基金名称：</td><td style=\"text-align:left\">!{fundName}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">申请记录</td></tr>",
							"<tr><td style=\"text-align:right\">下单日期：</td><td style=\"text-align:left\">!{orderDate}</td><td style=\"text-align:right\">下单时间：</td><td style=\"text-align:left\">!{orderTime}</td></tr>",
							"<tr><td style=\"text-align:right\">申请金额：</td><td style=\"text-align:left\">!{requestBalance}元</td><td style=\"text-align:right\">支付渠道：</td><td style=\"text-align:left\">!{payMode}</td></tr>",
							"<tr><td style=\"text-align:right\">申请单编号：</td><td style=\"text-align:left\">!{delegateNo}</td>",
							"<td style=\"text-align:right\">申请状态：</td><td style=\"text-align:left\">!{state}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">确认结果</td></tr>",
							"{@each transInInfo as item,index}",
								"<tr style='background-color: rgb(244, 244, 244);'><td style=\"text-align:right\">基金名称：</td><td style=\"text-align:left\">!{item.outFundName}</td><td  style='text-align:right'>收费方式：</td><td style='text-align:left'>",
								"{@if item.shareType != ''}",
								"!{item.shareType}",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">确认金额：</td><td style=\"text-align:left\">",
								"{@if item.confirmBalance != ''}",
								"!{item.confirmBalance}元",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">手续费：</td><td style=\"text-align:left\">",
								"{@if item.confirmFee != ''}",
								"!{item.confirmFee}元",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">确认份额：</td><td style=\"text-align:left\">",
								"{@if item.confirmShare != ''}",
								"!{item.confirmShare}份",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">确认日期：</td><td style=\"text-align:left\">",
								"{@if item.confirmDate != ''}",
								"!{item.confirmDate}",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">当日净值：</td><td style=\"text-align:left\">",
								"{@if item.dateJz != ''}",
								"!{item.dateJz}",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">确认结果：</td><td style=\"text-align:left\">!{item.confirmState}</td></tr>",
							"{@/each}",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	//还款模板
	var tp7 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">业务类型：</td><td style=\"text-align:left\" colspan='3'>!{businType}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">申请记录</td></tr>",
							"<tr><td style=\"text-align:right\">还款类型：</td><td style=\"text-align:left\">!{businType} </td><td></td><td></td></tr>",
							"<tr><td style=\"text-align:right\">目标卡银行：</td><td style=\"text-align:left\">!{receiveBankNo}</td><td style=\"text-align:right\">目标卡号：</td><td style=\"text-align:left\">!{receiveBankAcco}</td></tr>",
							"<tr><td style=\"text-align:right\">还款金额：</td><td style=\"text-align:left\">!{requestBalance}元</td>",
							"<td style=\"text-align:right\">收款人：</td><td style=\"text-align:left\">!{receiverName} </td></tr>",
							"<tr><td style=\"text-align:right\">还款日期：</td><td style=\"text-align:left\">",
							"{@if confirmDate != ''}",
							"!{confirmDate}",
							"{@else}--{@/if}",
							"</td><td style=\"text-align:right\">到款日期：</td><td style=\"text-align:left\">",
							"{@if onAccountDate != ''}",
							"!{onAccountDate}",
							"{@else}--{@/if}",
							"</td></tr>",
							"<tr><td style=\"text-align:right\">交易流水号：</td><td style=\"text-align:left\">!{delegateNo} </td>",
							"<td style=\"text-align:right\">还款状态：</td><td style=\"text-align:left\">!{confirmState}</td></tr>",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	//钱袋子支付模板
	var tp8 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">业务类型：</td><td style=\"text-align:left\" colspan='3'>!{businType}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">申请记录</td></tr>",
							"<tr><td style=\"text-align:right\">产品名称：</td><td style=\"text-align:left\">!{businType}</td><td></td><td></td></tr>",
							"<tr><td style=\"text-align:right\">下单日期：</td><td style=\"text-align:left\">!{orderDate}</td><td style=\"text-align:right\">下单时间：</td><td style=\"text-align:left\">!{orderTime}</td></tr>",
							"<tr><td style=\"text-align:right\">申请金额：</td><td style=\"text-align:left\">!{requestBalance}元</td>",
							"<td style=\"text-align:right\">支付渠道：</td><td style=\"text-align:left\">!{payMode}</td></tr>",
							"<tr><td style=\"text-align:right\">申请单编号：</td><td style=\"text-align:left\">!{delegateNo}</td><td style=\"text-align:right\">申请状态：</td><td style=\"text-align:left\">!{state}</td></tr>",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	var bindEvent = function(){
        $("#province").focus(searchDev,focusText).keyup(searchDev).change(searchDev).blur(blurText);
        $("#startDatePicker").change(function(){
			var beforeC = $("#startDate").val();
			if($("#startDatePicker").val()>$("#endDateTextPicker").val()){
				alert("开始日期不能比结束日期大");
				//恢复到原来选择的日期
				$( "#startDatePicker" ).datepicker( "setDate", beforeC);
			}else{
				setDate("startDatePicker","startDate");
			}
		});
        $("#endDateTextPicker").change(function(){
			var beforeL = $("#endDate").val();
			if($("#endDateTextPicker").val()<$("#startDatePicker").val()){
				alert("结束日期不能比开始日期小");
				$( "#endDateTextPicker" ).datepicker( "setDate", beforeL);
			}else{
				setDate("endDateTextPicker","endDate");
			}
		});
		$(".showDetailInfo").click(function(e){
			var delegateNo = $(this).parent().find("input:eq(0)").val();
			var businType = $(this).parent().find("input:eq(4)").val();
			var requestType = $(this).parent().find("input:eq(2)").val();
			//异步加载弹出框需要的详细信息
			$.get("/main/query/queryDetailInfo?delegateNo="+delegateNo+"&businType="+businType+"&requestType="+requestType,function(data){
				var innerContent = "";
				if(data.data == "error"){
					alert("系统繁忙，请稍候再试!");
					return;
				}
				if(data.data.showType=="1"){
					innerContent = tp1;
				}else if(data.data.showType=="2"){
					innerContent = tp2;
				}else if(data.data.showType=="3"){
					innerContent = tp3;
				}else if(data.data.showType=="4"){
					innerContent = tp4;
				}else if(data.data.showType=="5"){
					innerContent = tp5;
				}else if(data.data.showType=="6"){
					innerContent = tp6;
				}else if(data.data.showType=="7"){
					innerContent = tp7;
				}else if(data.data.showType=="8"){
					innerContent = tp8;
				}
				//juicer作用是将数据，传输到模板里面。
				var result = juicer(innerContent,data.data);
				//将\n换行内容，换成html的换行
				result = result.replace(/\n/g, "<br />");
				$("#bodyHtml").html(result);
				var maxHeight = $(window).height()*0.8 - 111;
				$("#bodyHtml").css("max-height",maxHeight+"px");
				$("#myModal").modal('show');
			});
		});
		
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
		
		/*$("#segDate").change(function(){
			var segDate = $("#segDate").val();
            if(segDate==6){
                $("#timeDIV").css("display","block");
                $("#selDIV").css("display","none");
            }else{
                //改变期间，则重新设置开始日期、结束日期。
                $( "#endDateTextPicker" ).datepicker( "setDate", new Date());
                setDate("endDateTextPicker","endDate");
                $( "#startDatePicker" ).datepicker( "setDate", getEndDate($( "#endDateTextPicker" ).val(),segDate));
                setDate("startDatePicker","startDate");
            }
		});*/
		
		$(".rollback").click(function(e){
			var delegateNo = $(this).parent().find("input:eq(0)").val();
			var redomDay = $(this).parent().find("input:eq(3)").val();
            var tradeAcco = $(this).parent().find("input:eq(5)").val();
			if(delegateNo.indexOf('|')!=-1){
				//解析出delegateNo
				delegateNo =  delegateNo.split('|')[3];
			}
			
			var businTypeView = $(this).parent().find("input:eq(1)").val();
            var doCancel = false;
            if (businTypeView == "申购" || businTypeView == "认购" || businTypeView == "约定申购" || businTypeView == "定期申购"
                || businTypeView == "趋势定投" || businTypeView == "钱袋子申购基金" || businTypeView == "钱袋子认购基金"
                || businTypeView == "组合购买" || businTypeView == "组合定投" || businTypeView == "钱袋子定投"
                || businTypeView == "钱袋子趋势定投") {
                doCancel = confirm("确定要撤销该笔交易吗？\n钱袋子支付已实时退款，银行卡支付退款于"+redomDay+"到账。");
            } else {
                doCancel = confirm("确定要撤销该笔交易吗？");
            }
			if (doCancel)
            {
				if(businTypeView == "组合购买" || businTypeView == "组合定投"){
					//组合交易撤单
					window.open("/trade/TrustQueryAction.do?method=rollbackDo&applyNo=" + delegateNo, "_self");
				}else if(businTypeView == "钱袋子取现" || businTypeView == "钱袋子买基金" || businTypeView == "钱袋子认购基金" || businTypeView == "钱袋子申购基金"){
					//所有钱袋子购买的是一个撤销方式
					$.get("/main/query/rollWallet?delegateNo="+delegateNo+"&tradeacco="+tradeAcco,function(data){
						alert(data.data);
						$("#queryForm").attr("action","/main/query/queryList");
						$("#queryForm").submit();
					});
				}else{
					//普通基金撤单
					window.open("/trade/RollBackTradeAction.do?method=rollbackDo&applyNo=" + delegateNo, "_self");
				}
            }
		});
		
		$(".saleRecord").click(function(e){
			$("#queryForm").attr("action","/main/query/queryList");
			$("#queryForm").submit();
		});
		
		$(".otherSaleRecord").click(function(e){
			$("#queryForm").attr("action","/main/query/otherNetList");
			$("#queryForm").submit();
		});



        //期间显示方法设置
        $(document).click(function(event){
            if(!$(event.target).hasClass("banklist") && !$(event.target).hasClass("bankshow") && !$(event.target).hasClass("bankname")) {
                CreditCard.hideBankList();
            }
        });

        $(".bankshow").click(function () {

            if ($(".bankshow").css("background-image").indexOf("bg-arr-down.gif") > 0) {
                CreditCard.showBankList();
            } else {
                CreditCard.hideBankList();
            }
        });

        $(document).click(function(event){
            if(!$(event.target).hasClass("banklist") && !$(event.target).hasClass("bankshow") && !$(event.target).hasClass("bankname")) {
                CreditCard.hideBankList();
            }
        });


        $(".banklist li").each(function (index, element) {

            $(this).click(function () {

                var bankkey=$(this).attr("bankkey");
                $("#segDate").val(bankkey);
                CreditCard.hideBankList();

                if(bankkey=='6'){
                    $(".bankshow").html('');

                    $("#selDIV").hide();
                    $("#timeDIV").show();

                    $("#endDateTextPicker").datepicker("setDate", $("#endDateVal").val());
                    setDate("endDateTextPicker","endDate");

                    $("#startDatePicker").datepicker("setDate",getEndDate($("#endDateTextPicker").val(),"2"));
                    setDate("startDatePicker","startDate");

                }else{
                    //改变期间，则重新设置开始日期、结束日期。
                    $(".bankshow").html('<div class="bankname">' + $(this).text() + '</div>');

                    $("#selDIV").show();
                    $("#timeDIV").hide();
                    $("#endDateTextPicker").datepicker( "setDate", $("#endDateVal").val());
                    setDate("endDateTextPicker","endDate");
                    $("#startDatePicker").datepicker( "setDate", getEndDate($("#endDateTextPicker").val(),bankkey));
                    setDate("startDatePicker","startDate");

                }
            });
        });
        if(""!=$("#segDate").val()){
            if($("#segDate").val()=="6"){
                $("#selDIV").hide();
                $("#timeDIV").show();
                Timeselector.hideTimeList();
            }else{
                $(".banklist li[bankkey='"+$("#segDate").val()+"']").click();
            }



        }
        else{
        
           // $".banklist li[bankkey='2']").click();
        }


        //带时间框期间显示方法设置
        $(document).click(function(event){
            if(!$(event.target).hasClass("timelist") && !$(event.target).hasClass("timeshow") && !$(event.target).hasClass("timename")) {
                Timeselector.hideTimeList();
            }
        });

        $(".timeshow").click(function () {

            if ($(".timeshow").css("background-image").indexOf("bg-arr-down.gif") > 0) {
                Timeselector.showTimeList();
            } else {
                Timeselector.hideTimeList();
            }
        });



        $(".timelist li").each(function (index, element) {

            $(this).click(function () {

                var timekey=$(this).attr("timekey");
                $("#segDate").val(timekey);
                Timeselector.hideTimeList();

                if(timekey=="6"){
                    $("#selDIV").hide();
                    $("#timeDIV").show();
                    $(".bankshow").html('');
                    $("#endDateTextPicker").datepicker( "setDate",$("#endDateVal").val());
                    setDate("endDateTextPicker","endDate");
                    $("#startDatePicker").datepicker( "setDate", getEndDate($("#endDateTextPicker").val(),"2"));
                    setDate("startDatePicker","startDate");

                }else{
                   //改变期间，则重新设置开始日期、结束日期。
                    $("#selDIV").show();
                    $("#timeDIV").hide();
                    $(".bankshow").html('<div class="bankname">' + $(this).text() + '</div>');

                    $("#endDateTextPicker").datepicker("setDate", $("#endDateVal").val());
                    setDate("endDateTextPicker","endDate");
                    $("#startDatePicker").datepicker( "setDate", getEndDate($("#endDateTextPicker").val(),timekey));
                    setDate("startDatePicker","startDate");
                }
            });
        });


        //业务类型选择器方法
        //ajax_url是这个input绑定的ajax数据地址
        $(document).click(function(event){
            if(!$(event.target).hasClass("busslist") && !$(event.target).hasClass("bussshow") && !$(event.target).hasClass("bussname")) {
                Bussiness.hideBussList();
            }
        });

        $(".bussshow").click(function () {

            if ($(".bussshow").css("background-image").indexOf("bg-arr-down.gif") > 0) {

                Bussiness.showBussList();
            } else {
                Bussiness.hideBussList();
            }
        });




        $(".busslist li").each(function (index, element) {

            $(this).click(function () {

                var busskey=$(this).attr("busskey");

                Bussiness.hideBussList();
                $(".bussshow").html('<div class="bussname">' + $(this).text() + '</div>');

                $("#businType").val(busskey);

            });
        });
        $(".busslist li[busskey='"+$("#businType").val()+"']").click();
        //销售渠道选择器方法
        //ajax_url是这个input绑定的ajax数据地址
        $(document).click(function(event){
            if(!$(event.target).hasClass("tradelist") && !$(event.target).hasClass("tradeshow") && !$(event.target).hasClass("tradename")) {
                TradeCaptal.hideTradeList();
            }
        });

        $(".tradeshow").click(function () {
            if ($(".tradeshow").css("background-image").indexOf("bg-arr-down.gif") > 0) {
                TradeCaptal.showTradeList();
            } else {
                TradeCaptal.hideTradeList();
            }
        });

        $(".tradelist li").each(function (index, element) {

            $(this).click(function () {

                var tradekey=$(this).attr("tradekey");

                TradeCaptal.hideTradeList();
                $(".tradeshow").html('<div class="tradename">' + $(this).text() + '</div>');
                $("#tradeCapital").val(tradekey);

            });
        });

        $(".tradelist li[tradekey='"+$("#tradeCapital").val()+"']").click();
        if(null!=$("#fundCode").val() && ""!==$("#fundCode").val() && ""!=$("#fundName").val() && null!=$("#fundName").val()) {
            $("#province").val($("#fundCode").val()+"|"+$("#fundName").val());
        }

        $(".selectxiala").click(function () {
            searchDev("");
        });


    };
	
    return {
        init : _init,
		setDate:setDate,
		bindEvent:bindEvent
    }
})();

$(function(){
    main.init();
	main.bindEvent();
	//$('#myTab a:last').tab('show');
	$('#element').tooltip('show');
});

//业务类型显示隐藏方法
var Bussiness=function(){}

Bussiness.showBussList=function(){

    $(".busslist").show();
    $(".bussshow").css("background-image","url(/static/wtgf/img/bg-arr-up.gif)");

}

Bussiness.hideBussList=function(){
    $(".busslist").hide();
    $(".bussshow").css("background-image","url(/static/wtgf/img/bg-arr-down.gif)");
}
//期间显示隐藏方法
var CreditCard=function(){}

CreditCard.showBankList=function(){
    $(".banklist").show();
    $(".bankshow").css("background-image","url(/static/wtgf/img/bg-arr-up.gif)");
}

CreditCard.hideBankList=function(){
    $(".banklist").hide();
    $(".bankshow").css("background-image","url(/static/wtgf/img/bg-arr-down.gif)");
}



//销售渠道显示隐藏方法
var TradeCaptal=function(){}

TradeCaptal.showTradeList=function(){
    $(".tradelist").show();
    $(".tradeshow").css("background-image","url(/static/wtgf/img/bg-arr-up.gif)");
}

TradeCaptal.hideTradeList=function(){
    $(".tradelist").hide();
    $(".tradeshow").css("background-image","url(/static/wtgf/img/bg-arr-down.gif)");
}

//销售渠道显示隐藏方法
var Timeselector=function(){}

Timeselector.showTimeList=function(){
    $(".timelist").show();
    $(".timeshow").css("background-image","url(/static/wtgf/img/bg-arr-up.gif)");
}

Timeselector.hideTimeList=function(){
    $(".timelist").hide();
    $(".timeshow").css("background-image","url(/static/wtgf/img/bg-arr-down.gif)");
}
var $xialaSELECT;
var k = 1;


$(document).ready(function(){
    initXialaSelect();
    initSearch();
    searchDev("");
    $(document).click(function(event)
    {
        if(k ==2){
            k = 1;
            if($xialaSELECT)
            {

                if ($xialaSELECT.css('display') == 'block') {
                    $xialaSELECT.hide();
                    $("#selectxiala").css("background-image","url(/static/wtgf/img/bg-arr-down.gif)");
                }
            }
        }else{
            k = 2;
        }
    });

    $(".selectshow").click(function () {

        if ($(".selectshow").css("background-image").indexOf("bg-arr-up.gif") > 0) {
            var obj = eval('(' + $("#fundlist").val() + ')');
            query="";
            xiala(obj);
        } else {
            $("#selectxiala").css("background-image","url(/static/wtgf/img/bg-arr-down.gif)");
            $xialaSELECT.hide();
        }
    });
});
var temptimeout=null;
var query="";
function searchDev(key){
    query=$("#province").val();
    if(query=="请输入基金名称、代码"){
        query="";

    }
    var obj = eval('(' + $("#fundlist").val() + ')');
    xiala(obj);
    /*if(key==""){
        $("#fundCode").val("");
        $("#fundName").val("");
    }*/

}
function initSearch()
{
//定义一个下拉按钮层，并配置样式(位置，定位点坐标，大小，背景图片，Z轴)，追加到文本框后面
    $xialaDIV = $('<div id="selectxiala" class="selectshow"></div>').css('left', $('#province').position().left + $('#province').width() - 15 + 'px').css('top',
            $('#province').position().top + 4 + 'px');
    $('#province').after($xialaDIV);

//鼠标进入修改背景图位置
    $xialaDIV.mouseover(function(){
      //  $xialaDIV.css('background-position', ' 0% -16px');
    });
//鼠标移出修改背景图位置
    $xialaDIV.mouseout(function(){
       // $xialaDIV.css('background-position', ' 0% -0px');
    });
//鼠标按下修改背景图位置
    $xialaDIV.mousedown(function(){
       // $xialaDIV.css('background-position', ' 0% -32px');
    });
//鼠标释放修改背景图位置
    $xialaDIV.mouseup(function(){
      //  $xialaDIV.css('background-position', ' 0% -16px');
        if($xialaSELECT){
            $("#selectxiala").css("background-image","url(/static/wtgf/img/bg-arr-up.gif)");
            $xialaSELECT.show();
        }

    });
    $('#province').mouseup(function(){
      //  $xialaDIV.css('background-position', ' 0% -16px');
        $xialaSELECT.show();
        $("#selectxiala").css("background-image","url(/static/wtgf/img/bg-arr-up.gif)");
    });
}
var firstTimeYes=1;
//文本框的下拉框div
function xiala(data){
//first time
    if($xialaSELECT)
    {
        $xialaSELECT.empty();
    }
//定义一个下拉框层，并配置样式(位置，定位点坐标，宽度，Z轴)，先将其隐藏
//定义五个选项层，并配置样式(宽度，Z轴一定要比下拉框层高)，添加name、value属性，加入下拉框层

   var uloption="<ul style='padding-left:5px;margin:0px;'>";
    var lioption="";
    if(null!=data && data.length>0){
        for(var i=0;i<data.length;i++){
            if(query==""){
                lioption+=("<li style='float:left;width:240px;height:20px;display:inline;cursor:pointer;padding-left:1px;text-align: left;'  ><a   href='javascript:;'  >"+data[i].fundcode+"|"+data[i].fundname+"</a></li>")
            }else{
                if(data[i].fundcode.indexOf(query)>-1 || data[i].fundname.indexOf(query)>-1 || ((data[i].fundcode+"|"+data[i].fundname).indexOf(query)>-1)){
                    lioption+=("<li style='float:left;width:240px;height:20px;display:inline;cursor:pointer;padding-left:1px;text-align: left;'   ><a  href='javascript:;'  >"+data[i].fundcode+"|"+data[i].fundname+"</a></li>")
                }
            }
        }
        if(lioption==""){
            lioption+=("<li style='float:left;width:240px;height:20px;display:inline;cursor:pointer;padding-left:1px;text-align: left;'  ><a   href='javascript:;'  >无匹配结果,请重新输入或重新选择转人基金</a></li>")
        }
    }else{
        lioption+=("<li style='float:left;width:240px;height:20px;display:inline;cursor:pointer;padding-left:1px;text-align: left;'  ><a   href='javascript:;'  >无匹配结果,请重新输入或重新选择转人基金</a></li>")
    }

    lioption+="</ul>";

    $xialaSELECT.append(uloption+lioption);
    if(firstTimeYes == 1)
    {
        firstTimeYes =firstTimeYes+1;
    }else{
        $xialaSELECT.show();
        $("#selectxiala").css("background-image","url(/static/wtgf/img/bg-arr-up.gif)");
    }

}
function initXialaSelect()
{
    $xialaSELECT = $('<div id="searchdiv" ></div>').css('position', 'absolute').css('overflow-y','auto').css('overflow-x','hidden').css('border', '1px solid #dcdcdc').css('border-top','none').css('left', $('#province').left+'px').css
        ('top', $('#province').position().top + $('#province').height() + 10+ 'px').css('width', $('#province').width()+100 + 'px').css('z-index', '101').css('width','253px').css('background','#fff').css('min-height','0px').css('max-height','200px');
    $('#province').after($xialaSELECT);
//选项层的鼠标移入移出样式
    $xialaSELECT.mouseover(function(event){
        if ($(event.target).attr('name') == 'option') {
//移入时背景色变深，字色变白
            $(event.target).css('background-color', '#000077').css('color', 'white');
            $(event.target).mouseout(function(){
//移出是背景色变白，字色变黑
                $(event.target).css('background-color', '#FFFFFF').css('color', '#000000');
            });
        }
    });
//通过点击位置，判断弹出的显示
    $xialaSELECT.mouseup(function(event){
//如果是下拉按钮层或下拉框层，则依然显示下拉框层
        if (event.target == $xialaSELECT.get(0) || event.target == $xialaDIV.get(0)) {
            $xialaSELECT.show();
            $("#selectxiala").css("background-image","url(/static/wtgf/img/bg-arr-up.gif)");
        }
        else {
//如果是选项层，则改变文本框的值
            var fundcode=$(event.target).html().split("|")[0];
            var fundname=$(event.target).html().split("|")[1];
            $("#fundCode").val(fundcode);
            $("#fundName").val(fundname);
            $("#province").val($(event.target).html());
//如果是其他位置，则将下拉框层
            if ($xialaSELECT.css('display') == 'block' ) {
                $xialaSELECT.hide();
                $("#selectxiala").css("background-image","url(/static/wtgf/img/bg-arr-down.gif)");
            }
        }
    });
    $xialaSELECT.hide();
    $("#selectxiala").css("background-image","url(/static/wtgf/img/bg-arr-down.gif)");
}


	$("#J_submitButton").click(function(){
            $("#pageNo").val("1");
            $("#queryForm").submit();
        });

function focusText(){
    var val=$("#province").val();
    if(val=="请输入基金名称、代码"){
        $("#province").val("")
    }
    $(".cba").css("color","#000000");
}

function blurText(){
    var val=$("#province").val();
    if(val==""){
        $("#province").val("请输入基金名称、代码")
        $(".cba").css("color","#999");
         $("#fundCode").val("");
         $("#fundName").val("");
    }

}










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
    };
	//将隐藏域日期设置的和选择的日期控件一致。
	var setDate = function(datePicVar,dateVar){
		var t = $("#"+datePicVar).val();
		$("#"+dateVar).attr("value",t);
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
				
			}else if(type == 3){
				monthCount = -1;
			}else if(type == 4){
				monthCount = -3;
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
			}
        
            var t2 = year2 + '-' + month2 + '-' + day2;
            return t2;
    };
	
	var bindEvent = function(){
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
		
		$("#segDate").change(function(){
			var segDate = $("#segDate").val();
			//改变期间，则重新设置开始日期、结束日期。
			$( "#endDateTextPicker" ).datepicker( "setDate", new Date());
			setDate("endDateTextPicker","endDate");
			$( "#startDatePicker" ).datepicker( "setDate", getEndDate($( "#endDateTextPicker" ).val(),segDate));
			setDate("startDatePicker","startDate");
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
});

var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js");
	dialog = require("common:widget/dialog/dialog.js");

var main = (function(){
    var _init = function(){
		//���ý�������
		$("#endDateTextPicker").datepicker({
            dateFormat : "yy-mm-dd",
            changeYear : true,
            changeMonth : true,
			currentText: "Now"
        });
		
		//��ʼ��һ���º�Ϊ��������
		//$( "#endDateTextPicker" ).datepicker( "setDate", new Date());
		//setDate("endDateTextPicker","endDate");
		
		//���ÿ�ʼ����
		$("#startDatePicker").datepicker({
            dateFormat : "yy-mm-dd",
            changeYear : true,
            changeMonth : true,
			currentText: "Now"
        });
		//��ʼ������
		//$( "#startDatePicker" ).datepicker( "setDate", getEndDate($( "#endDateTextPicker" ).val(),2));
		//�������������������ڣ����ڴ��䵽��̨����ͬ��
		//setDate("startDatePicker","startDate");
		$("[data-toggle='tooltip']").tooltip(); 
    };
	//���������������õĺ�ѡ������ڿؼ�һ�¡�
	var setDate = function(datePicVar,dateVar){
		var t = $("#"+datePicVar).val();
		$("#"+dateVar).attr("value",t);
	};
	//����������ڣ����typeΪ1�������һ�ܣ����typeΪ2�������һ���£����typeΪ3�������3���£����typeΪ4����������ꣻ���typeΪ5�������һ�ꡣ
	var getEndDate = function (date,type) {
            var arr = date.split('-');
            var year = arr[0]; //��ȡ��ǰ���ڵ����
            var month = arr[1]; //��ȡ��ǰ���ڵ��·�
            var day = arr[2]; //��ȡ��ǰ���ڵ���
            var days = new Date(year, month, 0);
            days = days.getDate(); //��ȡ��ǰ�����е��µ�����
            var year2 = year;
			var monthCount = 0;
			if(type == 1){
				if(parseInt(day)<=7){
					//�����ǰ��С�ڵ���7,����µ���һ����,���Ҳ�����,����ᴦ��
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
				//��һ�����ڣ���Ҫ���¼�����
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
				alert("��ʼ���ڲ��ܱȽ������ڴ�");
				//�ָ���ԭ��ѡ�������
				$( "#startDatePicker" ).datepicker( "setDate", beforeC);
			}else{
				setDate("startDatePicker","startDate");
			}
		});
        $("#endDateTextPicker").change(function(){
			var beforeL = $("#endDate").val();
			if($("#endDateTextPicker").val()<$("#startDatePicker").val()){
				alert("�������ڲ��ܱȿ�ʼ����С");
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
			//�ı��ڼ䣬���������ÿ�ʼ���ڡ��������ڡ�
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

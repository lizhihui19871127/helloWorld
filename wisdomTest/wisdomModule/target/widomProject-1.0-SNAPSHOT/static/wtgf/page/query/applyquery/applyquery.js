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

       var bussinse = eval('(' + $("#bussinessList").val() + ')');
       var tradeCaptal = eval('(' + $("#tradeCaptalList").val() + ')');

      var lioption="<ul style='padding-left:5px;margin:0px;'> <li   tradekey='' ><a  tradekey=''  href='javascript:;'>ȫ��</a></li>";

        for(var i=0;i<tradeCaptal.length;i++){

                lioption+=("<li  tradekey='"+tradeCaptal[i].value+"' ><a  tradekey='"+tradeCaptal[i].value+"'  href='javascript:;'>"+tradeCaptal[i].name+"</a></li>")

        }
        lioption+="</ul>";

        $("#tradeCaptal").append(lioption);


        var bussoption="<ul style='padding-left:5px;margin:0px;'> <li   busskey='' ><a  busskey=''  href='javascript:;'>ȫ��</a></li>";
        var bussinoption="";
        var common="��ֵ,Ǯ���ӿ���ȡ��,Ǯ����ȡ��,Ǯ�����깺����,�깺,Ǯ�����Ϲ�����,�Ϲ�,���,ת��";

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
	//���������������õĺ�ѡ������ڿؼ�һ�¡�
	var setDate = function(datePicVar,dateVar){
		var t = $("#"+datePicVar).val();

        $("#"+dateVar).val(t);


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
	//ʱ����
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
	
	//�깺ģ��
	var tp1 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">ҵ�����ͣ�</td><td style=\"text-align:left\">!{businType}</td><td style=\"text-align:right\">�������ƣ�</td><td style=\"text-align:left\">!{fundName}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">�����¼</td></tr>",
							"<tr><td style=\"text-align:right\">�µ����ڣ�</td><td style=\"text-align:left\">!{orderDate}</td><td style=\"text-align:right\">�µ�ʱ�䣺</td><td style=\"text-align:left\">!{orderTime}</td></tr>",
							"<tr><td style=\"text-align:right\">�����</td><td style=\"text-align:left\">!{requestBalance}Ԫ</td><td style=\"text-align:right\">֧��������</td><td style=\"text-align:left\">!{payMode}</td></tr>",
							"<tr><td style=\"text-align:right\">�շѷ�ʽ��</td><td style=\"text-align:left\">!{shareType}</td><td style=\"text-align:right\">���뵥��ţ�</td><td style=\"text-align:left\">!{delegateNo}</td></tr>",
							"<tr><td style=\"text-align:right\">����״̬��</td><td style=\"text-align:left\">!{state}</td><td></td><td></td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">ȷ�Ͻ��</td></tr>",
							"{@each transInInfo as item,index}",
								"<tr><td style=\"text-align:right\">ȷ�Ͻ�</td><td style=\"text-align:left\">",
								"{@if item.confirmBalance != ''}",
								"!{item.confirmBalance}Ԫ",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">�����ѣ�</td><td style=\"text-align:left\">",
								"{@if item.confirmFee != ''}",
								"!{item.confirmFee}Ԫ",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">ȷ�Ϸݶ</td><td style=\"text-align:left\">",
								"{@if item.confirmShare != ''}",
								"!{item.confirmShare}��",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">ȷ�����ڣ�</td><td style=\"text-align:left\">",
								"{@if item.confirmDate != ''}",
								"!{item.confirmDate}",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">���վ�ֵ��</td><td style=\"text-align:left\">",
								"{@if item.dateJz != ''}",
								"!{item.dateJz}",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">ȷ�Ͻ����</td><td style=\"text-align:left\">!{item.confirmState}</td></tr>",
							"{@/each}",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	//�Ϲ�ģ��
	var tp2 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">ҵ�����ͣ�</td><td style=\"text-align:left\">!{businType}</td><td style=\"text-align:right\">�������ƣ�</td><td style=\"text-align:left\">!{fundName}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">�����¼</td></tr>",
							"<tr><td style=\"text-align:right\">�µ����ڣ�</td><td style=\"text-align:left\">!{orderDate}</td><td style=\"text-align:right\">�µ�ʱ�䣺</td><td style=\"text-align:left\">!{orderTime}</td></tr>",
							"<tr><td style=\"text-align:right\">�����</td><td style=\"text-align:left\">!{requestBalance}Ԫ</td><td style=\"text-align:right\">֧��������</td><td style=\"text-align:left\">!{payMode}</td></tr>",
							"<tr><td style=\"text-align:right\">���뵥��ţ�</td><td style=\"text-align:left\">!{delegateNo}</td>",
							"<td style=\"text-align:right\">����״̬��</td><td style=\"text-align:left\">!{state}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">ȷ�Ͻ��</td></tr>",
							"{@each transInInfo as item,index}",
								"<tr><td style=\"text-align:right\">�Ϲ���Ϊȷ�ϣ�</td><td style=\"text-align:left\">!{item.subBehaviorConfirmDate}</td><td></td><td></td></tr>",
								"<tr><td style=\"text-align:right\">ȷ�Ͻ�</td><td style=\"text-align:left\">",
								"{@if item.confirmBalance != ''}",
								"!{item.confirmBalance}Ԫ",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">�����ѣ�</td><td style=\"text-align:left\">",
								"{@if item.confirmFee != ''}",
								"!{item.confirmFee}Ԫ",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">ȷ�Ϸݶ</td><td style=\"text-align:left\">",
								"{@if item.confirmShare != ''}",
								"!{item.confirmShare}��",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">�ݶ�ȷ�����ڣ�</td><td style=\"text-align:left\">",
								"{@if item.confirmDate != ''}",
								"!{item.confirmDate}",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">���վ�ֵ��</td><td style=\"text-align:left\">",
								"{@if item.dateJz != ''}",
								"!{item.dateJz}",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">ȷ�Ͻ����</td><td style=\"text-align:left\">!{item.confirmState}</td></tr>",
							"{@/each}",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	//���ģ��
	var tp3 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">ҵ�����ͣ�</td><td style=\"text-align:left\">!{businType}</td><td style=\"text-align:right\">�������ƣ�</td><td style=\"text-align:left\">!{fundName}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">�����¼</td></tr>",
							"<tr><td style=\"text-align:right\">�µ����ڣ�</td><td style=\"text-align:left\">!{orderDate}</td><td style=\"text-align:right\">�µ�ʱ�䣺</td><td style=\"text-align:left\">!{orderTime}</td></tr>",
							"<tr><td style=\"text-align:right\">����ݶ</td><td style=\"text-align:left\">!{requestShare}��</td><td style=\"text-align:right\">�տ��˻���</td><td style=\"text-align:left\">!{payMode}</td></tr>",
							"<tr><td style=\"text-align:right\">���뵥��ţ�</td><td style=\"text-align:left\">!{delegateNo}</td>",
							"<td style=\"text-align:right\">����״̬��</td><td style=\"text-align:left\">!{state}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">ȷ�Ͻ��</td></tr>",
                            "{@if confirmReward == ''}",
                                "<tr><td style=\"text-align:right\">ȷ�Ͻ�</td><td style=\"text-align:left\">",
                                "{@if confirmBalance != ''}",
                                "!{confirmBalance}Ԫ",
                                "{@else}--{@/if}",
                                "</td><td style=\"text-align:right\">�����ѣ�</td><td style=\"text-align:left\">",
                                "{@if confirmFee != ''}",
                                "!{confirmFee}Ԫ",
                                "{@else}--{@/if}",
                                "</td></tr>",
                                "<tr><td style=\"text-align:right\">ȷ�Ϸݶ</td><td style=\"text-align:left\">",
                                "{@if confirmShare != ''}",
                                "!{confirmShare}��",
                                "{@else}--{@/if}",
                                "</td><td style=\"text-align:right\">ȷ�����ڣ�</td><td style=\"text-align:left\">",
                                "{@if confirmDate != ''}",
                                "!{confirmDate}",
                                "{@else}--{@/if}",
                                "</td></tr>",
                                "<tr><td style=\"text-align:right\">���վ�ֵ��</td><td style=\"text-align:left\">",
                                "{@if dateJz != ''}",
                                "!{dateJz}",
                                "{@else}--{@/if}",
                                "</td><td style=\"text-align:right\">ȷ�Ͻ����</td><td style=\"text-align:left\">!{confirmState}</td></tr>",
                                "<tr><td style=\"text-align:right\">Ԥ�Ƶ���ʱ�䣺</td><td style=\"text-align:left\">",
                                "{@if onAccountDate != ''}",
                                "!{onAccountDate}",
                                "{@else}--{@/if}",
                                "</td><td></td><td></td></tr>",
                            "{@else}",
                                "<tr><td style=\"text-align:right\">ȷ�Ͻ�</td><td style=\"text-align:left\">",
                                "{@if confirmBalance != ''}",
                                "!{confirmBalance}Ԫ",
                                "{@else}--{@/if}",
                                "</td><td style=\"text-align:right\">�����ѣ�</td><td style=\"text-align:left\">",
                                "{@if confirmFee != ''}",
                                "!{confirmFee}Ԫ",
                                "{@else}--{@/if}",
                                "</td></tr>",
                                "<tr><td style=\"text-align:right\">ȷ�Ϸݶ</td><td style=\"text-align:left\">",
                                "{@if confirmShare != ''}",
                                "!{confirmShare}��",
                                "{@else}--{@/if}",
                                "</td><td style=\"text-align:right\">ҵ�����꣺</td><td style=\"text-align:left\">",
                                "{@if confirmReward != ''}",
                                "!{confirmReward}",
                                "{@else}--{@/if}",
                                "</td></tr>",
                                "<tr><td style=\"text-align:right\">���վ�ֵ��</td><td style=\"text-align:left\">",
                                "{@if dateJz != ''}",
                                "!{dateJz}",
                                "{@else}--{@/if}",
                                "</td><td style=\"text-align:right\">ȷ�����ڣ�</td><td style=\"text-align:left\">",
                                "{@if confirmDate != ''}",
                                "!{confirmDate}",
                                "{@else}--{@/if}",
                                "</td></tr>",
                                "<tr><td style=\"text-align:right\">Ԥ�Ƶ���ʱ�䣺</td><td style=\"text-align:left\">",
                                "{@if onAccountDate != ''}",
                                "!{onAccountDate}",
                                "{@else}--{@/if}",
                                "</td><td style=\"text-align:right\">ȷ�Ͻ����</td><td style=\"text-align:left\">!{confirmState}</td></tr>",
                            "{@/if}",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	//ת��ģ��
	var tp4 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">ҵ�����ͣ�</td><td style=\"text-align:left\">!{businType}</td><td style=\"text-align:right\">�������ƣ�</td><td style=\"text-align:left\">!{fundName}->!{otherFundCode}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">�����¼</td></tr>",
							"<tr><td style=\"text-align:right\">�µ����ڣ�</td><td style=\"text-align:left\">!{orderDate}</td><td style=\"text-align:right\">�µ�ʱ�䣺</td><td style=\"text-align:left\">!{orderTime}</td></tr>",
							"<tr><td style=\"text-align:right\">����ݶ</td><td style=\"text-align:left\">!{requestShare}��</td><td style=\"text-align:right\">֧��������</td><td style=\"text-align:left\">!{payMode}</td></tr>",
							"<tr><td style=\"text-align:right\">�շѷ�ʽ��</td><td style=\"text-align:left\">!{shareType}</td><td style=\"text-align:right\">���뵥��ţ�</td><td style=\"text-align:left\">!{delegateNo}</td></tr>",
							"<tr><td style=\"text-align:right\">����״̬��</td><td style=\"text-align:left\">!{state}</td><td></td><td></td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">ȷ�Ͻ��</td></tr>",
							"<tr style='background-color: rgb(244, 244, 244);'><td style=\"text-align:right\">ת������</td><td style=\"text-align:left\">!{outFundName}</td>",
							"<td style=\"text-align:right\">ȷ�Ͻ�</td>",
							"<td style=\"text-align:left\">",
							"{@if confirmBalance != ''}",
							"!{confirmBalance}Ԫ",
							"{@else}--{@/if}",
							"</td></tr>",
							"<tr><td style=\"text-align:right\">ȷ�Ϸݶ</td><td style=\"text-align:left\">",
							"{@if confirmShare != ''}",
							"!{confirmShare}��",
							"{@else}--{@/if}",
							"</td>",
							"<td style=\"text-align:right\">ȷ�����ڣ�</td><td style=\"text-align:left\">",
							"{@if confirmDate != ''}",
							"!{confirmDate}",
							"{@else}--{@/if}",
							"</td></tr>",
							"<tr><td style=\"text-align:right\">���վ�ֵ��</td><td style=\"text-align:left\">",
							"{@if dateJz != ''}",
							"!{dateJz}",
							"{@else}--{@/if}",
							"</td>",
							"<td style=\"text-align:right\">ȷ�Ͻ����</td><td style=\"text-align:left\">!{confirmState}</td></tr>",
							"{@each transInInfo as item,index}",
								"<tr style='background-color: rgb(244, 244, 244);'><td style=\"text-align:right\">ת�����</td><td style=\"text-align:left\">!{item.outFundName}</td>",
								"<td style=\"text-align:right\">ȷ�Ͻ�</td><td style=\"text-align:left\">",
								"{@if item.confirmBalance != ''}",
								"!{item.confirmBalance}Ԫ",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">ȷ�Ϸݶ</td><td style=\"text-align:left\">",
								"{@if item.confirmShare != ''}",
								"!{item.confirmShare}��",
								"{@else}--{@/if}",
								"</td>",
								"<td style=\"text-align:right\">ȷ�����ڣ�</td><td style=\"text-align:left\">",
								"{@if item.confirmDate != ''}",
								"!{item.confirmDate}",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">���վ�ֵ��</td><td style=\"text-align:left\">",
								"{@if item.dateJz != ''}",
								"!{item.dateJz}",
								"{@else}--{@/if}",
								"</td>",
								"<td style=\"text-align:right\">ȷ�Ͻ����</td><td style=\"text-align:left\">!{item.confirmState}</td></tr>",
								"<tr><td style='text-align:right'>�����ѣ�</td>",
								"<td style=\"text-align:left\">",
								"{@if confirmFee != ''}",
								"!{confirmFee}Ԫ",
								"{@else}--{@/if}",
								"</td><td></td><td></td></tr>",
							"{@/each}",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	//���ת�깺ģ��
	var tp5 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">ҵ�����ͣ�</td><td style=\"text-align:left\">!{businType}</td><td style=\"text-align:right\">�������ƣ�</td><td style=\"text-align:left\">!{fundName}->!{otherFundCode}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">�����¼</td></tr>",
							"<tr><td style=\"text-align:right\">�µ����ڣ�</td><td style=\"text-align:left\">!{orderDate}</td><td style=\"text-align:right\">�µ�ʱ�䣺</td><td style=\"text-align:left\">!{orderTime}</td></tr>",
							"<tr><td style=\"text-align:right\">����ݶ</td><td style=\"text-align:left\">!{requestShare}��</td><td style=\"text-align:right\">֧��������</td><td style=\"text-align:left\">!{payMode}</td></tr>",
							"<tr><td style=\"text-align:right\">�շѷ�ʽ��</td><td style=\"text-align:left\">!{shareType}</td><td style=\"text-align:right\">���뵥��ţ�</td><td style=\"text-align:left\">!{delegateNo}</td></tr>",
							"<tr><td style=\"text-align:right\">����״̬��</td><td style=\"text-align:left\">!{state}</td><td></td><td></td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">ȷ�Ͻ��</td></tr>",
							"{@if businType == '���ת�Ϲ�'}",
							"<tr><td style=\"text-align:right\">�Ϲ���Ϊȷ�ϣ�</td><td style=\"text-align:left\">!{subBehaviorConfirmDate}</td><td></td><td></td></tr>",
							"{@/if}",
							"<tr style='background-color: rgb(244, 244, 244);'><td style=\"text-align:right\">��ػ���</td><td style=\"text-align:left\" colspan='3'>!{outFundName}</td></tr>",
							"<tr><td style=\"text-align:right\">ȷ�Ͻ�</td><td style=\"text-align:left\">",
							"{@if confirmBalance != ''}",
							"!{confirmBalance}Ԫ",
							"{@else}--{@/if}",
							"</td><td style=\"text-align:right\">�����ѣ�</td><td style=\"text-align:left\">",
							"{@if confirmFee != ''}",
							"!{confirmFee}Ԫ",
							"{@else}--{@/if}",
							"</td></tr>",
							"<tr><td style=\"text-align:right\">ȷ�Ϸݶ</td><td style=\"text-align:left\">",
							"{@if confirmShare != ''}",
							"!{confirmShare}��",
							"{@else}--{@/if}",
							"</td><td style=\"text-align:right\">ȷ�����ڣ�</td><td style=\"text-align:left\">",
							"{@if confirmDate != ''}",
							"!{confirmDate}",
							"{@else}--{@/if}",
							"</td></tr>",
							"<tr><td style=\"text-align:right\">���վ�ֵ��</td><td style=\"text-align:left\">",
							"{@if dateJz != ''}",
							"!{dateJz}",
							"{@else}--{@/if}",
							"</td><td style=\"text-align:right\">ȷ�Ͻ����</td><td style=\"text-align:left\">!{confirmState}</td></tr>",
							"{@each transInInfo as item,index}",
								"<tr style='background-color: rgb(244, 244, 244);'><td style=\"text-align:right\">�깺����</td><td style=\"text-align:left\" colspan='3'>!{item.outFundName}</td></tr>",
								"<tr><td style=\"text-align:right\">ȷ�Ͻ�</td><td style=\"text-align:left\">",
								"{@if item.confirmBalance != ''}",
								"!{item.confirmBalance}Ԫ",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">�����ѣ�</td><td style=\"text-align:left\">",
								"{@if item.confirmFee != ''}",
								"!{item.confirmFee}Ԫ",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">ȷ�Ϸݶ</td><td style=\"text-align:left\">",
								"{@if item.confirmShare != ''}",
								"!{item.confirmShare}��",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">ȷ�����ڣ�</td><td style=\"text-align:left\">",
								"{@if item.confirmDate != ''}",
								"!{item.confirmDate}",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">���վ�ֵ��</td><td style=\"text-align:left\">",
								"{@if item.dateJz != ''}",
								"!{item.dateJz}",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">ȷ�Ͻ����</td><td style=\"text-align:left\">!{item.confirmState}</td></tr>",
							"{@/each}",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	//����깺ģ��
	var tp6 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">ҵ�����ͣ�</td><td style=\"text-align:left\">!{businType}</td><td style=\"text-align:right\">�������ƣ�</td><td style=\"text-align:left\">!{fundName}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">�����¼</td></tr>",
							"<tr><td style=\"text-align:right\">�µ����ڣ�</td><td style=\"text-align:left\">!{orderDate}</td><td style=\"text-align:right\">�µ�ʱ�䣺</td><td style=\"text-align:left\">!{orderTime}</td></tr>",
							"<tr><td style=\"text-align:right\">�����</td><td style=\"text-align:left\">!{requestBalance}Ԫ</td><td style=\"text-align:right\">֧��������</td><td style=\"text-align:left\">!{payMode}</td></tr>",
							"<tr><td style=\"text-align:right\">���뵥��ţ�</td><td style=\"text-align:left\">!{delegateNo}</td>",
							"<td style=\"text-align:right\">����״̬��</td><td style=\"text-align:left\">!{state}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">ȷ�Ͻ��</td></tr>",
							"{@each transInInfo as item,index}",
								"<tr style='background-color: rgb(244, 244, 244);'><td style=\"text-align:right\">�������ƣ�</td><td style=\"text-align:left\">!{item.outFundName}</td><td  style='text-align:right'>�շѷ�ʽ��</td><td style='text-align:left'>",
								"{@if item.shareType != ''}",
								"!{item.shareType}",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">ȷ�Ͻ�</td><td style=\"text-align:left\">",
								"{@if item.confirmBalance != ''}",
								"!{item.confirmBalance}Ԫ",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">�����ѣ�</td><td style=\"text-align:left\">",
								"{@if item.confirmFee != ''}",
								"!{item.confirmFee}Ԫ",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">ȷ�Ϸݶ</td><td style=\"text-align:left\">",
								"{@if item.confirmShare != ''}",
								"!{item.confirmShare}��",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">ȷ�����ڣ�</td><td style=\"text-align:left\">",
								"{@if item.confirmDate != ''}",
								"!{item.confirmDate}",
								"{@else}--{@/if}",
								"</td></tr>",
								"<tr><td style=\"text-align:right\">���վ�ֵ��</td><td style=\"text-align:left\">",
								"{@if item.dateJz != ''}",
								"!{item.dateJz}",
								"{@else}--{@/if}",
								"</td><td style=\"text-align:right\">ȷ�Ͻ����</td><td style=\"text-align:left\">!{item.confirmState}</td></tr>",
							"{@/each}",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	//����ģ��
	var tp7 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">ҵ�����ͣ�</td><td style=\"text-align:left\" colspan='3'>!{businType}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">�����¼</td></tr>",
							"<tr><td style=\"text-align:right\">�������ͣ�</td><td style=\"text-align:left\">!{businType} </td><td></td><td></td></tr>",
							"<tr><td style=\"text-align:right\">Ŀ�꿨���У�</td><td style=\"text-align:left\">!{receiveBankNo}</td><td style=\"text-align:right\">Ŀ�꿨�ţ�</td><td style=\"text-align:left\">!{receiveBankAcco}</td></tr>",
							"<tr><td style=\"text-align:right\">�����</td><td style=\"text-align:left\">!{requestBalance}Ԫ</td>",
							"<td style=\"text-align:right\">�տ��ˣ�</td><td style=\"text-align:left\">!{receiverName} </td></tr>",
							"<tr><td style=\"text-align:right\">�������ڣ�</td><td style=\"text-align:left\">",
							"{@if confirmDate != ''}",
							"!{confirmDate}",
							"{@else}--{@/if}",
							"</td><td style=\"text-align:right\">�������ڣ�</td><td style=\"text-align:left\">",
							"{@if onAccountDate != ''}",
							"!{onAccountDate}",
							"{@else}--{@/if}",
							"</td></tr>",
							"<tr><td style=\"text-align:right\">������ˮ�ţ�</td><td style=\"text-align:left\">!{delegateNo} </td>",
							"<td style=\"text-align:right\">����״̬��</td><td style=\"text-align:left\">!{confirmState}</td></tr>",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	//Ǯ����֧��ģ��
	var tp8 = [
					"<p> ",
						"<table class=\"table table-condensed table-bordered\" contenteditable=\"false\">",
							"<tr style='font-weight:bold'><td style=\"text-align:right\">ҵ�����ͣ�</td><td style=\"text-align:left\" colspan='3'>!{businType}</td></tr>",
							"<tr><td colspan=\"4\" style=\"text-align:left\">�����¼</td></tr>",
							"<tr><td style=\"text-align:right\">��Ʒ���ƣ�</td><td style=\"text-align:left\">!{businType}</td><td></td><td></td></tr>",
							"<tr><td style=\"text-align:right\">�µ����ڣ�</td><td style=\"text-align:left\">!{orderDate}</td><td style=\"text-align:right\">�µ�ʱ�䣺</td><td style=\"text-align:left\">!{orderTime}</td></tr>",
							"<tr><td style=\"text-align:right\">�����</td><td style=\"text-align:left\">!{requestBalance}Ԫ</td>",
							"<td style=\"text-align:right\">֧��������</td><td style=\"text-align:left\">!{payMode}</td></tr>",
							"<tr><td style=\"text-align:right\">���뵥��ţ�</td><td style=\"text-align:left\">!{delegateNo}</td><td style=\"text-align:right\">����״̬��</td><td style=\"text-align:left\">!{state}</td></tr>",
						"</table>",
						timeLineVar,
					"</p>"
	].join("");
	var bindEvent = function(){
        $("#province").focus(searchDev,focusText).keyup(searchDev).change(searchDev).blur(blurText);
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
		$(".showDetailInfo").click(function(e){
			var delegateNo = $(this).parent().find("input:eq(0)").val();
			var businType = $(this).parent().find("input:eq(4)").val();
			var requestType = $(this).parent().find("input:eq(2)").val();
			//�첽���ص�������Ҫ����ϸ��Ϣ
			$.get("/main/query/queryDetailInfo?delegateNo="+delegateNo+"&businType="+businType+"&requestType="+requestType,function(data){
				var innerContent = "";
				if(data.data == "error"){
					alert("ϵͳ��æ�����Ժ�����!");
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
				//juicer�����ǽ����ݣ����䵽ģ�����档
				var result = juicer(innerContent,data.data);
				//��\n�������ݣ�����html�Ļ���
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
                //�ı��ڼ䣬���������ÿ�ʼ���ڡ��������ڡ�
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
				//������delegateNo
				delegateNo =  delegateNo.split('|')[3];
			}
			
			var businTypeView = $(this).parent().find("input:eq(1)").val();
            var doCancel = false;
            if (businTypeView == "�깺" || businTypeView == "�Ϲ�" || businTypeView == "Լ���깺" || businTypeView == "�����깺"
                || businTypeView == "���ƶ�Ͷ" || businTypeView == "Ǯ�����깺����" || businTypeView == "Ǯ�����Ϲ�����"
                || businTypeView == "��Ϲ���" || businTypeView == "��϶�Ͷ" || businTypeView == "Ǯ���Ӷ�Ͷ"
                || businTypeView == "Ǯ�������ƶ�Ͷ") {
                doCancel = confirm("ȷ��Ҫ�����ñʽ�����\nǮ����֧����ʵʱ�˿���п�֧���˿���"+redomDay+"���ˡ�");
            } else {
                doCancel = confirm("ȷ��Ҫ�����ñʽ�����");
            }
			if (doCancel)
            {
				if(businTypeView == "��Ϲ���" || businTypeView == "��϶�Ͷ"){
					//��Ͻ��׳���
					window.open("/trade/TrustQueryAction.do?method=rollbackDo&applyNo=" + delegateNo, "_self");
				}else if(businTypeView == "Ǯ����ȡ��" || businTypeView == "Ǯ���������" || businTypeView == "Ǯ�����Ϲ�����" || businTypeView == "Ǯ�����깺����"){
					//����Ǯ���ӹ������һ��������ʽ
					$.get("/main/query/rollWallet?delegateNo="+delegateNo+"&tradeacco="+tradeAcco,function(data){
						alert(data.data);
						$("#queryForm").attr("action","/main/query/queryList");
						$("#queryForm").submit();
					});
				}else{
					//��ͨ���𳷵�
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



        //�ڼ���ʾ��������
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
                    //�ı��ڼ䣬���������ÿ�ʼ���ڡ��������ڡ�
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


        //��ʱ����ڼ���ʾ��������
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
                   //�ı��ڼ䣬���������ÿ�ʼ���ڡ��������ڡ�
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


        //ҵ������ѡ��������
        //ajax_url�����input�󶨵�ajax���ݵ�ַ
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
        //��������ѡ��������
        //ajax_url�����input�󶨵�ajax���ݵ�ַ
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

//ҵ��������ʾ���ط���
var Bussiness=function(){}

Bussiness.showBussList=function(){

    $(".busslist").show();
    $(".bussshow").css("background-image","url(/static/wtgf/img/bg-arr-up.gif)");

}

Bussiness.hideBussList=function(){
    $(".busslist").hide();
    $(".bussshow").css("background-image","url(/static/wtgf/img/bg-arr-down.gif)");
}
//�ڼ���ʾ���ط���
var CreditCard=function(){}

CreditCard.showBankList=function(){
    $(".banklist").show();
    $(".bankshow").css("background-image","url(/static/wtgf/img/bg-arr-up.gif)");
}

CreditCard.hideBankList=function(){
    $(".banklist").hide();
    $(".bankshow").css("background-image","url(/static/wtgf/img/bg-arr-down.gif)");
}



//����������ʾ���ط���
var TradeCaptal=function(){}

TradeCaptal.showTradeList=function(){
    $(".tradelist").show();
    $(".tradeshow").css("background-image","url(/static/wtgf/img/bg-arr-up.gif)");
}

TradeCaptal.hideTradeList=function(){
    $(".tradelist").hide();
    $(".tradeshow").css("background-image","url(/static/wtgf/img/bg-arr-down.gif)");
}

//����������ʾ���ط���
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
    if(query=="������������ơ�����"){
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
//����һ��������ť�㣬��������ʽ(λ�ã���λ�����꣬��С������ͼƬ��Z��)��׷�ӵ��ı������
    $xialaDIV = $('<div id="selectxiala" class="selectshow"></div>').css('left', $('#province').position().left + $('#province').width() - 15 + 'px').css('top',
            $('#province').position().top + 4 + 'px');
    $('#province').after($xialaDIV);

//�������޸ı���ͼλ��
    $xialaDIV.mouseover(function(){
      //  $xialaDIV.css('background-position', ' 0% -16px');
    });
//����Ƴ��޸ı���ͼλ��
    $xialaDIV.mouseout(function(){
       // $xialaDIV.css('background-position', ' 0% -0px');
    });
//��갴���޸ı���ͼλ��
    $xialaDIV.mousedown(function(){
       // $xialaDIV.css('background-position', ' 0% -32px');
    });
//����ͷ��޸ı���ͼλ��
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
//�ı����������div
function xiala(data){
//first time
    if($xialaSELECT)
    {
        $xialaSELECT.empty();
    }
//����һ��������㣬��������ʽ(λ�ã���λ�����꣬��ȣ�Z��)���Ƚ�������
//�������ѡ��㣬��������ʽ(��ȣ�Z��һ��Ҫ����������)�����name��value���ԣ������������

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
            lioption+=("<li style='float:left;width:240px;height:20px;display:inline;cursor:pointer;padding-left:1px;text-align: left;'  ><a   href='javascript:;'  >��ƥ����,���������������ѡ��ת�˻���</a></li>")
        }
    }else{
        lioption+=("<li style='float:left;width:240px;height:20px;display:inline;cursor:pointer;padding-left:1px;text-align: left;'  ><a   href='javascript:;'  >��ƥ����,���������������ѡ��ת�˻���</a></li>")
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
//ѡ������������Ƴ���ʽ
    $xialaSELECT.mouseover(function(event){
        if ($(event.target).attr('name') == 'option') {
//����ʱ����ɫ�����ɫ���
            $(event.target).css('background-color', '#000077').css('color', 'white');
            $(event.target).mouseout(function(){
//�Ƴ��Ǳ���ɫ��ף���ɫ���
                $(event.target).css('background-color', '#FFFFFF').css('color', '#000000');
            });
        }
    });
//ͨ�����λ�ã��жϵ�������ʾ
    $xialaSELECT.mouseup(function(event){
//�����������ť���������㣬����Ȼ��ʾ�������
        if (event.target == $xialaSELECT.get(0) || event.target == $xialaDIV.get(0)) {
            $xialaSELECT.show();
            $("#selectxiala").css("background-image","url(/static/wtgf/img/bg-arr-up.gif)");
        }
        else {
//�����ѡ��㣬��ı��ı����ֵ
            var fundcode=$(event.target).html().split("|")[0];
            var fundname=$(event.target).html().split("|")[1];
            $("#fundCode").val(fundcode);
            $("#fundName").val(fundname);
            $("#province").val($(event.target).html());
//���������λ�ã����������
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
    if(val=="������������ơ�����"){
        $("#province").val("")
    }
    $(".cba").css("color","#000000");
}

function blurText(){
    var val=$("#province").val();
    if(val==""){
        $("#province").val("������������ơ�����")
        $(".cba").css("color","#999");
         $("#fundCode").val("");
         $("#fundName").val("");
    }

}










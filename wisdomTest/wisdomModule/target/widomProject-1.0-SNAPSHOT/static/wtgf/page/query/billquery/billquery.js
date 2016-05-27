var util = require("common:widget/util/util.js"),
    datepicker = require("common:widget/datepicker/datepicker.js"),
    juicer = require("common:widget/juicer/juicer.js"),
    dialog = require("common:widget/dialog/dialog.js");



   function _init(){
        /*初始化年份下拉框*/

        var dateObj=new Date();
        var year=dateObj.getFullYear();
        var flag=$("#flag").val();
       var yearshow=$("#yearshow").val();
       var seasonshow=$("#seasonshow").val();
       var monthshow=$("#monthshow").val();

       $("input[value='"+flag+"']").attr("checked",true);

       if(yearshow==""){
           yearshow=year;
       }

       $("#year").append("<option value='"+year+"' selected='selected'>"+year+"年</option>");
       $("#year").append("<option value='"+(year-1)+"'>"+(year-1)+"年</option>");
       $("#year").append("<option value='"+(year-2)+"'>"+(year-2)+"年</option>");
       $("#year").append("<option value='"+(year-3)+"'>"+(year-3)+"年</option>");
       $("#year").append("<option value='"+(year-4)+"'>"+(year-4)+"年</option>");

       $("#year option[value="+yearshow+"]").attr("selected",true)
       $("#season option[value="+seasonshow+"]").attr("selected",true)
       $("#month option[value="+monthshow+"]").attr("selected",true)
       //设置结束日期
       $("#endDatePicker").datepicker({
           dateFormat : "yy-mm-dd",
           changeYear : true,
           changeMonth : true,
           currentText: "Now"
       });

       //初始化一个月后为结束日期

       //设置开始日期
       $("#startDatePicker").datepicker({
           dateFormat : "yy-mm-dd",
           changeYear : true,
           changeMonth : true,
           currentText: "Now"
       });


       setInfo();

      }

    function bindEvent(){
        $("input[name='type']").click(setInfo);
        $("#startDatePicker").change(function(){
            var beforeC = $("#startDate").val();
            if($("#startDatePicker").val()>$("#endDatePicker").val()){
                alert("开始日期不能比结束日期大");
                //恢复到原来选择的日期
                $( "#startDatePicker" ).datepicker( "setDate", beforeC);
            }else{
                setDate("startDatePicker","startDate");
            }
        });
        $("#endDatePicker").change(function(){
            var beforeL = $("#endDate").val();
            if($("#endDatePicker").val()<$("#startDatePicker").val()){
                alert("结束日期不能比开始日期小");
                $( "#endDatePicker" ).datepicker( "setDate", beforeL);
            }else{
                setDate("endDatePicker","endDate");
            }
        });
        $(".qbtn").click(checkForm);

    }

    function setDate(datePicVar,dateVar){

        var t = $("#"+datePicVar).val();
        $("#"+dateVar).val(t);

    };
   function setInfo()
    {
        var _obj = $("input[name='type']:checked").val();
        var _year=$("#yearshow").val();
        var _season=$("#seasonshow").val();
        var _month=$("#monthshow").val();
        if(_obj=='4'){
            $("#cutomeDate").show();
            $("#routineDate").hide();
            $("#flag").val(4);
        } else{
            $("#cutomeDate").hide();
            $("#routineDate").show();
        }

        if (_obj == '1')
        {
            $("#season").hide();
            $("#month").hide();
            $("#flag").val(1);
           /* if (_year && _year.length > 0)
            {
                $("#year").attr('value', _year);
            }*/
        } else if (_obj == '2')
        {
            $("#season").show();
            $("#month").hide();
            $("#flag").val(2);
          /*  if (_year && _year.length > 0)
            {
                $("#year").attr('value', _year);
            }
            if (_season != '0')
            {
                $("#season").attr('value', _season);
            }*/
        } else if(_obj=='3')
        {
            $("#season").hide();
            $("#month").show();
            $("#flag").val(3);
          /*  if (_year && _year.length > 0)
            {
                $("#year").attr('value', _year);
            }
            if (_month < 10)
            {
                $("#month").attr('value', '0' + _month);
            } else
            {
                $("#month").attr('value', _month);
            }*/
        }
    }


   function loadDate(){
        var flag=$("#flag").val();
        var month=$("#month").val();
        var year=$("#year").val();
        var season=$("#season").val();
        var day="";
        var startDate="";
        var endDate="";
        if(null==year){
            alert("请选择年份！");
            return "";
        }
        if(flag=="1"){
            startDate=year+"-01-01";
            endDate=year+"-12-31";

        }else if(flag=="2") {
            if(season=="1"){

                startDate=year+"-01-01";
                endDate=year+"-03-31";
            }else if(season=="2"){

                startDate=year+"-04-01";
                endDate=year+"-06-30";
            }else if(season=="3"){

                startDate=year+"-07-01";
                endDate=year+"-09-30";
            }else if(season=="4"){
                startDate=year+"-10-01";
                endDate=year+"-12-31";
            }

        }else if(flag=="3"){


            if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8
                || month == 10 || month == 12) {
                day="31";
            }
            if (month == 4 || month == 6 || month == 9 || month == 11) {

                day="30";
            }
            if (month == 2) {
                if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
                    day= "29";
                } else {
                    day="28";
                }
            }

            startDate=year+"-"+month+"-01";
            endDate=year+"-"+month+"-"+day;
        }else if(flag=="4"){
            startDate= $("#startDatePicker").val();
            endDate= $("#endDatePicker").val();

        }

            $("#startDate").val(startDate);
            $("#endDate").val(endDate);

        return     startDate+","+endDate

    }

    function loadReport(){

        var  datetime= loadDate();

        if(datetime!=""){
            window.open("/main/bill/billreport?list=1&startDate="+datetime.split(",")[0]+"&endDate="+datetime.split(",")[1]+"&businCode=000");
        }

    }

    function checkForm(){
        var  datetime= loadDate();

        if(datetime!=""){

            $("#queryForm").submit();
        }
    }




$(function(){

    _init();

    bindEvent();
    setInfo();

});
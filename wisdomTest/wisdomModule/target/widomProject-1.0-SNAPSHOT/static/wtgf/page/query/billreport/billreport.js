/**
 * Created with IntelliJ IDEA.
 * User: hj
 * Date: 15-10-8
 * Time: 下午3:02
 * To change this template use File | Settings | File Templates.
 */

$(function(){

    var startdate=$("#startDate").val();
    var enddate=$("#endDate").val();
    startdate=startdate.split("-")[0]+"年"+startdate.split("-")[1]+"月"+startdate.split("-")[2]+"日";
    enddate=enddate.split("-")[0]+"年"+enddate.split("-")[1]+"月"+enddate.split("-")[2]+"日";
    $("#tradeDate").html(startdate+"-"+enddate);
    $("#uptodate").html(enddate);
    $("#redDate").html(enddate);
    $("#pageFooter").hide();

});

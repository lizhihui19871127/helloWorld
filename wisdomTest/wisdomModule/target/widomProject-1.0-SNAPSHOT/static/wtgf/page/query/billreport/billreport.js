/**
 * Created with IntelliJ IDEA.
 * User: hj
 * Date: 15-10-8
 * Time: ����3:02
 * To change this template use File | Settings | File Templates.
 */

$(function(){

    var startdate=$("#startDate").val();
    var enddate=$("#endDate").val();
    startdate=startdate.split("-")[0]+"��"+startdate.split("-")[1]+"��"+startdate.split("-")[2]+"��";
    enddate=enddate.split("-")[0]+"��"+enddate.split("-")[1]+"��"+enddate.split("-")[2]+"��";
    $("#tradeDate").html(startdate+"-"+enddate);
    $("#uptodate").html(enddate);
    $("#redDate").html(enddate);
    $("#pageFooter").hide();

});

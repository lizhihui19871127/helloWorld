var util = require("common:widget/util/util.js");


var genRow = function(json) {
    if (typeof(json) == "undefined" || json == null)
        return "";
    var row = "<tr fundCode='"+json.fundCode+"' agencyName='"+json.agencyName+"'>";
    row += "<td>"+json.year+"</td>";
    row += "<td>"+util.number.format(json.yearrate,2)+"</td>";
    row += "<td>"+util.number.format(json.indexprof,2)+"</td>";
    row += "<td>"+json.endbala+"</td>";
    row += "<td>"+json.totalfare+"</td>";
    row += "<td>"+json.totaldivid+"</td>";
    row += "<td>"+json.holdprof+"</td>";
    row += "<td>"+json.totalprof+"</td>";
    row += "</tr>";
    return row;
};

$(function(){
    $.get("/main/profreport/query", function(returnobj) {
        if (typeof(returnobj) == "undefined" || returnobj == null) {
            alert("获取客户收益信息失败，请稍后重试！");
            return;
        }
        if (typeof(returnobj.issuccess) != "boolean" || returnobj.issuccess == false) {
            alert(returnobj.returnmsg);
            return;
        }
        var allProfInfo = returnobj.data;
        if (typeof(allProfInfo) == "undefined" || allProfInfo == null || allProfInfo.length == 0)
            return;
        for (var i in allProfInfo) {
            var prof = allProfInfo[i];
            $(".yearreport table").append(genRow(prof));
        }
    });
});
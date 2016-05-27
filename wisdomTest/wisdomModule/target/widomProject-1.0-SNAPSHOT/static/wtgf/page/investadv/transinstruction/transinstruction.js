/**
 * Created by xiaox on 2016/1/19.
 */
var datepicker = require("common:widget/datepicker/datepicker.js");
var util = require("common:widget/util/util.js");
var datetool = util.date;

$(function () {
    $("#startdateslt").datepicker({
        dateFormat : "yymmdd",
        changeYear : true,
        changeMonth : true});
    $("#enddateslt").datepicker({
        dateFormat : "yymmdd",
        changeYear : true,
        changeMonth : true});

    $(".trans_reset").on("click", function() {
        var now = new Date();
        $("#enddateslt").val(datetool.format(now, "yyyyMMdd"));
        var month = now.getMonth();
        var year = now.getFullYear();
        if (month == 0) {
            month = 11;
            year -= 1;
        } else {
            month -= 1;
        }
        now.setFullYear(year);
        now.setMonth(month);
        $("#startdateslt").val(datetool.format(now, "yyyyMMdd"));
        $("#confirmflagslt").val("");
        $("#transplanslt").val("");
        $("form.dczl_msg").submit();
    });
});
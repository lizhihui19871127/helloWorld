/**
 * Created by xiaox on 2016/3/3.
 */
$(function(){
    var datepicker = require("common:widget/datepicker/datepicker.js");
    var dateFormat = "yymmdd";

    $("#qr_date").datepicker({
        dateFormat : dateFormat,
        changeYear : true,
        changeMonth : true});
    $("#over_date").datepicker({
        dateFormat : dateFormat,
        changeYear : true,
        changeMonth : true});
});

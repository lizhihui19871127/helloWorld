$(function(){
    var util = require("common:widget/util/util.js");
	var $containerPay = $('.container-pay');
    util.cookie.set("row", "r2");
    util.cookie.set("col", "c25");

	$containerPay.on('click', '.fh_table .xiugai_pop', function(){
        var fundcode = $(this).attr("fundcode");
        var curdivid = $(this).attr("curdivid");
        var dividreq = null;
        if (curdivid == '1') {
            dividreq = "0";
            $(".pop-bank-yhyz .dividpoptext").text("红利再投资");
        } else if (curdivid == '0') {
            dividreq = '1';
            $(".pop-bank-yhyz .dividpoptext").text("现金红利");
        } else {
            alert("当前的分红方式有误，请刷新后重试！");
            return false;
        }
        $containerPay.find(".chgsubmit").attr("dividreq", dividreq).attr("fundcode", fundcode);
        $containerPay.find('.pop-bank-yhyz').stop().fadeIn();
	});

	//关闭弹出框
	$containerPay.on('click', '.js-pop-close', function(){
		$(this).closest('.pop').fadeOut();
	});

    //提交表单修改分红方式
    $containerPay.on("click", ".chgsubmit", function(){
        var dividreq = $(this).attr("dividreq");
        var fundcode = $(this).attr("fundcode");
        $("#moddividform [name='fundCode']").val(fundcode);
        $("#moddividform [name='dividReq']").val(dividreq);
        $("#moddividform").submit();
    });
});
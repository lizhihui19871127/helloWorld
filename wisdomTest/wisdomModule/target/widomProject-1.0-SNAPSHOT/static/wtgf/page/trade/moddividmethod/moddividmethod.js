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
            $(".pop-bank-yhyz .dividpoptext").text("������Ͷ��");
        } else if (curdivid == '0') {
            dividreq = '1';
            $(".pop-bank-yhyz .dividpoptext").text("�ֽ����");
        } else {
            alert("��ǰ�ķֺ췽ʽ������ˢ�º����ԣ�");
            return false;
        }
        $containerPay.find(".chgsubmit").attr("dividreq", dividreq).attr("fundcode", fundcode);
        $containerPay.find('.pop-bank-yhyz').stop().fadeIn();
	});

	//�رյ�����
	$containerPay.on('click', '.js-pop-close', function(){
		$(this).closest('.pop').fadeOut();
	});

    //�ύ���޸ķֺ췽ʽ
    $containerPay.on("click", ".chgsubmit", function(){
        var dividreq = $(this).attr("dividreq");
        var fundcode = $(this).attr("fundcode");
        $("#moddividform [name='fundCode']").val(fundcode);
        $("#moddividform [name='dividReq']").val(dividreq);
        $("#moddividform").submit();
    });
});
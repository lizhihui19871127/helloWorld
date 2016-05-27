/******* page private variables *******/
var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js"),
	dialog = require("common:widget/dialog/dialog.js"),

    FormValidator = require("common:widget/validate/validate.js"),
    btn = require("common:widget/btn/btn.js");

//��֤��
var validateForm = null;
//�û�֧��������Ϣ
var userPayChannels = null;
//��ǰ֧������map
var currentPaymethodMap = null;
var isSupportWalletFreezeBusin = false;
var smsVFCodeTipsObj=null;

//start here
$(function(){

    init();//ҳ���ʼ��
    bindEvent(); //ҳ��󶨷���
});

//���¼�
function bindEvent() {
    /*��ͬ��Ϣ��ʾ����*/
    $(".ht_xxqr>dt").click(function(event) {
        $(this).siblings('dd').slideToggle("400");
        $(this).children('img').toggleClass('change');
    });
    // �Ƿ����Ķ���ͬ���ͬ����
    $('.choose_this').click(function(event) {
        if($(".choose_this").hasClass('active')){
            $(".choose_this").removeClass('active');
        }else{
            $(".choose_this").addClass('active');
        }
    });
    $("#pageContent .nav-wrap>dl>dd").click(function(event) {
        $(this).children('ul').slideToggle(400);
        $(this).toggleClass('zhuan');
    });
    /*���ֻ������޸ĵ���*/
    $(".click_change").click(function(event) {
        $("html,body").css({
            overflow: 'hidden'
        });
        $(".change_phoneN").css({
            display: 'block'
        });
    });
    /*�ر��ֻ������޸ĵ���*/
    $(".pop .close_pop").click(function(event) {
        $(this).parents(".pop").parent().css({
            display: 'none'
        });
        $("html,body").css({
            overflow: 'auto'
        });
    });

    /*��ǩ��Э�鵯��*/
    $(".yqsxy_pop").click(function(event) {
        $("html,body").css({
            overflow: 'hidden'
        });
        $(".qianxie_pop").css({
            display: 'block'
        });
    });
    /*ǩ��ƾ֤����*/
    $(".qspz_pop").click(function(event) {
        $("html,body").css({
            overflow: 'hidden'
        });
        $(".qianspz_pop").css({
            display: 'block'
        });
    });
    /*�߶������ҳtab�л�*/
    $(".gdlc_index .bottom_main_nav ul li").click(function(event) {
        var num=$(this).index();
        $(this).addClass('current').siblings('li').removeClass('current');
        $(".gdlc_index .list_content>div").eq(num).addClass('current').siblings('div').removeClass('current');
    });
    /*�߶���Ʋ�Ʒҳtab�л�*/
    $(".product_page .smart_nav ul li").click(function(event) {
        var num=$(this).index();
        $(this).addClass('current').siblings('li').removeClass('current');
        $(".product_page .product_message>div").eq(num).addClass('current').siblings('div').removeClass('current');
        if(num==0){
            $(".product_page .product_message>em").animate({left: '32px'}, 400);
        }
        if(num==1){
            $(".product_page .product_message>em").animate({left: '127px'}, 400);
            initSVGBydiffSYl();
        }if(num==2){
            $(".product_page .product_message>em").animate({left: '214px'}, 400);
            initSVGBydiffSYl();
        }if(num==3){
            $(".product_page .product_message>em").animate({left: '300px'}, 400);
        }
    });

    /*���㷢��������ʱ�Գ�ּ�1���ʲ������ͬ������*/
    $("#zcglht").click(function(event) {
        if($(this).prop("checked")==true){
            $("html,body").css({
                overflow: 'hidden'
            });
            $(".zichanglht").css({
                display: 'block'
            });
        }

    });
    $(".dont_choose1").click(function(event) {
        $("#zcglht").prop("checked",false);
    });

    /*������ǩ��Լ���顷����*/
    $("#dzqmyds").click(function(event) {
        if($(this).prop("checked")==true){
            $("html,body").css({
                overflow: 'hidden'
            });
            $(".dianziqmyds").css({
                display: 'block'
            });
        }

    });
    $(".dont_choose2").click(function(event) {
        $("#dzqmyds").prop("checked",false);
        if($(".checkbox1").prop("checked")==true){
            if($(".checkbox2").prop("checked")==true){
                if($(".checkbox3").prop("checked")==true){
                    if($(".checkbox4").prop("checked")==true){
                        if($(".checkbox5").prop("checked")==true){

                                $("#tongyi_tijiao").removeClass('not_use').attr("disabled",false);

                        }else{
                            $("#tongyi_tijiao").addClass('not_use').attr("disabled",true);
                        }
                    }else{
                        $("#tongyi_tijiao").addClass('not_use').attr("disabled",true);
                    }
                }else{
                    $("#tongyi_tijiao").addClass('not_use').attr("disabled",true);
                }
            }else{
                $("#tongyi_tijiao").addClass('not_use').attr("disabled",true);
            }
        }else{
            $("#tongyi_tijiao").addClass('not_use').attr("disabled",true);
        }
    });
    $(".checkbox").change(function(event) {
        if($(".checkbox1").prop("checked")==true){
            if($(".checkbox2").prop("checked")==true){
                if($(".checkbox3").prop("checked")==true){
                    if($(".checkbox4").prop("checked")==true){
                        if($(".checkbox5").prop("checked")==true){

                                 $("#tongyi_tijiao").removeClass('not_use').attr("disabled",false);

                        }else{
                           $("#tongyi_tijiao").addClass('not_use').attr("disabled",true);
                        }
                    }else{
                        $("#tongyi_tijiao").addClass('not_use').attr("disabled",true);
                    }
                }else{
                    $("#tongyi_tijiao").addClass('not_use').attr("disabled",true);
                }
            }else{
                $("#tongyi_tijiao").addClass('not_use').attr("disabled",true);
            }
        }else{
            $("#tongyi_tijiao").addClass('not_use').attr("disabled",true);
        }
    });

    $("#walletRadio").click(walletRadioClick);
    $("#bankcardRadio").click(bankcardRadioClick);
    $("#paychannelSelect").change(paychannelSelectChange);
    $("#gozhifu").click(tijiao);
    $(".click_change").click(function(){
        window.location.href="/account/modifyaccountinfo.jsp";
    });

    //������
    $("#applyMoney").change(function(){
        $("#ratetitle").empty();
        $("#rateamount").empty();
        var _obj = $("#applyMoney").val();
        $("#chinavalue").html(ChangeShareToUpper(_obj));
    });
    $("#applyMoney").blur(function(){
        checkMoney();
    });
    $('#applyMoney').keyup(function () {
        var _obj = $("#applyMoney").val();
        $("#chinavalue").html(ChangeShareToUpper(_obj));
    });

    $("#walletRadio_label").click(function(){
        $("#walletRadio_label").removeClass().addClass("sources sources1 active");
        $("#walletRadio_label2").removeClass().addClass("sources sources2");
    });

    $("#walletRadio_label2").click(function(){
        $("#walletRadio_label").removeClass().addClass("sources sources1");
        $("#walletRadio_label2").removeClass().addClass("sources sources2 active");
    });

    $("#toUpdateLever").click(function(){
        window.location.href = "/account/showsubject.jsp";
    });

    $("#payLimitAlarmWyzf").click(function(){
        changePayMethod('WEB');
    });
	$("#payLimitAlarmWyqy").click(function(){
        webSign();
    });
	$("#payLimitAlarmQywc").click(function(){
        checkProtocolSignResult();
    });
	$("#payLimitAlarmQxqy").click(function(){
        cancelProtocolSign();
    });
	$("#payLimitAlarmKtwc").click(function(){
        checkOpenQuickpayResult('WEB');
    });
	$("#payLimitAlarmQxkt").click(function(){
        cancelOpenQuickpay('WEB');
    });

    $("#xg").click(function(){
        return false;
    });
    $("#addressadd").click(function(){

        window.location.href="/account/modifyaccountinfo.jsp";
    });
    $("#mobileadd").click(function(){
        window.location.href="/account/modifyaccountinfo.jsp";
    });
    /*�򿪵��Ӻ�ͬ�����֤����*/
    $(".jyts_pop").click(function(event) {
        var flag= checkPayLimit();

        if(!flag){
            return false;
        } else{
            if(""==$("#mobile").val()){
                $("html,body").css({
                    overflow: 'hidden'
                });
                $(".mobilediv").css({
                    display: 'block'
                });
                return false;
            }else if(""==$("#address").val()){
                $("html,body").css({
                    overflow: 'hidden'
                });
                $(".mobilediv").css({
                    display: 'block'
                });
                return false;
            }else{

                $("html,body").css({
                    overflow: 'hidden'
                });
                $(".yanz_phoneN").css({
                    display: 'block'
                });
                $("#gozhifu").attr("disabled",false);
                $("#gozhifu").css("background-color","#eb5406");
                if(time!=null){
                    clearTimeout(time);
                }
                $("#smsVFCodeBtn").html("��ȡ��֤��");
                $("#smsVFCodeBtn").removeClass('get_unyanzm').addClass('get_yanzm');

            }
        }
    });
    /*���㷢��������ʱ�Գ�ּ�1���ʲ������ͬ������*/
    $("#zcglht").click(function(event) {
        if($(this).prop("checked")==true){
            $("html,body").css({
                overflow: 'hidden'
            });
            $(".zichanglht").css({
                display: 'block'
            });
            /*����ʱ*/
            var num=15;
            function times(){
                num--;
                $(".zichanglht #daojis").text(num)
                if(num==0){
                    clearInterval(auto1);
                    $(".zichanglht #agree_btn").text('ͬ��ǩ��').addClass('close_pop').removeClass('unclick');
                    if($(".zichanglht #agree_btn").hasClass('close_pop')){
                        /*�رյ���*/
                        $(".pop .close_pop").click(function(event) {
                            $(this).parents(".pop").parent().css({
                                display: 'none'
                            });
                            $("html,body").css({
                                overflow: 'auto'
                            });
                            clearInterval(auto1);
                        });
                    }
                }
            }
            var auto1=setInterval(times, 1000);
        }else{
            $(".pop .close_pop").unbind();
            clearInterval(auto1);
            $(".zichanglht #agree_btn").removeClass('close_pop').addClass('unclick').html('�����Ķ�Э��(<em id="daojis">15</em>s)');
        }

    });

    /*������ǩ��Լ���顷����*/
    $("#dzqmyds").click(function(event) {
        if($(this).prop("checked")==true){
            $("html,body").css({
                overflow: 'hidden'
            });
            $(".dianziqmyds").css({
                display: 'block'
            });
            /*����ʱ*/
            var num=15;
            function times(){
                num--;
                $(".dianziqmyds #daojis").text(num)
                if(num==0){
                    clearInterval(auto2);
                    $(".dianziqmyds #agree_btn").text('ͬ��ǩ��').addClass('close_pop').removeClass('unclick');
                    /*�رյ���*/
                    $(".pop .close_pop").click(function(event) {
                        $(this).parents(".pop").parent().css({
                            display: 'none'
                        });
                        $("html,body").css({
                            overflow: 'auto'
                        });
                        clearInterval(auto2);
                    });
                }
            }
            var auto2=setInterval(times, 1000);
        }else{
            $(".pop .close_pop").unbind();
            clearInterval(auto2);
            $(".dianziqmyds #agree_btn").removeClass('close_pop').addClass('unclick').html('�����Ķ�Э��(<em id="daojis">15</em>s)');
        }

    });

    //���Ͷ�����֤��
    $('#smsVFCodeBtn').click(function(){
       // validateForm.hideError('smsVFCode');
        if($("#smsVFCodeBtn").hasClass('get_yanzm')){
       /* smsVFCodeTipsObj = btn.disable($("#smsVFCodeBtn"),{
            color:          '#FF0000',     //disable���������ɫ
            setBtnLoad:     false        //�Ƿ���ʾLoading��gifͼƬ
        });*/
        var mobile = $('#mobile').val();
        $.ajax({
            type: "post",
            url: "/main/account/openaccount/sendSmsVF",
            data: {"mobileInBank": mobile,
                "noValidate":"true"},
            success: function (msg) {
                //var msgJson = $.parseJSON(msg);
                var msgJson = msg;
                if (msgJson.decode != '00000') {
                    //����ʧ��
                    alert(msgJson.errmsg);
                    btn.enable($("#smsVFCodeBtn"));
                } else {
                    $("#smsVFCodeBtn").removeClass('get_yanzm').addClass('get_unyanzm');
                    $("#showMsg").show()
                    CountDown(90);

                }
            }
        });
        }
    });

	
}

//ҳ���ʼ��
function init(){

    processCheckFundLevel();
    loadPaychannelInfo();

    $.post("/main/specialBuy/qrycontract",{fundcode:$("#fundCode").val()},function(result){
        if(result.errno=="00000"){

              $("#delidentityno").html(result.delidentityno);
            /*  $("#deladdress").html(result.deladdress);
              $("#address").html(result.deladdress);
              $("#address").val(result.deladdress); */
              $("#riskLevel").html(result.riskLevel);
              $("#fundlevelshow").html(result.fundlevelshow);

            if(""==result.deladdress || null==result.deladdress || undefined==result.deladdress){
                $("#addresshref").html("���");
            }else{
                $("#addresshref").html("�޸�");
                $("#deladdress").html(result.deladdress);

                $("#address").val(result.deladdress);
            }
            if(""==$("#mobile").val()){
                $("#mobilehref").html("���");
            }else{
                $("#mobilehref").html("�޸�");

            }

              if(''!=result.data.contracturl){
                    $("#contracthref").html("��"+result.data.contracturl.substring(result.data.contracturl.lastIndexOf('\\')+1,result.data.contracturl.length).split("_")[0]+"��");
                    $("#contracturl").val(encodeURI(result.data.contracturl,"utf-8"));
                    $("#confirmcontract").html("��"+result.data.contracturl.substring(result.data.contracturl.lastIndexOf('\\')+1,result.data.contracturl.length).split("_")[0]+"��");
                    $("#confirmcontract").attr("href","/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath="+result.data.contracturl);
                    $("#contracthref").attr("href","/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath="+result.data.contracturl);

              }

                if(''!=result.data.riskwarnurl){
                    $("#riskwarnurl").val(encodeURI(result.data.riskwarnurl,"utf-8"));
                    $("#riskwarnpath").attr("href","/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath="+result.data.riskwarnurl);
                }

                if(''!=result.data.signagreeurl){
                    $("#signagreeurl").val(encodeURI(result.data.signagreeurl,"utf-8"));
                    $("#signagree").attr("href","/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath="+result.data.signagreeurl);
                    $("#signagreepath").attr("href","/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath="+result.data.signagreeurl);

                }



        } else{
            modalStatusError(result.errMsg,true);

        }
    });

}


//����֧��������Ϣ
function loadPaychannelInfo()
{
    $("#paymethodGroup").addClass('hide');
    $("#paychannelTips").text("���ڼ���֧��������Ϣ...");
    $.ajax({
        type: "post",
        url: "/main/specialBuy/getPayChannelInfo",
        async:true,
        data: {"fundcode": $("#fundCode").val()},
        success: function (data) {
            if (data.errno != '00000') {
                //����
                $("#modal3").modal('hide');
                $("#showInfoMsg").html("��ȡ֧��������Ϣ���ִ������Ժ����ԡ�");
                $("#modal2").modal('show');
            } else {
                userPayChannels = data.userPayChannels;
                var businCode = $("#businCode").val();
                if(businCode == "020"){
                    $.ajax({
                        type: "post",
                        url: "/main/specialBuy/getAppreciation",
                        async:true,
                        data: {"fundcode": $("#fundCode").val(),"tradeacc":$("#tradeacc").val()},
                        success: function (data) {
                            if (data.support) {
                                isSupportWalletFreezeBusin = true;
                                $("#appreciationShow").css("display","block");
                            }
                        }
                    });
                }
                walletRadioClick();
            }
        }
    });
}
function walletRadioClick() {

    if(isSupportWalletFreezeBusin){
        $("#appreciationShow").css("display","block");
    }else{
        $("#appreciationShow").css("display","none");
    }
    $("#paychannelSelect").empty();
    for(var i = 0 ; i<userPayChannels.wallet.length;i++)
    {
        var wallet = userPayChannels.wallet[i];
        var bankaccoShow = wallet.bankacco.replace('I','');
        $("#paychannelSelect").append('<option value="' + wallet.type +'|' + i + '">'
            + wallet.bankname + ':'
            + bankaccoShow + '</option>');
    }
    $('select#paychannelSelect option:first').attr('selected','true');
    paychannelSelectChange();
    $("#paymethodGroup").addClass('hide');
    setMoneyInfo();
}

function setMoneyInfo()
{
    $("#method").val("redeemToConfirm");
}

function bankcardRadioClick(paymethod,bankselect) {
    $("#appreciationShow").css("display","none");
    $("#paychannelSelect").empty();
    for(var i = 0 ; i<userPayChannels.bankcard.length;i++)
    {
        var bankcard = userPayChannels.bankcard[i];
        var bankaccoShow = bankcard.bankacco.replace('I','');
        $("#paychannelSelect").append('<option value="' + bankcard.type +'|' + i + '">'
            + bankcard.bankname + ':'
            + bankaccoShow + '</option>');
    }
    if(bankselect != undefined){
        $("#paychannelSelect").val(bankselect);
        paychannelSelectChange('',"1");
    }else{
        $('select#paychannelSelect option:first').attr('selected','true');
        paychannelSelectChange();
    }
    $("#paymethodGroup").removeClass('hide');
    setBankCardInfo();
    paymethodClick();
}

//�������п���Ϣ
function setBankCardInfo()
{
    $("#method").val("buyConfirm");
}

function paychannelSelectChange(o,p)
{
    if(!$("#paychannelSelect").val())
    {
        return;
    }
    var tmp = $("#paychannelSelect").val().split('|');
    var type = tmp[0];
    var i = tmp[1];
    $("#paychannelTips").text("");
    if('W' == $.trim(type)|| 'w' == $.trim(type)){
        //Ǯ����
        var wallet = userPayChannels.wallet[i];
        if('Y' == wallet.reinvest || 'y' == wallet.reinvest){
            $("#paychannelTips").html("��ǰǮ���ӿ������:" + util.number.format(wallet.availshare,2) +"Ԫ&nbsp;<a href='../../wallet/recharging.jsp' target = '_blank' style='text-decoration: none;color:#3389ca;padding-left: 5px;' title='�ɹ���ֵǮ���Ӻ����������߶���Ʋ�Ʒ'>���÷ݶ����������ֵ></a>");
        }else{
            $("#paychannelTips").html("��ǰǮ���ӿ������:" + util.number.format(wallet.availshare,2) +"Ԫ&nbsp;<a href='../../wallet/recharging.jsp' target = '_blank' style='text-decoration: none;color:#3389ca;padding-left: 5px;' title='�ɹ���ֵǮ���Ӻ����������߶���Ʋ�Ʒ'>���÷ݶ����������ֵ></a>");
        }
        //ѡ�еĽ����˺���Ϣ
        $("#tradeAcc").val(wallet.tradeacco);
        $("#bankNo").val(wallet.bankno);
        $("#bankCardNo").val(wallet.bankacco);
        $("#paychannelType").val(wallet.type);
        $("#isreinvestment").val(wallet.reinvest);
        $("#taFund2").val("27");
        $("#targetFundCode").val(wallet.walletfundcode);
        $("#targetShareType").val(wallet.walletsharetype);
        $("#capitalmode").val(wallet.capitalmode);

        currentPaymethodMap = null;
    }else{
        //���п�
        var bankcard = userPayChannels.bankcard[i];
        var paymethod = bankcard.payMethod;
        $("#paymethodDiv").empty();
        currentPaymethodMap = {};
        for(var j=0; j< paymethod.length; j++){
            $("#paymethodDiv").append(
                '<label class="radio" id="' + paymethod[j].methodtype + '_label" style="width:80%;padding-top:0px;height:30px;line-height:30px;margin-bottom:10px">' +
                '<input type="radio" id="' + paymethod[j].methodtype + 'Radio" name="payMethodRadio" style="margin-left:10px;margin-right:5px;margin-top:8px"' +
                    ' onclick="paymethodClick()" value="' +
                    paymethod[j].methodtype + '">' +
                    paymethod[j].showname + '&nbsp;&nbsp;' +
                    paymethod[j].dispmsg +
                '</label>'
            );
            currentPaymethodMap[paymethod[j].methodtype] = paymethod[j];
        }
        if(p == undefined){
            $('input:radio[name="payMethodRadio"]:first').attr('checked', 'checked');
        }else{
            $('input:radio[name="payMethodRadio"]:last').attr('checked', 'checked');
        }

        if('Y' == bankcard.reinvest || 'y' == bankcard.reinvest){
            $("#paychannelTips").text("");
        }else{
            $("#paychannelTips").text("");
        }
        $("#tradeAcc").val(bankcard.tradeacco);
        $("#bankNo").val(bankcard.bankno);
        $("#bankCardNo").val(bankcard.bankacco);
        $("#paychannelType").val(bankcard.type);
        $("#isreinvestment").val(bankcard.reinvest);
        $("#capitalmode").val(bankcard.capitalmode);
    }
}

//����¼���֧����ʽ
function paymethodClick()
{
    if(!currentPaymethodMap)
    {
        return;
    }
    var value = $('input:radio[name="payMethodRadio"]:checked').val();
    var paymthod = currentPaymethodMap[value];
    if('Y' == paymthod.needSign.toUpperCase())
    {
        var tradeacco = $("#tradeAcc").val();
        var bankcardno = $("#bankCardNo").val();
        //��ʾǩԼ
        if("DATAFLOW" == value.toUpperCase()){
            if ( confirm( "����δ��ͨһ��֧�����ܣ���ͨ������ǩԼ�������п�ͨ���Ƿ����Ͽ�ͨ��" ) ) {
                displayShadeDiv("signMsgConfirm");
                window.open("/account/MyBankAccountAction.do?method=sign&tradeAccount=" + tradeacco +
                    "&bankCardNo=" + bankcardno);
            }
        }else if ("SMG" == value.toUpperCase()){
            if ( confirm( "����δ��ͨһ��֧�����ܣ��Ƿ����Ͽ�ͨ��" ) ){
                displayShadeDiv("openQuickPayConfirm");
                window.open("/account/OpenQuickPayAction.do?method=openPre&tradeAcco=" +tradeacco +
                    "&bankCardNo=" + bankcardno);
            }
        }
    }

}

//�޸�Ϊ����֧��
function changePayMethod(payMethodChangto){
    var yh = $("#paychannelSelect  option:selected").val();
    bankcardRadioClick(payMethodChangto,yh);
//    $("#payLimitAlarm").modal('hide');
    $("#frm").submit();
}

//����޶�
function checkPayLimit()
{
    var t = checkForm();
    if(!t){
       return false;
    }
    var value = $('input:radio[name="payMethodRadio"]:checked').val();
    if(!currentPaymethodMap)
    {
        return true;
    }
    var paymthod = currentPaymethodMap[value];

    var payment = $("#applyMoney").val();
    var methodtype = paymthod.methodtype.toUpperCase();
    var singlePayLimit = paymthod.singlepaylimit;
    var capitalmode = paymthod.capitalmode;
    var showName = paymthod.showname;
    var bankNo =  $("#bankNo").val();

    if (methodtype !='WEB' && singlePayLimit != "" && parseFloat(payment) > parseFloat(singlePayLimit)){
        //hhw:tag ��Ϊͨ����������������ͬʱ֧�ֶ���ǩԼ����ҳǩԼ�����
        if("I"==capitalmode&&(bankNo == "004"||bankNo == "017")){
            if(methodtype=="SMG"){
                $("#msg_payment_allinpay").text(payment);
                $("#msg_paymethod_allinpay").text(showName);
                $("#msg_paylimit_allinpay").text(singlePayLimit);
                $("#btn_cutpaylimit_allinpay").val("��֧��"+singlePayLimit+"Ԫ");
                displayShadeDiv("payLimitAlarm_allinpay");
                return false;
            }else if(methodtype=="DATAFLOW"){
                $("#showInfoMsg").html("֧�����ܳ����޶"+singlePayLimit+"Ԫ");
                $("#modal2").modal('show');
                return false;
            }
        }else if(bankNo == "050"||bankNo == "018"){
            $("#showInfoMsg").html("֧�����ܳ����޶"+singlePayLimit+"Ԫ");
            $("#modal2").modal('show');
            return false;
        }else{
            $("#msg_payment").text(payment);
            $("#msg_paymethod").text(showName);
            $("#msg_paylimit").text(singlePayLimit);
            $("#btn_cutpaylimit").val("��֧��"+singlePayLimit+"Ԫ");
            displayShadeDiv("payLimitAlarm");
            return false;
        }
        return true;
    }
    return true;
}

function tijiao(){
      if(""==$("#smsVFCode").val()){
          alert("��֤�벻��Ϊ��,��������ȷ����֤��!") ;
          return false ;
      }

      $("#gozhifu").css("background-color","#cecece");
      $("#gozhifu").attr("disabled",true);

      var datas={
        fundCode:$("#fundCode").val(),
        contracturl:$("#contracturl").val(),
        riskwarnurl:$("#riskwarnurl").val(),
        signagreeurl:$("#signagreeurl").val(),
        tradeAcco:$("#tradeAcc").val(),
        verifyCode:$("#smsVFCode").val()
      }
       $.post("/main/1Qw2nbvcGFjkfdSxL/extra/savecontract",datas,function(result){
          if(result.errno=="00000"){
              $("#contractNo").val(result.contractNo);
              $("#frm").submit()
           } else{
              $("#gozhifu").css("background-color","#eb5406");
              $("#gozhifu").attr("disabled",false);
              alert(result.errmsg);
           return false;

          }
       });


}

//����ǩԼ
function webSign(){
    var tradeacco = $("#tradeAcc").val();
    var bankcardno = $("#bankCardNo").val();
    displayShadeDiv("signMsgConfirm");
    hideShadeDiv('payLimitAlarm_allinpay');
    window.open("/account/MyBankAccountAction.do?method=sign&tradeAccount=" + tradeacco + "&bankCardNo=" + bankcardno);
}

//��֤ǩԼ���������������
function checkProtocolSignResult(){
    var tradeacco = $("#tradeAcc").val();
    var bankcardno = $("#bankCardNo").val();
    $.ajax({
        type: "post",
        url: "/main/specialBuy/checkProtocolSign",
        async:true,
        data: {"tradeacco": tradeacco,"bankcardno":bankcardno},
        success: function (data) {
            if (data.errno != '00000') {
                //����
                $("#showInfoMsg").html("��ȡǩԼ����������⣬���Ժ����ԡ�");
                $("#modal2").modal('show');
            } else {
                if(data.signstate) {
                    hideShadeDiv("signMsgConfirm");
                }else{
                    $("#showInfoMsg").html("ǩԼδ��ɣ�����ǩԼ�ټ������ף���ѡ������֧����ʽ��");
                    $("#modal2").modal('show');
                }
            }
        }
    });
}

//ȡ��ǩԼ��ѡ������֧����ʽ
function cancelProtocolSign(){
    hideShadeDiv("signMsgConfirm");
}

//��ͨ��ݸ�����ӿ�ݸ�֧������
function checkOpenQuickpayResult(){
    var tradeacco = $("#tradeAcc").val();
    var bankcardno = $("#bankCardNo").val();
    $.ajax({
        type: "post",
        url: "/main/specialBuy/checkOpenQuickPay",
        async:true,
        data: {"tradeacco": tradeacco,"bankcardno":bankcardno},
        success: function (data) {
            if (data.errno != '00000') {
                //����
                $("#showInfoMsg").html("��ȡһ��֧����ͨ����������⣬���Ժ����ԡ�");
                $("#modal2").modal('show');
            } else {
                if(data.signstate) {
                    hideShadeDiv("openQuickPayConfirm");
                }else{
					hideShadeDiv("openQuickPayConfirm");
                    $("#showInfoMsg").html("һ��֧��δ��ͨ�����ȿ�ͨһ��֧���ټ������ף�");
                    $("#modal2").modal('show');
                }
            }
        }
    });
}

//ȡ����ͨ��ݸ�
function cancelOpenQuickpay(){
    hideShadeDiv("openQuickPayConfirm");
}


//��ʾ���ֲ�
function displayShadeDiv(id){
    $("#tradeShadeDiv").show();
//    $("#"+id).show();
    $("#"+id).modal('show');
}

//�������ֲ�
function hideShadeDiv(id){
    $("#tradeShadeDiv").hide();
//    $("#"+id).hide();
    $("#"+id).modal('hide');
}

/******* �����������ķ��� *******/

//���������
function checkMoney()
{
    var money = $("#applyMoney").val();
    money = money.replace(/\s+/g, "");
    if(money == null || money == ""){
        return false;
    }else{
        var msg = "";
        var _money = parseFloat($("#applyMoney").val());
        var _fundCode = $("#fundCode").val();
        var _shareType = $("#shareType").val();
        var _tradeAcc = $("#tradeAcc").val();
        var _businCode = $("#businCode").val();
        var _bankNo = $("#bankNo").val();
        var isreinvestment = $("#isreinvestment").val();
        var capitalmode=$("#capitalmode").val();

        $.ajax({
            type : "post",
            url : "/main/specialBuy/getFeeInfo",
            data : "inbusincode="+_businCode+"&intradeacco="+_tradeAcc+"&infundcode="+_fundCode+"&sharetype="+
                _shareType+"&bankno="+_bankNo+"&inrequestamount="+_money + "&isreinvestment=" + isreinvestment +
                "&capitalmode="+capitalmode,
            async : false,//ȡ���첽
            success : function(data){
                var _rate;
                var _amount;
                if (data.flag != undefined)
                {
                    _rate = data.fareratio;
                    _amount = data.farevalue;
                    if (parseInt(data.flag) == -1)
                    {
                        $("#rateamount").html(" ");
                        $("#ratetitle").html("�Ϲ��ڻ������ܷ����Ż�");
                    } else
                    {
                        $("#rateamount").html(_amount.toFixed(2));
                        $("#ratetitle").html(" ");
                    }
                } else
                {
                    $("#rateamount").html(" ");
                    $("#ratetitle").html("�޷������������");
                }

                if (data.message != undefined)
                {
                    $("#checkmoney").html(data.message);
                    $("#checkmoney").show();
                } else
                {
                    $("#checkmoney").hide();
                }
                msg = data.message;
            }
        });
    }
    return msg;
}

//���ַݶ�ת��д��js��
function ChangeShareToUpper(value)
{
    var intFen,i,iPos;
    var strArr,strCheck,strFen,strDW,strNum,strBig,strNow;
    var type = $("#paychannelType").val();
    var unit='Ԫ';
    if('W' == type || 'w' == type){
        unit='��'
    }

    // Ϊ��
    if(!CheckEmpty(value))
        return "";

    // ������
    if (!isNumberStr(value))   //���ݷǷ�ʱ��ʾ�������ؿմ�
    {
        strErr = value+"������Ч���֣�"
        return strErr;
    }

    iPos = GetDotPos(value);
    if (iPos < 0 )
    {
        // ��ȫ����
        return ChangeIntToUpper(value)+unit;
    }
    else if (iPos == 0)
    {
        //����С��
        return "���" + ChangeShareFracToUpper(value.substring(1))+unit;
    }
    else
    {
        //����С�����
        var numA, numB;

        strArr = value.split(".");
        numA = strArr[0];
        numB = strArr[1];

        if(numA.length>12)   //���ݴ��ڵ���һ����ʱ��ʾ�޷�����
        {
            strErr = value+"�����޷�����"
            return strErr;
        }

        var numBBig = ChangeShareFracToUpper(numB);

        if (numBBig.length != 0)
            return ChangeIntToUpper(numA) + "��" + numBBig +unit;
        else
            return ChangeIntToUpper(numA) + unit;
    }
}

function CheckEmpty(strInput)
{
    if (strInput.length <= 0)
        return false;
    return true;
}

/**
 * �����ַ����б�.
 * @param s ��Ҫ�б���ַ���.
 * @return ��sΪ�����ַ���ʱ����true, ��֮����false.
 */
function isNumberStr(s)
{
    var n = "0123456789.";
    var i;
    var isF = false;
    var fnum = 0;
    var maxF = 2;//С��λ�����ֵ
    var j = 0;
    if ((s == null) || (s.length == 0 )){
        return false;
    }

    for (i = 0 ; i < s.length ; i++){
        if ( s.charAt(i) == "." ) {
            isF = true;
            j++;
        }
        if (isF) {
            fnum++;
        }
        var c = s.charAt(i);
        if ( ( n.indexOf(c) == -1) || (j > 1) || (fnum - 1 > maxF)){
            return false;
        }
    }
    return true;
}


// �õ�.��λ��
function GetDotPos(value)
{
    var j,i,nPos;
    var isZero;

    nPos = -1;
    for (i = 0 ; i < value.length ; i++)
    {
        if ( value.charAt(i) == "." )
        {
            nPos = i;
            break;
        }
    }
    return nPos;
}


// ���������֣�ת���ɴ�д
function ChangeIntToUpper(inputNum)
{
    //alert(inputNum);
    if (parseInt(inputNum) == 0)
        return GetNumUpper('0');

    var subsNum = Math.ceil(inputNum.length/4);
    var beforNum = inputNum.length % 4;

    var substr = new Array(subsNum);

    var i=0,j=0;
    var iPos = 0;
    var sOut = "";
    var isZero = false;
    for (i=0; i<subsNum; i++)
    {
        if (i==0 && beforNum != 0)
        {
            substr[i] = inputNum.substr(0,beforNum);
            iPos += beforNum;
        }
        else
        {
            substr[i] = inputNum.substr(iPos,4);
            iPos += 4;
        }

        // alert("��"+i+ "��(" +subsNum+")" + substr[i]);
        var subStrLen = substr[i].length;
        for(j=0;j<subStrLen; j++)
        {
            if (substr[i].charAt(j) != '0')
            {
                if (isZero)
                {
                    isZero = false;
                    sOut += GetNumUpper('0');
                }
                sOut += GetNumUpper(substr[i].charAt(j)) + GetIntPosUnit(0,subStrLen-j);
            }
            else
                isZero = true;

        }

        if (parseInt(substr[i]) != 0)
            sOut += GetIntPosUnit(1,subsNum-i);
        //alert("��"+i+ "��(" +subsNum+")" + sOut);
    }

    return sOut;
}

function ChangeShareFracToUpper(inputNum)
{
    // ��������Ϊ������
    var sInputNum = "";

    var iLen,i;
    var isZero = true;
    iLen = inputNum.length;
    for (i=iLen; i>0; i--)
    {
        if (inputNum.charAt(i-1) == '0')
        {
            if (!isZero)
            {
                sInputNum = inputNum.charAt(i-1) + sInputNum;
            }
        }
        else
        {
            sInputNum = inputNum.charAt(i-1) + sInputNum;
            isZero = false;
        }
    }

    if (sInputNum.length == 0)
    {
        return "";
    }

    var sOut="";

    iLen = sInputNum.length;
    for (i=0; i<iLen; i++)
    {
        sOut += GetNumUpper(sInputNum.charAt(i));
    }
    return sOut;
}


// �õ���Ӧ���ֵĴ�д
function GetNumUpper(value)
{
    var strNum = "";
    switch (value)              //ѡ������
    {
        case "1":strNum = "Ҽ";break;
        case "2":strNum = "��";break;
        case "3":strNum = "��";break;
        case "4":strNum = "��";break;
        case "5":strNum = "��";break;
        case "6":strNum = "½";break;
        case "7":strNum = "��";break;
        case "8":strNum = "��";break;
        case "9":strNum = "��";break;
        case "0":strNum = "��";break;
    }
    return strNum;
}

// �õ�����λ����Ӧ�Ĵ�д��λ
function GetIntPosUnit(type,postion)
{
    var strDW = "";

    if (type==0)
    {// 10000����
        switch(postion)              //ѡ��λ
        {
            case 1:strDW = "";break;    // ��
            case 2:strDW = "ʰ";break;  // ʮ
            case 3:strDW = "��";break;  // ��
            case 4:strDW = "Ǫ";break;  // ǧ
            default: strDW = "";break;
        }
    }
    else if (type==1)
    {// 10000�ı��� //TODO:�ٴ�Ͳ�֪����ô������
        switch(postion)              //ѡ��λ
        {
            case 1:strDW = "";break;
            case 2:strDW = "��";break;
            case 3:strDW = "��";break;
            case 4:strDW = "��";break;
            default: strDW = "";break;
        }
    }

    return strDW;
}

//���ռ��
function processCheckFundLevel()
{
    var riskLever = $("#riskLever").val();
    var _check = $("#fundCode").val();
    $.ajax({
        type : "post",
        url : "/main/specialBuy/getRiskInfo?fundCode="+_check,
        async : false,//ȡ���첽
        success : function(data){
            if (data.riskInfo == "")
            {
                //��ƥ�� �����ط�����ʾ ��ť����
                if ($("#fundCode").val() == "" || $("#fundCode").val() == null)
                {
                   // $('#tongyi_tijiao').attr('disabled', 'disabled');
                   // $('#tongyi_tijiao').css("background","grey");
                } else
                {
                   // $('#tongyi_tijiao').removeAttr('disabled');
                   // $('#tongyi_tijiao').css("background","#eb5406");
                }
            } else
            {
                //����ƥ�� ��ʾ������ʾ����check����ť�����á���ʾ��ʾ
                $("#riskCheckShow").hide();
                $("#showInfoMsgLever").html(data.riskInfo);
                $("#modal3").modal('show');
               // $('#tongyi_tijiao').attr('disabled', 'disabled');
                //$('#tongyi_tijiao').css("background","grey");
            }
        }
    });
}

// ��׼���깺��������֤
function checkForm()
{
    var msg = "";
   /* if($("#filecheck").is(":checked")==false)
    {
        $("#showInfoMsg").html("��ȷ�� ���Ķ������֪�����˽�����գ�");
        $("#modal2").modal('show');
        return false;
    }*/
    // 1.1 ���֧�����
    if ($("#applyMoney").val() == "")
    {
        msg += "֧������Ϊ�գ�\n";
    }
    else
    {
        var moneyPattern = /^[0-9]+([.]\d{1,2})?$/;
        if (!moneyPattern.exec($("#applyMoney").val()))
        {
            msg += "��������ȷ��ʽ�Ľ�\n";
        }
        else if ($("#applyMoney").val() <= 0)
        {
            msg += "֧������������㣡\n";
        }
        else
        {
            msg += checkMoney();
        }
    }



    if (msg != "")
    {
        $("#showInfoMsg").html(msg);
        $("#modal2").modal('show');
        return false;
    }

    var contractAddr = $('#contractAddrView').val();
    var _other = ' ,' + ' ,' + ' ,' + $('#zipCode').val();

    //�ǿ��ж�
    /*if (contractAddr == "")
    {
        msg = "��������͵�ַ��\n";
    } else
    {
        if ($("#zipCode").val() == "")
        {
            msg += "��������������\n";
        } else
        {
            if ($("#zipCode").val().length != 6)
            {
                msg += "��������ȷ6λ��������\n";
            }
        }

        var _newObj = contractAddr.replace(/[^\x00-\xff]/g, "**");

        if (_newObj.length > 60)
        {
            msg += "��ϵ��ַ���ܳ���60���ַ���1�����ĵ���2���ַ���";
        }
        $("#contractAddr").val(_other + "," + contractAddr);//����������ַ
    }
*/
    //�������Ǯ���ӹ���Ҫ���Ǯ����ʣ��ݶ����
    var type = $("#paychannelType").val();
    if('W' == type || 'w' == type){
        if(!$("#paychannelSelect").val())
        {
            msg += "û��ѡ��֧��������";
        }else{
            var tmp = $("#paychannelSelect").val().split('|');
            var type = tmp[0];
            var i = tmp[1];
            var wallet = userPayChannels.wallet[i];
            var availableValue = wallet.availshare;
            if (availableValue == undefined){
                availableValue = 0.00;
            }
            if (parseFloat($("#applyMoney").val()) > parseFloat(availableValue)){
                msg += "Ǯ�������㣬�޷����ף�\n";
            }
            $("#transferShares").val($("#applyMoney").val());
        }
    }

    //�����ʾ���Ϲ��������棬����Ҫ��ѡЭ���
    var appreciationShow = $("#appreciationShow").css("display");
    if(appreciationShow == "block"){
        if ($("#appreciationNote").is(":checked")) {
        }else{
            msg = "�빴ѡ�Ϲ�������Ǯ��������Э�顣";
        }
    }

    if (msg != "")
    {
        $("#showInfoMsg").html(msg);
        $("#modal2").modal('show');
        return false;
    }else{
        return true;
    }
}
var time;
// ����ʱ
function CountDown(secs){
   // $(smsVFCodeTipsObj).html('<span class="text-red text-fontsize16">��'+secs+'��</span>');

    $("#smsVFCodeBtn").html('��'+secs+'������»�ȡ��');
    //$("#smsVFCodeBtn").("��"+secs+"������»�ȡ��");
    if(--secs>0){
        time=setTimeout("CountDown("+secs+")",1000);
    } else {
        /*$(".get_yanzm").css("background-color","#f2641c");
        $(".get_yanzm").css("width","86px");*/
        $("#smsVFCodeBtn").removeClass('get_unyanzm').addClass('get_yanzm');
       /* btn.enable($("#smsVFCodeBtn"));
        $(smsVFCodeTipsObj).html('');*/
        $("#smsVFCodeBtn").html("���»�ȡ");
        $("#showMsg").hide()
    }
}
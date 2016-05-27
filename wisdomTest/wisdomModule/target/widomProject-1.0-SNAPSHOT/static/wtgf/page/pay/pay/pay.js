var util = require("common:widget/util/util.js"),
    datepicker = require("common:widget/datepicker/datepicker.js"),
    juicer = require("common:widget/juicer/juicer.js"),
    dialog = require("common:widget/dialog/dialog.js"),
    btn = require("common:widget/btn/btn.js"),
    cal = require("common:widget/cal/cal.js"),
    menuCookie = require("wtgf:widget/menuCookie/menuCookie.js"),
    fredkeyboard = require("wtgf:widget/fredkeyboard/fredKeyboard.js"),
    verifyDiv = require("wtgf:widget/verifyDiv/verifyDiv.js");
var id = "";
var $containerPay = $('.container-pay');
var row;//�����ĵ���������һ��ҳ�棬��cookie��¼���������������˺ܶࡣ
var col;//�����ĵ���������һ��ҳ�棬��cookie��¼���������������˺ܶࡣ
var main = (function(){
    var _init = function(){
        $.ajaxSetup({ cache: false });
        //�ж���Ǯ���ӻ�����ͨ����(����Ϊ�˷�ֹcookie���¿�ҳ�渲�ǣ�����ͨ��ҵ���ֶλ�ȡ��Դ������Ժ�������ҵ��
        // ���������������Ҫ��Ӧ����ȥ��)
        var verifyBusinessTemp = verifyBusinessFunction();
        if(verifyBusinessTemp == "reCharge"){
            //Ǯ���ӳ�ֵ
            menuCookie.cookie.setMenu("r1","c11");
        }else{
            //��ֻ������
            menuCookie.cookie.setMenu("r2","c28");
        }
        menuCookie.cookie.menu();
        row = util.cookie.get("row");
        col = util.cookie.get("col");
        loadPayInfo();
    };

    var bindEvent = function(){
        $('.in-pw').fredKeyboard({
            inp: '#tradingpw',
            isRandom: true,
            // ��ʽ�ļ���ַ
            cssAdr: '/static/wtgf/css/fredkeyboard/fredkeyboard.css',
            // ������������,���޸���ȫ������
            text: {
                title: '�㷢�������Ͻ���ƽ̨',
                kbswitch: 'ʹ�ü�������',
                caps: '�л���/Сд',
                enter: 'ȷ��',
                backp: 'backspace'
            }
        });

        // ����ȷ����֧��-ѡ��֧����ʽ
        $containerPay.on('click', '.pay-type-dd .pay-type-main li', function(){
            $(this).parents('.pay-type-dd').find('li').removeClass('active');
            setDefaultPay($(this));
            return false;
        });

        //����֧�����к���İ�ť
        $containerPay.on('click', '.pay-type-dd .pay-type-main li a', function(){
            if($(this).parent().hasClass('signing')){
                //�����ͨ�������߿�ͨ���
                $("#modal3").modal("show");
                window.open("/main/bankCards/myCards");
            }else if($(this).parent().hasClass('limit')){
                //��ת��֧�����ͻ㸶���µ��޶�ҳ��
                window.open("http://www.gffunds.com.cn/wsjyjsy/zfyhk/");
            }
        });

        // Ǯ����֧�����㣬��ֵ - ѡ��֧����ʽ
        $containerPay.on('click', '.walletDiv .pay-type-main li', function(){
            $(this).parents('.walletDiv').find('li').removeClass('active');
            $(this).addClass('active');
            var buyMethod = $(this).find("input:eq(0)").val();
            var tradeAcco = $(this).find("input:eq(1)").val();
            var bankCardNo = $(this).find("input:eq(2)").val();
            var bankNo = $(this).find("input:eq(3)").val();
            $("#reCharege_buyMethod").val(buyMethod);
            $("#reCharege_tradeAcco").val(tradeAcco);
            $("#reCharege_bankCardNo").val(bankCardNo);
            $("#reCharege_bankNo").val(bankNo);
            $("#setPayStyle").hide();
            return false;
        });

        // ����ȷ����֧��-ѡ��֧����ʽ-Ǯ����֧��
        var $qdzLi = null;
        $containerPay.on('click', '.pay-qdz .pay-type-main li', function(){
            $qdzLi = null;

            // �ж�Ǯ��������Ƿ��㹻
            if($(this).attr('data-less')){
                // ����
                // ����ѡ��֧����ʽ
                $("#modal6").modal("show");
                $("#toPay").removeAttr('disabled');
                $('#toPay').css("background","#DF5412");
                var money = $(this).attr("data-less");
                $("#reCharegeMoney").html(money);
                $("#reCharege_amount").val(money);
                $qdzLi = $(this);
                var bankCardNo = $(this).find("input:eq(0)").val();
                var capitalMode = $(this).find("input:eq(2)").val();
                $("#setPayStyle").hide();
                $("#tradePwd").val("");
                //����Ǯ���Ӳ��㣬��ֵ��ѡ������
                $("#reChargeBankList").html('<center><img src="/static/wtgf/img/pay/loading.gif" alt="">&nbsp;&nbsp;���ڼ��أ����Ժ�......</center>');
                reChargeMoney(bankCardNo,capitalMode);
            }
        });

        //�رյ�����
        $containerPay.on('click', '.js-pop-close', function(){
            $(this).parents('.pop').fadeOut();
        });

        //֧����ʽ�л�
        $(".mode_of_payment li").click(function(event) {
            var num=$(this).index();
            $(this).addClass('current').siblings('li').removeClass('current');
            $(".pay_type_describe>ul>li").eq(num).addClass('current').siblings('li').removeClass('current');
            $(".pay-type-dd>div").eq(num).addClass('current').siblings('div').removeClass('current');
            //��ѡ�е����֧����ʽĬ��ѡ���һ��,�����ǰѡ���֧����ʽһ�����ж�û�У���ʲô��������
            var selectedLiNode = $(".pay-type-dd>div").eq(num).find('li:eq(0)');
            if(selectedLiNode == null || selectedLiNode == undefined || selectedLiNode.length == 0){
                $("#bankCardNo").val("");
                $("#bankNo").val("");
                $("#capitalMode").val("");
                $("#buyMethod").val("");
                $("#tradeAcco").val("");
                $("#perPayLimit").val("");
            }else{
                $(".pay-type-dd").find('li').removeClass('active');
                setDefaultPay(selectedLiNode);
            }
        });

        $("#ktwy").click(function(){
            menuCookie.cookie.setMenu(row,col);
            window.location.reload();
        });

        //�رմ����¼�
        $("#modal3").on('hide.bs.modal', function (){
            menuCookie.cookie.setMenu(row,col);
            window.location.reload();
        });

        $(".reChargezfwc").click(function(){
            //��ֵ�ɹ���ˢ�������б��ݶ�
            menuCookie.cookie.setMenu(row,col);
            window.location.reload();
        });

        //�رմ����¼�
        $('#modal7').on('hide.bs.modal', function (){
            menuCookie.cookie.setMenu(row,col);
            window.location.reload();
        });
        //�رմ����¼�
        $('#modal8').on('hide.bs.modal', function (){
            menuCookie.cookie.setMenu(row,col);
            window.location.reload();
        });
        //�رմ����¼�
        $('#modal9').on('hide.bs.modal', function (){
            menuCookie.cookie.setMenu(row,col);
            window.location.reload();
        });
        //�رմ����¼�
        $('#modal5').on('hide.bs.modal', function (){
            $.ajax({
                type: "get",
                url: "/main/order/getState/"+id,
                success: function (data) {
                    if(data.issuccess){
                        window.location.href="/main/order/query/"+id;
                    }else{
                        $("#showInfoMsg").html(data.returnmsg);
                        $("#modal0").modal("show");
                        $("#pay").removeAttr('disabled');
                        $('#pay').css("background","#DF5412");
                        if(typeof(dcsPageTrack)=="function"){
                            var business = "";
                            var errorType = "";
                            var verifyBusinessTemp = verifyBusinessFunction();
                            if(verifyBusinessTemp == "reCharge"){
                                business = "Ǯ���ӳ�ֵ";
                                errorType = "��ֵʧ��";
                            }else{
                                business = "�������깺";
                                errorType = "���깺ʧ��";
                            }
                            dcsPageTrack("WT.si_n",business,false,"WT.si_x",errorType,false,"WT.err_type",data.returnmsg,false);
                        }
                    }
                }
            });
        });


        $("#paySuccess").click(function(){
            $.ajax({
                type: "get",
                url: "/main/order/getState/"+id,
                success: function (data) {
                    if(data.issuccess){
                        menuCookie.cookie.setMenu(row,col);
                        window.location.href="/main/order/query/"+id;
                    }else{
                        $("#modal5").modal("hide");
                        $("#showInfoMsg").html(data.returnmsg);
                        $("#modal0").modal("show");
                        $("#pay").removeAttr('disabled');
                        $('#pay').css("background","#DF5412");
                    }
                }
            });
        });

        $("#pay").click(function(){
            //�ж��Ƿ�ΪQD����
            var isQdDelay = $("#isQdDelay").val();
            var predictTradeDate = $("#predictTradeDate").val();
            if(isQdDelay == "true"){
                var fundName = $("#fundName").val();
                //�ж���Ǯ���ӻ�����ͨ����
                var buyMethod = $("#buyMethod").val();
                if(buyMethod == "F"){
                    $("#walletInfoMsg").html("�����г����У�"+fundName+"������ͣ�깺�������깺���뽫�Զ�˳���������"+
                        "�����깺��("+predictTradeDate+")�µ�����"+predictTradeDate+"ǰ���ʽ���Ȼ��Ǯ���������ܻ��һ������档�Ƿ�ȷ���µ�?");
                    $("#modal2").modal("show");
                }else{
                    $("#alertInfoMsg").html("�����г����У�"+fundName+"������ͣ�깺�������깺���뽫�Զ�˳���������"+
                        "�����깺��("+predictTradeDate+")���Ƿ�ȷ���µ�?");
                    $("#modal1").modal("show");
                }
            }else{
                mainPay();
            }
        });

        $("#qdToBuy").click(function(){
           //ȷ��Qd�����µ�
            $("#modal1").modal("hide");
            mainPay();
        });

        $("#qdCancel").click(function(){
           //ȡ��QD�µ�
            $("#modal1").modal("hide");
        });

        $("#walletQdToBuy").click(function(){
            //ȷ��Qd�����µ�
            $("#modal2").modal("hide");
            mainPay();
        });

        $("#walletQdCancel").click(function(){
            //ȡ��QD�µ�
            $("#modal2").modal("hide");
        });

        $("#toBankUrl").click(function(){
            $("#modal11").modal("hide");
            var toBankUrlWindow = $("#toBankUrlWindow").val();
            //1����ת������֧��ҳ��
            $("#modal"+toBankUrlWindow).modal("show");
            //2���¿�ҳ�棬��ת����̨��
            var verifyBusiness = "buyFund";
            if(toBankUrlWindow == "9"){
                verifyBusiness = "reCharge";
            }
            var verifyBusinessTemp = verifyBusinessFunction();
            if(verifyBusinessTemp == "reCharge"){
                verifyBusiness = "reCharge";
            }
            window.open("/main/order/goBank?verifyBusiness="+verifyBusiness);
        });

        //Ǯ���Ӳ��㣬��ֵȷ��
        $("#toPay").click(function(){
            if(typeof(dcsPageTrack)=="function"){
                dcsPageTrack("WT.si_n","Ǯ���ӳ�ֵ",false,"WT.si_x","ȷ�϶���",false);
            }
            menuCookie.cookie.setMenu(row,col);
            var reCharege_amount = $("#reCharege_amount").val();
            var reCharege_buyMethod = $("#reCharege_buyMethod").val();
            var reCharege_tradeAcco = $("#reCharege_tradeAcco").val();
            var reCharege_bankCardNo = $("#reCharege_bankCardNo").val();
            var reCharege_bankNo = $("#reCharege_bankNo").val();
            if(reCharege_tradeAcco == null || reCharege_tradeAcco == "" || reCharege_tradeAcco == undefined){
                //δѡ��֧����ʽ
                $("#setPayStyle").show();
            }else{
                $("#toPay").attr("disabled","disabled");
                $('#toPay').css("background","grey");
                $('#toPay').css("border","0px");
                $.ajax({
                    type: "post",
                    url: "/main/order/payConfirm",
                    async:true,
                    data:{"amount":reCharege_amount,"bankCardNo":reCharege_bankCardNo,"bankNo":reCharege_bankNo,
                        "businCode":"","capitalMode":$("#capitalMode").val(),"fundCode":$("#walletFundCode").val(),
                        "buyMethod":reCharege_buyMethod,"shareType":"A","tradeAcco":reCharege_tradeAcco,
                        "tradePassWord":$("#tradePwd").val(),"verifyBusiness":"reCharge"},
                    success: function (data) {
                        $("#tradePwd").val("");
                        var orderId = data.orderId;
                        id = orderId;
                        $("#toPay").removeAttr('disabled');
                        var fundCode = $("#fundCode").val();
                        if(reCharege_buyMethod == "D"){
                            //��ݳ�ֵ
                            if(data.issuccess){
                                //��ֵ�ɹ�
                                $("#modal6").modal("hide");
                                $("#modal7").modal("show");
                                if(typeof(dcsPageTrack)=="function"){
                                    dcsPageTrack("WT.si_n","Ǯ���ӳ�ֵ",false,"WT.si_x","��ֵ�ɹ�",false,"WT.pn_sku",fundCode,false,
                                        "WT.pc","",false,"WT.tx_s",reCharege_amount,false,"WT.tx_i","",false,"WT.tx_id","",false,
                                        "WT.tx_it","",false,"WT.payentry","���п�",false,"WT.paytype","ǰ�շ�",false,
                                        "WT.paybank",$("#capitalMode").val(),false);
                                }
                            }else{
                                $("#modal6").modal("hide");
                                //ʧ�ܵ����򣬸����û�������Ϣ
                                $("#zfsbMsg").html(data.returnmsg);
                                $("#modal8").modal("show");
                                if(typeof(dcsPageTrack)=="function"){
                                    dcsPageTrack("WT.si_n","Ǯ���ӳ�ֵ",false,"WT.si_x","��ֵʧ��",false,"WT.pn_sku",fundCode,false,
                                        "WT.pc","",false,"WT.tx_s",reCharege_amount,false,"WT.tx_i","",false,"WT.tx_id","",false,
                                        "WT.tx_it","",false,"WT.payentry","���п�",false,"WT.paytype","ǰ�շ�",false,
                                        "WT.paybank",$("#capitalMode").val(),false,"WT.err_type",data.returnmsg,false);
                                }
                            }
                        }else{
                            if(data.issuccess){
                                $("#modal6").modal("hide");
                                //������ֵ
                                $("#toBankUrlWindow").val("9");
                                $("#modal11").modal("show");
                            }else{
                                $("#modal6").modal("hide");
                                //ʧ�ܵ����򣬸����û�������Ϣ
                                $("#zfsbMsg").html(data.returnmsg);
                                $("#modal8").modal("show");
                                if(typeof(dcsPageTrack)=="function"){
                                    dcsPageTrack("WT.si_n","Ǯ���ӳ�ֵ",false,"WT.si_x","��ֵʧ��",false,"WT.pn_sku",fundCode,false,
                                        "WT.pc","",false,"WT.tx_s",reCharege_amount,false,"WT.tx_i","",false,"WT.tx_id","",false,
                                        "WT.tx_it","",false,"WT.payentry","���п�",false,"WT.paytype","ǰ�շ�",false,
                                        "WT.paybank",$("#capitalMode").val(),false,"WT.err_type",data.returnmsg,false);
                                }
                            }
                        }
                    }
                });
            }
        });

        //�������п�
        $(".add").click(function(){
            goToMyBankCardsPage();
        });
    };

    return {
        init : _init,
        bindEvent:bindEvent
    }
})();

$(function(){
    main.init();
    main.bindEvent();
    addWebtrends();
});

//ҳ��Ƕ��
function addWebtrends(){
    var business = "";
    var verifyBusinessTemp = verifyBusinessFunction();
    if(verifyBusinessTemp == "reCharge"){
        //Ǯ���ӳ�ֵ
        business = "Ǯ���ӳ�ֵ";
    }else{
        //��ֻ������
        business = "�������깺";
    }
    window.WTjson = {
        "WT.si_n":business,
        "WT.si_x":"ȷ�϶���"
    }
}

//��Ҫ����֧������
function mainPay(){
    var verifyBusinessTemp = verifyBusinessFunction();
    menuCookie.cookie.setMenu(row,col);
    //ȷ��֧��
    var bankCardNo = $("#bankCardNo").val();
    var buyMethod = $("#buyMethod").val();
    var tradingpw = $("#tradingpw").val();
    if(bankCardNo == null || bankCardNo == "" || bankCardNo == undefined){
        //δѡ��֧����ʽ
        $("#showInfoMsg").html("��ѡ��֧����ʽ!");
        $("#modal0").modal("show");
    }else if(tradingpw == ""){
        //δ����֧������
        $("#showInfoMsg").html("�������벻��Ϊ��!");
        $("#modal0").modal("show");
    }else{
        var flag = true;
        if(flag){
            //�ж��޶�
            var amount = $("#amount").val();
            var perPayLimit = $("#perPayLimit").val();
            if(perPayLimit != ""){
                if(parseFloat(amount)>parseFloat(perPayLimit)){
                    $("#showInfoMsg").html("������ܳ������п������޶�!");
                    $("#modal0").modal("show");
                    return false;
                }
            }
            //Ǯ���Ӳ��ܹ�����շѷ�ʽ�Ļ���
            var shareType = $("#shareType").val();
            var buyMethod = $("#buyMethod").val();
            var bankNo=$("#bankNo").val();
            if(buyMethod == "F" && shareType == "B"){
                $("#showInfoMsg").html("Ǯ�����޷������շѷ�ʽΪ���շѵĻ���!");
                $("#modal0").modal("show");
                return false;
            }
            $("#pay").attr("disabled","disabled");
            $('#pay').css("background","grey");
            $('#pay').css("border","0px");
            $("#tradingpw").val("");
            var verifyBusiness = "buyFund";
            if(verifyBusinessTemp == "reCharge"){
                verifyBusiness = "reCharge";
            }
            var objRet;
            $.ajax({
                type: "post",
                url: "/main/order/payConfirm",
                async:false,
                data:{"amount":$("#amount").val(),"bankCardNo":bankCardNo,"bankNo":bankNo,
                    "businCode":$("#businCode").val(),"capitalMode":$("#capitalMode").val(),"fundCode":$("#fundCode").val(),
                    "buyMethod":$("#buyMethod").val(),"shareType":$("#shareType").val(),"tradeAcco":$("#tradeAcco").val(),
                    "tradePassWord":tradingpw,"verifyBusiness":verifyBusiness},
                success: function (data) {
                    objRet=data;
                }
            });

            if(objRet.issuccess){
                var orderId = objRet.orderId;
                id = orderId;
                if(buyMethod == "D" || buyMethod == "F"){
                    window.location.href="/main/order/query/"+orderId;
                }else{
                    $("#toBankUrlWindow").val("5");
                    $("#modal11").modal("show");
                }
            }else{
                verifyDiv.showPayFailedDiv(bankCardNo,bankNo,buyMethod,objRet.returnmsg);

                $("#pay").removeAttr('disabled');
                $('#pay').css("background","#DF5412");
                if(typeof(dcsPageTrack)=="function"){
                    var business = "";
                    var errorType = "";
                    var shareName = "";
                    var payentry = "";
                    if(verifyBusinessTemp == "reCharge"){
                        business = "Ǯ���ӳ�ֵ";
                        errorType = "��ֵʧ��";
                    }else{
                        business = "�������깺";
                        errorType = "���깺ʧ��";
                    }
                    if(shareType == "A"){
                        shareName = "ǰ�շ�";
                    }else if(shareType == "B"){
                        shareName = "���շ�";
                    }else{
                        shareName = "C���շ�";
                    }

                    if(verifyBusinessTemp == "reCharge"){
                        payentry = "Ǯ����";
                    }else{
                        payentry = "���п�";
                    }
                    dcsPageTrack("WT.si_n",business,false,"WT.si_x",errorType,false,"WT.pn_sku",$("#fundCode").val(),false,
                        "WT.pc","",false,"WT.tx_s",$("#amount").val(),false,"WT.tx_i","",false,"WT.tx_id","",false,
                        "WT.tx_it","",false,"WT.payentry",payentry,false,"WT.paytype",shareName,false,
                        "WT.paybank",$("#capitalMode").val(),false,"WT.err_type",objRet.returnmsg,false);
                }
            }

        }
    }
}


//����֧�������б���Ϣ
function loadPayInfo(){
    var fundCode = $("#fundCode").val();
    var walletFundCode = $("#walletFundCode").val();
    var shareType = $("#shareType").val();
    var moneyPayInfo = "";
    var smgPayInfo = "";
    var webPayInfo = "";
    var feeFlag = true;
    var amount = $("#amount").val();
    if(fundCode == walletFundCode || shareType == "B" || shareType == "C"){
        //�����Ǯ���ӳ�ֵ�����շѡ�C���շѣ�����չʾԤ��������
        feeFlag = false;
    }
    if(fundCode != walletFundCode){
        //������ҵ��
        $(".back-order").attr("href","/main/fund/order/pre?amount="+amount+"&fundCode="+fundCode+"&shareType="+shareType);
    }else{
        $(".back-order").attr("href","/main/wallet/order/pre?amount="+amount);
    }
    var hasSelectedPay = false;//��¼�Ƿ�ѡ����֧����ʽ
    $.ajax({
        type: "get",
        url: "/main/order/payCards?fundCode="+fundCode+"&shareType="+shareType,
        success: function (data) {
            //����Ǯ����֧��
            var walletBankCards = data.walletBankCards;
            if(walletBankCards != null && walletBankCards != undefined){
                for(var i=0;i < walletBankCards.length;i++){
                    var walletBankCardInfo = walletBankCards[i];
                    var content = "";
                    var result = cal.use.numSub(amount,walletBankCardInfo.availShare);
                    if(feeFlag){
                        if(result > 0){
                            if(walletBankCardInfo.capitalMode == "1"){
                                //����ǹ�̨�˻�������չʾȥ��ֵ������ݵġ�
                                content += "<li>";
                            }else if(walletBankCardInfo.capitalMode == "P"){
                                //֧��������չʾ��ֵ
                                content += "<li>";
                            }else{
                                content += "<li data-less='"+result+"'>";
                            }
                        }else{
                            content += "<li>";
                        }
                    }else{
                        if(result > 0){
                            if(walletBankCardInfo.capitalMode == "1"){
                                //����ǹ�̨�˻�������չʾȥ��ֵ������ݵġ�
                                content += "<li style='margin-bottom:0px'>";
                            }else if(walletBankCardInfo.capitalMode == "P"){
                                //֧��������չʾ��ֵ
                                content += "<li style='margin-bottom:0px'>";
                            }else{
                                content += "<li style='margin-bottom:0px' data-less='"+result+"'>";
                            }
                        }else{
                            content += "<li style='margin-bottom:0px'>";
                        }
                    }
                    if(walletBankCardInfo.capitalMode == "1"){
                        //����ǹ�̨�˻���չʾ��̨����
                        content += "<span class='bank' style='width:270px'>"+walletBankCardInfo.bankName+"(��̨)["+walletBankCardInfo.bankCardShow+"]</span>";
                    }else if(walletBankCardInfo.capitalMode == "P"){
                        //֧��������չʾ����
                        content += "<span class='bank' style='width:270px'>"+walletBankCardInfo.bankName+"</span>";
                    }else{
                        content += "<span class='bank' style='width:270px'>"+walletBankCardInfo.bankName+"["+walletBankCardInfo.bankCardShow+"]</span>";
                    }
                    if(result > 0){
                        content += "<span class='money'>��<em>"+walletBankCardInfo.availShare+"</em>Ԫ</span>";
                        if(walletBankCardInfo.capitalMode == "1"){
                            //����ǹ�̨�˻�������չʾȥ��ֵ������ݵġ�
                            content += "<span class='tips'></span>";
                        }else if(walletBankCardInfo.capitalMode == "P"){
                            //֧��������չʾ��ֵ
                            content += "<span class='tips'></span>";
                        }else{
                            content += "<span class='tips'><a href='javascript:;'>����"+result+"Ԫ,�ȳ�ֵ</a></span>";
                        }
                    }else{
                        content += "<span class='money'>��<em style='color: #df5412;'>"+walletBankCardInfo.availShare+"</em>Ԫ</span>";
                        content += "<span class='tips'></span>";
                    }
                    content += setPayFee(walletBankCardInfo,feeFlag);
                    moneyPayInfo += content;
                }
                $("#moneyPayInfo").html(moneyPayInfo);
                if(walletBankCards.length != 0){
                    //���û���б��Ͳ����Զ�ѡ���һ��
                    setDefaultPay($("#moneyPayInfo").find("li:eq(0)"));
                    hasSelectedPay = true;
                    $("#walletPay_noPayCard").css("display","none");
                }else{
                    $("#walletPay_noPayCard").css("display","");
                }
            }else{
                $("#wallet").css("display","none");
                $("#walletSub").css("display","none");
                $("#kjzf").addClass("current");
                $("#kjzfSub").addClass("current");
            }
            //���ؿ��֧��
            var smgBankCards = data.smgBankCards;
            if(smgBankCards != null && smgBankCards != undefined){
                for(var i=0;i < smgBankCards.length;i++){
                    var smgBankCardInfo = smgBankCards[i];
                    var content = "";
                    if(feeFlag){
                        if(smgBankCardInfo.signStatus == "0"){
                            content += "<li class='pay-kj'>";
                        }else{
                            content += "<li>";
                        }
                    }else{
                        if(smgBankCardInfo.signStatus == "0"){
                            content += "<li class='pay-kj' style='margin-bottom:0px'>";
                        }else{
                            content += "<li style='margin-bottom:0px'>";
                        }
                    }
                    if(smgBankCardInfo.capitalMode == "P"){
                        //֧��������չʾ����
                        content += "<span class='bank' style='white-space: nowrap;margin-right:30px;width: 320px;'><img src='/static/wtgf/img/bank/"+smgBankCardInfo.bankNo+"_icon_small.png' alt=''>"+smgBankCardInfo.capitalName+"&nbsp;</span>";
                    }else{
                        content += "<span class='bank' style='white-space: nowrap;margin-right:30px;width: 320px;'><img src='/static/wtgf/img/bank/"+smgBankCardInfo.bankNo+"_icon_small.png' alt=''>"+smgBankCardInfo.capitalName+"&nbsp;["+smgBankCardInfo.bankCardShow+"]</span>";
                    }
                    if(smgBankCardInfo.capitalMode == "P" || smgBankCardInfo.capitalMode == "H"){
                        //֧�����ͻ㸶���£��޶���һ������
                        content += "<span class='limit'><a href='http://www.gffunds.com.cn/wsjyjsy/zfyhk/' target='_blank' style='color: #fff;text-decoration: none;'>�޶�</a></span>";
                    }else{
                        content += "<span class='limit'>�޶�";
                        content += "<div class='limit-tips'>";
                        if(smgBankCardInfo.payShowLimit != undefined){
                            content += "<i></i><em>�����޶�</em><em>"+smgBankCardInfo.payShowLimit.perPayLimit/10000+"��Ԫ</em><em>�����޶�</em><em>"+smgBankCardInfo.payShowLimit.dailyPayLimit/10000+"��Ԫ</em></div></span>";
                        }
                        content += "</div></span>";
                    }

                    if(smgBankCardInfo.capitalMode == "3"){
                        //�����Ĳ�չʾת�˷���
                        content += $("#zzfy").html();
                    }
                    if(smgBankCardInfo.signStatus == "0"){
                        content += "<span class='signing signing-kjzf'><a href='/main/bankCards/myCards' target='_blank'>��ͨ���֧��</a></span>";
                    }
                    content += setPayFee(smgBankCardInfo,feeFlag);
                    smgPayInfo += content;
                }
                $("#smgPayInfo").html(smgPayInfo);
                if(smgBankCards.length != 0){
                    //���û���б��Ͳ����Զ�ѡ���һ��
                    if(!hasSelectedPay){
                        setDefaultPay($("#smgPayInfo").find("li:eq(0)"));
                        hasSelectedPay = true;
                    }
                    $("#smgPayInfo_hasPayCard").css("display","");
                    $("#smgPayInfo_noPayCard").css("display","none");
                }else{
                    $("#smgPayInfo_hasPayCard").css("display","none");
                    $("#smgPayInfo_noPayCard").css("display","");
                }
            }else{
                if(shareType == "C"){
                    $("#smgPayInfo_noPayCard").hide();
                    $("#smgPayInfo").html("<center>C���շѽ�֧��Ǯ����֧��</center>");
                }else{
                    $("#smgPayInfo").html("");
                }
            }
            //��������֧��
            var webBankCards = data.webBankCards;
            if(webBankCards != null && webBankCards != undefined){
                for(var i=0;i < webBankCards.length;i++){
                    var webBankCardInfo = webBankCards[i];
                    var content = "";
                    if(feeFlag){
                        if(webBankCardInfo.signStatus == "0"){
                            content += "<li class='pay-wy'>";
                        }else{
                            content += "<li>";
                        }
                    }else{
                        if(webBankCardInfo.signStatus == "0"){
                            content += "<li class='pay-wy' style='margin-bottom:0px'>";
                        }else{
                            content += "<li style='margin-bottom:0px'>";
                        }
                    }
                    if(webBankCardInfo.capitalMode == "P"){
                        //֧������չʾ����
                        content += "<span class='bank' style='white-space: nowrap;margin-right:30px;width: 320px;'><img src='/static/wtgf/img/bank/"+webBankCardInfo.bankNo+"_icon_small.png' alt=''>"+"&nbsp;"+webBankCardInfo.capitalName+"&nbsp;</span>";
                    }else{
                        content += "<span class='bank' style='white-space: nowrap;margin-right:30px;width: 320px;'><img src='/static/wtgf/img/bank/"+webBankCardInfo.bankNo+"_icon_small.png' alt=''>"+"&nbsp;"+webBankCardInfo.capitalName+"&nbsp;["+webBankCardInfo.bankCardShow+"]</span>";
                    }

                    if(webBankCardInfo.capitalMode == "P" || webBankCardInfo.capitalMode == "H"){
                        //֧�����ͻ㸶���£��޶���һ������
                        content += "<span class='limit'><a href='http://www.gffunds.com.cn/wsjyjsy/zfyhk/' target='_blank' style='color: #fff;text-decoration: none;'>�޶�</a></span>";
                    }else{
                        content += "<span class='limit'>�޶�";
                        content += "<div class='limit-tips'>";
                        if(webBankCardInfo.payShowLimit != undefined){
                            content += "<i></i><em>�����޶�</em><em>"+webBankCardInfo.payShowLimit.perPayLimit/10000+"��Ԫ</em><em>�����޶�</em><em>"+webBankCardInfo.payShowLimit.dailyPayLimit/10000+"��Ԫ</em></div></span>";
                        }
                        content += "</div></span>";
                    }

                    if(webBankCardInfo.capitalMode == "3"){
                        //�����Ĳ�չʾת�˷���
                        content += $("#zzfy").html();
                    }
                    if(webBankCardInfo.signStatus == "0"){
                        content += "<span class='signing signing-wy'><a href='/main/bankCards/myCards' target='_blank'>��ͨ����֧��</a></span>";
                    }
                    content += setPayFee(webBankCardInfo,feeFlag);
                    webPayInfo += content;
                }
                $("#webPayInfo").html(webPayInfo);
                if(webBankCards.length != 0){
                    //���û���б��Ͳ����Զ�ѡ���һ��
                    if(!hasSelectedPay){
                        setDefaultPay($("#webPayInfo").find("li:eq(0)"));
                        hasSelectedPay = true;
                    }
                    $("#webPayInfo_hasPayCard").css("display","");
                    $("#webPayInfo_noPayCard").css("display","none");
                }else{
                    $("#webPayInfo_hasPayCard").css("display","none");
                    $("#webPayInfo_noPayCard").css("display","");
                }
            }else{
                if(shareType == "C"){
                    $("#webPayInfo_noPayCard").hide();
                    $("#webPayInfo").html("<center>C���շѽ�֧��Ǯ����֧��</center>");
                }else{
                    $("#webPayInfo").html("");
                }
            }
        }
    });
}

//��ȡ������
function initFee(tradeAcco,obj){
    var amount = $("#amount").val();
    var businCode = $("#businCode").val();
    var fundCode = $("#fundCode").val();
    var shareType = $("#shareType").val();
    var buyMethod = $("#buyMethod").val();
    var walletFundCode = $("#walletFundCode").val();
    var url = "";
    if(buyMethod == "F"){
        url = "/main/order/fare?amount="+amount+"&businCode="+businCode+"&fundCode="+fundCode+"&otherFundCode="+walletFundCode+"&shareType="+shareType+"&tradeAcco="+tradeAcco;
    }else{
        url = "/main/order/fare?amount="+amount+"&businCode="+businCode+"&fundCode="+fundCode+"&shareType="+shareType+"&tradeAcco="+tradeAcco;
    }
    $.ajax({
        type: "get",
        url: url,
        success: function (data) {
            var t = "";
            //����ǹ㷢�������Ʊ�����룺001764��������ѡ��Ǯ����֧�����Ϲ�״̬-�˴��жϲ����Ƿ��Ϲ�������ʱ���жϡ�
            if(fundCode == "001764" && buyMethod == "F"){
                //������ǹ̶����ʵģ���ֻ��Ҫ1�ۣ�ȡ��ԭ����4�ۡ�
                if(data.orgRatio == "" && data.ratio == ""){
                    t = "Ԥ��������<em style='margin-left: 2px;margin-right: 2px;'>"+data.fare+"</em>Ԫ(���ݷ���<del style='margin-left: 5px;'>"+cal.use.numMulti(data.orgRatio,100)+"%</del> "+cal.use.numMulti(data.ratio,100)+"% ��������)";
                }else{
                    //���㹫ʽ��M-X��* D = X����Xֵ��
                    var md = cal.use.numMulti(amount,cal.use.numMulti(data.ratio,0.25))*10000;
                    var fareTemp = cal.use.numDiv(md,(1+cal.use.numMulti(data.ratio,0.25))*10000);
                    fareTemp = cal.use.toFixed(fareTemp,2);
                    t = "Ԥ��������<em style='margin-left: 2px;margin-right: 2px;'>"+fareTemp+"</em>Ԫ(���ݷ���<del style='margin-left: 5px;'>"+cal.use.numMulti(data.orgRatio,100)+"%</del> "+cal.use.numMulti(data.ratio,25)+"% ��������)";
                }
            }else{
                t = "Ԥ��������<em style='margin-left: 2px;margin-right: 2px;'>"+data.fare+"</em>Ԫ(���ݷ���<del style='margin-left: 5px;'>"+cal.use.numMulti(data.orgRatio,100)+"%</del> "+cal.use.numMulti(data.ratio,100)+"% ��������)";
            }
            obj.find('.tixing').html(t);
        }
    });
}

//Ĭ��ѡ��֧����ʽ�еĵ�һ��
function setDefaultPay(firstMoneyPay){
    var isAppreciationShow = $("#isAppreciationShow").val();
    if(isAppreciationShow == "true"){
        var className = firstMoneyPay.parent()[0].className;
        if(className == "wallet"){
            $("#zzyw").css("display","");
        }else{
            $("#zzyw").css("display","none");
        }
    }else{
        $("#zzyw").css("display","none");
    }
    firstMoneyPay.parent().find('li').removeClass('active');
    firstMoneyPay.addClass('active');
    var bankCardNo = firstMoneyPay.find('input:eq(0)').val();
    var bankNo = firstMoneyPay.find('input:eq(1)').val();
    var capitalMode = firstMoneyPay.find('input:eq(2)').val();
    var buyMethod = firstMoneyPay.find('input:eq(3)').val();
    var tradeAcco = firstMoneyPay.find('input:eq(4)').val();
    var perPayLimit = firstMoneyPay.find('input:eq(5)').val();
    $("#bankCardNo").val(bankCardNo);
    $("#bankNo").val(bankNo);
    $("#capitalMode").val(capitalMode);
    $("#buyMethod").val(buyMethod);
    $("#tradeAcco").val(tradeAcco);
    $("#perPayLimit").val(perPayLimit);
    initFee(tradeAcco,firstMoneyPay);
    // �ж����п�֧��Ϊ��ݻ�������
    if(firstMoneyPay.hasClass('pay-kj') || firstMoneyPay.hasClass('pay-wy')){
        //�����Ҫ��ͨ�������߿�ݣ���ť�û�
        $("#pay").attr("disabled","disabled");
        $('#pay').css("background","grey");
        $('#pay').css("border","0px");
    }else{
        $("#pay").removeAttr('disabled');
        $('#pay').css("background","#DF5412");
    }
}

//����Ԥ��������
function setPayFee(obj,feeFlag){
    var bankCardNo = obj.bankCardNo;
    var bankNo = obj.bankNo;
    var capitalMode = obj.capitalMode;
    var buyMethod = "";
    if(obj.buyMethod != undefined){
        buyMethod = obj.buyMethod;
    }
    var perPayLimit = "";
    if(obj.payShowLimit != undefined && obj.payShowLimit.perPayLimit != undefined){
        perPayLimit = obj.payShowLimit.perPayLimit;
    }
    var tradeAcco = obj.tradeAcco;
    var content = "";
    content += "<input type='hidden' value="+bankCardNo+">";
    content += "<input type='hidden' value="+bankNo+">";
    content += "<input type='hidden' value="+capitalMode+">";
    content += "<input type='hidden' value="+buyMethod+">";
    content += "<input type='hidden' value="+tradeAcco+">";
    content += "<input type='hidden' value="+perPayLimit+">";
    if(feeFlag){
        content += "<p class='tixing'>Ԥ��������<em style='margin-left: 2px;margin-right: 2px;'>45.21</em>Ԫ(���ݷ���<del style='margin-left: 5px;'>1.20%</del> 0.48% ��������)</p>";
    }
    content += "</li>";
    return content;
}

//Ǯ���Ӳ��㣬���г�ֵ��
function reChargeMoney(bankCardNo,capitalMode){
    var content = "";
    var hasCardFlag = false;
    $.ajax({
        type: "get",
        url: "/main/order/payCards/"+bankCardNo+"/"+capitalMode,
        success: function (data) {
            if(data.issuccess){
                if(data.smgBankCard != null && data.smgBankCard != undefined){
                    var smgBankCardInfo = data.smgBankCard;
                    if(smgBankCardInfo.signStatus == 1){
                        content += "<li style='margin-bottom:0px'>";
                        content += "<span class='bank' style='width:260px'><img src='/static/wtgf/img/bank/"+smgBankCardInfo.bankNo+"_icon_small.png' alt=''>"+smgBankCardInfo.bankName+"["+smgBankCardInfo.bankCardShow+"]</span>";
                        content += "<span class='ptype ptype-kj'>���</span>";
                        content += "<input type='hidden' value='"+smgBankCardInfo.buyMethod+"'>";
                        content += "<input type='hidden' value='"+smgBankCardInfo.tradeAcco+"'>";
                        content += "<input type='hidden' value='"+smgBankCardInfo.bankCardNo+"'>";
                        content += "<input type='hidden' value='"+smgBankCardInfo.bankNo+"'></li>";
                        hasCardFlag = true;
                    }
                }
                if(data.webBankCard != null && data.webBankCard != undefined){
                    var webBankCardInfo = data.webBankCard;
                    if(webBankCardInfo.signStatus == 1){
                        content += "<li style='margin-bottom:0px'>";
                        content += "<span class='bank' style='width:260px'><img src='/static/wtgf/img/bank/"+webBankCardInfo.bankNo+"_icon_small.png' alt=''>"+webBankCardInfo.bankName+"["+webBankCardInfo.bankCardShow+"]</span>";
                        content += "<span class='ptype ptype-wy'>����</span>";
                        content += "<input type='hidden' value='"+webBankCardInfo.buyMethod+"'>";
                        content += "<input type='hidden' value='"+webBankCardInfo.tradeAcco+"'>";
                        content += "<input type='hidden' value='"+webBankCardInfo.bankCardNo+"'>";
                        content += "<input type='hidden' value='"+webBankCardInfo.bankNo+"'></li>";
                        hasCardFlag = true;
                    }
                }
                if(hasCardFlag){
                    $("#reChargeBankList").html(content);
                    var defaultLi = $("#reChargeBankList").find("li:eq(0)");
                    defaultLi.addClass('active');
                    var buyMethod = defaultLi.find("input:eq(0)").val();
                    var tradeAcco = defaultLi.find("input:eq(1)").val();
                    var bankCardNo = defaultLi.find("input:eq(2)").val();
                    var bankNo = defaultLi.find("input:eq(3)").val();
                    $("#reCharege_buyMethod").val(buyMethod);
                    $("#reCharege_tradeAcco").val(tradeAcco);
                    $("#reCharege_bankCardNo").val(bankCardNo);
                    $("#reCharege_bankNo").val(bankNo);
                }else{
                    $("#reChargeBankList").html("<center>���޿��õ����п���������ѡ��Ǯ����֧����</center>");
                }
            }else{
                $("#modal6").modal("hide");
                $("#showInfoMsg").html(data.returnmsg);
                $("#modal0").modal("show");
            }
        }
    });
}

function goToMyBankCardsPage(){
    $("#modal3").modal("show");
    window.open("/main/bankCards/bindCard/pre");
}

/**
 * �ж��ǳ�ֵǮ���ӻ��������
 * @returns {string}
 */
function verifyBusinessFunction(){
    var fundCode = $("#fundCode").val();
    var walletFundCode = $("#walletFundCode").val();
    if(fundCode == walletFundCode){
        return "reCharge";
    }else{
        return "buyFund";
    }
}




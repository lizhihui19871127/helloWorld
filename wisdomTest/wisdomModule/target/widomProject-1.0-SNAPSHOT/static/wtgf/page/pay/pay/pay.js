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
var row;//该死的导航，公用一个页面，用cookie记录从那里来，复杂了很多。
var col;//该死的导航，公用一个页面，用cookie记录从那里来，复杂了很多。
var main = (function(){
    var _init = function(){
        $.ajaxSetup({ cache: false });
        //判断是钱袋子还是普通基金(这里为了防止cookie被新开页面覆盖，采用通过业务字段获取来源，如果以后有新增业务
        // 情况，这里代码得需要相应加上去。)
        var verifyBusinessTemp = verifyBusinessFunction();
        if(verifyBusinessTemp == "reCharge"){
            //钱袋子充值
            menuCookie.cookie.setMenu("r1","c11");
        }else{
            //单只基金购买
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
            // 样式文件地址
            cssAdr: '/static/wtgf/css/fredkeyboard/fredkeyboard.css',
            // 软键盘相关文字,有修改需全部重置
            text: {
                title: '广发基金网上交易平台',
                kbswitch: '使用键盘输入',
                caps: '切换大/小写',
                enter: '确定',
                backp: 'backspace'
            }
        });

        // 订单确认与支付-选择支付方式
        $containerPay.on('click', '.pay-type-dd .pay-type-main li', function(){
            $(this).parents('.pay-type-dd').find('li').removeClass('active');
            setDefaultPay($(this));
            return false;
        });

        //具体支付银行后面的按钮
        $containerPay.on('click', '.pay-type-dd .pay-type-main li a', function(){
            if($(this).parent().hasClass('signing')){
                //点击开通网银或者开通快捷
                $("#modal3").modal("show");
                window.open("/main/bankCards/myCards");
            }else if($(this).parent().hasClass('limit')){
                //跳转到支付宝和汇付天下的限额页面
                window.open("http://www.gffunds.com.cn/wsjyjsy/zfyhk/");
            }
        });

        // 钱袋子支付不足，充值 - 选择支付方式
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

        // 订单确认与支付-选择支付方式-钱袋子支付
        var $qdzLi = null;
        $containerPay.on('click', '.pay-qdz .pay-type-main li', function(){
            $qdzLi = null;

            // 判断钱袋子余额是否足够
            if($(this).attr('data-less')){
                // 余额不足
                // 弹出选择支付方式
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
                //加载钱袋子不足，充值可选的银行
                $("#reChargeBankList").html('<center><img src="/static/wtgf/img/pay/loading.gif" alt="">&nbsp;&nbsp;正在加载，请稍后......</center>');
                reChargeMoney(bankCardNo,capitalMode);
            }
        });

        //关闭弹出框
        $containerPay.on('click', '.js-pop-close', function(){
            $(this).parents('.pop').fadeOut();
        });

        //支付方式切换
        $(".mode_of_payment li").click(function(event) {
            var num=$(this).index();
            $(this).addClass('current').siblings('li').removeClass('current');
            $(".pay_type_describe>ul>li").eq(num).addClass('current').siblings('li').removeClass('current');
            $(".pay-type-dd>div").eq(num).addClass('current').siblings('div').removeClass('current');
            //让选中的这个支付方式默认选择第一个,如果当前选择的支付方式一个银行都没有，就什么都不做。
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

        //关闭窗口事件
        $("#modal3").on('hide.bs.modal', function (){
            menuCookie.cookie.setMenu(row,col);
            window.location.reload();
        });

        $(".reChargezfwc").click(function(){
            //充值成功，刷新银行列表及份额
            menuCookie.cookie.setMenu(row,col);
            window.location.reload();
        });

        //关闭窗口事件
        $('#modal7').on('hide.bs.modal', function (){
            menuCookie.cookie.setMenu(row,col);
            window.location.reload();
        });
        //关闭窗口事件
        $('#modal8').on('hide.bs.modal', function (){
            menuCookie.cookie.setMenu(row,col);
            window.location.reload();
        });
        //关闭窗口事件
        $('#modal9').on('hide.bs.modal', function (){
            menuCookie.cookie.setMenu(row,col);
            window.location.reload();
        });
        //关闭窗口事件
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
                                business = "钱袋子充值";
                                errorType = "充值失败";
                            }else{
                                business = "基金认申购";
                                errorType = "认申购失败";
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
            //判断是否为QD基金
            var isQdDelay = $("#isQdDelay").val();
            var predictTradeDate = $("#predictTradeDate").val();
            if(isQdDelay == "true"){
                var fundName = $("#fundName").val();
                //判断是钱袋子还是普通基金
                var buyMethod = $("#buyMethod").val();
                if(buyMethod == "F"){
                    $("#walletInfoMsg").html("因海外市场休市，"+fundName+"今日暂停申购，您的申购申请将自动顺延至最近的"+
                        "开放申购日("+predictTradeDate+")下单，在"+predictTradeDate+"前，资金仍然在钱袋子中享受货币基金收益。是否确认下单?");
                    $("#modal2").modal("show");
                }else{
                    $("#alertInfoMsg").html("因海外市场休市，"+fundName+"今日暂停申购，您的申购申请将自动顺延至最近的"+
                        "开放申购日("+predictTradeDate+")。是否确认下单?");
                    $("#modal1").modal("show");
                }
            }else{
                mainPay();
            }
        });

        $("#qdToBuy").click(function(){
           //确定Qd基金下单
            $("#modal1").modal("hide");
            mainPay();
        });

        $("#qdCancel").click(function(){
           //取消QD下单
            $("#modal1").modal("hide");
        });

        $("#walletQdToBuy").click(function(){
            //确定Qd基金下单
            $("#modal2").modal("hide");
            mainPay();
        });

        $("#walletQdCancel").click(function(){
            //取消QD下单
            $("#modal2").modal("hide");
        });

        $("#toBankUrl").click(function(){
            $("#modal11").modal("hide");
            var toBankUrlWindow = $("#toBankUrlWindow").val();
            //1、跳转到网银支付页面
            $("#modal"+toBankUrlWindow).modal("show");
            //2、新开页面，跳转到后台。
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

        //钱袋子不足，充值确认
        $("#toPay").click(function(){
            if(typeof(dcsPageTrack)=="function"){
                dcsPageTrack("WT.si_n","钱袋子充值",false,"WT.si_x","确认订单",false);
            }
            menuCookie.cookie.setMenu(row,col);
            var reCharege_amount = $("#reCharege_amount").val();
            var reCharege_buyMethod = $("#reCharege_buyMethod").val();
            var reCharege_tradeAcco = $("#reCharege_tradeAcco").val();
            var reCharege_bankCardNo = $("#reCharege_bankCardNo").val();
            var reCharege_bankNo = $("#reCharege_bankNo").val();
            if(reCharege_tradeAcco == null || reCharege_tradeAcco == "" || reCharege_tradeAcco == undefined){
                //未选择支付方式
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
                            //快捷充值
                            if(data.issuccess){
                                //充值成功
                                $("#modal6").modal("hide");
                                $("#modal7").modal("show");
                                if(typeof(dcsPageTrack)=="function"){
                                    dcsPageTrack("WT.si_n","钱袋子充值",false,"WT.si_x","充值成功",false,"WT.pn_sku",fundCode,false,
                                        "WT.pc","",false,"WT.tx_s",reCharege_amount,false,"WT.tx_i","",false,"WT.tx_id","",false,
                                        "WT.tx_it","",false,"WT.payentry","银行卡",false,"WT.paytype","前收费",false,
                                        "WT.paybank",$("#capitalMode").val(),false);
                                }
                            }else{
                                $("#modal6").modal("hide");
                                //失败弹出框，告诉用户错误信息
                                $("#zfsbMsg").html(data.returnmsg);
                                $("#modal8").modal("show");
                                if(typeof(dcsPageTrack)=="function"){
                                    dcsPageTrack("WT.si_n","钱袋子充值",false,"WT.si_x","充值失败",false,"WT.pn_sku",fundCode,false,
                                        "WT.pc","",false,"WT.tx_s",reCharege_amount,false,"WT.tx_i","",false,"WT.tx_id","",false,
                                        "WT.tx_it","",false,"WT.payentry","银行卡",false,"WT.paytype","前收费",false,
                                        "WT.paybank",$("#capitalMode").val(),false,"WT.err_type",data.returnmsg,false);
                                }
                            }
                        }else{
                            if(data.issuccess){
                                $("#modal6").modal("hide");
                                //网银充值
                                $("#toBankUrlWindow").val("9");
                                $("#modal11").modal("show");
                            }else{
                                $("#modal6").modal("hide");
                                //失败弹出框，告诉用户错误信息
                                $("#zfsbMsg").html(data.returnmsg);
                                $("#modal8").modal("show");
                                if(typeof(dcsPageTrack)=="function"){
                                    dcsPageTrack("WT.si_n","钱袋子充值",false,"WT.si_x","充值失败",false,"WT.pn_sku",fundCode,false,
                                        "WT.pc","",false,"WT.tx_s",reCharege_amount,false,"WT.tx_i","",false,"WT.tx_id","",false,
                                        "WT.tx_it","",false,"WT.payentry","银行卡",false,"WT.paytype","前收费",false,
                                        "WT.paybank",$("#capitalMode").val(),false,"WT.err_type",data.returnmsg,false);
                                }
                            }
                        }
                    }
                });
            }
        });

        //新增银行卡
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

//页面嵌码
function addWebtrends(){
    var business = "";
    var verifyBusinessTemp = verifyBusinessFunction();
    if(verifyBusinessTemp == "reCharge"){
        //钱袋子充值
        business = "钱袋子充值";
    }else{
        //单只基金购买
        business = "基金认申购";
    }
    window.WTjson = {
        "WT.si_n":business,
        "WT.si_x":"确认订单"
    }
}

//主要核心支付方法
function mainPay(){
    var verifyBusinessTemp = verifyBusinessFunction();
    menuCookie.cookie.setMenu(row,col);
    //确认支付
    var bankCardNo = $("#bankCardNo").val();
    var buyMethod = $("#buyMethod").val();
    var tradingpw = $("#tradingpw").val();
    if(bankCardNo == null || bankCardNo == "" || bankCardNo == undefined){
        //未选择支付方式
        $("#showInfoMsg").html("请选择支付方式!");
        $("#modal0").modal("show");
    }else if(tradingpw == ""){
        //未输入支付密码
        $("#showInfoMsg").html("交易密码不能为空!");
        $("#modal0").modal("show");
    }else{
        var flag = true;
        if(flag){
            //判断限额
            var amount = $("#amount").val();
            var perPayLimit = $("#perPayLimit").val();
            if(perPayLimit != ""){
                if(parseFloat(amount)>parseFloat(perPayLimit)){
                    $("#showInfoMsg").html("购买金额不能超过银行卡单笔限额!");
                    $("#modal0").modal("show");
                    return false;
                }
            }
            //钱袋子不能购买后收费方式的基金
            var shareType = $("#shareType").val();
            var buyMethod = $("#buyMethod").val();
            var bankNo=$("#bankNo").val();
            if(buyMethod == "F" && shareType == "B"){
                $("#showInfoMsg").html("钱袋子无法购买收费方式为后收费的基金!");
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
                        business = "钱袋子充值";
                        errorType = "充值失败";
                    }else{
                        business = "基金认申购";
                        errorType = "认申购失败";
                    }
                    if(shareType == "A"){
                        shareName = "前收费";
                    }else if(shareType == "B"){
                        shareName = "后收费";
                    }else{
                        shareName = "C类收费";
                    }

                    if(verifyBusinessTemp == "reCharge"){
                        payentry = "钱袋子";
                    }else{
                        payentry = "银行卡";
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


//加载支付银行列表信息
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
        //如果是钱袋子充值、后收费、C类收费，都不展示预估手续费
        feeFlag = false;
    }
    if(fundCode != walletFundCode){
        //基金购买业务
        $(".back-order").attr("href","/main/fund/order/pre?amount="+amount+"&fundCode="+fundCode+"&shareType="+shareType);
    }else{
        $(".back-order").attr("href","/main/wallet/order/pre?amount="+amount);
    }
    var hasSelectedPay = false;//记录是否选中了支付方式
    $.ajax({
        type: "get",
        url: "/main/order/payCards?fundCode="+fundCode+"&shareType="+shareType,
        success: function (data) {
            //加载钱袋子支付
            var walletBankCards = data.walletBankCards;
            if(walletBankCards != null && walletBankCards != undefined){
                for(var i=0;i < walletBankCards.length;i++){
                    var walletBankCardInfo = walletBankCards[i];
                    var content = "";
                    var result = cal.use.numSub(amount,walletBankCardInfo.availShare);
                    if(feeFlag){
                        if(result > 0){
                            if(walletBankCardInfo.capitalMode == "1"){
                                //如果是柜台账户，不用展示去充值这个内容的。
                                content += "<li>";
                            }else if(walletBankCardInfo.capitalMode == "P"){
                                //支付宝，不展示充值
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
                                //如果是柜台账户，不用展示去充值这个内容的。
                                content += "<li style='margin-bottom:0px'>";
                            }else if(walletBankCardInfo.capitalMode == "P"){
                                //支付宝，不展示充值
                                content += "<li style='margin-bottom:0px'>";
                            }else{
                                content += "<li style='margin-bottom:0px' data-less='"+result+"'>";
                            }
                        }else{
                            content += "<li style='margin-bottom:0px'>";
                        }
                    }
                    if(walletBankCardInfo.capitalMode == "1"){
                        //如果是柜台账户，展示柜台名称
                        content += "<span class='bank' style='width:270px'>"+walletBankCardInfo.bankName+"(柜台)["+walletBankCardInfo.bankCardShow+"]</span>";
                    }else if(walletBankCardInfo.capitalMode == "P"){
                        //支付宝，不展示卡号
                        content += "<span class='bank' style='width:270px'>"+walletBankCardInfo.bankName+"</span>";
                    }else{
                        content += "<span class='bank' style='width:270px'>"+walletBankCardInfo.bankName+"["+walletBankCardInfo.bankCardShow+"]</span>";
                    }
                    if(result > 0){
                        content += "<span class='money'>余额：<em>"+walletBankCardInfo.availShare+"</em>元</span>";
                        if(walletBankCardInfo.capitalMode == "1"){
                            //如果是柜台账户，不用展示去充值这个内容的。
                            content += "<span class='tips'></span>";
                        }else if(walletBankCardInfo.capitalMode == "P"){
                            //支付宝，不展示充值
                            content += "<span class='tips'></span>";
                        }else{
                            content += "<span class='tips'><a href='javascript:;'>还差"+result+"元,先充值</a></span>";
                        }
                    }else{
                        content += "<span class='money'>余额：<em style='color: #df5412;'>"+walletBankCardInfo.availShare+"</em>元</span>";
                        content += "<span class='tips'></span>";
                    }
                    content += setPayFee(walletBankCardInfo,feeFlag);
                    moneyPayInfo += content;
                }
                $("#moneyPayInfo").html(moneyPayInfo);
                if(walletBankCards.length != 0){
                    //如果没有列表，就不用自动选择第一个
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
            //加载快捷支付
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
                        //支付宝，不展示卡号
                        content += "<span class='bank' style='white-space: nowrap;margin-right:30px;width: 320px;'><img src='/static/wtgf/img/bank/"+smgBankCardInfo.bankNo+"_icon_small.png' alt=''>"+smgBankCardInfo.capitalName+"&nbsp;</span>";
                    }else{
                        content += "<span class='bank' style='white-space: nowrap;margin-right:30px;width: 320px;'><img src='/static/wtgf/img/bank/"+smgBankCardInfo.bankNo+"_icon_small.png' alt=''>"+smgBankCardInfo.capitalName+"&nbsp;["+smgBankCardInfo.bankCardShow+"]</span>";
                    }
                    if(smgBankCardInfo.capitalMode == "P" || smgBankCardInfo.capitalMode == "H"){
                        //支付宝和汇付天下，限额是一个链接
                        content += "<span class='limit'><a href='http://www.gffunds.com.cn/wsjyjsy/zfyhk/' target='_blank' style='color: #fff;text-decoration: none;'>限额</a></span>";
                    }else{
                        content += "<span class='limit'>限额";
                        content += "<div class='limit-tips'>";
                        if(smgBankCardInfo.payShowLimit != undefined){
                            content += "<i></i><em>单笔限额</em><em>"+smgBankCardInfo.payShowLimit.perPayLimit/10000+"万元</em><em>单日限额</em><em>"+smgBankCardInfo.payShowLimit.dailyPayLimit/10000+"万元</em></div></span>";
                        }
                        content += "</div></span>";
                    }

                    if(smgBankCardInfo.capitalMode == "3"){
                        //银联的才展示转账费用
                        content += $("#zzfy").html();
                    }
                    if(smgBankCardInfo.signStatus == "0"){
                        content += "<span class='signing signing-kjzf'><a href='/main/bankCards/myCards' target='_blank'>开通快捷支付</a></span>";
                    }
                    content += setPayFee(smgBankCardInfo,feeFlag);
                    smgPayInfo += content;
                }
                $("#smgPayInfo").html(smgPayInfo);
                if(smgBankCards.length != 0){
                    //如果没有列表，就不用自动选择第一个
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
                    $("#smgPayInfo").html("<center>C类收费仅支持钱袋子支付</center>");
                }else{
                    $("#smgPayInfo").html("");
                }
            }
            //加载网银支付
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
                        //支付宝不展示卡号
                        content += "<span class='bank' style='white-space: nowrap;margin-right:30px;width: 320px;'><img src='/static/wtgf/img/bank/"+webBankCardInfo.bankNo+"_icon_small.png' alt=''>"+"&nbsp;"+webBankCardInfo.capitalName+"&nbsp;</span>";
                    }else{
                        content += "<span class='bank' style='white-space: nowrap;margin-right:30px;width: 320px;'><img src='/static/wtgf/img/bank/"+webBankCardInfo.bankNo+"_icon_small.png' alt=''>"+"&nbsp;"+webBankCardInfo.capitalName+"&nbsp;["+webBankCardInfo.bankCardShow+"]</span>";
                    }

                    if(webBankCardInfo.capitalMode == "P" || webBankCardInfo.capitalMode == "H"){
                        //支付宝和汇付天下，限额是一个链接
                        content += "<span class='limit'><a href='http://www.gffunds.com.cn/wsjyjsy/zfyhk/' target='_blank' style='color: #fff;text-decoration: none;'>限额</a></span>";
                    }else{
                        content += "<span class='limit'>限额";
                        content += "<div class='limit-tips'>";
                        if(webBankCardInfo.payShowLimit != undefined){
                            content += "<i></i><em>单笔限额</em><em>"+webBankCardInfo.payShowLimit.perPayLimit/10000+"万元</em><em>单日限额</em><em>"+webBankCardInfo.payShowLimit.dailyPayLimit/10000+"万元</em></div></span>";
                        }
                        content += "</div></span>";
                    }

                    if(webBankCardInfo.capitalMode == "3"){
                        //银联的才展示转账费用
                        content += $("#zzfy").html();
                    }
                    if(webBankCardInfo.signStatus == "0"){
                        content += "<span class='signing signing-wy'><a href='/main/bankCards/myCards' target='_blank'>开通网银支付</a></span>";
                    }
                    content += setPayFee(webBankCardInfo,feeFlag);
                    webPayInfo += content;
                }
                $("#webPayInfo").html(webPayInfo);
                if(webBankCards.length != 0){
                    //如果没有列表，就不用自动选择第一个
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
                    $("#webPayInfo").html("<center>C类收费仅支持钱袋子支付</center>");
                }else{
                    $("#webPayInfo").html("");
                }
            }
        }
    });
}

//获取手续费
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
            //如果是广发沪港深股票（代码：001764），并且选择钱袋子支付，认购状态-此处判断不了是否认购，先暂时不判断。
            if(fundCode == "001764" && buyMethod == "F"){
                //如果不是固定费率的，才只需要1折，取代原来的4折。
                if(data.orgRatio == "" && data.ratio == ""){
                    t = "预估手续费<em style='margin-left: 2px;margin-right: 2px;'>"+data.fare+"</em>元(根据费率<del style='margin-left: 5px;'>"+cal.use.numMulti(data.orgRatio,100)+"%</del> "+cal.use.numMulti(data.ratio,100)+"% 计算所得)";
                }else{
                    //计算公式（M-X）* D = X，求X值。
                    var md = cal.use.numMulti(amount,cal.use.numMulti(data.ratio,0.25))*10000;
                    var fareTemp = cal.use.numDiv(md,(1+cal.use.numMulti(data.ratio,0.25))*10000);
                    fareTemp = cal.use.toFixed(fareTemp,2);
                    t = "预估手续费<em style='margin-left: 2px;margin-right: 2px;'>"+fareTemp+"</em>元(根据费率<del style='margin-left: 5px;'>"+cal.use.numMulti(data.orgRatio,100)+"%</del> "+cal.use.numMulti(data.ratio,25)+"% 计算所得)";
                }
            }else{
                t = "预估手续费<em style='margin-left: 2px;margin-right: 2px;'>"+data.fare+"</em>元(根据费率<del style='margin-left: 5px;'>"+cal.use.numMulti(data.orgRatio,100)+"%</del> "+cal.use.numMulti(data.ratio,100)+"% 计算所得)";
            }
            obj.find('.tixing').html(t);
        }
    });
}

//默认选中支付方式中的第一个
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
    // 判断银行卡支付为快捷或者网银
    if(firstMoneyPay.hasClass('pay-kj') || firstMoneyPay.hasClass('pay-wy')){
        //如果需要开通网银或者快捷，按钮置灰
        $("#pay").attr("disabled","disabled");
        $('#pay').css("background","grey");
        $('#pay').css("border","0px");
    }else{
        $("#pay").removeAttr('disabled');
        $('#pay').css("background","#DF5412");
    }
}

//加载预估手续费
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
        content += "<p class='tixing'>预估手续费<em style='margin-left: 2px;margin-right: 2px;'>45.21</em>元(根据费率<del style='margin-left: 5px;'>1.20%</del> 0.48% 计算所得)</p>";
    }
    content += "</li>";
    return content;
}

//钱袋子不足，进行充值。
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
                        content += "<span class='ptype ptype-kj'>快捷</span>";
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
                        content += "<span class='ptype ptype-wy'>网银</span>";
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
                    $("#reChargeBankList").html("<center>暂无可用的银行卡，请重新选择钱袋子支付。</center>");
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
 * 判断是充值钱袋子还是买基金
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




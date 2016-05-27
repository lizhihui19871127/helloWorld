/******* page private variables *******/
var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js"),
	dialog = require("common:widget/dialog/dialog.js"),
    FormValidator = require("common:widget/validate/validate.js"),
    btn = require("common:widget/btn/btn.js");

//验证表单
var validateForm = null;
//用户支付渠道信息
var userPayChannels = null;
//当前支付对象map
var currentPaymethodMap = null;
var isSupportWalletFreezeBusin = false;

//start here
$(function(){
    init();//页面初始化
    bindEvent(); //页面绑定方法
});

//绑定事件
function bindEvent() {

    $("#walletRadio").click(walletRadioClick);
    $("#bankcardRadio").click(bankcardRadioClick);
    $("#paychannelSelect").change(paychannelSelectChange);

    //申请金额
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
	
}

//页面初始化
function init(){
    //初始化表单验证
    validateForm = new FormValidator(
        'frm',
        [{
            name : 'applyMoney',
            display:'购买金额',
            rules : 'required'
        },{
            name : 'contractAddrView',
            display:'寄送地址',
            rules : 'required'
        },{
            name : 'zipCode',
            display:'邮编',
            rules : 'required'
        },{
            name : 'userName',
            display:'收件人',
            rules : 'required'
        },{
            name : 'mobilePhone',
            display:'手机号码',
            rules : 'required'
        }],
        {
            success : function(datas,evt){  //异步提交请求
                if(checkPayLimit()){
                    return false;
                }
                return  true
            },
            autoSubmit : true
        }
    );
    processCheckFundLevel();
    loadPaychannelInfo();
}


//加载支付渠道信息
function loadPaychannelInfo()
{
    $("#paymethodGroup").addClass('hide');
    $("#paychannelTips").text("正在加载支付渠道信息...");
    $.ajax({
        type: "post",
        url: "/main/specialBuy/getPayChannelInfo",
        async:true,
        data: {"fundcode": $("#fundCode").val()},
        success: function (data) {
            if (data.errno != '00000') {
                //出错
                $("#modal3").modal('hide');
                $("#showInfoMsg").html("获取支付渠道信息出现错误，请稍后重试。");
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
    $("#paymethodGroup").addClass('hide')
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

//设置银行卡信息
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
        //钱袋子
        var wallet = userPayChannels.wallet[i];
        if('Y' == wallet.reinvest || 'y' == wallet.reinvest){
            $("#paychannelTips").html("当前钱袋子可用余额:" + util.number.format(wallet.availshare,2) +"元&nbsp;<a href='../../wallet/recharging.jsp' target = '_blank' style='text-decoration: none;color:#3389ca;padding-left: 5px;' title='成功充值钱袋子后可立即购买高端理财产品'>可用份额不够？立即充值></a>");
        }else{
            $("#paychannelTips").html("当前钱袋子可用余额:" + util.number.format(wallet.availshare,2) +"元&nbsp;<a href='../../wallet/recharging.jsp' target = '_blank' style='text-decoration: none;color:#3389ca;padding-left: 5px;' title='成功充值钱袋子后可立即购买高端理财产品'>可用份额不够？立即充值></a>");
        }
        //选中的交易账号信息
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
        //银行卡
        var bankcard = userPayChannels.bankcard[i];
        var paymethod = bankcard.payMethod;
        $("#paymethodDiv").empty();
        currentPaymethodMap = {};
        for(var j=0; j< paymethod.length; j++){
            $("#paymethodDiv").append(
                '<label class="radio" id="' + paymethod[j].methodtype + '_label" style="width:80%;padding-top:0px;height:30px;line-height:30px;margin-bottom:10px">' +
                '<input type="radio" id="' + paymethod[j].methodtype + 'Radio" name="payMethodRadio" style="margin-left:-10px;margin-right:5px;margin-top:8px"' +
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

//点击事件：支付方式
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
        //提示签约
        if("DATAFLOW" == value.toUpperCase()){
            if ( confirm( "您尚未开通一键支付功能，可通过托收签约操作进行开通，是否马上开通？" ) ) {
                displayShadeDiv("signMsgConfirm");
                window.open("/account/MyBankAccountAction.do?method=sign&tradeAccount=" + tradeacco +
                    "&bankCardNo=" + bankcardno);
            }
        }else if ("SMG" == value.toUpperCase()){
            if ( confirm( "您尚未开通一键支付功能，是否马上开通？" ) ){
                displayShadeDiv("openQuickPayConfirm");
                window.open("/account/OpenQuickPayAction.do?method=openPre&tradeAcco=" +tradeacco +
                    "&bankCardNo=" + bankcardno);
            }
        }
    }

}

//修改为网银支付
function changePayMethod(payMethodChangto){
    var yh = $("#paychannelSelect  option:selected").val();
    bankcardRadioClick(payMethodChangto,yh);
//    $("#payLimitAlarm").modal('hide');
    $("#frm").submit();
}

//检查限额
function checkPayLimit()
{
    var t = checkForm();
    if(!t){
        return true;
    }
    var value = $('input:radio[name="payMethodRadio"]:checked').val();
    var paymthod = currentPaymethodMap[value];

    var payment = $("#applyMoney").val();
    var methodtype = paymthod.methodtype.toUpperCase();
    var singlePayLimit = paymthod.singlepaylimit;
    var capitalmode = paymthod.capitalmode;
    var showName = paymthod.showname;
    var bankNo =  $("#bankNo").val();

    if (methodtype !='WEB' && singlePayLimit != "" && parseFloat(payment) > parseFloat(singlePayLimit)){
        //hhw:tag 当为通联渠道，并且银行同时支持短信签约和网页签约的情况
        if("I"==capitalmode&&(bankNo == "004"||bankNo == "017")){
            if(methodtype=="SMG"){
                $("#msg_payment_allinpay").text(payment);
                $("#msg_paymethod_allinpay").text(showName);
                $("#msg_paylimit_allinpay").text(singlePayLimit);
                $("#btn_cutpaylimit_allinpay").val("先支付"+singlePayLimit+"元");
                displayShadeDiv("payLimitAlarm_allinpay");
            }else if(methodtype=="DATAFLOW"){
                $("#showInfoMsg").html("支付金额不能超过限额："+singlePayLimit+"元");
                $("#modal2").modal('show');
            }
        }else if(bankNo == "050"||bankNo == "018"){
            $("#showInfoMsg").html("支付金额不能超过限额："+singlePayLimit+"元");
            $("#modal2").modal('show');
        }else{
            $("#msg_payment").text(payment);
            $("#msg_paymethod").text(showName);
            $("#msg_paylimit").text(singlePayLimit);
            $("#btn_cutpaylimit").val("先支付"+singlePayLimit+"元");
            displayShadeDiv("payLimitAlarm");
        }
        return true;
    }
    return false;
}

//网银签约
function webSign(){
    var tradeacco = $("#tradeAcc").val();
    var bankcardno = $("#bankCardNo").val();
    displayShadeDiv("signMsgConfirm");
    hideShadeDiv('payLimitAlarm_allinpay');
    window.open("/account/MyBankAccountAction.do?method=sign&tradeAccount=" + tradeacco + "&bankCardNo=" + bankcardno);
}

//验证签约结果，并继续交易
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
                //出错
                $("#showInfoMsg").html("获取签约详情出现问题，请稍后重试。");
                $("#modal2").modal('show');
            } else {
                if(data.signstate) {
                    hideShadeDiv("signMsgConfirm");
                }else{
                    $("#showInfoMsg").html("签约未完成，请先签约再继续交易！或选择其他支付方式！");
                    $("#modal2").modal('show');
                }
            }
        }
    });
}

//取消签约，选择其他支付方式
function cancelProtocolSign(){
    hideShadeDiv("signMsgConfirm");
}

//开通快捷付后添加快捷付支付功能
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
                //出错
                $("#showInfoMsg").html("获取一键支付开通详情出现问题，请稍后重试。");
                $("#modal2").modal('show');
            } else {
                if(data.signstate) {
                    hideShadeDiv("openQuickPayConfirm");
                }else{
					hideShadeDiv("openQuickPayConfirm");
                    $("#showInfoMsg").html("一键支付未开通，请先开通一键支付再继续交易！");
                    $("#modal2").modal('show');
                }
            }
        }
    });
}

//取消开通快捷付
function cancelOpenQuickpay(){
    hideShadeDiv("openQuickPayConfirm");
}


//显示遮罩层
function displayShadeDiv(id){
    $("#tradeShadeDiv").show();
//    $("#"+id).show();
    $("#"+id).modal('show');
}

//隐藏遮罩层
function hideShadeDiv(id){
    $("#tradeShadeDiv").hide();
//    $("#"+id).hide();
    $("#"+id).modal('hide');
}

/******* 其他拷贝来的方法 *******/

//检查输入金额
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
            async : false,//取消异步
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
                        $("#ratetitle").html("认购期基金不享受费率优惠");
                    } else
                    {
                        $("#rateamount").html(_amount.toFixed(2));
                        $("#ratetitle").html(" ");
                    }
                } else
                {
                    $("#rateamount").html(" ");
                    $("#ratetitle").html("无法计算出手续费");
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

//数字份额转大写（js）
function ChangeShareToUpper(value)
{
    var intFen,i,iPos;
    var strArr,strCheck,strFen,strDW,strNum,strBig,strNow;
    var type = $("#paychannelType").val();
    var unit='元';
    if('W' == type || 'w' == type){
        unit='份'
    }

    // 为空
    if(!CheckEmpty(value))
        return "";

    // 非数字
    if (!isNumberStr(value))   //数据非法时提示，并返回空串
    {
        strErr = value+"不是有效数字！"
        return strErr;
    }

    iPos = GetDotPos(value);
    if (iPos < 0 )
    {
        // 完全整数
        return ChangeIntToUpper(value)+unit;
    }
    else if (iPos == 0)
    {
        //就是小数
        return "零点" + ChangeShareFracToUpper(value.substring(1))+unit;
    }
    else
    {
        //整数小数混合
        var numA, numB;

        strArr = value.split(".");
        numA = strArr[0];
        numB = strArr[1];

        if(numA.length>12)   //数据大于等于一万亿时提示无法处理
        {
            strErr = value+"过大，无法处理！"
            return strErr;
        }

        var numBBig = ChangeShareFracToUpper(numB);

        if (numBBig.length != 0)
            return ChangeIntToUpper(numA) + "点" + numBBig +unit;
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
 * 数字字符串判别.
 * @param s 需要判别的字符串.
 * @return 当s为数字字符串时返回true, 返之返回false.
 */
function isNumberStr(s)
{
    var n = "0123456789.";
    var i;
    var isF = false;
    var fnum = 0;
    var maxF = 2;//小数位数最大值
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


// 得到.的位置
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


// 将整数部分，转换成大写
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

        // alert("第"+i+ "次(" +subsNum+")" + substr[i]);
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
        //alert("第"+i+ "次(" +subsNum+")" + sOut);
    }

    return sOut;
}

function ChangeShareFracToUpper(inputNum)
{
    // 过滤连续为零的情况
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


// 得到对应数字的大写
function GetNumUpper(value)
{
    var strNum = "";
    switch (value)              //选择数字
    {
        case "1":strNum = "壹";break;
        case "2":strNum = "贰";break;
        case "3":strNum = "叁";break;
        case "4":strNum = "肆";break;
        case "5":strNum = "伍";break;
        case "6":strNum = "陆";break;
        case "7":strNum = "柒";break;
        case "8":strNum = "捌";break;
        case "9":strNum = "玖";break;
        case "0":strNum = "零";break;
    }
    return strNum;
}

// 得到整数位数对应的大写单位
function GetIntPosUnit(type,postion)
{
    var strDW = "";

    if (type==0)
    {// 10000以内
        switch(postion)              //选择单位
        {
            case 1:strDW = "";break;    // 个
            case 2:strDW = "拾";break;  // 十
            case 3:strDW = "佰";break;  // 百
            case 4:strDW = "仟";break;  // 千
            default: strDW = "";break;
        }
    }
    else if (type==1)
    {// 10000的倍数 //TODO:再大就不知道怎么处理了
        switch(postion)              //选择单位
        {
            case 1:strDW = "";break;
            case 2:strDW = "万";break;
            case 3:strDW = "亿";break;
            case 4:strDW = "兆";break;
            default: strDW = "";break;
        }
    }

    return strDW;
}

//风险检查
function processCheckFundLevel()
{
    var riskLever = $("#riskLever").val();
    var _check = $("#fundCode").val();
    $.ajax({
        type : "post",
        url : "/main/specialBuy/getRiskInfo?fundCode="+_check,
        async : false,//取消异步
        success : function(data){
            if (data.riskInfo == "")
            {
                //若匹配 则隐藏风险提示 按钮可用
                if ($("#fundCode").val() == "" || $("#fundCode").val() == null)
                {
                    $('#J_submitButton').attr('disabled', 'disabled');
                    $('#J_submitButton').css("background","grey");
                } else
                {
                    $('#J_submitButton').removeAttr('disabled');
                    $('#J_submitButton').css("background","#eb5406");
                }
            } else
            {
                //若不匹配 显示风险提示、不check、按钮不可用、显示提示
                $("#riskCheckShow").hide();
                $("#showInfoMsgLever").html(data.riskInfo);
                $("#modal3").modal('show');
                $('#J_submitButton').attr('disabled', 'disabled');
                $('#J_submitButton').css("background","grey");
            }
        }
    });
}

// 标准认申购买基金表单验证
function checkForm()
{
    var msg = "";
    if($("#filecheck").is(":checked")==false)
    {
        $("#showInfoMsg").html("请确认 已阅读相关须知，并了解其风险！");
        $("#modal2").modal('show');
        return false;
    }
    // 1.1 检查支付金额
    if ($("#applyMoney").val() == "")
    {
        msg += "支付金额不能为空！\n";
    }
    else
    {
        var moneyPattern = /^[0-9]+([.]\d{1,2})?$/;
        if (!moneyPattern.exec($("#applyMoney").val()))
        {
            msg += "请输入正确格式的金额！\n";
        }
        else if ($("#applyMoney").val() <= 0)
        {
            msg += "支付金额必须大于零！\n";
        }
        else
        {
            msg += checkMoney();
        }
    }

    if ($.trim($("#mobilePhone").val()) == "")
    {
        msg += "手机号不能为空！";
    }

    if ($.trim($("#userName").val()) == "")
    {
        msg += "收件人姓名不能为空！";
    }

    if (msg != "")
    {
        $("#showInfoMsg").html(msg);
        $("#modal2").modal('show');
        return false;
    }

    var contractAddr = $('#contractAddrView').val();
    var _other = ' ,' + ' ,' + ' ,' + $('#zipCode').val();

    //非空判断
    if (contractAddr == "")
    {
        msg = "请输入寄送地址！\n";
    } else
    {
        if ($("#zipCode").val() == "")
        {
            msg += "请输入邮政编码\n";
        } else
        {
            if ($("#zipCode").val().length != 6)
            {
                msg += "请输入正确6位邮政编码\n";
            }
        }

        var _newObj = contractAddr.replace(/[^\x00-\xff]/g, "**");

        if (_newObj.length > 60)
        {
            msg += "联系地址不能超过60个字符，1个中文等于2个字符！";
        }
        $("#contractAddr").val(_other + "," + contractAddr);//设置完整地址
    }

    //如果是用钱袋子购买，要检查钱袋子剩余份额够不够
    var type = $("#paychannelType").val();
    if('W' == type || 'w' == type){
        if(!$("#paychannelSelect").val())
        {
            msg += "没有选择支付渠道！";
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
                msg += "钱袋子余额不足，无法交易！\n";
            }
            $("#transferShares").val($("#applyMoney").val());
        }
    }

    //如果显示了认购享有收益，是需要勾选协议的
    var appreciationShow = $("#appreciationShow").css("display");
    if(appreciationShow == "block"){
        if ($("#appreciationNote").is(":checked")) {
        }else{
            msg = "请勾选认购期享受钱袋子收益协议。";
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
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

//start here
$(function(){
    init();//ҳ���ʼ��
    bindEvent(); //ҳ��󶨷���
});

//���¼�
function bindEvent() {

    $("#walletRadio").click(walletRadioClick);
    $("#bankcardRadio").click(bankcardRadioClick);
    $("#paychannelSelect").change(paychannelSelectChange);

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
	
}

//ҳ���ʼ��
function init(){
    //��ʼ������֤
    validateForm = new FormValidator(
        'frm',
        [{
            name : 'applyMoney',
            display:'������',
            rules : 'required'
        },{
            name : 'contractAddrView',
            display:'���͵�ַ',
            rules : 'required'
        },{
            name : 'zipCode',
            display:'�ʱ�',
            rules : 'required'
        },{
            name : 'userName',
            display:'�ռ���',
            rules : 'required'
        },{
            name : 'mobilePhone',
            display:'�ֻ�����',
            rules : 'required'
        }],
        {
            success : function(datas,evt){  //�첽�ύ����
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
        //hhw:tag ��Ϊͨ����������������ͬʱ֧�ֶ���ǩԼ����ҳǩԼ�����
        if("I"==capitalmode&&(bankNo == "004"||bankNo == "017")){
            if(methodtype=="SMG"){
                $("#msg_payment_allinpay").text(payment);
                $("#msg_paymethod_allinpay").text(showName);
                $("#msg_paylimit_allinpay").text(singlePayLimit);
                $("#btn_cutpaylimit_allinpay").val("��֧��"+singlePayLimit+"Ԫ");
                displayShadeDiv("payLimitAlarm_allinpay");
            }else if(methodtype=="DATAFLOW"){
                $("#showInfoMsg").html("֧�����ܳ����޶"+singlePayLimit+"Ԫ");
                $("#modal2").modal('show');
            }
        }else if(bankNo == "050"||bankNo == "018"){
            $("#showInfoMsg").html("֧�����ܳ����޶"+singlePayLimit+"Ԫ");
            $("#modal2").modal('show');
        }else{
            $("#msg_payment").text(payment);
            $("#msg_paymethod").text(showName);
            $("#msg_paylimit").text(singlePayLimit);
            $("#btn_cutpaylimit").val("��֧��"+singlePayLimit+"Ԫ");
            displayShadeDiv("payLimitAlarm");
        }
        return true;
    }
    return false;
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
                    $('#J_submitButton').attr('disabled', 'disabled');
                    $('#J_submitButton').css("background","grey");
                } else
                {
                    $('#J_submitButton').removeAttr('disabled');
                    $('#J_submitButton').css("background","#eb5406");
                }
            } else
            {
                //����ƥ�� ��ʾ������ʾ����check����ť�����á���ʾ��ʾ
                $("#riskCheckShow").hide();
                $("#showInfoMsgLever").html(data.riskInfo);
                $("#modal3").modal('show');
                $('#J_submitButton').attr('disabled', 'disabled');
                $('#J_submitButton').css("background","grey");
            }
        }
    });
}

// ��׼���깺��������֤
function checkForm()
{
    var msg = "";
    if($("#filecheck").is(":checked")==false)
    {
        $("#showInfoMsg").html("��ȷ�� ���Ķ������֪�����˽�����գ�");
        $("#modal2").modal('show');
        return false;
    }
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

    if ($.trim($("#mobilePhone").val()) == "")
    {
        msg += "�ֻ��Ų���Ϊ�գ�";
    }

    if ($.trim($("#userName").val()) == "")
    {
        msg += "�ռ�����������Ϊ�գ�";
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
    if (contractAddr == "")
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
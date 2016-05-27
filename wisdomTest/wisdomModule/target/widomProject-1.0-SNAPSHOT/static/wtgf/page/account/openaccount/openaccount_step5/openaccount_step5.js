var FormValidator = require("common:widget/validate/validate.js"),
    datePicker = require("common:widget/datepicker/datepicker.js"),
    btn = require("common:widget/btn/btn.js");

/******* page private variables *******/
var validateForm = null;
var smsVFCodeTipsObj=null;
var tryWEB=null;

//start here
$(function(){
    init();//页面初始化
    bindEvent(); //页面绑定方法
});

function bindEvent() {
    $("#selectedCardBtn").click(function(){
        window.location.href='/main/account/openaccount/openaccount_step4?bankShowKey='+$("#bankShowKey").val()+'&bankNo='+$("#bankNo").val();
    });
    $("#verifyMethodWEB").click(function() {
        verifyModeShow(false,true,false);
    });
    $("#verifyMethodDT").click(function(){
        verifyModeShow(true,false,false);
    });
    $("#timeUnLimited").click(timeUnLimitedClick);
    $("#verifyMsgDivClose").click(hideVerifyMsgDiv);
    $("#bankMsgBoxClose").click(hideBankMsgBox);
    $("#webverifyA").click(webverifyAClick);


    //遮蔽层，验证成功
    $("#verifyMsgDivOK").click(verifyMsgDivOKClick);

    //遮蔽层，验证失败
    $("#verifyMsgDivErr").click(function(){
        $('#shadeDiv').hide();
        $('#verifyMsgDiv').hide();
    });
    //发送短信验证码
    $("#smsVFCodeBtn").click(smsVFCodeBtnClick);

    $("#identityNo").blur(regContactShow);
    $("#identityType").blur(regContactShow);
}

//页面初始化
function init(){
    //日期
    $("#expiredate").datepicker({
        dateFormat : "yy-mm-dd",
        changeYear : true,
        changeMonth : true,
        yearRange : "c-0:c+20"
    });
    $("#expiredate").attr("readonly","readonly");
    $('#expiredate').css({ 'cursor':'default'});

    //遮盖层
    $("#shadeDiv").css({"width":document.documentElement.scrollWidth+"px",
        "height":document.documentElement.scrollHeight+"px"});

    //初始化表单验证
    validateForm = new FormValidator(
        'openaccount_step5_form',
        [{
            name : 'userName',
            display:'姓名',
            rules : 'required|callback_regName_rule'
        },{
            name : 'identityType'
        },{
            name : 'identityNo',
            display: '证件号码',
            rules : function(value){
                var idType = $("#identityType").val(),
                    rules = 'required';

                if(idType == '0'){
                    return rules + "|valid_identity";
                }else{
                    return rules;      //军官证什么的只要是数字就OK
                }
            }
        },{
            name:'expiredate',
            display:'证件有效期',
            rules : function(value){
                var rules = 'required|callback_expireDateCheck';
                if(($('#timeUnLimited').prop("checked"))){
                    rules ='callback_expireDateCheck';
                }
                return rules;
            },
            posTarget : $("#noExpiretimeChkbox")
        },{
            name : 'tradePasswd',
            display: '交易密码',
            posTarget:$("#passwdTipsSpan"),
            rules :  'required|no_blank|alpha_dash|min_length[6]|max_length[8]|callback_passwords'
        },{
            name : 'tradePasswdConfirm',
            display: '确认密码',
            rules :  'required|matches[tradePasswd]'
        },{
            name:'agreeCheckbox',
            rules: 'callback_agreeProx',
            posTarget:$("#agreeA")
        },{
            name:'selectedCard'
        },{
            name:'verifyMethod'
        },{
            name:'bankNo'
        },{
            name:'childBankNo'
        },{
            name:'capitalMode'
        },{
            name:'email'
        }],
        {
            success : function(datas,evt){  //异步提交请求
                btn.disable($("#nextStepBtn"),{
                    color:          '#FF0000',
                    setBtnLoad:     true
                });
                var v= $('#timeUnLimited').prop("checked")
                if(v){
                    datas.expiredate='99999999'; //永久有效
                }
                if(window.GF_VIEWINFO.verifyMode == -1) //取配置
                {
                    datas.verifyMethod='';
                }
                //招行特别处理
                specialOperationForCMB(datas);
                specialOperationForCGB(datas);
                $.post("/main/account/openaccount/bindCards",datas, function (ret) {
                    if(ret.errno == "00000") {
                        if(typeof(dcsPageTrack)=="function"){
                            dcsPageTrack("WT.si_n","银行卡绑定",false,"WT.si_x","绑卡成功",false,"WT.paybank",ret.bankName,false);
                        }
                        window.location.href="/main/account/openaccount/openaccount_success"
                    }else if(ret.errno == "99998"){
                        //WEB验证
                       // window.open('/main/account/openaccount/notBindCard','_blank');
                        if(typeof(dcsPageTrack)=="function"){
                            dcsPageTrack("WT.si_n","银行卡绑定",false,"WT.si_x","绑卡失败",false,"WT.paybank",ret.bankName,false,"WT.err_type",ret.errmsg,false);
                        }
                        $('#goweb').submit();
                        showVerifyMsgDiv();
                    }else if(tryWEB && ret.tryWEB && "1" ==ret.tryWEB) {
                        $("#bankErrMsg").text(ret.errmsg);
                        if(typeof(dcsPageTrack)=="function"){
                            dcsPageTrack("WT.si_n","银行卡绑定",false,"WT.si_x","绑卡失败",false,"WT.paybank",ret.bankName,false,"WT.err_type",ret.errmsg,false);
                        }
                        showBankMsgBox();
                    }else{
                        $('#modalMsgSpan').text(ret.errmsg);
                        $('#myModal').modal();
                        if(typeof(dcsPageTrack)=="function"){
                            dcsPageTrack("WT.si_n","银行卡绑定",false,"WT.si_x","绑卡失败",false,"WT.paybank",ret.bankName,false,"WT.err_type",ret.errmsg,false);
                        }
                    }
                    btn.enable($("#nextStepBtn"));
                });
            },
            autoSubmit : false
        }
    );
    validateForm.setMessage('tradePasswdConfirm.matches','两次输入的密码不一致');

    //姓名
    validateForm.registerCallback('regName_rule',function(value){
//        if(!/^[\u4E00-\u9FA5\uf900-\ufa2d\s\._a-zA-Z]{2,40}$/.test(value)) {
//            return false;
//        }
        if (/^\s{1,}|\s{1,}$/.test(value)) {
            return false;
        }
        return true;
    });
    //validateForm.setMessage('regName_rule','姓名只能是汉字、字母、点、空格和下划线，不允许其他符号和数字');
    validateForm.setMessage('regName_rule','姓名前后不能有空格');

    //交易密码不能含特殊字符
    validateForm.registerCallback('passwords',function(value){
        if("-".indexOf(value)>-1){
            return false;
        }
        //若全是字母
        if (/^\D+$/gi.test(value)) {
            if (/(\D)\1{2,}/g.test(value)) {
                //msg = "不允许有3位或3位以上连续相同字符。（如：4个’a’）";  // 全一样
                return false;
            }
        } else if (/^\d+$/gi.test(value)) {//全是数字
            if (/(\d)\1{2,}/g.test(value)) {
                //msg = "不允许有3位或3位以上连续相同字符。（如：不允许3个’1’）";  // 全一样
                return false;
            }
            for (var i = 0; i < value.length - 2; i++) {
                var _first = parseInt(value.charAt(i));
                var _middle = parseInt(value.charAt(i + 1));
                var _end = parseInt(value.charAt(i + 2));
                if ((_first + 1 == _middle) && (_middle + 1 == _end)) {
                    //msg = "密码全是数字时不允许有3位或3位以上连续数字.（如:不允许’123’）";
                    return false;
                }
                if ((_first - 1 == _middle) && (_middle - 1 == _end)) {
                    //msg = "密码全是数字时不允许有3位或3位以上连续数字.（如:不允许’543’）";
                    return false;
                }
            }
        }
        return true;
    });
    validateForm.setMessage('passwords','密码只能是6-8位字母、数字或下划线组合，不能为简单密码');

    //交易密码，两次密码必须相等
    validateForm.registerCallback('passwords_equal',function(value){
        var v= $("#tradePasswdConfirm").val();
        if(v != value){
            return false;
        }
        return true;
    });
    validateForm.setMessage('passwords_equal','两次输入的密码不一致');

    //必须同意协议
    validateForm.registerCallback('agreeProx',function(value){
        var v= $('#agreeCheckbox').prop("checked");
        if(!v){
            return false;
        }
        return true;
    });
    validateForm.setMessage('agreeProx','请阅读《广发基金快捷支付协议》');

    //证件有效期
    validateForm.registerCallback('expireDateCheck',expireDateCheckFunc);

    //验证方式初始化,2为网页和数据流
    tryWEB=false;
    //招行特别处理
    if($("#bankNo").val() == '007' || $("#bankNo").val() == '018'||$("#bankNo").val() == '015' || $("#bankNo").val() == '052'||$("#bankNo").val() == '068'){
        verifyModeShow(true,true,true);
        tryWEB=true;
        $('#verifyMethodDT').prop('checked','checked');
    }else if ($('#bankNo').val() == '038' && $('#childBankNo').val() == '0305'){
        verifyModeShow(false,true,true);
        showMobileInBank(true);//民生银行需要显示手机号码
        $('#verifyMethodWEB').prop('checked','checked');
    }else if(window.GF_VIEWINFO.verifyMode == 0){ //只能是网银
        verifyModeShow(false,true,true);
        $('#verifyMethodWEB').prop('checked','checked');
    }else if(window.GF_VIEWINFO.verifyMode == 1){ //只是数据流
        verifyModeShow(true,false,true);
        $('#verifyMethodDT').prop('checked','checked');
    }else if(window.GF_VIEWINFO.verifyMode == -1){ //取系统配置，为WEB方式
        verifyModeShow(false,true,true);
        $('#verifyMethodWEB').prop('checked','checked');
    }else{
        verifyModeShow(true,true,true);
        $('#verifyMethodDT').prop('checked','checked');
        tryWEB=true;
    }

    //支付宝、天天盈不需要输入卡号
    if($("#bankNo").val() == '039' || $("#bankNo").val()=='038' && $("#childBankNo").val()=='')
    {
        $('#bankCard_cgroup').addClass('hide');
        validateForm.deleteField('bankCard');
    }else{
        $('#bankCard_cgroup').removeClass('hide');
        validateForm.addField({
            name:'bankCard',
            display:'银行卡号',
            rules: 'required|numeric|no_blank'
        });
    }

    //根据证件号码初始化页面
    $("select#identityType option").attr("disabled","disabled");
    var ele = "select#identityType option[value=" + window.GF_VIEWINFO.identityType + "]";
    $(ele).removeAttr("disabled");
    $('#identityType').val(window.GF_VIEWINFO.identityType);
    if(window.GF_VIEWINFO.identityType == '0'){
        $(".IDNOLen").show();
        validateForm.addField({
            name : 'identityNoMode'
        });
    }

    regContactShow();
}

/******* page private method *******/
//银行预留手机号码
function showMobileInBank(bshow)
{
    //银行预留手机号码
    if(bshow){
        $('#mobileInBank_cgroup').removeClass('hide');
        validateForm.addField({
            name:'mobileInBank',
            display:'银行预留手机号码',
            rules: 'required|numeric|exact_length[11]'
        });
    }else{
        $('#mobileInBank_cgroup').addClass('hide');
        validateForm.deleteField('mobileInBank');
    }
}

//显示验证方式
function verifyModeShow(showDatFlow,showWeb,includeLabel) {
    validateForm.hideError();
    if (!showDatFlow){
        //隐藏dataflow
        if(includeLabel){
            $('#verifyMethodDT_label').addClass('hide');
        }
        $('#smsVFCode__cgroup').addClass('hide');
        validateForm.deleteField('smsVFCode');
        showMobileInBank(false);
    }else{
        //显示dataFlow
        if(includeLabel) {
            $('#verifyMethodDT_label').removeClass('hide');
        }
        showMobileInBank(true);
        $('#smsVFCode__cgroup').removeClass('hide');
        //短信校验码
        validateForm.addField({
            name:'smsVFCode',
            display:'短信校验码',
            posTarget : $("#smsVFCodeBtn"),
            rules:'required|no_blank|exact_length[6]|callback_checkSmsVF'
        });
        validateForm.registerCallback('checkSmsVF',function(value){
            var isPassed = true;
            return isPassed;
        }).setMessage('checkSmsVF','短信校验码不正确');
    }

    if (!showWeb) {
        //隐藏网银
        if(includeLabel) {
            $('#verifyMethodWEB_label').addClass('hide');
        }
    }else{
        //显示网银
        if(includeLabel) {
            $('#verifyMethodWEB_label').removeClass('hide');
        }
    }

    //同时显示
    if(includeLabel && showDatFlow && showWeb){
        $('#verifyMethod_cgroup').removeClass('hide');
    }else if(includeLabel){
        //显示一个时也隐藏
        $('#verifyMethod_cgroup').addClass('hide');
    }
}

//招行的特别处理
function specialOperationForCMB(obj)
{
    if($("#bankNo").val() == '007' || $("#bankNo").val() == '018')
    {
        if ($('#verifyMethodDT').prop("checked"))
        {
            if (obj) {
                obj.capitalMode = 'I';
                obj.bankNo = '018';
                obj.childBankNo = '03080000';
                obj.verifyMethod="DATAFLOW";
            }
        } else if ($('#verifyMethodWEB').prop("checked"))
        {
            if (obj) {
                obj.capitalMode = 'D';
                obj.bankNo = '007';
                obj.childBankNo = '';
                obj.verifyMethod="WEB";
            }
        }
    }
}

//招行的特别处理
function specialOperationForCGB(obj)
{
    if($("#bankNo").val() == '015' || $("#bankNo").val() == '052')
    {
        if ($('#verifyMethodDT').prop("checked"))
        {
            if (obj) {
                obj.capitalMode = 'G';
                obj.bankNo = '052';
                obj.childBankNo = '';
                obj.verifyMethod="DATAFLOW";
            }
        } else if ($('#verifyMethodWEB').prop("checked"))
        {
            if (obj) {
                obj.capitalMode = '5';
                obj.bankNo = '015';
                obj.childBankNo = '';
                obj.verifyMethod="WEB";
            }
        }
    }
}

//遮蔽层成功按钮
function verifyMsgDivOKClick()
{
    //检查是否开户成功
    $.ajax({
        type: "post",
        url: "/main/account/openaccount/checkUserHasAccount",
        async:false,
        data: {"identityType": $('#identityType').val(),"identityNo":$('#identityNo').val()},
        success: function (msg) {
            if (msg.errno != '00000') {
                $('#shadeDiv').hide();
                $('#verifyMsgDiv').hide();
                $('#modalMsgSpan').text(msg.errmsg);
                $('#myModal').modal();
            } else {
                if(msg.status){
                    window.location.href="/main/account/openaccount/openaccount_success"
                }else{
                    $('#shadeDiv').hide();
                    $('#verifyMsgDiv').hide();
                    $('#modalMsgSpan').text('开户失败，请重试。');
                    $('#myModal').modal();
                }
            }
        }
    });
}

//发送短信验证码
function smsVFCodeBtnClick() {
    if(validateForm.validateField('userName') != 0 ||
        validateForm.validateField('identityType') !=0 ||
        validateForm.validateField('identityNo') !=0||
        validateForm.validateField('bankCard') !=0 ||
        validateForm.validateField('bankNo') !=0 ||
        validateForm.validateField('identityNoMode') !=0 ||
        validateForm.validateField('mobileInBank') !=0)
    {
        return;
    }
    validateForm.hideError('smsVFCode');
    smsVFCodeTipsObj = btn.disable($("#smsVFCodeBtn"),{
        color:          '#C0C0C0',     //disable后字体的颜色
        setBtnLoad:     false        //是否显示Loading的gif图片
    });
    var idMode = $('#identityNoMode18').val();
    if($('#identityNoMode15').prop("checked")){
        idMode = $('#identityNoMode15').val();
    }
    var postData ={
        userName: $('#userName').val(),
        identityType:$('#identityType').val(),
        identityNo:$('#identityNo').val(),
        bankCard:$('#bankCard').val(),
        bankNo:$('#bankNo').val(),
        identityNoMode:idMode,
        childBankNo:$('#childBankNo').val(),
        mobileInBank:$('#mobileInBank').val()
    };

    //招行特别处理
    specialOperationForCMB(postData);
    specialOperationForCGB(postData);

    $.ajax({
        type: "post",
        url: "/main/account/openaccount/sendSmsVF",
        data: postData,
        success: function (msg) {
            //var msgJson = $.parseJSON(msg);
            var msgJson = msg;
            if (msgJson.decode != '00000') {
                //发送失败
                if(tryWEB && msgJson.decode == '99991'){
                    $("#bankErrMsg").text(msgJson.errmsg);
                    showBankMsgBox();
                }else {
                    $('#modalMsgSpan').text(msgJson.errmsg);
                    $('#myModal').modal();
                }
                btn.enable($("#smsVFCodeBtn"));
            } else {
                CountDown(90);
            }
        }
    });
}

//日期检查
function expireDateCheckFunc(value) {
    var msg = "";
    var identityNo = $('#identityNo').val();
    var _type = $('#identityType').val();

    if(validateForm.validateField('identityNo') != 0)
    {
        return false;
    }

    var curDate = new Date();
    var curYear = curDate.getFullYear();
    var curMonth = curDate.getMonth();
    var curDay = curDate.getDate();
    var _nowDate = new Date(curYear, curMonth, curDay);

    var _selectyear = $("#expiredate").val().substring(0, 4);
    var _selectmonth = $("#expiredate").val().substring(5, 7);
    var _selectday = $("#expiredate").val().substring(8, 10);
    var _selecttime = new Date(_selectyear, parseInt(_selectmonth) - 1, _selectday);

    if(!$('#timeUnLimited').prop("checked") && _selecttime <= _nowDate){
        msg = '您选择的证件有限期不在有效范围内';
    }
    if(msg == "" && _type == '0')
    {

        var age = 0;
        if (identityNo.length == 15)
        {
            var tday = '19' + identityNo.substr(6, 2);
            age = new Date("" + '19' + identityNo.substr(6, 2), parseInt(identityNo.substr(8, 2)) - 1, identityNo.substr(10, 2));
        } else
        {
            age = new Date("" + identityNo.substr(6, 4), parseInt(identityNo.substr(10, 2)) - 1, identityNo.substr(12, 2));
        }

        if($('#timeUnLimited').prop("checked")){
            _selecttime = new Date(9999, 11, 30);
        }
        var age18 = new Date(curYear - 18,curMonth, curDay);
        var age26 = new Date(curYear - 26,curMonth, curDay);
        var age46 = new Date(curYear- 46,curMonth, curDay);
        if (age18 < age)
        {
            var currentDate = new Date(curYear+5, curMonth, curDay);
            if (_selecttime > currentDate)
            {
                msg = '您未满18周岁,根据您的证件号码推算您的证件有限期最大期限是' + (curYear + 5) + "年" + (curMonth + 1) + "月"+curDay+"日";
            }
        }
        else if (age18 >= age && age26 < age)
        {
            var currentDate = new Date(curYear+10, curMonth, curDay);
            if (_selecttime > currentDate)
            {
                msg = '您未满26周岁,根据您的证件号码推算您的证件有限期最大期限是' + (curYear + 10) + "年" + (curMonth + 1) + "月"+curDay+"日";
            }
        }
        else if (age26 >= age && age46 < age)
        {
            var currentDate = new Date(curYear+20, curMonth, curDay);
            if (_selecttime> currentDate)
            {
                msg = '您未满46周岁,根据您的证件号码推算您的证件有限期最大期限是' + (curYear+ 20) + "年" + (curMonth + 1) + "月"+curDay+"日";
            }
        }
    }
    if(msg != ""){
        validateForm.setMessage('expireDateCheck',msg);
        return false;
    }
    return true;
}

// 倒计时
function CountDown(secs){
    $(smsVFCodeTipsObj).html('<span class="text-red text-fontsize16">（'+secs+'秒后重新获取）</span>');
    if(--secs>0){
        setTimeout("CountDown("+secs+")",1000);
    } else {
        btn.enable($("#smsVFCodeBtn"));
        $(smsVFCodeTipsObj).html('');
        //$('#smsVFCodeBtn').html('重新获取校验码');
    }
}

function showVerifyMsgDiv()
{
    $('#shadeDiv').show();
    $('#verifyMsgDiv').show();
}

function showBankMsgBox()
{
    $('#shadeDiv').show();
    $('#bankMsgBox').show();
}

function hideVerifyMsgDiv()
{
    $('#shadeDiv').hide();
    $('#verifyMsgDiv').hide();
}

function hideBankMsgBox()
{
    $('#shadeDiv').hide();
    $('#bankMsgBox').hide();
}


function webverifyAClick()
{
    $("#bankMsgBoxClose").click();
    $("#verifyMethodWEB").click();
    $("#nextStepBtn").click();
}

function timeUnLimitedClick()
{
    if($(this).prop('checked')){
        $('#expiredate').val('');
        $('#expiredate').attr('disabled','disabled');
        $('#expiredate').css({ 'cursor':'not-allowed'});
    }else{
        $('#expiredate').removeAttr('disabled');
        $('#expiredate').css({ 'cursor':'default'});
    }
}

function regContactShow(){

    validateForm.hideError();
    var idType = $("#identityType").val();
    var identityNo= $("#identityNo").val();

    var birth,years,now;
    if(idType=='0' && identityNo!=''){
        now = new Date();
        if(identityNo.length == 15){
            birth = new Date(1900+identityNo.substr(6,2),identityNo.substr(8,2) - 1,identityNo.substr(10,2));
            years = (now.getTime() - birth.getTime()) / ( 365 * 24 * 60 * 60 * 1000);
        }
        if(identityNo.length == 18){
            birth = new Date(identityNo.substring(6,10),identityNo.substring(10,12) - 1,identityNo.substring(12,14)),
                years = (now.getTime() - birth.getTime()) / ( 365 * 24 * 60 * 60 * 1000);
        }

        if(years<46){

            $("#timeUnLimited").attr("disabled",true);
            $("#contacttimeUnlimited").attr("checked",false);
        }else{
            $("#timeUnLimited").attr("disabled",false);
        }

    }else{
        $("#timeUnLimited").attr("disabled",false);
    }
}


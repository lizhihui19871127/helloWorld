var util = require("common:widget/util/util.js"),
    datepicker = require("common:widget/datepicker/datepicker.js"),
    juicer = require("common:widget/juicer/juicer.js"),
    dialog = require("common:widget/dialog/dialog.js"),
    btn = require("common:widget/btn/btn.js"),
    FormValidator = require("common:widget/validate/validate.js");
var $containerBank = $('.container-bank');
var bankInfo = null;
var clientAge = false;//是否需要经办人信息
var hasOfferClientInfo = false;//是否已经提供了经办人信息
var bankListShow = {};
var verifyToken = "";
var nIntervId;
var secondCount = 90;
var smsVFCodeTipsObj;
//经办人信息
var nIntervIdWindow;
var secondCountWindow = 90;
var smsVFCodeTipsObjWindow;

var payType = null;//支付类型（账户类0、网银1、快捷支付2）
//验证表单
var validateForm = null;
var frmLayerForm = null;
var main = (function(){
    var _init = function(){
        $("#validDate").datepicker({
            dateFormat : "yy-mm-dd",
            changeYear : true,
            changeMonth : true,
            yearRange : "c-0:c+20"
        });
        $("#validDate").attr("readonly","readonly");
        $('#validDate').css({ 'cursor':'default'});
        //初始化表单验证
        validateForm = new FormValidator(
            'frm',
            [{
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
                name:'validDate',
                display:'证件有效期',
                rules : function(value){
                    var rules = 'required|callback_validDateCheck';
                    if(($('#isYjyx').prop("checked"))){
                        rules ='callback_validDateCheck';
                    }
                    return rules;
                },
                posTarget : $("#noExpiretimeChkbox")
            },{
                name : 'tradePwd',
                display: '交易密码',
                posTarget:$("#passwdTipsSpan"),
                rules :  'required|no_blank|alpha_dash|min_length[6]|max_length[8]|callback_passwords'
            },{
                name : 'tradePasswdConfirm',
                display: '确认密码',
                rules :  'required|matches[tradePwd]'
            },{
                name : 'email',
                display: '邮箱',
                rules :  'required|valid_email'
            },{
                name:'agreeCheckbox',
                rules: 'callback_agreeProx',
                posTarget:$("#qyxy")
            },{
                name : 'userName',
                display: '姓名',
                rules :  'required'
            },{
                name : 'addressShow',
                display: '详细地址',
                rules :  'required'
            },{
                name : 'city',
                display: '省市',
                rules :  'required',
                posTarget:$("#adressWr")
            }
            ],
            {
                success : function(datas,evt){  //异步提交请求
                    setZipCode();
			        $("#bankCardNo").val($("#bankCardNo").val().replace(/[^\d]/g,''));
                    $("#identityNo").val($("#identityNo").val().replace(/[x]/g,"X"));
		            if(clientAge){
                        if(!hasOfferClientInfo){
                            //没有提供经办人信息
                            $("#modal5").modal("show");
                            checkLayer();
                        }else{
                            submitForm();
                            return true;
                        }
                    }else{
                        submitForm();
                        return true;
                    }
                }
            }
        );

        //姓名
        validateForm.registerCallback('regName_rule',function(value){
            if (/^\s{1,}|\s{1,}$/.test(value)) {
                return false;
            }
            return true;
        });

        //证件有效期
        validateForm.registerCallback('validDateCheck',validDateCheckFunc);

        validateForm.setMessage('regName_rule','姓名前后不能有空格');

        validateForm.setMessage('tradePasswdConfirm.matches','两次输入的密码不一致');


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
        loadBankInfo();
        regContactShow();
    };

    var bindEvent = function(){
        // 选择银行卡
        $containerBank.on('click', '.bank-sel', function(){
            hideErrors();
            $containerBank.find('.bank-list').toggle();
            var b = $("#bankListView").css("display");
            if(b == "none"){
                $("#bankTips").css("display","");
            }else{
                $("#bankTips").css("display","none");
            }
        });

        $containerBank.on('focus','.bank-sel',function(){
            $containerBank.find('.bank-list').hide();
        });

        // 选中银行卡
        $containerBank.on('click', '.bank-list li', function(){
            hideErrors();
            var str = $(this).html();
            $containerBank.find('.bank-list').hide();
            $("#bankTips").css("display","");
            $containerBank.find('.bank-sel').html(str);
            //根据选择的银行卡信息，展示银行卡提示信息
            var selectedBankInfo = getSelectedBank(str);
            var verifyMethod = selectedBankInfo.verifyMethod;
            if(verifyMethod != null && verifyMethod.length >0){
                var defaultMethod = verifyMethod[0];
                $("#bankNo").val(selectedBankInfo.bankNo);
                $("#bankName").val(selectedBankInfo.bankName);
                $("#capitalMode").val(defaultMethod.capitalMode);
                $("#verifyMethod").val(defaultMethod.method);
                //如果是支付宝、天天盈这种账户类的支付方式，是不显示网银和快捷的图标，也不需要显示银行卡号
                if(defaultMethod.capitalMode == "P" || defaultMethod.capitalMode == "H"){
                    $("#bankCardNoView").css("display","none");
                    $("#telView").css("display","none");
                    $("#verifyCodeView").css("display","none");
                    payType = 0;
                }else{
                    if(defaultMethod.method == 'D'){
                        //如果是快捷展示
                        $("#telView").css("display","block");
                        $("#verifyCodeView").css("display","block");
                        $("#bankCardNoView").css("display","block");
                        payType = 2;
                    }else if(defaultMethod.method == 'W'){
                        //如果是网银，不出现银行预留手机号码及验证码
                        $("#telView").css("display","none");
                        $("#verifyCodeView").css("display","none");
                        $("#bankCardNoView").css("display","block");
                        payType = 1;
                    }
                }
                changeBankCardNote(defaultMethod,selectedBankInfo);
            }
        });

        $("#guideTips").click(function(){
            //网银快捷相互切换
            if(payType == 1){
                changePayType(2);
            }else{
                changePayType(1);
            }
        });

        $("#getWyzf").click(function(){
            changePayType(1);
            $("#modal2").modal('hide');
        });

        // 是否同意业务协议
        $containerBank.on('change', 'label.agreen input', function(){
            if($(this).is(':checked')){
                $(this).parent().addClass('active');
            }else{
                $(this).parent().removeClass('active');
            }
        });

        // 输入银行卡
        $containerBank.on('focus', '.in-card-num', function(){
            var v = $(".in-card-num").val().replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,'$1 ');
            if(v != ""){
                $(this).parent().find('.bank-card-num').show();
            }
        });

        $containerBank.on('blur', '.in-card-num', function(){
            $(this).parent().find('.bank-card-num').hide();
        });

        $containerBank.on('keyup', '.in-card-num', function(){
            var v = $(this).val().replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,'$1 ');
            $(this).parent().find('.bank-card-num').html(v);
            if(v != ""){
                $(this).parent().find('.bank-card-num').show();
            }else{
                $(this).parent().find('.bank-card-num').hide();
            }
        });

        // 银行卡预留手机提示，2s后自动消失
        var phoneTipsTime;
        $containerBank.on('mouseenter', '.js-phone-tips', function(){
            $(this).find('.phone-tips').show();
            clearTimeout(phoneTipsTime);
        });

        $containerBank.on('mouseleave', '.js-phone-tips', function(){
            var $this = $(this);

            phoneTipsTime = setTimeout(function(){
                $this.find('.phone-tips').hide();
            },200);
        });

        // 我的银行卡-显示全部卡片
        $containerBank.on('click', '.my-bank-content .down', function(){
            $(this).hide().parent().find('ul').addClass('show-all');
        });

        $("#getValidCode").on('click',function(){
            $("#bankCardNo").val($("#bankCardNo").val().replace(/[^\d]/g,''));
            smsVFCodeBtnClick();
        });

        $("#getContackValidCode").on('click',function(){
            getVerifyCode();
        });

        $("#isYjyx").click(timeUnLimitedClick);

        $("#identityNo").blur(regContactShow);
        $("#identityType").blur(regContactShow);

        //重试，如果重新过一次，还是失败，就不允许再重试了。
        $("#submitAgain").on("click",function(){
            $("#retryFlag").val("1");
            $("#frm").submit();
            $("#retryFlag").val("0");
        });

        //确认温馨提示信息
        $("#toUpdateLever").on("click",function(){
            $("#modal").modal("hide");
        });

        //继续添加银行卡
        $("#addNewBankCard").on("click",function(){
            $("#modal").modal("hide");
        });

        //验证银行卡成功
        $("#checkSuccess").on("click",function(){
            //直接跳转到我的银行卡页面
            window.location.href="/main/bankCards/myCards";
        });

        //继续添加银行卡
        $("#addNewCard").on("click",function(){
            $("#modal4").modal("hide");
        });

        //取消按钮
        $("#cancelBtn").on("click",function(){
            $("#modal4").modal("hide");
        });

        //继续添加银行卡
        $("#yzNewCard").on("click",function(){
            $("#modal6").modal("hide");
        });

        //取消按钮
        $("#yzCancelBtn").on("click",function(){
            $("#modal6").modal("hide");
        });

        //去掉空格
        $("#bankCardNo").on("blur",function(){
            $("#bankCardNo").val($("#bankCardNo").val().replace(/[^\d]/g,''));
        });

        $("#forlife").click(windowtimeUnLimitedClick);

        //切换证件类型
        $("#identityTypeShow").on("change",function(){
            $("#identityType").val($("#identityTypeShow").val());
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
    window.WTjson = {
        "WT.si_n":"添加银行卡",
        "WT.si_x":"选择银行卡"
    }
}

//网银快捷相互切换(type:1为网银；2为快捷)
function changePayType(type){
    hideErrors();
    var t = $("#bankInfo").html();
    //根据选择的银行卡信息，展示银行卡提示信息
    var selectedBankInfo = getSelectedBank(t);
    var verifyMethod = selectedBankInfo.verifyMethod;
    for(var i=0;i < verifyMethod.length;i++){
        var defaultMethod = verifyMethod[i];
        if(type == 1){
            if(defaultMethod.method == "W"){
                dealChangePayStyle(defaultMethod.method,defaultMethod,selectedBankInfo);
            }
        }else if(type == 2){
            if(defaultMethod.method == "D"){
                dealChangePayStyle(defaultMethod.method,defaultMethod,selectedBankInfo);
            }
        }
    }
}
//处理网银快捷切换后的事宜
function dealChangePayStyle(method,defaultMethod,selectedBankInfo){
    var icon = "/static/wtgf/img/bank/"+selectedBankInfo.bankNo+"_icon_small.png";
    var bankContent = "<img src="+icon+" alt=\"\">";
    bankContent += "<span>"+selectedBankInfo.bankName+"</span>";
    if(method == "W"){
        payType = 1;
        bankContent += "<i class=\"wy\">网银</i>";
    }else{
        payType = 2;
        bankContent += "<i class=\"kj\">快捷</i>";
    }
    $("#bankInfo").html(bankContent);
    changeBankCardNote(defaultMethod,selectedBankInfo);
    $("#bankNo").val(selectedBankInfo.bankNo);
    $("#bankName").val(selectedBankInfo.bankName);
    $("#capitalMode").val(defaultMethod.capitalMode);
    $("#verifyMethod").val(defaultMethod.method);
    if(method == "W"){
        $("#telView").css("display","none");
        $("#verifyCodeView").css("display","none");
        $("#bankCardNoView").css("display","block");
    }else{
        $("#telView").css("display","block");
        $("#verifyCodeView").css("display","block");
        $("#bankCardNoView").css("display","block");
    }
}
//弹层验证
function checkLayer(){
    $("#dateshow").datepicker({
        dateFormat : "yy-mm-dd",
        changeYear : true,
        changeMonth : true,
        yearRange : "c-0:c+20"
    });
    $("#dateshow").attr("readonly","readonly");
    $('#dateshow').css({ 'cursor':'default'});
    frmLayerForm = new FormValidator(
        'frmLayer',
        [{
            name : 'contactWindow',
            display:'姓名',
            rules: 'required',
            tipsTarget:$("#ctrname-wrap")
        },{
            name : 'contnoWindow',
            display: '证件号码',
            tipsTarget:$('#cardNum-wrap'),
            rules : function(value){
                var idType = $("#conttypeWindow").val(),
                    rules = 'required';

                if(idType == '0'){
                    return rules + "|valid_identity";
                }else{
                    return rules;      //军官证什么的只要是数字就OK
                }
            }
        },{
            name:'dateshow',
            display:'证件有效期',
            rules : function(value){
                var rules = 'required|callback_validDateCheckLayer';
                if(($('#forlife').prop("checked"))){
                    rules ='callback_validDateCheckLayer';
                }
                return rules;
            },
            topTarget:$('#forlife'),
            tipsTarget:$('#validdate-wrap')

        },{
            name : 'relationshipWindow',
            display: '客户关系',
            rules :  'required',
            tipsTarget:$('#rel-wrap')
        },{
            name : 'contphoneWindow',
            display: '手机号码',
            rules :  'required',
            tipsTarget:$('#mobile-wrap')
        },{
            name : 'contackVerifyCode',
            display: '验证码',
            rules :  'required',
            tipsTarget:$('#verifyCode-wrap')
        }
        ],
        {
            success : function(datas,evt){  //异步提交请求
                //验证校验码是否成功
                checkVerifyCode();
            }
        }
        );
    frmLayerForm.registerCallback('validDateCheckLayer',validDateCheckLFunc);
}

//弹层日期校验
function validDateCheckLFunc(){

    var msg = "";
    var identityNo = $('#contnoWindow').val();
    var _type = $('#conttypeWindow').val();

    if(validateForm.validateField('contnoWindow') != 0)
    {
        return false;
    }

    var curDate = new Date();
    var curYear = curDate.getFullYear();
    var curMonth = curDate.getMonth();
    var curDay = curDate.getDate();
    var _nowDate = new Date(curYear, curMonth, curDay);

    var _selectyear = $("#dateshow").val().substring(0, 4);
    var _selectmonth = $("#dateshow").val().substring(5, 7);
    var _selectday = $("#dateshow").val().substring(8, 10);
    if($('#forlife').prop("checked")){
        $("#contacttimelimitedWindow").val("29990101");
    }else{
        $("#contacttimelimitedWindow").val(""+_selectyear+_selectmonth+_selectday);
    }

    var _selecttime = new Date(_selectyear, parseInt(_selectmonth) - 1, _selectday);

    if(!$('#forlife').prop("checked") && _selecttime <= _nowDate){
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

        if($('#forlife').prop("checked")){
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
        validateForm.setMessage('validDateCheckLayer',msg);
        return false;
    }
    return true;

}

//加载银行信息
function loadBankInfo()
{
    $("#bankInfo").text("正在加载银行信息,请稍后");
    $.ajax({
        type: "get",
        url: "/main/bankCards/banks",
        async:true,
        data: null,
        success: function (data) {
            if (data.issuccess != true) {
                $("#showInfoMsg").html("获取银行信息出现错误，请稍后重试。");
                $("#toUpdateLever").css("display","");
                $("#addNewBankCard").css("display","none");
                $("#modal").modal('show');
            } else {
                bankInfo = data.data;
                //填充第一个银行的信息
                if(bankInfo != null && bankInfo.length > 0){
                    var firstBankInfo = bankInfo[0];
                    var icon = "/static/wtgf/img/bank/"+firstBankInfo.bankNo+"_icon_small.png";
                    var bankContent = "<img src="+icon+" alt=\"\">";
                    bankContent += "<span>"+firstBankInfo.bankName+"</span>";
                    //获取默认的是快捷还是网银
                    var verifyMethod = firstBankInfo.verifyMethod;
                    if(verifyMethod != null && verifyMethod.length >0){
                        var defaultMethod = verifyMethod[0];
                        //如果是支付宝、天天盈这种账户类的支付方式，是不显示网银和快捷的图标，也不需要显示银行卡号
                        if(defaultMethod.capitalMode == "P" || defaultMethod.capitalMode == "H"){
                            if(defaultMethod.method == 'W'){
                                bankContent += "<i class=\"wy\" style='display: none'>网银</i>";
                            }else if(defaultMethod.method == 'D'){
                                bankContent += "<i class=\"kj\" style='display: none'>快捷</i>";
                            }
                            bankContent += "";
                            $("#bankCardNoView").css("display","none");
                            $("#telView").css("display","none");
                            $("#verifyCodeView").css("display","none");
                            payType = 0;
                        }else{
                            if(defaultMethod.method == 'W'){
                                bankContent += "<i class=\"wy\">网银</i>";
                                //如果是网银不展示
                                $("#bankCardNoView").css("display","block");
                                $("#telView").css("display","none");
                                $("#verifyCodeView").css("display","none");
                                payType = 1;
                            }else if(defaultMethod.method == 'D'){
                                bankContent += "<i class=\"kj\">快捷</i>";
                                //如果是快捷，出现银行预留手机号码及验证码
                                $("#bankCardNoView").css("display","block");
                                $("#telView").css("display","block");
                                $("#verifyCodeView").css("display","block");
                                payType = 2;
                            }
                        }
                        //填充第一个银行的银行提示信息
                        changeBankCardNote(defaultMethod,firstBankInfo);
                        $("#bankTips").css("display","none");
                        $containerBank.find('.bank-list').show();
                    }
                    $("#bankInfo").html(bankContent);
                }
                //填充银行列表显示
                var bankListView = "<ul class='clearfix' style='padding:0px;margin:0 0 0 0'>";
                var method = "";
                for(var i =0;i < bankInfo.length;i++){
                    var currentBankInfo = bankInfo[i];
                    var icon = "/static/wtgf/img/bank/"+currentBankInfo.bankNo+"_icon_small.png";
                    var bankContent = "<img src=\""+icon+"\" alt=\"\">";
                    bankContent += "<span>"+currentBankInfo.bankName+"</span>";
                    //获取默认的是快捷还是网银
                    var verifyMethod = currentBankInfo.verifyMethod;
                    for(var j =0;j < verifyMethod.length;j++){
                        var allMethod = verifyMethod[j];
                        var methodParam = "";
                        //如果是支付宝、天天盈这种账户类的支付方式，是不显示网银和快捷的图标
                        if(allMethod.capitalMode == "P" || allMethod.capitalMode == "H"){
                            methodParam = "";
                            if(allMethod.method == 'W'){
                                methodParam = "<i class=\"wy\" style='display: none'>网银</i>";
                                method = "网银";
                            }else if(allMethod.method == 'D'){
                                methodParam = "<i class=\"kj\" style='display: none'>快捷</i>";
                                method = "快捷";
                            }
                        }else{
                            if(allMethod.method == 'W'){
                                methodParam = "<i class=\"wy\">网银</i>";
                                method = "网银";
                            }else if(allMethod.method == 'D'){
                                methodParam = "<i class=\"kj\">快捷</i>";
                                method = "快捷";
                            }
                        }
                        if(j == 0){
                            bankListView += "<li>"+bankContent+methodParam+"</li>";
                        }
                        bankListShow[currentBankInfo.bankNo+","+currentBankInfo.bankName+","+method] = currentBankInfo;
                    }
                }
                bankListView += "</ul>";
                $("#bankListView").html(bankListView);
            }
        }
    });
}

//发送短信验证码
function smsVFCodeBtnClick() {
    if(validateForm.validateField('bankCardNo') != 0 ||
        validateForm.validateField('mobilePhone') !=0)
    {
        return;
    }
    smsVFCodeTipsObj = btn.disable($("#getValidCode"),{
        color:          '#C0C0C0',     //disable后字体的颜色
        setBtnLoad:     false        //是否显示Loading的gif图片
    });
    $.ajax({
        type: "post",
        url: "/main/bankCards/verifyCode",
        data: {"bankNo": $('#bankNo').val(),"capitalMode":$('#capitalMode').val(),
            "bankCardNo": $('#bankCardNo').val(),"mobilePhone":$('#mobilePhone').val(),
        "identityType":$("#identityType").val(),"identityNo":$("#identityNo").val(),"userName":$("#userName").val()},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                //发送失败
                $("#showInfoMsg").html(msgJson.returnmsg);
                $("#toUpdateLever").css("display","");
                $("#addNewBankCard").css("display","none");
                $("#modal").modal('show');
                btn.enable($("#getValidCode"));
            } else {
                verifyToken = msgJson.verifySequence;
                $("#verifyToken").val(verifyToken);
	    	    $(smsVFCodeTipsObj).html('<span class="text-red text-fontsize16">（'+(secondCount--)+'秒后重新获取）</span>');
                nIntervId = setInterval(CountDown, 1000);

            }
        }
    });
}

//短信90秒倒计时
function CountDown(){
    $(smsVFCodeTipsObj).html('<span class="text-red text-fontsize16">（'+secondCount+'秒后重新获取）</span>');
    if(--secondCount<0){
        clearCountDown();
    }
}
//清除短信90秒倒计时任务
function clearCountDown(){
    btn.enable($("#getValidCode"));
    if(smsVFCodeTipsObj != undefined){
        $(smsVFCodeTipsObj).html('');
    }
    clearInterval(nIntervId);
    secondCount = 90;
}

function submitForm(){
    btn.setDisabled($('#J_submitButton'));
    var bankName = $("#bankName").val();
    var verifyMethod = $("#verifyMethod").val();
    var expiredate = $("#expiredate").val();
    if(verifyMethod == "D"){
        if(typeof(dcsPageTrack)=="function"){
            dcsPageTrack("WT.si_n","添加银行卡",false,"WT.si_x","验证信息",false,"WT.pn_sku",bankName,false,"WT.pc","快捷",false);
        }
        validateForm.autoSubmit = false;
        var _submitParam = {
        };
        _submitParam.bankNo = $('#bankNo').val();
        _submitParam.capitalMode = $('#capitalMode').val();
        _submitParam.verifyMethod = $('#verifyMethod').val();
        _submitParam.bankCardNo = $('#bankCardNo').val();
        _submitParam.verifyCode = $('#verifyCode').val();
        _submitParam.mobilePhone = $('#mobilePhone').val();
        _submitParam.tradePassWord = $('#tradePassWord').val();
        _submitParam.verifySequence = $('#verifyToken').val();
        _submitParam.userName = $("#userName").val();
        _submitParam.identityType = $('#identityType').val();
        _submitParam.identityNo = $('#identityNo').val();
        _submitParam.expiredate = $('#expiredate').val();
        //开发一账通新增的参数
        _submitParam.email = $('#email').val();
        _submitParam.gender = $('#gender').val();
        _submitParam.province = $('#province').val();
        _submitParam.cityno = $('#cityno').val();
        _submitParam.districtno = $('#districtno').val();
        _submitParam.address = $('#address').val();
        _submitParam.vocation = $('#vocation').val();
        _submitParam.id = $('#id').val();
        _submitParam.year70 = clientAge;
        _submitParam.zipno = $('#zipno').val();
        //年龄大于70岁，还需要的参数
        _submitParam.contact = $('#contact').val();
        _submitParam.contacttimelimited = $('#contacttimelimited').val();
        _submitParam.contno = $('#contno').val();
        _submitParam.contphone = $('#contphone').val();
        _submitParam.conttype = $('#conttype').val();
        _submitParam.relationShip = $('#relationShip').val();
        $.ajax({
            type: "post",
            url: "/main/account/openaccount/bindCard",
            data: _submitParam,
            success: function (msg) {
                var msgJson = msg;
                if(msgJson.issuccess){
                    var verifySequence = $('#verifyToken').val();
                    window.location.href="/main/bankCards/"+verifySequence+"/openAccountBindCardSuccess";
                }else{
                    //失败了，要弹出失败框，展示失败原因
                    var returnmsg = msgJson.returnmsg;
                    $("#showErrormsg").html(returnmsg);
                    $("#modal2").modal('show');
                    if(typeof(dcsPageTrack)=="function"){
                        dcsPageTrack("WT.si_n","添加银行卡",false,"WT.si_x","绑卡失败",false,"WT.pn_sku",bankName,false,"WT.pc","快捷",false,"WT.err_type",returnmsg,false);
                    }
                }
                btn.setEnabled($('#J_submitButton'));
            }
        });
    }else if(verifyMethod == "W"){
        if(typeof(dcsPageTrack)=="function"){
            dcsPageTrack("WT.si_n","添加银行卡",false,"WT.si_x","验证信息",false,"WT.pn_sku",bankName,false,"WT.pc","网银",false);
        }
        $("#modal3").modal('show');
        validateForm.autoSubmit = true;
        btn.setEnabled($('#J_submitButton'));
    }
}

//日期检查
function validDateCheckFunc(value) {
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

    var _selectyear = $("#validDate").val().substring(0, 4);
    var _selectmonth = $("#validDate").val().substring(5, 7);
    var _selectday = $("#validDate").val().substring(8, 10);
    if($('#isYjyx').prop("checked")){
        $("#expiredate").val("29990101");
    }else{
        $("#expiredate").val(""+_selectyear+_selectmonth+_selectday);
    }

    var _selecttime = new Date(_selectyear, parseInt(_selectmonth) - 1, _selectday);

    if(!$('#isYjyx').prop("checked") && _selecttime <= _nowDate){
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

        if($('#isYjyx').prop("checked")){
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
        validateForm.setMessage('validDateCheck',msg);
        return false;
    }
    return true;
}

function timeUnLimitedClick()
{
    if($(this).prop('checked')){
        $('#validDate').val('');
        $('#validDate').attr('disabled','disabled');
        $('#validDate').css({ 'cursor':'not-allowed'});
    }else{
        $('#validDate').removeAttr('disabled');
        $('#validDate').css({ 'cursor':'default'});
    }
}

/**
 * 弹出框日期永久有效
 */
function windowtimeUnLimitedClick()
{
    if($(this).prop('checked')){
        $('#dateshow').val('');
        $('#dateshow').attr('disabled','disabled');
        $('#dateshow').css({ 'cursor':'not-allowed'});
    }else{
        $('#dateshow').removeAttr('disabled');
        $('#dateshow').css({ 'cursor':'default'});
    }
}

function regContactShow(){

    validateForm.hideError();
    $('#validDate').val("");
    var idType = $("#identityType").val()==""?"0":$("#identityType").val();
    var identityNo= $("#identityNo").val();

    var birth,years,now,age;
    if(idType=='0' && identityNo!=''){
        now = new Date();
        if(identityNo.length == 15){
            if((parseInt(identityNo.substr(14,1))&1)==0){
                 $("#gender").val('2');
            } else{
                 $("#gender").val('1') ;
            }
            birth = new Date(1900+identityNo.substr(6,2),identityNo.substr(8,2) - 1,identityNo.substr(10,2));
            years = (now.getTime() - birth.getTime()) / ( 365 * 24 * 60 * 60 * 1000);
        }
        if(identityNo.length == 18){
            if((parseInt(identityNo.substr(16,1))&1)==0){
                $("#gender").val('2');
            } else{
                $("#gender").val('1') ;
            }
            birth = new Date(identityNo.substring(6,10),identityNo.substring(10,12) - 1,identityNo.substring(12,14)),
                years = (now.getTime() - birth.getTime()) / ( 365 * 24 * 60 * 60 * 1000);
        }

        if(years<46){
            $("#isYjyx").attr("disabled",true);
            $("#isYjyx").attr("checked",false);
        }else{
            if(years>70){
                clientAge = true;
                if(!hasOfferClientInfo){
                    $("#modal5").modal("show");
                    checkLayer();
                }
                $("#year70").val(true);
            }else{
                clientAge = false;
                $("#year70").val(false);
            }
            $("#isYjyx").attr("disabled",false);
        }
    }else{
        clientAge = false;
        $("#year70").val(false);
        $("#isYjyx").attr("disabled",false);
        $("#isYjyx").attr("checked",false);
    }
    if($("#isYjyx").prop('checked')){
        $('#validDate').val('');
        $('#validDate').attr('disabled','disabled');
        $('#validDate').css({ 'cursor':'not-allowed'});
    }else{
        $('#validDate').removeAttr('disabled');
        $('#validDate').css({ 'cursor':'default'});
    }
}

//变更银行卡以后，修改相关的提示信息
function changeBankCardNote(defaultMethod,currentBank){
    verifyToken = "";
    $("#verifyToken").val("");
    $("#mobilePhone").val("");
    $("#verifyCode").val("");
    $("#tradePassWord").val("");
    $("#tradePasswdConfirm").val("");
    clearCountDown();
    var discountMsg = defaultMethod.discountMsg;
    $("#discountMsg").html(discountMsg.showMsg);

    var limitMsg = defaultMethod.limitMsg;
    //如果是支付宝、天天盈这种，支付限额是链接
    if(defaultMethod.capitalMode == "P" || defaultMethod.capitalMode == "H"){
        $("#limitMsg").html("<a href='"+limitMsg.showMsg+"' style='position: relative;' target='_blank'>点击查看具体银行支付额度</a>");
    }else{
        $("#limitMsg").html(limitMsg.showMsg);
    }

    var bindMsg = defaultMethod.bindMsg;
    $("#bindMsg").html(bindMsg.showMsg);

    var otherMsg = defaultMethod.otherMsg;
    $("#otherMsg").html(otherMsg.showMsg);

    //修改手机号,只有工农中建有,对应bankno 002 003 004 005
    var bankNoCurrent = currentBank.bankNo;
    if(bankNoCurrent == "002" || bankNoCurrent == "003" || bankNoCurrent == "004" || bankNoCurrent == "005"){
        var linkUrl = "";
        if(bankNoCurrent == "002"){
            linkUrl = "http://www.gffunds.com.cn/khfw/bzzx/cjwt/wsjy/ghk/201405/t20140526_36891_help.htm";
        }else if(bankNoCurrent == "003"){
            linkUrl = "http://www.gffunds.com.cn/khfw/bzzx/cjwt/wsjy/nhk/201405/t20140526_36892.htm";
        }else if(bankNoCurrent == "004"){
            linkUrl = "http://www.gffunds.com.cn/khfw/bzzx/cjwt/wsjy/zgyhk/201405/t20140526_36894.htm";
        }else if(bankNoCurrent == "005"){
            linkUrl = "http://www.gffunds.com.cn/khfw/bzzx/cjwt/wsjy/jhk/201405/t20140526_36893.htm";
        }
        $("#imgTips").html("<i></i><a href='"+linkUrl+"' target='_blank'>如何修改手机验证？</a>");
        $("#updateTelImg").css("display","");
//        $("#imgTips").css("display","block");
        $("#imgTips").addClass("phone-tips");
    }else{
        $("#updateTelImg").css("display","none");
        $("#imgTips").css("display","none");
        $("#imgTips").removeClass();
    }

    //协议，只有快捷有协议，并且固定
    if(defaultMethod.method == "D"){
        $("#xieyi").css("display","");
        $('#agreeCheckbox').prop("checked",false);
        var protocalListContent = "<a href='http://www.gffunds.com.cn/etrade/fw/jygz/wsjygz/201312/t20131225_33765.htm' target='_blank' id='agreeA'>《广发基金管理有限公司“一键支付”业务协议》</a>";
        $("#qyxy").html(protocalListContent);
    }else{
        //如果协议为空，则不用展示协议，也不用勾选。
        $("#xieyi").css("display","none");
        $('#agreeCheckbox').prop("checked",true);
    }

    var guideTips = defaultMethod.guideTips;
    if(guideTips != undefined){
        $("#guideTips").text(guideTips);
    }else{
        $("#guideTips").text("");
    }
    $("#bankNo").val(currentBank.bankNo);
    $("#bankName").val(currentBank.bankName);
    $("#capitalMode").val(defaultMethod.capitalMode);
    $("#verifyMethod").val(defaultMethod.method);

    if(defaultMethod.capitalMode == "I" && currentBank.bankNo == "012"){
        //如果是光大通联，需要弹出提示框
        $("#gdyhTipsView").css("display","");
        $("#zhzlTipsView").css("display","none");
        $("#modal4").modal("show");
    }else if(defaultMethod.capitalMode == "D" && currentBank.bankNo == "007"){
        //如果是招商银行直连，需要弹出对应提示框
        $("#gdyhTipsView").css("display","none");
        $("#zhzlTipsView").css("display","");
        $("#modal4").modal("show");
    }else if(currentBank.bankNo == "034"){
        //邮政弹出提示框
        $("#modal6").modal("show");
    }
    //根据不同类型（账户类、网银、快捷），需要验证不同的字段
    validateForm.addField({
        name : 'tradePassWord',
        display:'交易密码',
        posTarget:$("#passwdTipsSpan"),
        rules :  'required|no_blank|alpha_dash|min_length[6]|max_length[8]|callback_passwords'
    });
    validateForm.addField({
        name : 'tradePasswdConfirm',
        display:'确认密码',
        rules :  'required|matches[tradePassWord]'
    });
    if(payType == "0"){
        //如果是账户类的支付方式（支付宝、天天盈），只需要验证协议。
        validateForm.deleteField('bankCardNo');
        validateForm.deleteField('mobilePhone');
        validateForm.deleteField('verifyCode');
    }else{
        if(payType == "1"){
            //如果是网银，需要验证（卡号、协议）
            validateForm.deleteField('mobilePhone');
            validateForm.deleteField('verifyCode');
            validateForm.addField({
                name : 'bankCardNo',
                display:'银行卡号',
                rules : 'required'
            });
        }else if(payType == "2"){
            //如果是快捷支付，需要验证(卡号、协议、手机号、验证码)
            validateForm.addField({
                name : 'bankCardNo',
                display:'银行卡号',
                rules : 'required'
            });
            validateForm.addField({
                name : 'mobilePhone',
                display:'手机号码',
                posTarget:$("#getValidCode"),
                rules : 'required|valid_tel_phone'
            });
            validateForm.addField({
                name : 'verifyCode',
                display:'验证码',
                rules : 'required|numeric'
            });
        }
    }
    if(typeof(dcsPageTrack)=="function"){
        var bankName = $("#bankName").val();
        var payMethod = "";
        if(defaultMethod.method == "D"){
            payMethod = "快捷";
        }else{
            payMethod = "网银";
        }
        dcsPageTrack("WT.si_n","添加银行卡",false,"WT.si_x","银行卡信息输入",false,"WT.pn_sku",bankName,false,"WT.pc",payMethod,false);
    }
}

//改了银行以后，清空所有提示，重新再进行验证
function hideErrors(){
    var fields = validateForm.fields;
    for (var sProp in fields) {
        validateForm.hideError(sProp);
    }
}

/**
 * 根据选择的内容，找到对应的银行及渠道
 * @param msg
 * @returns {string}
 */
function getSelectedBank(msg){
    var content = "";
    for (var info in bankListShow) {
        var infoArray = info.split(",");
        var bankNo = infoArray[0];
        var bankName = infoArray[1];
        var method = infoArray[2];
        if(msg.indexOf(bankNo) != -1 && msg.indexOf(bankName) != -1 && msg.indexOf(method) != -1){
            content = bankListShow[info];
            break;
        }else{
            continue;
        }
    }
    return content;
}

/**
 * 设置邮政编码
 * @returns {*}
 */
function setZipCode(){
    var districtList = $(".city-picker-span").find(".title").find(".select-item");
    var count = 0;
    var districtNo= "";
    for(var selectItem in districtList){
        if(count < 3){
            var value = districtList[selectItem].dataset.count;
            var dataCode = districtList[selectItem].dataset.code;
            if(value == "province"){
                $("#province").val(dataCode);
            }else if(value == "city"){
                $("#cityno").val(dataCode);
            }else if(value == "district"){
                $("#districtno").val(dataCode);
                districtNo = dataCode;
            }

        }else{
            break;
        }
        count ++;
    }
    $.ajax({
        type: "post",
        url: "/main/account/bindCard/getZipCode?districtNo="+districtNo,
        async:false,
        success: function (msg) {
            $("#zipno").val(msg.zipCode);
            var addressPre = $(".title").text().replace(new RegExp("/",'gm'),'');
            $("#address").val(addressPre+$("#address").val());
        }
    });
}

//发送短信验证码(大于70岁，经办人短信)
function getVerifyCode() {
    $("#verifyCodeMsg").html("");
    if(frmLayerForm.validateField('contphone') !=0)
    {
        return;
    }
    smsVFCodeTipsObjWindow = btn.disable($("#getContackValidCode"),{
        color:          '#C0C0C0',     //disable后字体的颜色
        height:'28px',
        setBtnLoad:     false        //是否显示Loading的gif图片
    });
    $.ajax({
        type: "post",
        url: "/main/register/verifyCode",
        data: {"mobilePhone":$('#contphoneWindow').val()},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                //发送失败
                $("#verifyCodeMsg").html(msgJson.returnmsg);
                btn.enable($("#getContackValidCode"));
            } else {
                $(smsVFCodeTipsObjWindow).html('（'+(secondCountWindow--)+'秒后重新获取）');
                nIntervIdWindow = setInterval(CountDownWindow, 1000);
            }
        }
    });
}

//校验经办人手机验证是否成功
function checkVerifyCode(){
    btn.setDisabled($('#L_submitButton'));
    $.ajax({
        type: "post",
        url: "/main/checkVerifyCode",
        async:false,
        data: {"mobileNo":$('#contphoneWindow').val(),"verifyCode":$("#contackVerifyCode").val()},
        success: function (msg) {
            var msgJson = msg;
            btn.setEnabled($('#L_submitButton'));
            if (!msgJson.issuccess) {
                //发送失败
                $("#verifyCodeMsg").html(msgJson.returnmsg);
            } else {
                hasOfferClientInfo = true;
                //将经办人信息赋值到绑卡的form中。
                $("#contact").val($("#contactWindow").val());
                $("#conttype").val($("#conttypeWindow").val());
                $("#contno").val($("#contnoWindow").val());
                $("#contacttimelimited").val($("#contacttimelimitedWindow").val());
                $("#relationShip").val($("#relationshipWindow").val());
                $("#contphone").val($("#contphoneWindow").val());
                $("#modal5").modal("hide");
                $("#showInfoMsg").html("经办人信息录入成功。");
                $("#toUpdateLever").css("display","");
                $("#addNewBankCard").css("display","none");
                $("#modal").modal('show');
            }
        }
    });
}

//短信90秒倒计时
function CountDownWindow(){
    $(smsVFCodeTipsObjWindow).html('<span class="text-red text-fontsize16">（'+secondCountWindow+'秒后重新获取）</span>');
    if(--secondCountWindow<0){
        clearCountDownWindow();
    }
}
//清除短信90秒倒计时任务
function clearCountDownWindow(){
    btn.enable($("#getContackValidCode"));
    if(smsVFCodeTipsObjWindow != undefined){
        $(smsVFCodeTipsObjWindow).html('');
    }
    clearInterval(nIntervIdWindow);
    secondCountWindow = 90;
}

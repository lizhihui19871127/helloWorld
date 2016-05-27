var util = require("common:widget/util/util.js"),
    datepicker = require("common:widget/datepicker/datepicker.js"),
    juicer = require("common:widget/juicer/juicer.js"),
    dialog = require("common:widget/dialog/dialog.js"),
    btn = require("common:widget/btn/btn.js"),
    menuCookie = require("wtgf:widget/menuCookie/menuCookie.js"),
    FormValidator = require("common:widget/validate/validate.js");
var $containerBank = $('.container-bank');
var bankInfo = null;
var bankListShow = {};
var hasPwd = false;
var verifyToken = "";
var nIntervId;
var secondCount = 90;
var smsVFCodeTipsObj;
var payType = null;//支付类型（账户类0、网银1、快捷支付2）
//验证表单
var validateForm = null;
var main = (function(){
    var _init = function(){
        menuCookie.cookie.setMenu("r5","c50");
        //初始化表单验证
        validateForm = new FormValidator(
            'frm',
            [{
                name:'agreeCheckbox',
                rules: 'callback_agreeProx',
                posTarget:$("#qyxy")
            }
            ],
            {
                success : function(datas,evt){  //异步提交请求
                    $("#bankCardNo").val($("#bankCardNo").val().replace(/[^\d]/g,''));
                    if(!checkBankCardExiste()){
                        return false;
                    }
                    submitForm();
                    return  true
                }
            }
        );

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
        canBindAnotherCard();
        loadBankInfo();
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
            $("#modal5").modal("hide");
        });

        //取消按钮
        $("#yzCancelBtn").on("click",function(){
            $("#modal5").modal("hide");
        });

        //去掉空格
        $("#bankCardNo").on("blur",function(){
            $("#bankCardNo").val($("#bankCardNo").val().replace(/[^\d]/g,''));
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
                //如果是已经设置过交易密码了的，不需要再设置
                if(data.hasPwd){
                    $("#pwdApply").css("display","none");
                    $("#pwd").css("display","none");
                }
                hasPwd = data.hasPwd;
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
            "bankCardNo": $('#bankCardNo').val(),"mobilePhone":$('#mobilePhone').val()},
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

function checkBankCardExiste(){
    btn.setDisabled($('#J_submitButton'));
    //如果是支付宝、汇付这种账户类的，不用验证。
    var capitalMode = $('#capitalMode').val();
    if(capitalMode == "P" || capitalMode == "H"){
        btn.setEnabled($('#J_submitButton'));
        return true;
    }
    var b = false;
    var bankCardNo = $('#bankCardNo').val();
    $.ajax({
        type: "get",
        url: "/main/bankCards/"+bankCardNo+"/"+capitalMode+"/isExists",
        async:false,
        success: function (msg) {
            var msgJson = msg;
            if(!msgJson.issuccess){
                $("#showInfoMsg").html(msgJson.returnmsg);
                $("#toUpdateLever").css("display","");
                $("#addNewBankCard").css("display","none");
                $("#modal2").modal("hide");
                $("#modal3").modal("hide");
                $("#modal").modal('show');
                b = false;
                btn.setEnabled($('#J_submitButton'));
            }else if (msgJson.isExists) {
                //卡已经存在
                $("#showInfoMsg").html("该卡已绑定，不能重复绑卡。");
                $("#toUpdateLever").css("display","");
                $("#addNewBankCard").css("display","none");
                $("#modal2").modal("hide");
                $("#modal3").modal("hide");
                $("#modal").modal('show');
                b = false;
                btn.setEnabled($('#J_submitButton'));
            }else{
                //如果是快捷，判断是否已经获得正确的短信验证码。
                var verifyMethod = $("#verifyMethod").val();
                if(verifyMethod == "D"){
                    if(verifyToken == null || verifyToken == ""){
                        $("#showInfoMsg").html("请获取短信验证码。");
                        $("#toUpdateLever").css("display","");
                        $("#addNewBankCard").css("display","none");
                        $("#modal2").modal("hide");
                        $("#modal3").modal("hide");
                        $("#modal").modal('show');
                        b = false;
                        btn.setEnabled($('#J_submitButton'));
                    }else{
                        b = true;
                    }
                }else{
                    b = true;
                }
            }
        }
    });
    return b;
}

function submitForm(){
    var bankName = $("#bankName").val();
    menuCookie.cookie.setMenu("r5","c50");
    var verifyMethod = $("#verifyMethod").val();
    if(verifyMethod == "D"){
        if(typeof(dcsPageTrack)=="function"){
            dcsPageTrack("WT.si_n","添加银行卡",false,"WT.si_x","验证信息",false,"WT.pn_sku",bankName,false,"WT.pc","快捷",false);
        }
        validateForm.autoSubmit = false;
        var tradePassWord = $("#tradePassWord").val();
        $.ajax({
            type: "post",
            url: "/main/bankCards/bindCard",
            data: {"bankNo": $('#bankNo').val(),"capitalMode":$('#capitalMode').val(),"verifyMethod":$("#verifyMethod").val(),
                "bankCardNo": $('#bankCardNo').val(),"verifyCode":$("#verifyCode").val(),"mobilePhone":$("#mobilePhone").val(),"tradePassWord":tradePassWord,
                "verifySequence":$('#verifyToken').val()},
            success: function (msg) {
                var msgJson = msg;
                if(msgJson.issuccess){
                    var verifySequence = $('#verifyToken').val();
                    window.location.href="/main/bankCards/"+verifySequence+"/success";
                }else{
                    //失败了，要弹出失败框，展示失败原因，如果此支付方式只有快捷没有网银，直接弹出错误信息。如果有网银支付，则弹出网银框，还可以用网银支付。
                    var hasWeb = false;
                    var t = $("#bankInfo").html();
                    //根据选择的银行卡信息，展示银行卡提示信息
                    var selectedBankInfo = getSelectedBank(t);
                    var verifyMethod = selectedBankInfo.verifyMethod;
                    for(var i=0;i < verifyMethod.length;i++){
                        var defaultMethod = verifyMethod[i];
                        if(defaultMethod.method == 'W'){
                            hasWeb = true;
                            break;
                        }
                    }
                    var returnmsg = msgJson.returnmsg;
                    if(hasWeb){
                        $("#showErrormsg").html(returnmsg);
                        $("#modal2").modal('show');
                    }else{
                        $("#showInfoMsg").html(returnmsg);
                        $("#toUpdateLever").css("display","");
                        $("#addNewBankCard").css("display","none");
                        $("#modal").modal('show');
                    }
                    btn.setEnabled($('#J_submitButton'));
                    if(typeof(dcsPageTrack)=="function"){
                        dcsPageTrack("WT.si_n","添加银行卡",false,"WT.si_x","绑卡失败",false,"WT.pn_sku",bankName,false,"WT.pc","快捷",false,"WT.err_type",returnmsg,false);
                    }
                }
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
        $("#modal5").modal("show");
    }
    //根据不同类型（账户类、网银、快捷），需要验证不同的字段
    if(!hasPwd){
        //如果需要设置交易密码，就必须经过校验。
        {
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
        }
    }
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
 * 判断是否可以再绑卡
 * @returns {boolean}
 */
function canBindAnotherCard(){
    $.ajax({
        type: "get",
        url: "/main/canBindAnotherCard",
        async:false,
        data: "",
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                $("#showInfoMsg").html(msgJson.returnmsg);
                $("#toUpdateLever").css("display","");
                $("#addNewBankCard").css("display","none");
                $("#modal").modal('show');
            }else{
                var canBindAnotherCard = msgJson.canBindAnotherCard;
                if(!canBindAnotherCard){
                    $("#showInfoMsg").html("开户当天只能绑定一张银行卡。");
                    $("#toUpdateLever").css("display","");
                    $("#addNewBankCard").css("display","none");
                    $("#modal").modal('show');
                    btn.setDisabled($('#J_submitButton'));
                }
            }
        }
    });
}
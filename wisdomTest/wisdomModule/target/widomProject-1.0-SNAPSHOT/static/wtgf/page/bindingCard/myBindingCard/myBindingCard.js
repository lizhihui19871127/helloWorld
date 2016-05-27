var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js"),
	dialog = require("common:widget/dialog/dialog.js"),
    btn = require("common:widget/btn/btn.js"),
    menuCookie = require("wtgf:widget/menuCookie/menuCookie.js"),
    FormValidator = require("common:widget/validate/validate.js");
var unsignFlag;//如果是1说明是换卡时需要解绑；如果是2说明是直接解绑.
var verifySequence = "";
var nIntervId;
var secondCount = 90;
var smsVFCodeTipsObj;
var $containerBank = $('.container-bank');
var main = (function(){
    var _init = function(){
        menuCookie.cookie.setMenu("r5","c51");
        $.ajaxSetup({ cache: false });
    };
    var bindEvent = function(){

        var phoneTipsTime;
        $containerBank.on('mouseenter', '.types_content .zf_fanshi .tishi', function(){
            $containerBank.find(".phone-tips").hide();
            $(this).find('.phone-tips').show();
            clearTimeout(phoneTipsTime);
        });

        $containerBank.on('mouseleave', '.types_content .zf_fanshi .tishi', function(){
            var $this = $(this);
            phoneTipsTime = setTimeout(function(){
                $this.find('.phone-tips').hide();
            },500);
        });

        //点击提升额度按钮
        $(".tsed").click(function(){
            $("#modal").modal("show");
            var tradeAcco = $(this).parent().find("input:eq(0)").val();
            var capitalMode = $(this).parent().find("input:eq(3)").val();
            var bankNo = $(this).parent().find("input:eq(4)").val();
            var bankCardNo = $(this).parent().find("input:eq(6)").val();
            $("#bankNo").val(bankNo);
            $("#capitalMode").val(capitalMode);
            $("#bankCardNo").val(bankCardNo);
            $("#tradeAcco").val(tradeAcco);
        });

        //取消提升额度
        $("#tsedCancelBtn").click(function(){
            //提升额度取消
            $("#modal").modal("hide");
        });

        //提升额度
        $("#tsedBtn").click(function(){
            $("#modal").modal("hide");
            if(typeof(dcsPageTrack)=="function"){
                dcsPageTrack("WT.si_n","银行卡提高限额",false,"WT.si_x","提高限额确认",false);
            }
            var tradeAcco = $("#tradeAcco").val();
            upgradeQuickPay(tradeAcco);
        });

        //点击删卡按钮
        $(".sk").click(function(){
            $("#modal3").modal("show");
            var tradeAcco = $(this).parent().find("input:eq(0)").val();
            var capitalMode = $(this).parent().find("input:eq(3)").val();
            var bankNo = $(this).parent().find("input:eq(4)").val();
            var bankCardNo = $(this).parent().find("input:eq(6)").val();
            $("#bankNo").val(bankNo);
            $("#capitalMode").val(capitalMode);
            $("#bankCardNo").val(bankCardNo);
            $("#tradeAcco").val(tradeAcco);
            if(typeof(dcsPageTrack)=="function"){
                dcsPageTrack("WT.si_n","银行卡删卡",false,"WT.si_x","提示删卡",false);
            }
        });

        //取消删卡行为
        $("#skCancelBtn").click(function(){
            $("#modal3").modal("hide");
        });

        //确定删卡
        $("#skBtn").click(function(){
            var tradeAcco = $("#tradeAcco").val();
            var capitalMode = $("#capitalMode").val();
            var bankCardNo = $("#bankCardNo").val();
            btn.setDisabled($("#skBtn"));
            deleteCard(tradeAcco,capitalMode,bankCardNo);
        });

        //点击换卡按钮
        $(".hk").click(function(){
            var tradeAcco = $(this).parent().find("input:eq(0)").val();
            var chgQkPayFlag = $(this).parent().find("input:eq(2)").val();
            var capitalMode = $(this).parent().find("input:eq(3)").val();
            var bankNo = $(this).parent().find("input:eq(4)").val();
            var bankCardNo = $(this).parent().find("input:eq(6)").val();
            $("#bankNo").val(bankNo);
            $("#capitalMode").val(capitalMode);
            $("#bankCardNo").val(bankCardNo);
            checkreplacecard(tradeAcco,chgQkPayFlag,capitalMode,bankNo);
        });

        //点击解除签约按钮
        $("#jcqyBtn").click(function(){
            menuCookie.cookie.setMenu("r5","c51");
            $("#modal4").modal("hide");
            var tradeAcco = $("#tradeAcco").val();
            var bankCardNo = $("#bankCardNo").val();
            var capitalMode = $("#capitalMode").val();
            var b = unsignquickpay(tradeAcco,bankCardNo,capitalMode);
            if(b){
                if(unsignFlag == 1){
                    //解除快捷绑定成功，才进行换卡后台逻辑
                    replacecardpre();
                }else if(unsignFlag == 2){
                    //解除绑定成功；刷新页面
                    window.location.reload();
                }
            }
        });

        $("#reloadPage").click(function(){
            menuCookie.cookie.setMenu("r5","c51");
            window.location.reload();
        });

        //点击取消解除签约协议按钮
        $("#jcqyCancelBtn").click(function(){
            $("#modal4").modal("hide");
        });

        //开通一键支付
        $(".ktyjzf").click(function(){
            menuCookie.cookie.setMenu("r5","c51");
            var tradeAcco = $(this).parent().find("input:eq(0)").val();
            $("#tradeAcco").val(tradeAcco);
            openquickpay();
        });

        //关闭快捷支付
        $(".gbkj").click(function(){
            menuCookie.cookie.setMenu("r5","c51");
            unsignFlag = 2;
            var tradeAcco = $(this).parent().find("input:eq(0)").val();
            var capitalMode = $(this).parent().find("input:eq(3)").val();
            var bankNo = $(this).parent().find("input:eq(4)").val();
            var bankCardNo = $(this).parent().find("input:eq(6)").val();
            $("#tradeAcco").val(tradeAcco);
            $("#capitalMode").val(capitalMode);
            $("#bankNo").val(bankNo);
            $("#bankCardNo").val(bankCardNo);
            $("#modal4").modal("show");
        });

        //选择银行卡类型
        $(".getType").each(function() {
            $(this).on("mouseenter",function(){
                var num=$(this).index();
                $(this).addClass('current').siblings('li').removeClass('current');
                $(this).parent().next("div").find(".common_style:eq("+num+")").addClass('current').siblings("div").removeClass('current');
            });
        });

        //开通网银支付
        $(".ktwy").click(function(){
            menuCookie.cookie.setMenu("r5","c51");
            var tradeAcco = $(this).parent().find("input:eq(0)").val();
            var capitalMode = $(this).parent().find("input:eq(3)").val();
            var bankNo = $(this).parent().find("input:eq(4)").val();
            var bankCardNo = $(this).parent().find("input:eq(6)").val();
            $("#capitalMode").val(capitalMode);
            $("#bankNo").val(bankNo);
            $("#bankCardNo").val(bankCardNo);
            $("#tradeAcco").val(tradeAcco);
            upgradeQuickPay(tradeAcco);
        });

        //开通快捷支付
        $(".ktkj").click(function(){
            menuCookie.cookie.setMenu("r5","c51");
            var tradeAcco = $(this).parent().find("input:eq(0)").val();
            var verifyMethod = $(this).parent().find("input:eq(1)").val();
            if(verifyMethod == "DATAFLOW"){
                var bankName = $(this).parent().find("input:eq(5)").val();
                var bankCardShow = $(this).parent().find("input:eq(7)").val();
                $("#tradeAcco").val(tradeAcco);
                $("#mobileNo").val("");
                $("#verifyCode").val("");
                $("#verifySequence").val("");
                clearCountDown();
                $("#bankInfoShow").html(bankName+"["+bankCardShow+"]");
                var capitalMode = $(this).parent().find("input:eq(3)").val();
                var bankNo = $(this).parent().find("input:eq(4)").val();
                var bankCardNo = $(this).parent().find("input:eq(6)").val();
                $("#bankNo").val(bankNo);
                $("#capitalMode").val(capitalMode);
                $("#bankCardNo").val(bankCardNo);
                $("#telMsg").hide();
                $("#verifyCodeMsg").hide();
                $("#agreeCheckMsg").hide();
                btn.setEnabled($("#qrkt"));
                $("#modal7").modal("show");
                if(typeof(dcsPageTrack)=="function"){
                    dcsPageTrack("WT.si_n","银行卡开通快捷",false,"WT.si_x","输入信息",false);
                }
            }else{
                var capitalMode = $(this).parent().find("input:eq(3)").val();
                var bankNo = $(this).parent().find("input:eq(4)").val();
                var bankCardNo = $(this).parent().find("input:eq(6)").val();
                $("#bankNo").val(bankNo);
                $("#capitalMode").val(capitalMode);
                $("#bankCardNo").val(bankCardNo);
                $("#tradeAcco").val(tradeAcco);
                if(typeof(dcsPageTrack)=="function"){
                    dcsPageTrack("WT.si_n","银行卡开通快捷",false,"WT.si_x","输入信息",false);
                }
                upgradeQuickPay(tradeAcco);
            }
        });

        //确认开通快捷
        $("#qrkt").click(function(){
            menuCookie.cookie.setMenu("r5","c51");
            var mobileNo = $("#mobileNo").val();
            var verifyCode = $("#verifyCode").val();
            var v= $('#agreeCheckbox').prop("checked");
            var verifySequence = $("#verifySequence").val();
            if(mobileNo == ""){
                $("#telMsg").html("手机号码不能为空！");
                $("#telMsg").show();
                return false;
            }else{
                $("#telMsg").hide();
            }
            if(verifyCode == ""){
                $("#verifyCodeMsg").html("手机校验码不能为空！");
                $("#verifyCodeMsg").show();
                return false;
            }else{
                $("#verifyCodeMsg").hide();
            }
            if(!v){
                $("#agreeCheckMsg").html("请仔细阅读并同意相关协议!");
                $("#agreeCheckMsg").show();
                return false;
            }else{
                $("#agreeCheckMsg").hide();
            }
            if(verifySequence == ""){
                $("#telMsg").html("请获取手机验证码！");
                $("#telMsg").show();
                return false;
            }else{
                $("#telMsg").hide();
                btn.setDisabled($('#qrkt'));
                submitForm();
            }
        });

        $("#getValidCode").on('click',function(){
            var mobileNo = $("#mobileNo").val();
            if(mobileNo == ""){
                $("#telMsg").html("手机号码不能为空！");
                $("#telMsg").show();
            }else{
                $("#telMsg").html("");
                $("#telMsg").hide();
                smsVFCodeBtnClick();
            }
        });

        //关闭窗口事件
        $('#modal2').on('hide.bs.modal', function (){
            menuCookie.cookie.setMenu("r5","c51");
            window.location.reload();
        });

        //关闭窗口事件
        $('#modal8').on('hide.bs.modal', function (){
            menuCookie.cookie.setMenu("r5","c51");
            window.location.reload();
        });
    };

    //提升额度方法
    function upgradeQuickPay(tradeAcco){
        //提升额度方法action
        menuCookie.cookie.setMenu("r5","c51");
        $("#modal2").modal("show");
        $("#verifyBusiness").val("webSign");
        $("#frm").attr("action","/main/bankCards/"+tradeAcco+"/webSign");
        $("#frm").submit();
    }

    //删卡方法
    function deleteCard(tradeAcco,capitalMode,bankCardNo){
        menuCookie.cookie.setMenu("r5","c51");
        $.ajax({
            type: "post",
            url: "/main/bankCards/"+tradeAcco+"/deleteCard",
            data: {"tradeAcco":tradeAcco,"bankCardNo":bankCardNo,"capitalMode":capitalMode},
            success: function (data) {
                var isSuccess = data.issuccess;
                $("#modal3").modal("hide");
                if(isSuccess){
                    if(typeof(dcsPageTrack)=="function"){
                        dcsPageTrack("WT.si_n","银行卡删卡",false,"WT.si_x","删卡成功",false);
                    }
                    //删卡成功,刷新页面
                    $("#showInfoMsg2").html(data.returnmsg);
                    $("#modal8").modal("show");
                    btn.setEnabled($("#skBtn"));
                }else{
                    //删卡失败，弹出错误原因
                    var returnMsg = data.returnmsg;
                    $("#showInfoMsg").html(returnMsg);
                    $("#modal0").modal("show");
                    btn.setEnabled($("#skBtn"));
                    if(typeof(dcsPageTrack)=="function"){
                        dcsPageTrack("WT.si_n","银行卡删卡",false,"WT.si_x","删卡失败",false, "WT.err_type",returnMsg,false);
                    }
                }
            }
        });
    }

    //检查是否可以换卡
    function checkreplacecard(tradeAcco,chgQkPayFlag,capitalMode,bankNo){
        menuCookie.cookie.setMenu("r5","c51");
        //1.1判断是否可以换卡
        $("#tradeAcco").val(tradeAcco);
        $.ajax({
            type: "post",
            url: "/main/bankCards/"+tradeAcco+"/changeCardAuditResult",
            async:false,
            success: function (data) {
                if(data.issuccess){
                    var canReplace = data.canReplace;
                    if(canReplace){
                        // 可以换卡
                        var newBankCardNo = data.newBankCardNo;
                        $("#newBankCardNo").val(newBankCardNo);
                        //1.2判断是否开通了快捷支付
                        if(chgQkPayFlag == "OPEN"){
                            //如果是招行直连，换卡的时候，判断是否有协议，如果有，需要去银行解除绑定。
                            //其他支付方式，直接在线解绑，然后进入换卡页面。
                            if(capitalMode == "D" && bankNo == "007"){
                                $("#modal5").modal("show");
                            }else{
                                unsignFlag = 1;
                                $("#modal4").modal("show");
                            }
                        }else{
                            //如果没有开通快捷支付相关协议
                            //进入换卡后台逻辑
                            replacecardpre();
                        }
                    }else{
                        //目前不管什么其他原因，全部显示需要提交资料进行审核
                        $("#modal6").modal("show");
                    }
                }else{
                    //程序处理错误
                    $("#modal6").modal("show");
                }
            }
        });
    }

    //解除快捷支付
    function unsignquickpay(tradeAcco,bankCardNo,capitalMode){
        menuCookie.cookie.setMenu("r5","c51");
        var b = false;
        $.ajax({
            type: "post",
            url: "/main/bankCards/"+tradeAcco+"/unSign",
            data:{"bankCardNo":bankCardNo,"capitalMode":capitalMode},
            async:false,
            success: function (data) {
                var isSuccess = data.issuccess;
                $("#modal4").modal("hide");
                if(isSuccess){
                    //解除协议成功
                    b = true;
                }else{
                    //解除协议失败，弹出原因
                    var returnMsg = data.returnmsg;
                    $("#showInfoMsg").html(returnMsg);
                    $("#modal0").modal("show");
                    b = false;
                }
            }
        });
        return b;
    }

    //跳转到开通一键支付后台
    function openquickpay(){
        menuCookie.cookie.setMenu("r5","c51");
        //开通一键支付后台action
        $("#verifyBusiness").val("openQuickPay");
        $("#frm").attr("action","/main/mycards/openquickpaypre");
        $("#frm").submit();
    }

    //跳转到换卡后台逻辑
    function replacecardpre(){
        //换卡action
        $("#frm").attr("target","_self");
        $("#verifyBusiness").val("changeCard");
        $("#frm").attr("action","/main/bankCards/changeCard/pre");
        $("#frm").submit();
        $("#frm").attr("target","_blank");
    }

    //发送短信验证码
    function smsVFCodeBtnClick() {
        smsVFCodeTipsObj = btn.disable($("#getValidCode"),{
            color:          '#C0C0C0',     //disable后字体的颜色
            setBtnLoad:     false        //是否显示Loading的gif图片
        });
        $.ajax({
            type: "post",
            url: "/main/bankCards/verifyCode",
            data: {"bankNo": $('#bankNo').val(),"capitalMode":$('#capitalMode').val(),
                "bankCardNo": $('#bankCardNo').val(),"mobilePhone":$('#mobileNo').val()},
            success: function (msg) {
                var msgJson = msg;
                if (!msgJson.issuccess) {
                    //发送失败
                    $("#verifyCodeMsg").html(msgJson.returnmsg);
                    $("#verifyCodeMsg").show();
                    btn.enable($("#getValidCode"));
                } else {
                    verifySequence = msgJson.verifySequence;
                    $("#verifySequence").val(verifySequence);
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
            $(smsVFCodeTipsObj).html("");
        }
        clearInterval(nIntervId);
        secondCount = 90;
    }

    function submitForm(){
        var tradeAcco = $("#tradeAcco").val();
        var mobileNo = $("#mobileNo").val();
        var verifyCode = $("#verifyCode").val();
        var verifySequence = $("#verifySequence").val();
        var bankCardNo = $("#bankCardNo").val();
        var capitalMode = $("#capitalMode").val();
        $.ajax({
            type: "post",
            url: "/main/bankCards/"+tradeAcco+"/smgSign",
            data: {"verifyCode":verifyCode,"verifySequence":verifySequence,"mobilePhone":mobileNo,"capitalMode":capitalMode,"bankCardNo":bankCardNo},
            success: function (msg) {
                $("#modal7").modal("hide");
                if(msg.issuccess){
                    if(typeof(dcsPageTrack)=="function"){
                        dcsPageTrack("WT.si_n","银行卡开通快捷",false,"WT.si_x","开通快捷成功",false);
                    }
                    $("#showInfoMsg2").html(msg.returnmsg);
                    $("#modal8").modal("show");
                }else{
                    $("#showInfoMsg").html(msg.returnmsg);
                    $("#modal0").modal("show");
                    if(typeof(dcsPageTrack)=="function"){
                        dcsPageTrack("WT.si_n","银行卡开通快捷",false,"WT.si_x","开通快捷失败",false,"WT.err_type",msg.returnmsg,false);
                    }
                }
            }
        });
    }
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
        "WT.si_n":"支付银行卡",
        "WT.si_x":"展示我的银行卡"
    }
}


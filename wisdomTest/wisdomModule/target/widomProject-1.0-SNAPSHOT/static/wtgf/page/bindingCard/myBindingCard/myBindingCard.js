var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js"),
	dialog = require("common:widget/dialog/dialog.js"),
    btn = require("common:widget/btn/btn.js"),
    menuCookie = require("wtgf:widget/menuCookie/menuCookie.js"),
    FormValidator = require("common:widget/validate/validate.js");
var unsignFlag;//�����1˵���ǻ���ʱ��Ҫ��������2˵����ֱ�ӽ��.
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

        //���������Ȱ�ť
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

        //ȡ���������
        $("#tsedCancelBtn").click(function(){
            //�������ȡ��
            $("#modal").modal("hide");
        });

        //�������
        $("#tsedBtn").click(function(){
            $("#modal").modal("hide");
            if(typeof(dcsPageTrack)=="function"){
                dcsPageTrack("WT.si_n","���п�����޶�",false,"WT.si_x","����޶�ȷ��",false);
            }
            var tradeAcco = $("#tradeAcco").val();
            upgradeQuickPay(tradeAcco);
        });

        //���ɾ����ť
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
                dcsPageTrack("WT.si_n","���п�ɾ��",false,"WT.si_x","��ʾɾ��",false);
            }
        });

        //ȡ��ɾ����Ϊ
        $("#skCancelBtn").click(function(){
            $("#modal3").modal("hide");
        });

        //ȷ��ɾ��
        $("#skBtn").click(function(){
            var tradeAcco = $("#tradeAcco").val();
            var capitalMode = $("#capitalMode").val();
            var bankCardNo = $("#bankCardNo").val();
            btn.setDisabled($("#skBtn"));
            deleteCard(tradeAcco,capitalMode,bankCardNo);
        });

        //���������ť
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

        //������ǩԼ��ť
        $("#jcqyBtn").click(function(){
            menuCookie.cookie.setMenu("r5","c51");
            $("#modal4").modal("hide");
            var tradeAcco = $("#tradeAcco").val();
            var bankCardNo = $("#bankCardNo").val();
            var capitalMode = $("#capitalMode").val();
            var b = unsignquickpay(tradeAcco,bankCardNo,capitalMode);
            if(b){
                if(unsignFlag == 1){
                    //�����ݰ󶨳ɹ����Ž��л�����̨�߼�
                    replacecardpre();
                }else if(unsignFlag == 2){
                    //����󶨳ɹ���ˢ��ҳ��
                    window.location.reload();
                }
            }
        });

        $("#reloadPage").click(function(){
            menuCookie.cookie.setMenu("r5","c51");
            window.location.reload();
        });

        //���ȡ�����ǩԼЭ�鰴ť
        $("#jcqyCancelBtn").click(function(){
            $("#modal4").modal("hide");
        });

        //��ͨһ��֧��
        $(".ktyjzf").click(function(){
            menuCookie.cookie.setMenu("r5","c51");
            var tradeAcco = $(this).parent().find("input:eq(0)").val();
            $("#tradeAcco").val(tradeAcco);
            openquickpay();
        });

        //�رտ��֧��
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

        //ѡ�����п�����
        $(".getType").each(function() {
            $(this).on("mouseenter",function(){
                var num=$(this).index();
                $(this).addClass('current').siblings('li').removeClass('current');
                $(this).parent().next("div").find(".common_style:eq("+num+")").addClass('current').siblings("div").removeClass('current');
            });
        });

        //��ͨ����֧��
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

        //��ͨ���֧��
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
                    dcsPageTrack("WT.si_n","���п���ͨ���",false,"WT.si_x","������Ϣ",false);
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
                    dcsPageTrack("WT.si_n","���п���ͨ���",false,"WT.si_x","������Ϣ",false);
                }
                upgradeQuickPay(tradeAcco);
            }
        });

        //ȷ�Ͽ�ͨ���
        $("#qrkt").click(function(){
            menuCookie.cookie.setMenu("r5","c51");
            var mobileNo = $("#mobileNo").val();
            var verifyCode = $("#verifyCode").val();
            var v= $('#agreeCheckbox').prop("checked");
            var verifySequence = $("#verifySequence").val();
            if(mobileNo == ""){
                $("#telMsg").html("�ֻ����벻��Ϊ�գ�");
                $("#telMsg").show();
                return false;
            }else{
                $("#telMsg").hide();
            }
            if(verifyCode == ""){
                $("#verifyCodeMsg").html("�ֻ�У���벻��Ϊ�գ�");
                $("#verifyCodeMsg").show();
                return false;
            }else{
                $("#verifyCodeMsg").hide();
            }
            if(!v){
                $("#agreeCheckMsg").html("����ϸ�Ķ���ͬ�����Э��!");
                $("#agreeCheckMsg").show();
                return false;
            }else{
                $("#agreeCheckMsg").hide();
            }
            if(verifySequence == ""){
                $("#telMsg").html("���ȡ�ֻ���֤�룡");
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
                $("#telMsg").html("�ֻ����벻��Ϊ�գ�");
                $("#telMsg").show();
            }else{
                $("#telMsg").html("");
                $("#telMsg").hide();
                smsVFCodeBtnClick();
            }
        });

        //�رմ����¼�
        $('#modal2').on('hide.bs.modal', function (){
            menuCookie.cookie.setMenu("r5","c51");
            window.location.reload();
        });

        //�رմ����¼�
        $('#modal8').on('hide.bs.modal', function (){
            menuCookie.cookie.setMenu("r5","c51");
            window.location.reload();
        });
    };

    //������ȷ���
    function upgradeQuickPay(tradeAcco){
        //������ȷ���action
        menuCookie.cookie.setMenu("r5","c51");
        $("#modal2").modal("show");
        $("#verifyBusiness").val("webSign");
        $("#frm").attr("action","/main/bankCards/"+tradeAcco+"/webSign");
        $("#frm").submit();
    }

    //ɾ������
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
                        dcsPageTrack("WT.si_n","���п�ɾ��",false,"WT.si_x","ɾ���ɹ�",false);
                    }
                    //ɾ���ɹ�,ˢ��ҳ��
                    $("#showInfoMsg2").html(data.returnmsg);
                    $("#modal8").modal("show");
                    btn.setEnabled($("#skBtn"));
                }else{
                    //ɾ��ʧ�ܣ���������ԭ��
                    var returnMsg = data.returnmsg;
                    $("#showInfoMsg").html(returnMsg);
                    $("#modal0").modal("show");
                    btn.setEnabled($("#skBtn"));
                    if(typeof(dcsPageTrack)=="function"){
                        dcsPageTrack("WT.si_n","���п�ɾ��",false,"WT.si_x","ɾ��ʧ��",false, "WT.err_type",returnMsg,false);
                    }
                }
            }
        });
    }

    //����Ƿ���Ի���
    function checkreplacecard(tradeAcco,chgQkPayFlag,capitalMode,bankNo){
        menuCookie.cookie.setMenu("r5","c51");
        //1.1�ж��Ƿ���Ի���
        $("#tradeAcco").val(tradeAcco);
        $.ajax({
            type: "post",
            url: "/main/bankCards/"+tradeAcco+"/changeCardAuditResult",
            async:false,
            success: function (data) {
                if(data.issuccess){
                    var canReplace = data.canReplace;
                    if(canReplace){
                        // ���Ի���
                        var newBankCardNo = data.newBankCardNo;
                        $("#newBankCardNo").val(newBankCardNo);
                        //1.2�ж��Ƿ�ͨ�˿��֧��
                        if(chgQkPayFlag == "OPEN"){
                            //���������ֱ����������ʱ���ж��Ƿ���Э�飬����У���Ҫȥ���н���󶨡�
                            //����֧����ʽ��ֱ�����߽��Ȼ����뻻��ҳ�档
                            if(capitalMode == "D" && bankNo == "007"){
                                $("#modal5").modal("show");
                            }else{
                                unsignFlag = 1;
                                $("#modal4").modal("show");
                            }
                        }else{
                            //���û�п�ͨ���֧�����Э��
                            //���뻻����̨�߼�
                            replacecardpre();
                        }
                    }else{
                        //Ŀǰ����ʲô����ԭ��ȫ����ʾ��Ҫ�ύ���Ͻ������
                        $("#modal6").modal("show");
                    }
                }else{
                    //���������
                    $("#modal6").modal("show");
                }
            }
        });
    }

    //������֧��
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
                    //���Э��ɹ�
                    b = true;
                }else{
                    //���Э��ʧ�ܣ�����ԭ��
                    var returnMsg = data.returnmsg;
                    $("#showInfoMsg").html(returnMsg);
                    $("#modal0").modal("show");
                    b = false;
                }
            }
        });
        return b;
    }

    //��ת����ͨһ��֧����̨
    function openquickpay(){
        menuCookie.cookie.setMenu("r5","c51");
        //��ͨһ��֧����̨action
        $("#verifyBusiness").val("openQuickPay");
        $("#frm").attr("action","/main/mycards/openquickpaypre");
        $("#frm").submit();
    }

    //��ת��������̨�߼�
    function replacecardpre(){
        //����action
        $("#frm").attr("target","_self");
        $("#verifyBusiness").val("changeCard");
        $("#frm").attr("action","/main/bankCards/changeCard/pre");
        $("#frm").submit();
        $("#frm").attr("target","_blank");
    }

    //���Ͷ�����֤��
    function smsVFCodeBtnClick() {
        smsVFCodeTipsObj = btn.disable($("#getValidCode"),{
            color:          '#C0C0C0',     //disable���������ɫ
            setBtnLoad:     false        //�Ƿ���ʾLoading��gifͼƬ
        });
        $.ajax({
            type: "post",
            url: "/main/bankCards/verifyCode",
            data: {"bankNo": $('#bankNo').val(),"capitalMode":$('#capitalMode').val(),
                "bankCardNo": $('#bankCardNo').val(),"mobilePhone":$('#mobileNo').val()},
            success: function (msg) {
                var msgJson = msg;
                if (!msgJson.issuccess) {
                    //����ʧ��
                    $("#verifyCodeMsg").html(msgJson.returnmsg);
                    $("#verifyCodeMsg").show();
                    btn.enable($("#getValidCode"));
                } else {
                    verifySequence = msgJson.verifySequence;
                    $("#verifySequence").val(verifySequence);
                    $(smsVFCodeTipsObj).html('<span class="text-red text-fontsize16">��'+(secondCount--)+'������»�ȡ��</span>');
                    nIntervId = setInterval(CountDown, 1000);
                }
            }
        });
    }

//����90�뵹��ʱ
    function CountDown(){
        $(smsVFCodeTipsObj).html('<span class="text-red text-fontsize16">��'+secondCount+'������»�ȡ��</span>');
        if(--secondCount<0){
            clearCountDown();
        }
    }
//�������90�뵹��ʱ����
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
                        dcsPageTrack("WT.si_n","���п���ͨ���",false,"WT.si_x","��ͨ��ݳɹ�",false);
                    }
                    $("#showInfoMsg2").html(msg.returnmsg);
                    $("#modal8").modal("show");
                }else{
                    $("#showInfoMsg").html(msg.returnmsg);
                    $("#modal0").modal("show");
                    if(typeof(dcsPageTrack)=="function"){
                        dcsPageTrack("WT.si_n","���п���ͨ���",false,"WT.si_x","��ͨ���ʧ��",false,"WT.err_type",msg.returnmsg,false);
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

//ҳ��Ƕ��
function addWebtrends(){
    window.WTjson = {
        "WT.si_n":"֧�����п�",
        "WT.si_x":"չʾ�ҵ����п�"
    }
}


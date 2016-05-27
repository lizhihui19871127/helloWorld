define('wtgf:widget/verifyDiv/verifyDiv.js', function(require, exports, module){  var  util = require("common:widget/util/util.js"),
    datepicker = require("common:widget/datepicker/datepicker.js"),
    juicer = require("common:widget/juicer/juicer.js"),
    dialog = require("common:widget/dialog/dialog.js"),
    btn = require("common:widget/btn/btn.js"),
    cal = require("common:widget/cal/cal.js"),
    menuCookie = require("wtgf:widget/menuCookie/menuCookie.js"),
    fredkeyboard = require("wtgf:widget/fredkeyboard/fredKeyboard.js"),
    FormValidator = require("common:widget/validate/validate.js"),
     ajaxHelper=require("wtgf:widget/ajaxHelper/ajaxHelper.js");

var validateForm = null;
var secondCount = 90;

var verifyDiv = (function () {
    var _init = function () {
        $.ajaxSetup({ cache: false });

        //��ʼ������֤
        validateForm = new FormValidator(
            'bindCardForm', [],
            {
                success: function (datas, evt) {  //�첽�ύ����
                    var verifyMethod = $("#verifyMethodForm").val();
                    if (verifyMethod == "D") {
                        submitForm();
                    }
                    return  true
                }
            }
        );
    };

    var bindEvent = function () {
        $("#verifySubmitForm").click(verifySubmit);

        $("#sendVerifyCodeForm").click(sendVerifyCode);

        $("#goVerify").click(goVerify);

    };

    /**
     * ֧��ʧ�ܵ���
     * @param bankCardNo
     * @param bankNo
     * @param returnMsg
     */
    var showPayFailedDiv = function (bankCardNo, bankNo,buyMethod, returnMsg) {

        var objRet=ajaxHelper.verifyLeading(bankCardNo);
        if (buyMethod=="D"&&objRet.isNeedLead) {
            showVerifyDiv(objRet.capitalMode, bankNo, objRet.verifyMethod, bankCardNo,objRet.CapitalName, returnMsg);
        }else{
            showFailedDiv(returnMsg);
        }

    }



    /**
     * ֧��ʧ�ܺ������Ҫ�����û�ȥǩԼ������Ҫ��ʾǩԼ�������ݣ�����ʼ��form���ֶ�
     * @param capitalMode
     * @param bankNo
     * @param verifyMethod
     * @param bankCardNo
     */
    var showVerifyDiv = function (capitalMode, bankNo, verifyMethod, bankCardNo,capitalName, msg) {
        $("#returnMsg").html(msg);
        $("#verifyLeedShow").show();
        if(verifyMethod=="W"){
            $("#questionGif").show();
        }else{
            $("#questionGif").hide();
        }

        var bankCardNoConvert=bankCardNo.substring(0,4)+"**********"+bankCardNo.substring(bankCardNo.length-4,bankCardNo.length);
        $("#bankCardNoShow").html(capitalName+"["+bankCardNoConvert+"]");

        $("#payFailDiv").modal("show");

        $("#capitalModeForm").val(capitalMode);
        $("#bankNoForm").val(bankNo);
        $("#verifyMethodForm").val(verifyMethod);
        $("#bankCardNoForm").val(bankCardNo);
    };

    /**
     * ֧��ʧ�ܺ������Ҫ�����û�ȥǩԼ������Ҫ��ʾǩԼ�������ݣ�����ʼ��form���ֶ�
     * @param capitalMode
     * @param bankNo
     * @param verifyMethod
     * @param bankCardNo
     */
    var showFailedDiv = function (msg) {
        $("#returnMsg").html(msg);
        $("#verifyLeedShow").hide();

        $("#payFailDiv").modal("show");
    };


    /**
     * �����DataFlowǩԼ��չʾ���ǩԼ�ĵ���
     */
    var goVerify = function(){
        var verifyMethod = $("#verifyMethodForm").val();

        if (verifyMethod == "W") {
            $("#payFailDiv").modal("hide");
            $("#afterWebVerifyDiv").modal("show");
            validateForm.autoSubmit = true;
            var bankName = $("#bankNameForm").val();
            if (typeof(dcsPageTrack) == "function") {
                dcsPageTrack("WT.si_n", "������п�", false, "WT.si_x", "��֤��Ϣ", false, "WT.pn_sku", bankName, false, "WT.pc", "����", false);
            }
            $("#result").show();

            $("#bindCardForm").submit();
        } else if(verifyMethod=="D") {
            validateForm.autoSubmit = false;

            $("#telMsgForm").html("");
            $("#verifyCodeMsgForm").html("");
            $("#agreeCheckMsgForm").html("");
            $("#noteTipsForm").html("");

            $("#payFailDiv").modal("hide");
            $("#smgVerifyDiv").modal("show");

        }
    };

    /**
     * ��֤������
     * @returns {boolean}
     */
   var verifySubmit= function(){
        $("#telMsgForm").html("");
        $("#verifyCodeMsgForm").html("");
        $("#agreeCheckMsgForm").html("");
        $("#noteTipsForm").html("");

        var mobilePhone= $("#mobilePhoneForm").val();
        var v = $('#agreeCheckboxForm').prop("checked");
        var verifySequence = $("#verifySequenceForm").val();
        var verifyCode = $("#verifyCodeForm").val();

        if (mobilePhone =="") {
            $("#telMsgForm").html("����д�ֻ����룡");
            return false;
        }

        if (verifyCode =="") {
            $("#verifyCodeMsgForm").html("����д��֤�룡");
            return false;
        }

        if (!v) {
            $("#noteTipsForm").html("����ϸ�Ķ���ͬ�����Э��!");
            return false;
        }

        if (verifySequence == "") {
            $("#telMsgForm").html("���ȡ�ֻ���֤�룡");
            return false;
        }

        btn.setDisabled($('#verifySubmitForm'));
        $("#bindCardForm").submit();
    };

    /**
     * �ύǩԼ�����
     */
    var submitForm = function () {
        var bankName = $("#bankNameForm").val();

        if (typeof(dcsPageTrack) == "function") {
            dcsPageTrack("WT.si_n", "������п�", false, "WT.si_x", "��֤��Ϣ", false, "WT.pn_sku", bankName, false, "WT.pc", "���", false);
        }

        var bankNo= $('#bankNoForm').val();
        var capitalMode=$('#capitalModeForm').val();
        var verifyMethod=$("#verifyMethodForm").val()
        var bankCardNo=$('#bankCardNoForm').val()
        var verifyCode=$("#verifyCodeForm").val()
        var mobilePhone=$("#mobilePhoneForm").val()
        var tradePassWord="";
        var verifySequence =$('#verifySequenceForm').val();

        var objRet=ajaxHelper.bindCard(bankNo,capitalMode,verifyMethod,bankCardNo,verifyCode,mobilePhone,tradePassWord,verifySequence);

        if (objRet.issuccess) {
            window.location.reload();
        } else {
            $("#noteTipsForm").html(objRet.returnmsg);
            btn.setEnabled($('#verifySubmitForm'));
        }

    };

//���Ͷ�����֤��
    var sendVerifyCode = function(){
        $("#bankCardNoForm").val($("#bankCardNoForm").val().replace(/[^\d]/g, ''));

        var mobilePhone= $("#mobilePhoneForm").val();
        if (mobilePhone == "") {
            $("#telMsgForm").html("����д�ֻ����룡");
            return;
        }
        smsVFCodeTipsObj = btn.disable($("#sendVerifyCodeForm"), {
            color: '#C0C0C0',     //disable���������ɫ
            setBtnLoad: false        //�Ƿ���ʾLoading��gifͼƬ
        });

        var bankNo = $('#bankNoForm').val();
        var capitalMode = $('#capitalModeForm').val();
        var bankCardNo = $('#bankCardNoForm').val();
        var mobilePhone = $('#mobilePhoneForm').val();

        var objRet = ajaxHelper.sendVerifyCode(bankNo, capitalMode, bankCardNo, mobilePhone);

        if (!objRet.issuccess) {
            //����ʧ��
            $("#telMsgForm").html(objRet.returnmsg);
            btn.enable($("#sendVerifyCodeForm"));
        } else {
            $("#verifySequenceForm").val(objRet.verifySequence);
            $(smsVFCodeTipsObj).html('<span class="text-red text-fontsize16">��' + (secondCount--) + '������»�ȡ��</span>');
            nIntervId = setInterval(CountDown, 1000);
        }
    };

//����90�뵹��ʱ
    var CountDown = function () {
        $(smsVFCodeTipsObj).html('<span class="text-red text-fontsize16">��' + secondCount + '������»�ȡ��</span>');
        if (--secondCount < 0) {
            clearCountDown();
        }
    };

//�������90�뵹��ʱ����
    var clearCountDown = function () {
        btn.enable($("#sendVerifyCodeForm"));
        if (smsVFCodeTipsObj != undefined) {
            $(smsVFCodeTipsObj).html('');
        }
        clearInterval(nIntervId);
        secondCount = 90;
    };

    return {
        init: _init,
        bindEvent: bindEvent,
        showPayFailedDiv: showPayFailedDiv
    }
})();

$(function () {
    verifyDiv.init();
    verifyDiv.bindEvent();
});

module.exports = verifyDiv; 
});
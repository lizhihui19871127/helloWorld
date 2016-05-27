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
var payType = null;//֧�����ͣ��˻���0������1�����֧��2��
//��֤��
var validateForm = null;
var main = (function(){
    var _init = function(){
        menuCookie.cookie.setMenu("r5","c50");
        //��ʼ������֤
        validateForm = new FormValidator(
            'frm',
            [{
                name:'agreeCheckbox',
                rules: 'callback_agreeProx',
                posTarget:$("#qyxy")
            }
            ],
            {
                success : function(datas,evt){  //�첽�ύ����
                    $("#bankCardNo").val($("#bankCardNo").val().replace(/[^\d]/g,''));
                    if(!checkBankCardExiste()){
                        return false;
                    }
                    submitForm();
                    return  true
                }
            }
        );

        //�������벻�ܺ������ַ�
        validateForm.registerCallback('passwords',function(value){
            if("-".indexOf(value)>-1){
                return false;
            }
            //��ȫ����ĸ
            if (/^\D+$/gi.test(value)) {
                if (/(\D)\1{2,}/g.test(value)) {
                    //msg = "��������3λ��3λ����������ͬ�ַ������磺4����a����";  // ȫһ��
                    return false;
                }
            } else if (/^\d+$/gi.test(value)) {//ȫ������
                if (/(\d)\1{2,}/g.test(value)) {
                    //msg = "��������3λ��3λ����������ͬ�ַ������磺������3����1����";  // ȫһ��
                    return false;
                }
                for (var i = 0; i < value.length - 2; i++) {
                    var _first = parseInt(value.charAt(i));
                    var _middle = parseInt(value.charAt(i + 1));
                    var _end = parseInt(value.charAt(i + 2));
                    if ((_first + 1 == _middle) && (_middle + 1 == _end)) {
                        //msg = "����ȫ������ʱ��������3λ��3λ������������.����:������123����";
                        return false;
                    }
                    if ((_first - 1 == _middle) && (_middle - 1 == _end)) {
                        //msg = "����ȫ������ʱ��������3λ��3λ������������.����:������543����";
                        return false;
                    }
                }
            }
            return true;
        });
        validateForm.setMessage('passwords','����ֻ����6-8λ��ĸ�����ֻ��»�����ϣ�����Ϊ������');

        //�������룬��������������
        validateForm.registerCallback('passwords_equal',function(value){
            var v= $("#tradePasswdConfirm").val();
            if(v != value){
                return false;
            }
            return true;
        });
        validateForm.setMessage('passwords_equal','������������벻һ��');


        //����ͬ��Э��
        validateForm.registerCallback('agreeProx',function(value){
            var v= $('#agreeCheckbox').prop("checked");
            if(!v){
                return false;
            }
            return true;
        });
        validateForm.setMessage('agreeProx','���Ķ����㷢������֧��Э�顷');
        canBindAnotherCard();
        loadBankInfo();
    };

    var bindEvent = function(){
        // ѡ�����п�
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

        // ѡ�����п�
        $containerBank.on('click', '.bank-list li', function(){
            hideErrors();
            var str = $(this).html();
            $containerBank.find('.bank-list').hide();
            $("#bankTips").css("display","");
            $containerBank.find('.bank-sel').html(str);
            //����ѡ������п���Ϣ��չʾ���п���ʾ��Ϣ
            var selectedBankInfo = getSelectedBank(str);
            var verifyMethod = selectedBankInfo.verifyMethod;
            if(verifyMethod != null && verifyMethod.length >0){
                var defaultMethod = verifyMethod[0];
                $("#bankNo").val(selectedBankInfo.bankNo);
                $("#bankName").val(selectedBankInfo.bankName);
                $("#capitalMode").val(defaultMethod.capitalMode);
                $("#verifyMethod").val(defaultMethod.method);
                //�����֧����������ӯ�����˻����֧����ʽ���ǲ���ʾ�����Ϳ�ݵ�ͼ�꣬Ҳ����Ҫ��ʾ���п���
                if(defaultMethod.capitalMode == "P" || defaultMethod.capitalMode == "H"){
                    $("#bankCardNoView").css("display","none");
                    $("#telView").css("display","none");
                    $("#verifyCodeView").css("display","none");
                    payType = 0;
                }else{
                    if(defaultMethod.method == 'D'){
                        //����ǿ��չʾ
                        $("#telView").css("display","block");
                        $("#verifyCodeView").css("display","block");
                        $("#bankCardNoView").css("display","block");
                        payType = 2;
                    }else if(defaultMethod.method == 'W'){
                        //���������������������Ԥ���ֻ����뼰��֤��
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
            //��������໥�л�
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

        // �Ƿ�ͬ��ҵ��Э��
        $containerBank.on('change', 'label.agreen input', function(){
            if($(this).is(':checked')){
                $(this).parent().addClass('active');
            }else{
                $(this).parent().removeClass('active');
            }
        });

        // �������п�
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

        // ���п�Ԥ���ֻ���ʾ��2s���Զ���ʧ
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

        // �ҵ����п�-��ʾȫ����Ƭ
        $containerBank.on('click', '.my-bank-content .down', function(){
            $(this).hide().parent().find('ul').addClass('show-all');
        });

        $("#getValidCode").on('click',function(){
            $("#bankCardNo").val($("#bankCardNo").val().replace(/[^\d]/g,''));
            smsVFCodeBtnClick();
        });


        //���ԣ�������¹�һ�Σ�����ʧ�ܣ��Ͳ������������ˡ�
        $("#submitAgain").on("click",function(){
            $("#retryFlag").val("1");
            $("#frm").submit();
            $("#retryFlag").val("0");
        });

        //ȷ����ܰ��ʾ��Ϣ
        $("#toUpdateLever").on("click",function(){
            $("#modal").modal("hide");
        });

        //����������п�
        $("#addNewBankCard").on("click",function(){
            $("#modal").modal("hide");
        });

        //��֤���п��ɹ�
        $("#checkSuccess").on("click",function(){
            //ֱ����ת���ҵ����п�ҳ��
            window.location.href="/main/bankCards/myCards";
        });

        //����������п�
        $("#addNewCard").on("click",function(){
            $("#modal4").modal("hide");
        });

        //ȡ����ť
        $("#cancelBtn").on("click",function(){
            $("#modal4").modal("hide");
        });

        //����������п�
        $("#yzNewCard").on("click",function(){
            $("#modal5").modal("hide");
        });

        //ȡ����ť
        $("#yzCancelBtn").on("click",function(){
            $("#modal5").modal("hide");
        });

        //ȥ���ո�
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

//ҳ��Ƕ��
function addWebtrends(){
    window.WTjson = {
        "WT.si_n":"������п�",
        "WT.si_x":"ѡ�����п�"
    }
}

//��������໥�л�(type:1Ϊ������2Ϊ���)
function changePayType(type){
    hideErrors();
    var t = $("#bankInfo").html();
    //����ѡ������п���Ϣ��չʾ���п���ʾ��Ϣ
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
//������������л��������
function dealChangePayStyle(method,defaultMethod,selectedBankInfo){
            var icon = "/static/wtgf/img/bank/"+selectedBankInfo.bankNo+"_icon_small.png";
            var bankContent = "<img src="+icon+" alt=\"\">";
            bankContent += "<span>"+selectedBankInfo.bankName+"</span>";
    if(method == "W"){
        payType = 1;
            bankContent += "<i class=\"wy\">����</i>";
    }else{
        payType = 2;
        bankContent += "<i class=\"kj\">���</i>";
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

//����������Ϣ
function loadBankInfo()
{
    $("#bankInfo").text("���ڼ���������Ϣ,���Ժ�");
    $.ajax({
        type: "get",
        url: "/main/bankCards/banks",
        async:true,
        data: null,
        success: function (data) {
            if (data.issuccess != true) {
                $("#showInfoMsg").html("��ȡ������Ϣ���ִ������Ժ����ԡ�");
                $("#toUpdateLever").css("display","");
                $("#addNewBankCard").css("display","none");
                $("#modal").modal('show');
            } else {
                bankInfo = data.data;
                //������Ѿ����ù����������˵ģ�����Ҫ������
                if(data.hasPwd){
                    $("#pwdApply").css("display","none");
                    $("#pwd").css("display","none");
                }
                hasPwd = data.hasPwd;
                //����һ�����е���Ϣ
                if(bankInfo != null && bankInfo.length > 0){
                    var firstBankInfo = bankInfo[0];
                    var icon = "/static/wtgf/img/bank/"+firstBankInfo.bankNo+"_icon_small.png";
                    var bankContent = "<img src="+icon+" alt=\"\">";
                    bankContent += "<span>"+firstBankInfo.bankName+"</span>";
                    //��ȡĬ�ϵ��ǿ�ݻ�������
                    var verifyMethod = firstBankInfo.verifyMethod;
                    if(verifyMethod != null && verifyMethod.length >0){
                        var defaultMethod = verifyMethod[0];
                        //�����֧����������ӯ�����˻����֧����ʽ���ǲ���ʾ�����Ϳ�ݵ�ͼ�꣬Ҳ����Ҫ��ʾ���п���
                        if(defaultMethod.capitalMode == "P" || defaultMethod.capitalMode == "H"){
                            if(defaultMethod.method == 'W'){
                                bankContent += "<i class=\"wy\" style='display: none'>����</i>";
                            }else if(defaultMethod.method == 'D'){
                                bankContent += "<i class=\"kj\" style='display: none'>���</i>";
                            }
                            bankContent += "";
                            $("#bankCardNoView").css("display","none");
                            $("#telView").css("display","none");
                            $("#verifyCodeView").css("display","none");
                            payType = 0;
                        }else{
                            if(defaultMethod.method == 'W'){
                                bankContent += "<i class=\"wy\">����</i>";
                                //�����������չʾ
                                $("#bankCardNoView").css("display","block");
                                $("#telView").css("display","none");
                                $("#verifyCodeView").css("display","none");
                                payType = 1;
                            }else if(defaultMethod.method == 'D'){
                                bankContent += "<i class=\"kj\">���</i>";
                                //����ǿ�ݣ���������Ԥ���ֻ����뼰��֤��
                                $("#bankCardNoView").css("display","block");
                                $("#telView").css("display","block");
                                $("#verifyCodeView").css("display","block");
                                payType = 2;
                            }
                        }
                        //����һ�����е�������ʾ��Ϣ
                        changeBankCardNote(defaultMethod,firstBankInfo);
                        $("#bankTips").css("display","none");
                        $containerBank.find('.bank-list').show();
                    }
                    $("#bankInfo").html(bankContent);
                }
                //��������б���ʾ
                var bankListView = "<ul class='clearfix' style='padding:0px;margin:0 0 0 0'>";
                var method = "";
                for(var i =0;i < bankInfo.length;i++){
                    var currentBankInfo = bankInfo[i];
                    var icon = "/static/wtgf/img/bank/"+currentBankInfo.bankNo+"_icon_small.png";
                    var bankContent = "<img src=\""+icon+"\" alt=\"\">";
                    bankContent += "<span>"+currentBankInfo.bankName+"</span>";
                    //��ȡĬ�ϵ��ǿ�ݻ�������
                    var verifyMethod = currentBankInfo.verifyMethod;
                    for(var j =0;j < verifyMethod.length;j++){
                        var allMethod = verifyMethod[j];
                        var methodParam = "";
                        //�����֧����������ӯ�����˻����֧����ʽ���ǲ���ʾ�����Ϳ�ݵ�ͼ��
                        if(allMethod.capitalMode == "P" || allMethod.capitalMode == "H"){
                            methodParam = "";
                            if(allMethod.method == 'W'){
                                methodParam = "<i class=\"wy\" style='display: none'>����</i>";
                                method = "����";
                            }else if(allMethod.method == 'D'){
                                methodParam = "<i class=\"kj\" style='display: none'>���</i>";
                                method = "���";
                            }
                        }else{
                            if(allMethod.method == 'W'){
                                methodParam = "<i class=\"wy\">����</i>";
                                method = "����";
                            }else if(allMethod.method == 'D'){
                                methodParam = "<i class=\"kj\">���</i>";
                                method = "���";
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

//���Ͷ�����֤��
function smsVFCodeBtnClick() {
    if(validateForm.validateField('bankCardNo') != 0 ||
        validateForm.validateField('mobilePhone') !=0)
    {
        return;
    }
    smsVFCodeTipsObj = btn.disable($("#getValidCode"),{
        color:          '#C0C0C0',     //disable���������ɫ
        setBtnLoad:     false        //�Ƿ���ʾLoading��gifͼƬ
    });
    $.ajax({
        type: "post",
        url: "/main/bankCards/verifyCode",
        data: {"bankNo": $('#bankNo').val(),"capitalMode":$('#capitalMode').val(),
            "bankCardNo": $('#bankCardNo').val(),"mobilePhone":$('#mobilePhone').val()},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                //����ʧ��
                $("#showInfoMsg").html(msgJson.returnmsg);
                $("#toUpdateLever").css("display","");
                $("#addNewBankCard").css("display","none");
                $("#modal").modal('show');
                btn.enable($("#getValidCode"));
            } else {
                verifyToken = msgJson.verifySequence;
                $("#verifyToken").val(verifyToken);
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
        $(smsVFCodeTipsObj).html('');
    }
    clearInterval(nIntervId);
    secondCount = 90;
}

function checkBankCardExiste(){
    btn.setDisabled($('#J_submitButton'));
    //�����֧�������㸶�����˻���ģ�������֤��
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
                //���Ѿ�����
                $("#showInfoMsg").html("�ÿ��Ѱ󶨣������ظ��󿨡�");
                $("#toUpdateLever").css("display","");
                $("#addNewBankCard").css("display","none");
                $("#modal2").modal("hide");
                $("#modal3").modal("hide");
                $("#modal").modal('show');
                b = false;
                btn.setEnabled($('#J_submitButton'));
            }else{
                //����ǿ�ݣ��ж��Ƿ��Ѿ������ȷ�Ķ�����֤�롣
                var verifyMethod = $("#verifyMethod").val();
                if(verifyMethod == "D"){
                    if(verifyToken == null || verifyToken == ""){
                        $("#showInfoMsg").html("���ȡ������֤�롣");
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
            dcsPageTrack("WT.si_n","������п�",false,"WT.si_x","��֤��Ϣ",false,"WT.pn_sku",bankName,false,"WT.pc","���",false);
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
                    //ʧ���ˣ�Ҫ����ʧ�ܿ�չʾʧ��ԭ�������֧����ʽֻ�п��û��������ֱ�ӵ���������Ϣ�����������֧�����򵯳������򣬻�����������֧����
                    var hasWeb = false;
                    var t = $("#bankInfo").html();
                    //����ѡ������п���Ϣ��չʾ���п���ʾ��Ϣ
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
                        dcsPageTrack("WT.si_n","������п�",false,"WT.si_x","��ʧ��",false,"WT.pn_sku",bankName,false,"WT.pc","���",false,"WT.err_type",returnmsg,false);
                    }
                }
            }
        });
    }else if(verifyMethod == "W"){
        if(typeof(dcsPageTrack)=="function"){
            dcsPageTrack("WT.si_n","������п�",false,"WT.si_x","��֤��Ϣ",false,"WT.pn_sku",bankName,false,"WT.pc","����",false);
        }
        $("#modal3").modal('show');
        validateForm.autoSubmit = true;
        btn.setEnabled($('#J_submitButton'));
    }
}

//������п��Ժ��޸���ص���ʾ��Ϣ
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
    //�����֧����������ӯ���֣�֧���޶�������
    if(defaultMethod.capitalMode == "P" || defaultMethod.capitalMode == "H"){
        $("#limitMsg").html("<a href='"+limitMsg.showMsg+"' style='position: relative;' target='_blank'>����鿴��������֧�����</a>");
    }else{
        $("#limitMsg").html(limitMsg.showMsg);
    }

    var bindMsg = defaultMethod.bindMsg;
    $("#bindMsg").html(bindMsg.showMsg);

    var otherMsg = defaultMethod.otherMsg;
    $("#otherMsg").html(otherMsg.showMsg);

    //�޸��ֻ���,ֻ�й�ũ�н���,��Ӧbankno 002 003 004 005
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
        $("#imgTips").html("<i></i><a href='"+linkUrl+"' target='_blank'>����޸��ֻ���֤��</a>");
        $("#updateTelImg").css("display","");
        $("#imgTips").addClass("phone-tips");
    }else{
        $("#updateTelImg").css("display","none");
        $("#imgTips").css("display","none");
        $("#imgTips").removeClass();
    }

    //Э�飬ֻ�п����Э�飬���ҹ̶�
    if(defaultMethod.method == "D"){
        $("#xieyi").css("display","");
        $('#agreeCheckbox').prop("checked",false);
        var protocalListContent = "<a href='http://www.gffunds.com.cn/etrade/fw/jygz/wsjygz/201312/t20131225_33765.htm' target='_blank' id='agreeA'>���㷢����������޹�˾��һ��֧����ҵ��Э�顷</a>";
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
        //����ǹ��ͨ������Ҫ������ʾ��
        $("#gdyhTipsView").css("display","");
        $("#zhzlTipsView").css("display","none");
        $("#modal4").modal("show");
    }else if(defaultMethod.capitalMode == "D" && currentBank.bankNo == "007"){
        //�������������ֱ������Ҫ������Ӧ��ʾ��
        $("#gdyhTipsView").css("display","none");
        $("#zhzlTipsView").css("display","");
        $("#modal4").modal("show");
    }else if(currentBank.bankNo == "034"){
        //����������ʾ��
        $("#modal5").modal("show");
    }
    //���ݲ�ͬ���ͣ��˻��ࡢ��������ݣ�����Ҫ��֤��ͬ���ֶ�
    if(!hasPwd){
        //�����Ҫ���ý������룬�ͱ��뾭��У�顣
        {
            validateForm.addField({
                name : 'tradePassWord',
                display:'��������',
                posTarget:$("#passwdTipsSpan"),
                rules :  'required|no_blank|alpha_dash|min_length[6]|max_length[8]|callback_passwords'
            });
            validateForm.addField({
                name : 'tradePasswdConfirm',
                display:'ȷ������',
                rules :  'required|matches[tradePassWord]'
            });
        }
    }
    if(payType == "0"){
        //������˻����֧����ʽ��֧����������ӯ����ֻ��Ҫ��֤Э�顣
        validateForm.deleteField('bankCardNo');
        validateForm.deleteField('mobilePhone');
        validateForm.deleteField('verifyCode');
    }else{
        if(payType == "1"){
            //�������������Ҫ��֤�����š�Э�飩
            validateForm.deleteField('mobilePhone');
            validateForm.deleteField('verifyCode');
            validateForm.addField({
                name : 'bankCardNo',
                display:'���п���',
                rules : 'required'
            });
        }else if(payType == "2"){
            //����ǿ��֧������Ҫ��֤(���š�Э�顢�ֻ��š���֤��)
            validateForm.addField({
                name : 'bankCardNo',
                display:'���п���',
                rules : 'required'
            });
            validateForm.addField({
                name : 'mobilePhone',
                display:'�ֻ�����',
                posTarget:$("#getValidCode"),
                rules : 'required|valid_tel_phone'
            });
            validateForm.addField({
                name : 'verifyCode',
                display:'��֤��',
                rules : 'required|numeric'
            });
        }
    }

    if(typeof(dcsPageTrack)=="function"){
        var bankName = $("#bankName").val();
        var payMethod = "";
        if(defaultMethod.method == "D"){
            payMethod = "���";
        }else{
            payMethod = "����";
        }
        dcsPageTrack("WT.si_n","������п�",false,"WT.si_x","���п���Ϣ����",false,"WT.pn_sku",bankName,false,"WT.pc",payMethod,false);
    }
}

//���������Ժ����������ʾ�������ٽ�����֤
function hideErrors(){
    var fields = validateForm.fields;
    for (var sProp in fields) {
        validateForm.hideError(sProp);
    }
}

/**
 * ����ѡ������ݣ��ҵ���Ӧ�����м�����
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
 * �ж��Ƿ�����ٰ�
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
                    $("#showInfoMsg").html("��������ֻ�ܰ�һ�����п���");
                    $("#toUpdateLever").css("display","");
                    $("#addNewBankCard").css("display","none");
                    $("#modal").modal('show');
                    btn.setDisabled($('#J_submitButton'));
                }
            }
        }
    });
}
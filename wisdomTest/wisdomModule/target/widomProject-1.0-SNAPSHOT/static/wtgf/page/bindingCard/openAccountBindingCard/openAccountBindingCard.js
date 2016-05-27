var util = require("common:widget/util/util.js"),
    datepicker = require("common:widget/datepicker/datepicker.js"),
    juicer = require("common:widget/juicer/juicer.js"),
    dialog = require("common:widget/dialog/dialog.js"),
    btn = require("common:widget/btn/btn.js"),
    FormValidator = require("common:widget/validate/validate.js");
var $containerBank = $('.container-bank');
var bankInfo = null;
var clientAge = false;//�Ƿ���Ҫ��������Ϣ
var hasOfferClientInfo = false;//�Ƿ��Ѿ��ṩ�˾�������Ϣ
var bankListShow = {};
var verifyToken = "";
var nIntervId;
var secondCount = 90;
var smsVFCodeTipsObj;
//��������Ϣ
var nIntervIdWindow;
var secondCountWindow = 90;
var smsVFCodeTipsObjWindow;

var payType = null;//֧�����ͣ��˻���0������1�����֧��2��
//��֤��
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
        //��ʼ������֤
        validateForm = new FormValidator(
            'frm',
            [{
                name : 'identityType'
            },{
                name : 'identityNo',
                display: '֤������',
                rules : function(value){
                    var idType = $("#identityType").val(),
                        rules = 'required';

                    if(idType == '0'){
                        return rules + "|valid_identity";
                    }else{
                        return rules;      //����֤ʲô��ֻҪ�����־�OK
                    }
                }
            },{
                name:'validDate',
                display:'֤����Ч��',
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
                display: '��������',
                posTarget:$("#passwdTipsSpan"),
                rules :  'required|no_blank|alpha_dash|min_length[6]|max_length[8]|callback_passwords'
            },{
                name : 'tradePasswdConfirm',
                display: 'ȷ������',
                rules :  'required|matches[tradePwd]'
            },{
                name : 'email',
                display: '����',
                rules :  'required|valid_email'
            },{
                name:'agreeCheckbox',
                rules: 'callback_agreeProx',
                posTarget:$("#qyxy")
            },{
                name : 'userName',
                display: '����',
                rules :  'required'
            },{
                name : 'addressShow',
                display: '��ϸ��ַ',
                rules :  'required'
            },{
                name : 'city',
                display: 'ʡ��',
                rules :  'required',
                posTarget:$("#adressWr")
            }
            ],
            {
                success : function(datas,evt){  //�첽�ύ����
                    setZipCode();
			        $("#bankCardNo").val($("#bankCardNo").val().replace(/[^\d]/g,''));
                    $("#identityNo").val($("#identityNo").val().replace(/[x]/g,"X"));
		            if(clientAge){
                        if(!hasOfferClientInfo){
                            //û���ṩ��������Ϣ
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

        //����
        validateForm.registerCallback('regName_rule',function(value){
            if (/^\s{1,}|\s{1,}$/.test(value)) {
                return false;
            }
            return true;
        });

        //֤����Ч��
        validateForm.registerCallback('validDateCheck',validDateCheckFunc);

        validateForm.setMessage('regName_rule','����ǰ�����пո�');

        validateForm.setMessage('tradePasswdConfirm.matches','������������벻һ��');


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
        loadBankInfo();
        regContactShow();
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

        $("#getContackValidCode").on('click',function(){
            getVerifyCode();
        });

        $("#isYjyx").click(timeUnLimitedClick);

        $("#identityNo").blur(regContactShow);
        $("#identityType").blur(regContactShow);

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
            $("#modal6").modal("hide");
        });

        //ȡ����ť
        $("#yzCancelBtn").on("click",function(){
            $("#modal6").modal("hide");
        });

        //ȥ���ո�
        $("#bankCardNo").on("blur",function(){
            $("#bankCardNo").val($("#bankCardNo").val().replace(/[^\d]/g,''));
        });

        $("#forlife").click(windowtimeUnLimitedClick);

        //�л�֤������
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
//������֤
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
            display:'����',
            rules: 'required',
            tipsTarget:$("#ctrname-wrap")
        },{
            name : 'contnoWindow',
            display: '֤������',
            tipsTarget:$('#cardNum-wrap'),
            rules : function(value){
                var idType = $("#conttypeWindow").val(),
                    rules = 'required';

                if(idType == '0'){
                    return rules + "|valid_identity";
                }else{
                    return rules;      //����֤ʲô��ֻҪ�����־�OK
                }
            }
        },{
            name:'dateshow',
            display:'֤����Ч��',
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
            display: '�ͻ���ϵ',
            rules :  'required',
            tipsTarget:$('#rel-wrap')
        },{
            name : 'contphoneWindow',
            display: '�ֻ�����',
            rules :  'required',
            tipsTarget:$('#mobile-wrap')
        },{
            name : 'contackVerifyCode',
            display: '��֤��',
            rules :  'required',
            tipsTarget:$('#verifyCode-wrap')
        }
        ],
        {
            success : function(datas,evt){  //�첽�ύ����
                //��֤У�����Ƿ�ɹ�
                checkVerifyCode();
            }
        }
        );
    frmLayerForm.registerCallback('validDateCheckLayer',validDateCheckLFunc);
}

//��������У��
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
        msg = '��ѡ���֤�������ڲ�����Ч��Χ��';
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
                msg = '��δ��18����,��������֤��������������֤�����������������' + (curYear + 5) + "��" + (curMonth + 1) + "��"+curDay+"��";
            }
        }
        else if (age18 >= age && age26 < age)
        {
            var currentDate = new Date(curYear+10, curMonth, curDay);
            if (_selecttime > currentDate)
            {
                msg = '��δ��26����,��������֤��������������֤�����������������' + (curYear + 10) + "��" + (curMonth + 1) + "��"+curDay+"��";
            }
        }
        else if (age26 >= age && age46 < age)
        {
            var currentDate = new Date(curYear+20, curMonth, curDay);
            if (_selecttime> currentDate)
            {
                msg = '��δ��46����,��������֤��������������֤�����������������' + (curYear+ 20) + "��" + (curMonth + 1) + "��"+curDay+"��";
            }
        }
    }
    if(msg != ""){
        validateForm.setMessage('validDateCheckLayer',msg);
        return false;
    }
    return true;

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
            "bankCardNo": $('#bankCardNo').val(),"mobilePhone":$('#mobilePhone').val(),
        "identityType":$("#identityType").val(),"identityNo":$("#identityNo").val(),"userName":$("#userName").val()},
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

function submitForm(){
    btn.setDisabled($('#J_submitButton'));
    var bankName = $("#bankName").val();
    var verifyMethod = $("#verifyMethod").val();
    var expiredate = $("#expiredate").val();
    if(verifyMethod == "D"){
        if(typeof(dcsPageTrack)=="function"){
            dcsPageTrack("WT.si_n","������п�",false,"WT.si_x","��֤��Ϣ",false,"WT.pn_sku",bankName,false,"WT.pc","���",false);
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
        //����һ��ͨ�����Ĳ���
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
        //�������70�꣬����Ҫ�Ĳ���
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
                    //ʧ���ˣ�Ҫ����ʧ�ܿ�չʾʧ��ԭ��
                    var returnmsg = msgJson.returnmsg;
                    $("#showErrormsg").html(returnmsg);
                    $("#modal2").modal('show');
                    if(typeof(dcsPageTrack)=="function"){
                        dcsPageTrack("WT.si_n","������п�",false,"WT.si_x","��ʧ��",false,"WT.pn_sku",bankName,false,"WT.pc","���",false,"WT.err_type",returnmsg,false);
                    }
                }
                btn.setEnabled($('#J_submitButton'));
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

//���ڼ��
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
        msg = '��ѡ���֤�������ڲ�����Ч��Χ��';
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
                msg = '��δ��18����,��������֤��������������֤�����������������' + (curYear + 5) + "��" + (curMonth + 1) + "��"+curDay+"��";
            }
        }
        else if (age18 >= age && age26 < age)
        {
            var currentDate = new Date(curYear+10, curMonth, curDay);
            if (_selecttime > currentDate)
            {
                msg = '��δ��26����,��������֤��������������֤�����������������' + (curYear + 10) + "��" + (curMonth + 1) + "��"+curDay+"��";
            }
        }
        else if (age26 >= age && age46 < age)
        {
            var currentDate = new Date(curYear+20, curMonth, curDay);
            if (_selecttime> currentDate)
            {
                msg = '��δ��46����,��������֤��������������֤�����������������' + (curYear+ 20) + "��" + (curMonth + 1) + "��"+curDay+"��";
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
 * ����������������Ч
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
//        $("#imgTips").css("display","block");
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
        //���Э��Ϊ�գ�����չʾЭ�飬Ҳ���ù�ѡ��
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
        $("#modal6").modal("show");
    }
    //���ݲ�ͬ���ͣ��˻��ࡢ��������ݣ�����Ҫ��֤��ͬ���ֶ�
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
 * ������������
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

//���Ͷ�����֤��(����70�꣬�����˶���)
function getVerifyCode() {
    $("#verifyCodeMsg").html("");
    if(frmLayerForm.validateField('contphone') !=0)
    {
        return;
    }
    smsVFCodeTipsObjWindow = btn.disable($("#getContackValidCode"),{
        color:          '#C0C0C0',     //disable���������ɫ
        height:'28px',
        setBtnLoad:     false        //�Ƿ���ʾLoading��gifͼƬ
    });
    $.ajax({
        type: "post",
        url: "/main/register/verifyCode",
        data: {"mobilePhone":$('#contphoneWindow').val()},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                //����ʧ��
                $("#verifyCodeMsg").html(msgJson.returnmsg);
                btn.enable($("#getContackValidCode"));
            } else {
                $(smsVFCodeTipsObjWindow).html('��'+(secondCountWindow--)+'������»�ȡ��');
                nIntervIdWindow = setInterval(CountDownWindow, 1000);
            }
        }
    });
}

//У�龭�����ֻ���֤�Ƿ�ɹ�
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
                //����ʧ��
                $("#verifyCodeMsg").html(msgJson.returnmsg);
            } else {
                hasOfferClientInfo = true;
                //����������Ϣ��ֵ���󿨵�form�С�
                $("#contact").val($("#contactWindow").val());
                $("#conttype").val($("#conttypeWindow").val());
                $("#contno").val($("#contnoWindow").val());
                $("#contacttimelimited").val($("#contacttimelimitedWindow").val());
                $("#relationShip").val($("#relationshipWindow").val());
                $("#contphone").val($("#contphoneWindow").val());
                $("#modal5").modal("hide");
                $("#showInfoMsg").html("��������Ϣ¼��ɹ���");
                $("#toUpdateLever").css("display","");
                $("#addNewBankCard").css("display","none");
                $("#modal").modal('show');
            }
        }
    });
}

//����90�뵹��ʱ
function CountDownWindow(){
    $(smsVFCodeTipsObjWindow).html('<span class="text-red text-fontsize16">��'+secondCountWindow+'������»�ȡ��</span>');
    if(--secondCountWindow<0){
        clearCountDownWindow();
    }
}
//�������90�뵹��ʱ����
function clearCountDownWindow(){
    btn.enable($("#getContackValidCode"));
    if(smsVFCodeTipsObjWindow != undefined){
        $(smsVFCodeTipsObjWindow).html('');
    }
    clearInterval(nIntervIdWindow);
    secondCountWindow = 90;
}

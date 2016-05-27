var FormValidator = require("common:widget/validate/validate.js"),
    datePicker = require("common:widget/datepicker/datepicker.js"),
    btn = require("common:widget/btn/btn.js");

/******* page private variables *******/
var validateForm = null;
var smsVFCodeTipsObj=null;
var tryWEB=null;

//start here
$(function(){
    init();//ҳ���ʼ��
    bindEvent(); //ҳ��󶨷���
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


    //�ڱβ㣬��֤�ɹ�
    $("#verifyMsgDivOK").click(verifyMsgDivOKClick);

    //�ڱβ㣬��֤ʧ��
    $("#verifyMsgDivErr").click(function(){
        $('#shadeDiv').hide();
        $('#verifyMsgDiv').hide();
    });
    //���Ͷ�����֤��
    $("#smsVFCodeBtn").click(smsVFCodeBtnClick);

    $("#identityNo").blur(regContactShow);
    $("#identityType").blur(regContactShow);
}

//ҳ���ʼ��
function init(){
    //����
    $("#expiredate").datepicker({
        dateFormat : "yy-mm-dd",
        changeYear : true,
        changeMonth : true,
        yearRange : "c-0:c+20"
    });
    $("#expiredate").attr("readonly","readonly");
    $('#expiredate').css({ 'cursor':'default'});

    //�ڸǲ�
    $("#shadeDiv").css({"width":document.documentElement.scrollWidth+"px",
        "height":document.documentElement.scrollHeight+"px"});

    //��ʼ������֤
    validateForm = new FormValidator(
        'openaccount_step5_form',
        [{
            name : 'userName',
            display:'����',
            rules : 'required|callback_regName_rule'
        },{
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
            name:'expiredate',
            display:'֤����Ч��',
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
            display: '��������',
            posTarget:$("#passwdTipsSpan"),
            rules :  'required|no_blank|alpha_dash|min_length[6]|max_length[8]|callback_passwords'
        },{
            name : 'tradePasswdConfirm',
            display: 'ȷ������',
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
            success : function(datas,evt){  //�첽�ύ����
                btn.disable($("#nextStepBtn"),{
                    color:          '#FF0000',
                    setBtnLoad:     true
                });
                var v= $('#timeUnLimited').prop("checked")
                if(v){
                    datas.expiredate='99999999'; //������Ч
                }
                if(window.GF_VIEWINFO.verifyMode == -1) //ȡ����
                {
                    datas.verifyMethod='';
                }
                //�����ر���
                specialOperationForCMB(datas);
                specialOperationForCGB(datas);
                $.post("/main/account/openaccount/bindCards",datas, function (ret) {
                    if(ret.errno == "00000") {
                        if(typeof(dcsPageTrack)=="function"){
                            dcsPageTrack("WT.si_n","���п���",false,"WT.si_x","�󿨳ɹ�",false,"WT.paybank",ret.bankName,false);
                        }
                        window.location.href="/main/account/openaccount/openaccount_success"
                    }else if(ret.errno == "99998"){
                        //WEB��֤
                       // window.open('/main/account/openaccount/notBindCard','_blank');
                        if(typeof(dcsPageTrack)=="function"){
                            dcsPageTrack("WT.si_n","���п���",false,"WT.si_x","��ʧ��",false,"WT.paybank",ret.bankName,false,"WT.err_type",ret.errmsg,false);
                        }
                        $('#goweb').submit();
                        showVerifyMsgDiv();
                    }else if(tryWEB && ret.tryWEB && "1" ==ret.tryWEB) {
                        $("#bankErrMsg").text(ret.errmsg);
                        if(typeof(dcsPageTrack)=="function"){
                            dcsPageTrack("WT.si_n","���п���",false,"WT.si_x","��ʧ��",false,"WT.paybank",ret.bankName,false,"WT.err_type",ret.errmsg,false);
                        }
                        showBankMsgBox();
                    }else{
                        $('#modalMsgSpan').text(ret.errmsg);
                        $('#myModal').modal();
                        if(typeof(dcsPageTrack)=="function"){
                            dcsPageTrack("WT.si_n","���п���",false,"WT.si_x","��ʧ��",false,"WT.paybank",ret.bankName,false,"WT.err_type",ret.errmsg,false);
                        }
                    }
                    btn.enable($("#nextStepBtn"));
                });
            },
            autoSubmit : false
        }
    );
    validateForm.setMessage('tradePasswdConfirm.matches','������������벻һ��');

    //����
    validateForm.registerCallback('regName_rule',function(value){
//        if(!/^[\u4E00-\u9FA5\uf900-\ufa2d\s\._a-zA-Z]{2,40}$/.test(value)) {
//            return false;
//        }
        if (/^\s{1,}|\s{1,}$/.test(value)) {
            return false;
        }
        return true;
    });
    //validateForm.setMessage('regName_rule','����ֻ���Ǻ��֡���ĸ���㡢�ո���»��ߣ��������������ź�����');
    validateForm.setMessage('regName_rule','����ǰ�����пո�');

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

    //֤����Ч��
    validateForm.registerCallback('expireDateCheck',expireDateCheckFunc);

    //��֤��ʽ��ʼ��,2Ϊ��ҳ��������
    tryWEB=false;
    //�����ر���
    if($("#bankNo").val() == '007' || $("#bankNo").val() == '018'||$("#bankNo").val() == '015' || $("#bankNo").val() == '052'||$("#bankNo").val() == '068'){
        verifyModeShow(true,true,true);
        tryWEB=true;
        $('#verifyMethodDT').prop('checked','checked');
    }else if ($('#bankNo').val() == '038' && $('#childBankNo').val() == '0305'){
        verifyModeShow(false,true,true);
        showMobileInBank(true);//����������Ҫ��ʾ�ֻ�����
        $('#verifyMethodWEB').prop('checked','checked');
    }else if(window.GF_VIEWINFO.verifyMode == 0){ //ֻ��������
        verifyModeShow(false,true,true);
        $('#verifyMethodWEB').prop('checked','checked');
    }else if(window.GF_VIEWINFO.verifyMode == 1){ //ֻ��������
        verifyModeShow(true,false,true);
        $('#verifyMethodDT').prop('checked','checked');
    }else if(window.GF_VIEWINFO.verifyMode == -1){ //ȡϵͳ���ã�ΪWEB��ʽ
        verifyModeShow(false,true,true);
        $('#verifyMethodWEB').prop('checked','checked');
    }else{
        verifyModeShow(true,true,true);
        $('#verifyMethodDT').prop('checked','checked');
        tryWEB=true;
    }

    //֧����������ӯ����Ҫ���뿨��
    if($("#bankNo").val() == '039' || $("#bankNo").val()=='038' && $("#childBankNo").val()=='')
    {
        $('#bankCard_cgroup').addClass('hide');
        validateForm.deleteField('bankCard');
    }else{
        $('#bankCard_cgroup').removeClass('hide');
        validateForm.addField({
            name:'bankCard',
            display:'���п���',
            rules: 'required|numeric|no_blank'
        });
    }

    //����֤�������ʼ��ҳ��
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
//����Ԥ���ֻ�����
function showMobileInBank(bshow)
{
    //����Ԥ���ֻ�����
    if(bshow){
        $('#mobileInBank_cgroup').removeClass('hide');
        validateForm.addField({
            name:'mobileInBank',
            display:'����Ԥ���ֻ�����',
            rules: 'required|numeric|exact_length[11]'
        });
    }else{
        $('#mobileInBank_cgroup').addClass('hide');
        validateForm.deleteField('mobileInBank');
    }
}

//��ʾ��֤��ʽ
function verifyModeShow(showDatFlow,showWeb,includeLabel) {
    validateForm.hideError();
    if (!showDatFlow){
        //����dataflow
        if(includeLabel){
            $('#verifyMethodDT_label').addClass('hide');
        }
        $('#smsVFCode__cgroup').addClass('hide');
        validateForm.deleteField('smsVFCode');
        showMobileInBank(false);
    }else{
        //��ʾdataFlow
        if(includeLabel) {
            $('#verifyMethodDT_label').removeClass('hide');
        }
        showMobileInBank(true);
        $('#smsVFCode__cgroup').removeClass('hide');
        //����У����
        validateForm.addField({
            name:'smsVFCode',
            display:'����У����',
            posTarget : $("#smsVFCodeBtn"),
            rules:'required|no_blank|exact_length[6]|callback_checkSmsVF'
        });
        validateForm.registerCallback('checkSmsVF',function(value){
            var isPassed = true;
            return isPassed;
        }).setMessage('checkSmsVF','����У���벻��ȷ');
    }

    if (!showWeb) {
        //��������
        if(includeLabel) {
            $('#verifyMethodWEB_label').addClass('hide');
        }
    }else{
        //��ʾ����
        if(includeLabel) {
            $('#verifyMethodWEB_label').removeClass('hide');
        }
    }

    //ͬʱ��ʾ
    if(includeLabel && showDatFlow && showWeb){
        $('#verifyMethod_cgroup').removeClass('hide');
    }else if(includeLabel){
        //��ʾһ��ʱҲ����
        $('#verifyMethod_cgroup').addClass('hide');
    }
}

//���е��ر���
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

//���е��ر���
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

//�ڱβ�ɹ���ť
function verifyMsgDivOKClick()
{
    //����Ƿ񿪻��ɹ�
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
                    $('#modalMsgSpan').text('����ʧ�ܣ������ԡ�');
                    $('#myModal').modal();
                }
            }
        }
    });
}

//���Ͷ�����֤��
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
        color:          '#C0C0C0',     //disable���������ɫ
        setBtnLoad:     false        //�Ƿ���ʾLoading��gifͼƬ
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

    //�����ر���
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
                //����ʧ��
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

//���ڼ��
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
        validateForm.setMessage('expireDateCheck',msg);
        return false;
    }
    return true;
}

// ����ʱ
function CountDown(secs){
    $(smsVFCodeTipsObj).html('<span class="text-red text-fontsize16">��'+secs+'������»�ȡ��</span>');
    if(--secs>0){
        setTimeout("CountDown("+secs+")",1000);
    } else {
        btn.enable($("#smsVFCodeBtn"));
        $(smsVFCodeTipsObj).html('');
        //$('#smsVFCodeBtn').html('���»�ȡУ����');
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


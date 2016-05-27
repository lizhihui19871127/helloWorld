var FormValidator = require("common:widget/validate/validate.js"),
    util = require("common:widget/util/util.js"),
    btn = require("common:widget/btn/btn.js");

var validateForm=null;
var year70=false;
//ҳ���ʼ��
function init() {
    //��ʼ������֤
    $("#shadeDiv").css({"width":document.documentElement.scrollWidth+"px",
        "height":document.documentElement.scrollHeight+"px"});
    validateForm = new FormValidator(
        'openaccount_step1_form',
        [
            {
                name:'identityType'
            },
            {
                name: 'identityNO',
                display: '֤������',
                rules: function (value) {
                    var idType = $("#identityType").val(),
                        rules = 'required';

                    if (idType == '0') {
                        return rules + "|valid_identity";
                    }else if(idType == '1'){
                        return rules + "|callback_regPassport_rule"
                    } else{
                        return rules;
                    }
                }
            },
            {
                name: 'userName',
                display: '����',
                rules: 'required|callback_regName_rule' //������Զ�����֤�߼�ע��Ҫ����callback_ǰ׺
            },
            {
                name: 'contphone',
                display: '�ֻ�����',
                rules: 'required' //������Զ�����֤�߼�ע��Ҫ����callback_ǰ׺
            }
        ],
        {
            success: function (datas, evt) {  //����false���ύ,true�ύ
                btn.disable($('#nextbtn'),{
                    color:'#FFFFFF',
                    setBtnLoad: true
                });
                datas.year70=year70;
                datas.verifycode=$("#smsVFCode").val();
                $.ajax({
                    type: "post",
                    url: "/main/account/openaccount/checkUserExist",
                    data: datas,
                    async: false,
                    success: function (result) {
                        var jsondata= result;
                        if(jsondata.errno !='00000' ){
                            $("#modalMsgSpan").text(jsondata.errmsg);
                            $("#DRlogin").addClass('hide');
                            $('#myModal').modal();
                        }else if (jsondata.userType == '5' || jsondata.userType == '2' || jsondata.userType == '0'){//һվͨ�û�
                            $("#modalMsgSpan").html("�����״ε�½����ֱ��ʹ�ò�ѯ�����¼��");
                            $("#DRlogin").removeClass('hide');
                            $('#myModal').modal();
                        }
                    }
                });
                //�����ݷ�cookie�� -_-...
                if(bSubmit){
                    util.cookie.set('OASP1_identityType',datas.identityType);
                    util.cookie.set('OASP1_identityNO',datas.identityNO);
                    util.cookie.set('OASP1_userName',datas.userName);
                    util.cookie.set('OASP1_contact',"");
                    util.cookie.set('OASP1_conttype',"");
                    util.cookie.set('OASP1_contno',"");
                    util.cookie.set('OASP1_contacttimelimited',"");
                    util.cookie.set('OASP1_relationship',"");
                    util.cookie.set('OASP1_contphone',"");
                }
                btn.enable($('#nextbtn'));
                return false;
            }
        }
    );

    //����Զ���У���߼�(��������֤���ֻ���֤���)
    validateForm.registerCallback('regName_rule', function (value) {
        //if (!/^[\u4E00-\u9FA5\uf900-\ufa2d\s\._a-zA-Z]{2,40}$/.test(value)) {
        //    return false;
        //}
        if (/^\s{1,}|\s{1,}$/.test(value)) {
            return false;
        }
        return true;
    });
    //�ж��û����֤���Ƿ����70�꣬�������70��������ʾʵ�ʲ�������Ϣ��������й����տ�����������ĸ������G\P\S\D\E��ͷ


    validateForm.registerCallback("regPassport_rule",function (value){
        if('GPSDE'.indexOf(value.substring(0,1))==-1){
            return false;
        }
        return true;
    });
    validateForm.setMessage('regPassport_rule', '�������֤�������ݲ�֧�ֿ���');
    //�����Զ���У���߼���ʧ����ʾ��
    //validateForm.setMessage('regName_rule', '����ֻ���Ǻ��֡���ĸ���㡢�ո���»��ߣ��������������ź�����');
    validateForm.setMessage('regName_rule', '����ǰ�����пո�');


};

//ҳ��󶨷���
function bindEvent() {
    $("#identityNO").blur(regIdentityShow);
    $("#identityType").blur(regIdentityShow);
    $("#smsVFCodeBtn").click(smsVFCodeBtnClick);
};

function hideVerifyMsgDiv(){
    $('#shadeDiv').hide();
    $('#bankMsgBox').hide();
}


//ÿ��ҳ�濽���������
$(function () {

    init();
    bindEvent();
});
//���Ͷ�����֤��
function smsVFCodeBtnClick() {
    if(validateForm.validateField('contact') != 0 ||
        validateForm.validateField('conttype') !=0 ||
        validateForm.validateField('contno') !=0||
        validateForm.validateField('relationship') !=0||
        validateForm.validateField('contphone') !=0)
    {
        return;
    }
    validateForm.hideError('smsVFCode');
    smsVFCodeTipsObj = btn.disable($("#smsVFCodeBtn"),{
        color:          '#C0C0C0',     //disable���������ɫ
        setBtnLoad:     false        //�Ƿ���ʾLoading��gifͼƬ
    });
    $.ajax({
        type: "post",
        url: "/main/account/openaccount/sendSmsVF",
        data: {"mobileInBank": $('#contphone').val(),
            "noValidate":"true"},
        success: function (msg) {
            //var msgJson = $.parseJSON(msg);
            //var msgJson = $.parseJSON(msg);
            var msgJson = msg;
            if (msgJson.decode != '00000') {
                //����ʧ��
                alert(msgJson.errmsg);
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
    var identityNo = $('#contno').val();
    var _type = $('#conttype').val();

    if(validateForm.validateField('conttype') != 0)
    {
        return false;
    }

    var curDate = new Date();
    var curYear = curDate.getFullYear();
    var curMonth = curDate.getMonth();
    var curDay = curDate.getDate();
    var _nowDate = new Date(curYear, curMonth, curDay);

    var _selectyear = $("#contacttimelimited").val().substring(0, 4);
    var _selectmonth = $("#contacttimelimited").val().substring(5, 7);
    var _selectday = $("#contacttimelimited").val().substring(8, 10);
    var _selecttime = new Date(_selectyear, parseInt(_selectmonth) - 1, _selectday);

    if(!$('#contacttimeUnlimited').prop("checked") && _selecttime <= _nowDate){
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

        if($('#contacttimeUnlimited').prop("checked")){
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




function timeUnLimitedClick()
{
    if($(this).prop('checked')){
        $('#contacttimelimited').val('');
        $('#contacttimelimited').attr('disabled','disabled');
        $('#contacttimelimited').css({ 'cursor':'not-allowed'});
    }else{
        $('#contacttimelimited').removeAttr('disabled');
        $('#contacttimelimited').css({ 'cursor':'default'});
    }
}

function keyUpShip(){
    var str=$("#relationship").val();
    if (typeof str != "string"){
        str += "";
    }
    if(str.replace(/[^\x00-\xff]/g,"01").length>20){

        $("#relationship").val(str.substr(0,10));
    }
}










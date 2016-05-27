var FormValidator = require("common:widget/validate/validate.js"),
    util = require("common:widget/util/util.js"),
    autocitys = require("common:widget/jquery/jquery-autoCitys-plugin-v1.js"),
    dialog = require("common:widget/jquery/jquery-dialog-plug-min.js"),

    btn = require("common:widget/btn/btn.js");


/******* page private variables *******/
var validateForm = null;
var smsVFCodeTipsObj=null;
//start here
$(function(){
    init();
    bindEvent();
    initProvinceCity();

});

//ҳ��󶨷���
function bindEvent(){
    //���Ͷ�����֤��
    $('#smsVFCodeBtn').click(function(){
        validateForm.hideError('smsVFCode');
        var error = validateForm.validateField('mobile');
        if(error.length != 0){
            return;
        }
        smsVFCodeTipsObj = btn.disable($("#smsVFCodeBtn"),{
            color:          '#FF0000',     //disable���������ɫ
            setBtnLoad:     false        //�Ƿ���ʾLoading��gifͼƬ
        });
        var mobile = $('#mobile').val();
        $.ajax({
            type: "post",
            url: "/main/account/openaccount/sendSmsVF",
            data: {"mobileInBank": mobile,
                "noValidate":"true"},
            success: function (msg) {
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
    });



};

//ҳ���ʼ��
function init(){

    if(!util.cookie.get('OASP1_identityType')){
        $('#modalMsgSpan').text('�밴����ȷ�Ĳ��������');
        $('#myModal').modal();
    }

    //��ʼ������֤
    validateForm = new FormValidator(
            'openaccount_step2_form',
            [{
                name : 'passwords',
                display: '��½����',
                rules :  'required|no_blank|min_length[6]|max_length[10]|callback_passwords',
                posTarget:$('#passwdTipsSpanPassword')
            },{
                name : 'passwordsConfirm',
                display:'ȷ������',
                rules :  'required|matches[passwords]'
            },{
                name:'mobile',
                display:'�ֻ�����',
                rules: 'required|no_blank|is_natural|exact_length[11]',
                posTarget:$('#passwdTipsSpanMobile')
            },{
                name:'smsVFCode',
                display:'У����',
                posTarget:$('#smsVFCodeBtn'),
                rules: 'required|no_blank|exact_length[6]|callback_checkSmsVF'
            },{
                name:'email',
                display:'Email��ַ',
                rules: 'valid_email|callback_emailcheck',
                posTarget:$('#passwdTipsSpanEmail')
            },{
                name : 'province'
            },{
                name : 'city'
            },{
                name : 'districtNo'
            },{
                name:'address1',
                display:'ʡ����',
                rules: 'required',
                posTarget:$('#address2')
            },{
                name:'address2',
                display:'��ϸ��ַ',
                rules: 'required|min_length[3]',
                posTarget:$('#address2')
            },{
                name : 'zipcode'
            },{
                name:'agreeCheckbox',
                rules: 'callback_agreeProx',
                posTarget:$("#agreeA")
            }],
            {
                success : function(datas,evt){
                    //console.log(datas);
                    btn.disable($('#nextbtn'),{
                        color:'#FFFFFF',
                        setBtnLoad: true
                    });
                    datas.identityType=util.cookie.get('OASP1_identityType');
                    datas.identityNO=util.cookie.get('OASP1_identityNO');
                    datas.userName=util.cookie.get('OASP1_userName');
                    datas.gender=util.cookie.get('OASP1_gender');
                    datas.vocation= util.cookie.get('OASP1_vocation');
                    datas.contact= util.cookie.get('OASP1_contact');
                    datas.conttype= util.cookie.get('OASP1_conttype');

                    datas.contno= util.cookie.get('OASP1_contno');
                    datas.contacttimelimited= util.cookie.get('OASP1_contacttimelimited');
                    datas.relationship= util.cookie.get('OASP1_relationship');
                    datas.contphone= util.cookie.get('OASP1_contphone');
                    datas.year70=util.cookie.get('OASP1_year70');
                    if(!datas.identityType || !datas.identityNO || !datas.userName || !datas.gender || !datas.vocation)
                    {
                        $('#modalMsgSpan').text('�밴����ȷ�Ĳ��������');
                        $('#myModal').modal();
                        btn.enable($('#nextbtn'));
                        return false;
                    }
                    datas.verifycode=$("#smsVFCode").val();
                    $.post("/main/account/openaccount/idsCreateAccount",datas, function (ret) {
                        if(ret.errno == "00000") {
                            util.cookie.remove('OASP1_identityType');
                            util.cookie.remove('OASP1_identityNO');
                            util.cookie.remove('OASP1_userName');

                            util.cookie.remove('OASP1_gender');
                            util.cookie.remove('OASP1_vocation');
                            util.cookie.remove('OASP1_contact');
                            util.cookie.remove('OASP1_conttype');
                            util.cookie.remove('OASP1_contno');
                            util.cookie.remove('OASP1_contacttimelimited');
                            util.cookie.remove('OASP1_relationship');
                            util.cookie.remove('OASP1_contphone');
                            util.cookie.remove('OASP1_year70');
                            if(typeof(dcsPageTrack)=="function"){
                                dcsPageTrack("WT.si_n","��������",false,"WT.si_x","�����ɹ�",false);
                            }
                            hop_delay(1);//Ϊ��webtrance���b��Ҫ�ӳ���ת
                            //window.location.href = "/main/account/openaccount/openaccount_step3";
                        }else{
                            $('#modalMsgSpan').text(ret.errmsg);
                            $('#myModal').modal();
                            if(typeof(dcsPageTrack)=="function"){
                                dcsPageTrack("WT.si_n","��������",false,"WT.si_x","����ʧ��",false,"WT.err_type",ret.errmsg,false);
                            }
                        }
                        btn.enable($('#nextbtn'));
                    });
                },
                autoSubmit : false
            }
    );
    validateForm.setMessage('passwordsConfirm.matches','������������벻һ��');

    var mobiletips = '��������ȷ���ֻ�����';
    validateForm.setMessage('mobile.no_blank',mobiletips);
    validateForm.setMessage('mobile.is_natural',mobiletips);
    validateForm.setMessage('mobile.exact_length',mobiletips);

    //var pwdtips = '6-10λ��ĸ�����ֻ���ŵ���ϣ����ܰ����ո񣬲���Ϊ������';
    var pwdtips = '��������ȷ������';
    validateForm.setMessage('passwords.no_blank',pwdtips);
    validateForm.setMessage('passwords.min_length',pwdtips);
    validateForm.setMessage('passwords.max_length',pwdtips);
    validateForm.registerCallback('passwords',function(value){
        if(/^(a+|b+|c+|d+|e+|f+|g+|h+|i+|j+|k+|l+|m+|n+|o+|p+|q+|r+|s+|t+|u+|v+|w+|x+|y+|z+|A+|B+|C+|D+|E+|F+|G+|H+|I+|J+|K+|L+|M+|N+|O+|P+|Q+|R+|S+|T+|U+|V+|W+|X+|Y+|Z+|1+|2+|3+|3+|4+|6+|7+|8+|9+|0+)$/.test(value)
            || ("123456789".indexOf(value)>-1 || "987654321".indexOf(value)>-1)){
            return false;
        }
        return true;
    });
    //validateForm.setMessage('passwords','���벻�������ŵ����֡���ȫ��ͬ�����ֻ���ĸ');
    validateForm.setMessage('passwords',pwdtips);

    validateForm.registerCallback('emailcheck',function(value){
        if(value && value.indexOf('@')<2){
            return false;
        }
        return true;
    }).setMessage('emailcheck','@����ǰ������2λ�ַ�');

    validateForm.registerCallback('checkSmsVF',function(value){
        return true;
    });
    validateForm.setMessage('checkSmsVF','У���벻��ȷ');

    //����ͬ��Э��
    validateForm.registerCallback('agreeProx',function(value){
        var v= $('#agreeCheckbox').prop("checked");
        if(!v){
            return false;
        }
        return true;
    });
    validateForm.setMessage('agreeProx','���Ķ����Э��');
};

/******* page private method *******/

// ����ʱ
function CountDown(secs){
    $(smsVFCodeTipsObj).html('<span class="text-red text-fontsize16">��'+secs+'������»�ȡ��</span>');
    if(--secs>0){
        setTimeout("CountDown("+secs+")",1000);
    } else {
        btn.enable($("#smsVFCodeBtn"));
        $(smsVFCodeTipsObj).html('');
    }
}

//�ӳ���ת
function hop_delay(counts) {
    if (counts > 0) {
        counts = counts -1;
        setTimeout("hop_delay(" + counts + ")", 500);
    }else{
        window.location.href = "/main/account/openaccount/openaccount_step3";
    }
}

var config = {'01' : "����",'02' : "����",'03' : "����",'04' : "����",'05' : "����",'06' : "����",
    '07' : "����",'08' :"�۰�̨"};
var province = {'01' : [
    {"id":110000,"name":"������"},
    {"id":120000,"name":"�����"},
    {"id":130000,"name":"�ӱ�ʡ"},
    {"id":150000,"name":"���ɹ�������"}
    ,
    {"id":140000,"name":"ɽ��ʡ"}
],
    '02' : [
        {"id":310000,"name":"�Ϻ���"},
        {"id":320000,"name":"����ʡ"},
        {"id":340000,"name":"����ʡ"},
        {"id":330000,"name":"�㽭ʡ"},
        {"id":370000,"name":"ɽ��ʡ"},
        {"id":350000,"name":"����ʡ"}
    ],
    '03' : [
        {"id":440000,"name":"�㶫ʡ"},
        {"id":460000,"name":"����ʡ"},
        {"id":450000,"name":"����׳��������"}
    ],
    '04' : [
        {"id":410000,"name":"����ʡ"},
        {"id":420000,"name":"����ʡ"},
        {"id":430000,"name":"����ʡ"},
        {"id":360000,"name":"����ʡ"}
    ],
    '05' : [
        {"id":230000,"name":"������ʡ"},
        {"id":220000,"name":"����ʡ"},
        {"id":210000,"name":"����ʡ"}
    ],
    '06' : [
        {"id":630000,"name":"�ຣʡ"},
        {"id":620000,"name":"����ʡ"},
        {"id":640000,"name":"���Ļ���������"},
        {"id":610000,"name":"����ʡ"},
        {"id":650000,"name":"�½�ά�����������"}
    ],
    '07' : [
        {"id":540000,"name":"����������"},
        {"id":510000,"name":"�Ĵ�ʡ"},
        {"id":530000,"name":"����ʡ"},
        {"id":520000,"name":"����ʡ"},
        {"id":500000,"name":"������"}
    ],
    '08' : [
        {"id":810000,"name":"����ر�������"},
        {"id":820000,"name":"�����ر�������"},
        {"id":710000,"name":"̨��ʡ"}
    ]
};

function initProvinceCity()
{
    //����ʡ��ֱϽ���б�


    $.post("/main/account/openaccount/princelist",null, function(data) {

        $('#address1').selectCitys({
            cityConfig : config,
            province : province,
            data : data.princStr,
            callback : function(result)
            {


                if (result.district && result.district.zipCode)
                {
                    $('#zipcode').val(result.district.zipCode);
                } else if (result.city && result.city.zipCode)
                {
                    $('#zipcode').val(result.city.zipCode);
                } else
                {
                    $('#zipcode').val('');
                }
                var _val = "";
                if (result.province && result.province.name)
                {
                    _val += result.province.name;
                    $("#province").val(result.province.id);
                }
                if (result.city && result.city.name)
                {
                    _val += result.city.name;
                    $("#city").val(result.city.id);
                }
                if (result.district && result.district.name)
                {
                    _val += result.district.name;
                    $("#districtNo").val(result.district.id);
                }
                $("#address1").val(_val);
            }
        });
    });
}








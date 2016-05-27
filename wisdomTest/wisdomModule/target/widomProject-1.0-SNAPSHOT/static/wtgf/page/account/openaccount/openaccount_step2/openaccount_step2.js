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

//页面绑定方法
function bindEvent(){
    //发送短信验证码
    $('#smsVFCodeBtn').click(function(){
        validateForm.hideError('smsVFCode');
        var error = validateForm.validateField('mobile');
        if(error.length != 0){
            return;
        }
        smsVFCodeTipsObj = btn.disable($("#smsVFCodeBtn"),{
            color:          '#FF0000',     //disable后字体的颜色
            setBtnLoad:     false        //是否显示Loading的gif图片
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
                    //发送失败
                    alert(msgJson.errmsg);
                    btn.enable($("#smsVFCodeBtn"));
                } else {
                    CountDown(90);
                }
            }
        });
    });



};

//页面初始化
function init(){

    if(!util.cookie.get('OASP1_identityType')){
        $('#modalMsgSpan').text('请按照正确的步骤操作。');
        $('#myModal').modal();
    }

    //初始化表单验证
    validateForm = new FormValidator(
            'openaccount_step2_form',
            [{
                name : 'passwords',
                display: '登陆密码',
                rules :  'required|no_blank|min_length[6]|max_length[10]|callback_passwords',
                posTarget:$('#passwdTipsSpanPassword')
            },{
                name : 'passwordsConfirm',
                display:'确认密码',
                rules :  'required|matches[passwords]'
            },{
                name:'mobile',
                display:'手机号码',
                rules: 'required|no_blank|is_natural|exact_length[11]',
                posTarget:$('#passwdTipsSpanMobile')
            },{
                name:'smsVFCode',
                display:'校验码',
                posTarget:$('#smsVFCodeBtn'),
                rules: 'required|no_blank|exact_length[6]|callback_checkSmsVF'
            },{
                name:'email',
                display:'Email地址',
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
                display:'省市区',
                rules: 'required',
                posTarget:$('#address2')
            },{
                name:'address2',
                display:'详细地址',
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
                        $('#modalMsgSpan').text('请按照正确的步骤操作。');
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
                                dcsPageTrack("WT.si_n","开户流程",false,"WT.si_x","开户成功",false);
                            }
                            hop_delay(1);//为了webtrance这个b需要延迟跳转
                            //window.location.href = "/main/account/openaccount/openaccount_step3";
                        }else{
                            $('#modalMsgSpan').text(ret.errmsg);
                            $('#myModal').modal();
                            if(typeof(dcsPageTrack)=="function"){
                                dcsPageTrack("WT.si_n","开户流程",false,"WT.si_x","开户失败",false,"WT.err_type",ret.errmsg,false);
                            }
                        }
                        btn.enable($('#nextbtn'));
                    });
                },
                autoSubmit : false
            }
    );
    validateForm.setMessage('passwordsConfirm.matches','两次输入的密码不一致');

    var mobiletips = '请输入正确的手机号码';
    validateForm.setMessage('mobile.no_blank',mobiletips);
    validateForm.setMessage('mobile.is_natural',mobiletips);
    validateForm.setMessage('mobile.exact_length',mobiletips);

    //var pwdtips = '6-10位字母、数字或符号的组合，不能包含空格，不能为简单密码';
    var pwdtips = '请输入正确的密码';
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
    //validateForm.setMessage('passwords','密码不能是连号的数字、完全相同的数字或字母');
    validateForm.setMessage('passwords',pwdtips);

    validateForm.registerCallback('emailcheck',function(value){
        if(value && value.indexOf('@')<2){
            return false;
        }
        return true;
    }).setMessage('emailcheck','@符号前必须有2位字符');

    validateForm.registerCallback('checkSmsVF',function(value){
        return true;
    });
    validateForm.setMessage('checkSmsVF','校验码不正确');

    //必须同意协议
    validateForm.registerCallback('agreeProx',function(value){
        var v= $('#agreeCheckbox').prop("checked");
        if(!v){
            return false;
        }
        return true;
    });
    validateForm.setMessage('agreeProx','请阅读相关协议');
};

/******* page private method *******/

// 倒计时
function CountDown(secs){
    $(smsVFCodeTipsObj).html('<span class="text-red text-fontsize16">（'+secs+'秒后重新获取）</span>');
    if(--secs>0){
        setTimeout("CountDown("+secs+")",1000);
    } else {
        btn.enable($("#smsVFCodeBtn"));
        $(smsVFCodeTipsObj).html('');
    }
}

//延迟跳转
function hop_delay(counts) {
    if (counts > 0) {
        counts = counts -1;
        setTimeout("hop_delay(" + counts + ")", 500);
    }else{
        window.location.href = "/main/account/openaccount/openaccount_step3";
    }
}

var config = {'01' : "华北",'02' : "华东",'03' : "华南",'04' : "华中",'05' : "东北",'06' : "西北",
    '07' : "西南",'08' :"港澳台"};
var province = {'01' : [
    {"id":110000,"name":"北京市"},
    {"id":120000,"name":"天津市"},
    {"id":130000,"name":"河北省"},
    {"id":150000,"name":"内蒙古自治区"}
    ,
    {"id":140000,"name":"山西省"}
],
    '02' : [
        {"id":310000,"name":"上海市"},
        {"id":320000,"name":"江苏省"},
        {"id":340000,"name":"安徽省"},
        {"id":330000,"name":"浙江省"},
        {"id":370000,"name":"山东省"},
        {"id":350000,"name":"福建省"}
    ],
    '03' : [
        {"id":440000,"name":"广东省"},
        {"id":460000,"name":"海南省"},
        {"id":450000,"name":"广西壮族自治区"}
    ],
    '04' : [
        {"id":410000,"name":"河南省"},
        {"id":420000,"name":"湖北省"},
        {"id":430000,"name":"湖南省"},
        {"id":360000,"name":"江西省"}
    ],
    '05' : [
        {"id":230000,"name":"黑龙江省"},
        {"id":220000,"name":"吉林省"},
        {"id":210000,"name":"辽宁省"}
    ],
    '06' : [
        {"id":630000,"name":"青海省"},
        {"id":620000,"name":"甘肃省"},
        {"id":640000,"name":"宁夏回族自治区"},
        {"id":610000,"name":"陕西省"},
        {"id":650000,"name":"新疆维吾尔族自治区"}
    ],
    '07' : [
        {"id":540000,"name":"西藏自治区"},
        {"id":510000,"name":"四川省"},
        {"id":530000,"name":"云南省"},
        {"id":520000,"name":"贵州省"},
        {"id":500000,"name":"重庆市"}
    ],
    '08' : [
        {"id":810000,"name":"香港特别行政区"},
        {"id":820000,"name":"澳门特别行政区"},
        {"id":710000,"name":"台湾省"}
    ]
};

function initProvinceCity()
{
    //创建省、直辖市列表


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








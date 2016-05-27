var FormValidator = require("common:widget/validate/validate.js"),
    util = require("common:widget/util/util.js"),
    datePicker = require("common:widget/datepicker/datepicker.js"),
    btn = require("common:widget/btn/btn.js");

var validateForm=null;
var year70=false;
//页面初始化
function init() {
    //初始化表单验证
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
                display: '证件号码',
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
                display: '姓名',
                rules: 'required|callback_regName_rule' //这里的自定义验证逻辑注意要加上callback_前缀
            },
            {
                name: 'gender',
                display: '性别',
                rules: 'required' //这里的自定义验证逻辑注意要加上callback_前缀
            },
            {
                name: 'vocation',
                display: '职业',
                rules: 'required' //这里的自定义验证逻辑注意要加上callback_前缀
            }
        ],
        {
            success: function (datas, evt) {  //返回false则不提交,true提交
                //检查用户是否开户
                var bSubmit = false;
                btn.disable($('#nextbtn'),{
                    color:'#FFFFFF',
                    setBtnLoad: true
                });
                datas.year70=year70;
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
                        }else if (jsondata.userType == '5'){//一站通用户
                            $("#modalMsgSpan").html("您好！您已经是广发基金客户，请直接" +
                                "<a href=\"https://sso.gffunds.com.cn/ids/gfsso/login.jsp\" " +
                                "style=\"color:blue;\">登录</a>。");
                            $("#DRlogin").addClass('hide');
                            $('#myModal').modal();
                        }else if(jsondata.userType == '0') //代销户，使用非默认密码
                        {
                            $('#shadeDiv').show();
                            $('#bankMsgBox').show();
                        }else if(jsondata.userType == '2'){//直销户，已经绑卡
                            $("#modalMsgSpan").html("您好！您已经是广发基金客户，请直接<a href=\"https://trade.gffunds.com.cn\" " +
                                "style=\"color:blue;\">登录</a>。");
                            $("#DRlogin").removeClass('hide');
                            $('#myModal').modal();
                        }else{
                            bSubmit=true;
                        }
                    }
                });
                //console.log(datas);
                //表单内容放cookie， -_-...
                if(bSubmit){
                    util.cookie.set('OASP1_identityType',datas.identityType);
                    util.cookie.set('OASP1_identityNO',datas.identityNO);
                    util.cookie.set('OASP1_userName',datas.userName);
                    util.cookie.set('OASP1_gender',datas.gender);
                    util.cookie.set('OASP1_vocation',datas.vocation);

                    if(''!=datas.contact && null!=datas.contact && undefined!=datas.contact){
                        util.cookie.set('OASP1_contact',datas.contact);
                        util.cookie.set('OASP1_conttype',datas.conttype);
                        util.cookie.set('OASP1_contno',datas.contno);
                        var v= $('#contacttimeUnlimited').prop("checked");
                        if(v){
                            util.cookie.set('OASP1_contacttimelimited',"99999999");
                        } else{
                            util.cookie.set('OASP1_contacttimelimited',datas.contacttimelimited);
                        }


                        util.cookie.set('OASP1_relationship',datas.relationship);
                        util.cookie.set('OASP1_contphone',datas.contphone);
                    }else{
                        util.cookie.set('OASP1_contact',"");
                        util.cookie.set('OASP1_conttype',"");
                        util.cookie.set('OASP1_contno',"");
                        util.cookie.set('OASP1_contacttimelimited',"");

                        util.cookie.set('OASP1_relationship',"");
                        util.cookie.set('OASP1_contphone',"");
                    }
                    util.cookie.set('OASP1_year70',year70);

                }
                btn.enable($('#nextbtn'));
                return bSubmit;
            }
        }
    );

    //添加自定义校验逻辑(可用于验证如手机验证码等)
    validateForm.registerCallback('regName_rule', function (value) {
        //if (!/^[\u4E00-\u9FA5\uf900-\ufa2d\s\._a-zA-Z]{2,40}$/.test(value)) {
        //    return false;
        //}
        if (/^\s{1,}|\s{1,}$/.test(value)) {
            return false;
        }
        return true;
    });
    //判断用户身份证号是否大于70岁，如果大于70岁则需显示实际操作人信息，如果是中国护照开户，则首字母必须以G\P\S\D\E开头


    validateForm.registerCallback("regPassport_rule",function (value){
        if('GPSDE'.indexOf(value.substring(0,1))==-1){
            return false;
        }
        return true;
    });
    validateForm.setMessage('regPassport_rule', '您输入的证件号码暂不支持开户');
    //设置自定义校验逻辑的失败提示语
    //validateForm.setMessage('regName_rule', '姓名只能是汉字、字母、点、空格和下划线，不允许其他符号和数字');
    validateForm.setMessage('regName_rule', '姓名前后不能有空格');


};

//页面绑定方法
function bindEvent() {
    $("#bankMsgBoxClose").click(hideVerifyMsgDiv);
    $("#identityNO").blur(regIdentityShow);
    $("#identityType").blur(regIdentityShow);
    $("#contacttimeUnlimited").click(timeUnLimitedClick);
    $("#smsVFCodeBtn").click(smsVFCodeBtnClick);
};
function regContactShow(){

    validateForm.hideError();
    var idType = $("#conttype").val();
    var identityNo= $("#contno").val();

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

               $("#contacttimeUnlimited").attr("disabled",true);
            $("#contacttimeUnlimited").attr("checked",false);
            $('#contacttimelimited').removeAttr('disabled','');
            $('#contacttimelimited').css({ 'cursor':'default'});

        }else{
            $("#contacttimeUnlimited").attr("disabled",false);
            $('#contacttimelimited').removeAttr('disabled');
            $('#contacttimelimited').css({ 'cursor':'default'});

            if($("#contacttimeUnlimited").prop('checked')){
                $('#contacttimelimited').val('');
                $('#contacttimelimited').attr('disabled','disabled');
                $('#contacttimelimited').css({ 'cursor':'not-allowed'});
            }

        }

    } else{
        $("#contacttimeUnlimited").attr("disabled",false);
        $('#contacttimelimited').css({ 'cursor':'default'});
    }
}

function regIdentityShow(){
    var idType = $("#identityType").val();
    var identityNo= $("#identityNO").val();
    validateForm.hideError();
    var birth,now,years;
    if(idType=='0' && identityNo!='' && (identityNo.length == 18 || identityNo.length == 15)){
        now = new Date();

        if(identityNo.length == 15){

             if((parseInt(identityNo.substr(14,1))&1)===0){
                 $("#gender").val('2');
             } else{
                 $("#gender").val('1') ;

             }

            birth = new Date(1900+identityNo.substr(6,2),identityNo.substr(8,2) - 1,identityNo.substr(10,2));
            years = (now.getTime() - birth.getTime()) / ( 365 * 24 * 60 * 60 * 1000);


        }
        if(identityNo.length == 18){

            if((parseInt(identityNo.substr(16,1))&1)===0){
                $("#gender").val('2');
            } else{
                $("#gender").val('1') ;

            }
             birth = new Date(identityNo.substring(6,10),identityNo.substring(10,12) - 1,identityNo.substring(12,14)),
             years = (now.getTime() - birth.getTime()) / ( 365 * 24 * 60 * 60 * 1000);
        }





        if(years>=70){
            year70=true;
            //证件有效期
             $("#contacttimelimited").datepicker({
             dateFormat : "yy-mm-dd",
             changeYear : true,
             changeMonth : true,
             yearRange : "c-0:c+20"
             });
             $("#contacttimelimited").attr("readonly","readonly");
             $('#contacttimelimited').css({ 'cursor':'default'});

            $("#line_p").removeClass('hide');
            $("#title_p").removeClass("hide");
            $("#conttype_cgroup").removeClass("hide");
            $("#contno_cgroup").removeClass("hide");
            $("#contacttimelimited_cgroup").removeClass("hide");
            $("#contact_cgroup").removeClass("hide");
            $("#contphone_cgroup").removeClass("hide");
            $("#smsVFCode__cgroup").removeClass("hide");
            $("#relationship_cgroup").removeClass("hide");
            validateForm.addField({
                name:'contact',
                display:'实际操作人姓名',
                rules: 'required|callback_regContact_rule'
            });
            validateForm.addField({
                name:'conttype',
                display:'证件类型',
                rules: 'required'
            });
            validateForm.addField({
                name:'contno',
                display:'证件号码',
                rules: function (value) {
                    var idType = $("#conttype").val(),
                        rules = 'required';

                    if (idType == '0') {
                        return rules + "|valid_identity";
                    }else if(idType == '1'){
                        return rules + "|callback_regPassport_rule"
                    } else{
                        return rules;
                    }
                }
            });
            validateForm.addField({
                name:'contacttimelimited',
                display:'证件有效期',
                rules : function(value){
                    var rules = 'required|callback_expireDateCheck';
                    if(($('#contacttimeUnlimited').prop("checked"))){
                        rules ='callback_expireDateCheck';
                    }
                    return rules;
                },
                posTarget : $("#noTimeLimitChkbox")
            });

            validateForm.addField({
                name:'relationship',
                display:'与账户持有人关系',
                rules: 'required|no_blank|callback_regShip_rule|callback_regShipLen_rule|callback_regShipName_rule'
            });

            validateForm.addField({
                name:'contphone',
                display:'手机号码',
                rules: 'required|numeric|exact_length[11]'
            });

            //短信校验码
            validateForm.addField({
                name:'smsVFCode',
                display:'短信校验码',
                posTarget : $("#smsVFCodeBtn"),
                rules:'required|no_blank|exact_length[6]|callback_checkSmsVF'
            });
            validateForm.registerCallback('checkSmsVF',function(value){
                return true;
            }).setMessage('checkSmsVF','短信校验码不正确');
            validateForm.registerCallback('expireDateCheck',expireDateCheckFunc);
            $("#contno").blur(regContactShow);
            $("#conttype").blur(regContactShow);

            validateForm.registerCallback('regContact_rule', function (value) {
                //if (!/^[\u4E00-\u9FA5\uf900-\ufa2d\s\._a-zA-Z]{2,40}$/.test(value)) {
                //    return false;
                //}
                if (/^\s{1,}|\s{1,}$/.test(value)) {
                    return false;
                }
                return true;
            });

            validateForm.setMessage('regContact_rule', '实际操作人姓名前后不能有空格');

            validateForm.registerCallback('regShip_rule', function (value) {
                //if (!/^[\u4E00-\u9FA5\uf900-\ufa2d\s\._a-zA-Z]{2,40}$/.test(value)) {
                //    return false;
                //}
                if (/^\s{1,}|\s{1,}$/.test(value)) {
                    return false;
                }
                return true;
            });


            validateForm.setMessage('regShip_rule', '与账户持有人关系前后不能有空格');
            validateForm.registerCallback('regShipLen_rule', function (value) {
                if(value.replace(/[^\x00-\xff]/g,"01").length>20){
                    return false;
                }
                return true;
            });


            validateForm.setMessage('regShipLen_rule', '与账户持有人关系长度不能超过20个字符!');
            validateForm.registerCallback('regShipName_rule', function (value) {

                var regu = "^[\u4e00-\u9fa5]+$";
                var re = new RegExp(regu);
                if (!re.test(value)) {
                       return false;
                }

                return true;
            });
            validateForm.setMessage('regShipName_rule', '与账户持有人关系只允许输入中文!');



        }else{
            $("#line_p").addClass('hide');
            $("#title_p").addClass("hide");
            $("#conttype_cgroup").addClass("hide");
            $("#contno_cgroup").addClass("hide");
            $("#contacttimelimited_cgroup").addClass("hide");
            $("#contact_cgroup").addClass("hide");
            $("#contphone_cgroup").addClass("hide");
            $("#smsVFCode__cgroup").addClass("hide");
            $("#relationship_cgroup").addClass("hide");
            year70=false;

            validateForm.deleteField('contact');
            validateForm.deleteField('contno');
            validateForm.deleteField('conttype');
            validateForm.deleteField('contacttimelimited');
            validateForm.deleteField('relationship');
            validateForm.deleteField('contphone');
            validateForm.deleteField('smsVFCode');
        }


    }else{
        $("#line_p").addClass('hide');
        $("#title_p").addClass("hide");
        $("#conttype_cgroup").addClass("hide");
        $("#contno_cgroup").addClass("hide");
        $("#contacttimelimited_cgroup").addClass("hide");
        $("#contact_cgroup").addClass("hide");
        $("#contphone_cgroup").addClass("hide");
        $("#smsVFCode__cgroup").addClass("hide");
        $("#relationship_cgroup").addClass("hide");

        year70=false;
        validateForm.deleteField('contact');
        validateForm.deleteField('contno');
        validateForm.deleteField('conttype');
        validateForm.deleteField('contacttimelimited');
        validateForm.deleteField('relationship');
        validateForm.deleteField('contphone');
        validateForm.deleteField('smsVFCode');
    }



}
function hideVerifyMsgDiv(){
    $('#shadeDiv').hide();
    $('#bankMsgBox').hide();
}


//每个页面拷贝这个方法
$(function () {

    init();
    bindEvent();
});
//发送短信验证码
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
        color:          '#C0C0C0',     //disable后字体的颜色
        setBtnLoad:     false        //是否显示Loading的gif图片
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
                //发送失败
                alert(msgJson.errmsg);
                btn.enable($("#smsVFCodeBtn"));
            } else {
                CountDown(90);
            }
        }
    });
}

//日期检查
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
        msg = '您选择的证件有限期不在有效范围内';
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
                msg = '您未满18周岁,根据您的证件号码推算您的证件有限期最大期限是' + (curYear + 5) + "年" + (curMonth + 1) + "月"+curDay+"日";
            }
        }
        else if (age18 >= age && age26 < age)
        {
            var currentDate = new Date(curYear+10, curMonth, curDay);
            if (_selecttime > currentDate)
            {
                msg = '您未满26周岁,根据您的证件号码推算您的证件有限期最大期限是' + (curYear + 10) + "年" + (curMonth + 1) + "月"+curDay+"日";
            }
        }
        else if (age26 >= age && age46 < age)
        {
            var currentDate = new Date(curYear+20, curMonth, curDay);
            if (_selecttime> currentDate)
            {
                msg = '您未满46周岁,根据您的证件号码推算您的证件有限期最大期限是' + (curYear+ 20) + "年" + (curMonth + 1) + "月"+curDay+"日";
            }
        }
    }
    if(msg != ""){
        validateForm.setMessage('expireDateCheck',msg);
        return false;
    }
    return true;
}

// 倒计时
function CountDown(secs){
    $(smsVFCodeTipsObj).html('<span class="text-red text-fontsize16">（'+secs+'秒后重新获取）</span>');
    if(--secs>0){
        setTimeout("CountDown("+secs+")",1000);
    } else {
        btn.enable($("#smsVFCodeBtn"));
        $(smsVFCodeTipsObj).html('');
        //$('#smsVFCodeBtn').html('重新获取校验码');
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










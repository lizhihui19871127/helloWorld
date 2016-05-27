var util = require("common:widget/util/util.js"),
btn = require("common:widget/btn/btn.js"),
modal = require("wtgf:widget/modal/modal.js"),
FormValidator = require("common:widget/validate/validate.js");
var verifyToken = "";
var nIntervId;
var secondCount = 90;
//��֤��
var validateForm = null;
var smsVFCodeTipsObj;
var main = (function(){
    var _init = function(){
        //��ʼ������֤
        validateForm = new FormValidator(
            'frm',
            [
                {
                    name : 'mobilePhone',
                    display:'�ֻ�����',
                    posTarget:$("#telNote"),
                    rules : 'required|valid_tel_phone'
                },{
                    name : 'verifyCode',
                    display:'��֤��',
                    posTarget:$("#verifyCodeBtn"),
                    rules : 'required|numeric'
                },{
                    name : 'loginPassWord',
                    display:'��¼����',
                    posTarget:$("#pwdNote"),
                    rules :  'required|no_blank|min_length[6]|max_length[20]|callback_passwords'
                },{
                    name : 'loginPasswdConfirm',
                    display:'ȷ������',
                    rules :  'required|matches[loginPassWord]'
                },
                {
                    name:'agreeCheckbox',
                    rules: 'callback_agreeProx',
                    posTarget:$("#qyxy")
                }
            ],
            {
                success : function(datas,evt){  //�첽�ύ����
                    if(checkTelExiste()){
                        return false;
                    }
                    submitForm();
                },
                autoSubmit : false
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
        validateForm.setMessage('passwords','6-20λ���֡���ĸ�����ŵ���ϣ��ִ�Сд��');

        //�������룬��������������
        validateForm.registerCallback('passwords_equal',function(value){
            var v= $("#loginPasswdConfirm").val();
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
        validateForm.setMessage('agreeProx','���Ķ����㷢�������Э�顷');
    };

    var bindEvent = function(){
        $("#verifyCodeBtn").click(function(){
            if(!checkTelExiste()){
                smsVFCodeBtnClick();
            }
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
});

//�ж��ֻ������Ƿ��Ѿ�ע��
function checkTelExiste(){
    var b = false;
    $.ajax({
        type: "post",
        url: "/main/register/checkTelExiste",
        async:false,
        data: {"mobilePhone":$("#mobilePhone").val()},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                modal.showModal(msgJson.returnmsg);
                b = true;
            }else{
                if(msgJson.isExiste){
                    modal.showModal("���ֻ������Ѿ�ע�ᡣ");
                    b = true;
                }
            }
        }
    });
    return b;
}

//���Ͷ�����֤��
function smsVFCodeBtnClick() {
    if(validateForm.validateField('mobilePhone') !=0)
    {
        return;
    }
    $("#verifyCodeMsg").hide();
    smsVFCodeTipsObj = btn.disable($("#verifyCodeBtn"),{
        color:          '#C0C0C0',     //disable���������ɫ
        height:'28px',
        setBtnLoad:     false        //�Ƿ���ʾLoading��gifͼƬ
    });
    $.ajax({
        type: "post",
        url: "/main/register/verifyCode",
        data: {"mobilePhone":$('#mobilePhone').val()},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                //����ʧ��
                modal.showModal(msgJson.returnmsg);
                btn.enable($("#verifyCodeBtn"));
            } else {
                $("#verifyCodeMsg").show();
                verifyToken = "1";
                $("#verifyToken").val(verifyToken);
                $(smsVFCodeTipsObj).html('��'+(secondCount--)+'������»�ȡ��');
                nIntervId = setInterval(CountDown, 1000);
            }
        }
    });
}

//����90�뵹��ʱ
function CountDown(){
    $(smsVFCodeTipsObj).html('��'+secondCount+'������»�ȡ��');
    if(--secondCount<0){
        clearCountDown();
    }
}
//�������90�뵹��ʱ����
function clearCountDown(){
    btn.enable($("#verifyCodeBtn"));
    if(smsVFCodeTipsObj != undefined){
        $(smsVFCodeTipsObj).html('');
    }
    clearInterval(nIntervId);
    secondCount = 90;
}

//�ύ
function submitForm(){
    if(verifyToken == null || verifyToken == ""){
        modal.showModal("���ȡ������֤�롣");
        return false;
    }else{
        btn.setDisabled($('#J_submitButton'));
        var type = 0;//Ĭ����0(0:ֱ���û�ע��һ��ͨ��1:�ⲿ�����ͻ�ע��һ��ͨ)
        var url = "/main/register/addUser";
        var dataT = {"mobilePhone":$('#mobilePhone').val(),"verifyCode":$("#verifyCode").val(),"loginPassWord":$("#loginPassWord").val()};
        //�����ж���ֱ���û�ע�ᣬ�����ⲿ�����û�ע��
        var name = $("#name").val();
        if(name != null && name != ""){
            type = 1;
            url = "/main/register/otherAccountRegister";
            var name = $("#name").val();
            dataT = {"mobilePhone":$('#mobilePhone').val(),"verifyCode":$("#verifyCode").val(),"loginPassWord":$("#loginPassWord").val(),
                    "name":name,"identityType":$("#identityType").val(),"identityNo":$("#identityNo").val()};
        }
        $.ajax({
            type: "post",
            url: url,
            data:dataT,
            success: function (msg) {
                var msgJson = msg;
                if (!msgJson.issuccess) {
                    //ע��ʧ��
                    modal.showModal(msgJson.returnmsg);
                    btn.setEnabled($("#J_submitButton"));
                } else {
                    if(type == 0){
                        var id = msgJson.id;
                        window.location.href = "/main/register/success?id="+id;
                    }else{
                        window.location.href = "/main/register/otherAccountRegisterSuccess";
                    }
                }
            }
        });
    }
}
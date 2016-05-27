var FormValidator = require("common:widget/validate/validate.js"),
    datePicker = require("common:widget/datepicker/datepicker.js"), //ע��������ڿռ䣬require����֮��û�з����κζ���
                                                                    //require֮��ֱ��$('xxx').datepicker�����ü���
    btn = require("common:widget/btn/btn.js");

var page = (function(){

    var init = function(){
        
        initFormValidate(); //��ʼ������֤
        initDatePicker();
        
    };

    var bindEvent = function(){
        $("#addTest2").on("change",processTestField);
        $("#addTest1").on("change",processTestField);
        $("#verifyCodeBtn").click(sendVerifyCode);
    };


    /******* page private variables *******/
    window.validateForm = null;

    /******* page private function ********/
    var initFormValidate = function(){
                
        validateForm = new FormValidator(
            'formName',

            [{
                name : 'email',                         //nameΪ���ֶε�name����
                display : '�����ַ',                   //display���������ڴ�����ʾ������ʾ,��:"xxx����Ϊ��"
                rules : 'required|valid_email'          //���rulesʹ��|���зָĬ���Դ���rule���ṩ������ʾ��
            },{
                name : 'buyNum',
                display: '�깺��',
                rules : 'required|decimal|greater_than[100]|less_than[1500000]' //У���깺��������
            },{
                name : 'password',
                display: '����',
                rules : 'required|no_blank|min_length[6]|max_length[10]'        //�����У����Ը����Լ�������ƴ��
            },{
                name : 'noRuleEle'                      //����������ֶ����κ�У����򣬿�������д
                                                        //�����д����success�ص������в��������datas������
            },{
                name : 'telphone',
                display: '�ֻ�����',
                rules : 'required|valid_tel_phone'      //�ֻ�����У�飨ֻƥ���ֻ����룬����ʲô�Ĳ��У�
            },{
                name : 'verifyCode',
                display: '�ֻ���֤��',
                rules : 'required|callback_verify_code',
                posTarget : $("#verifyCodeBtn")
            },{
                name : 'phone',
                display: '�绰����',
                rules : 'required|valid_phone'          //��ͨ�ĵ绰����У��
            },{
                name : 'idNum',                         //rules������һ������������󷵻�һ��rules�ַ���
                display: '֤������',                    //����÷�������������ʽУ�飬���ֻ���֤���
                rules : function(value){
                    var idType = $("#idType").val(),
                        rules = 'required';

                    if(idType == '1'){
                        return rules + "|valid_identity";
                    }else{
                        return rules;
                    }
                }
            },{
                name : 'dateEle',
                display: '����',
                rules : 'required'
            },{
                name : 'customTest',
                rules : 'required|callback_custom_rule' //������Զ�����֤�߼�ע��Ҫ����callback_ǰ׺
            },{
                name : 'posTestInput',
                display: 'λ�ò���',
                rules : 'required',
                posTarget : $("#posTestBtn")            //��ʱ�������ʾ��λ����Ҫ��λ�������ط�������������
            }],

            {
                fail : function(errors,evt){    //��֤ʧ�ܺ�Ļص�������errors������֤ʧ�ܵ��ֶ���Ϣ
                    //console.log(errors);
                    //������ԶԴ�������Զ��崦��
                    //������showErrorΪfalse
                    //Ȼ���Լ�����Щ��������Զ�����ʾ
                },
                success : function(datas,evt){  //��֤ͨ����Ļص�����,datas�������ֶε�json��ʽ����
                    //console.log(datas); 
                    alert('У��ɹ�');
                    //�������ʹ��ajax�ύ��
                    //ǰ����autoSubmit����Ϊfalse
                },
                autoSubmit : false,             //��֤ͨ�����Ƿ��Զ��ύ��(Ĭ��Ϊtrue),�����ʹ��ajax�ύ������������Ϊfalse
                showError : true                //��֤ʧ�ܺ��Ƿ��Զ���ʾ����(Ĭ��Ϊtrue)
            }
        );

        //����Զ���У���߼�(��������֤���ֻ���֤���)
        validateForm.registerCallback('custom_rule',function(value){
            if(!isNaN(parseInt(value)) && parseInt(value) > 5){
                return true;
            }else{
                return false;
            }
        }).setMessage('custom_rule','���ֶα������1'); //�����Զ���У���߼���ʧ����ʾ��


        validateForm.registerCallback('verify_code',function(value){
            //����������֤�ֻ���֤���Ƿ�һ��,ע�⣺ajax��������Ϊͬ��(��async : false),�����ſ���������֤�� 
            
            var verifyCodeUrl = "/wtgf/verifyCode", //���URL��server.conf�н���ģ��
                result = false;

            var ret = $.ajax(verifyCodeUrl,{
                type : 'GET',
                async : false,
                data : {
                    verifyCode : value
                },
                success : function(ret){
                    if(ret.errno == 0){
                        result = true;
                    }else{
                        result = false;
                    }
                }
            });
            
            return result;

        }).setMessage('verify_code','�ֻ���֤���������');
    };

    var initDatePicker = function(){
        $("#dateEle").datepicker({
            dateFormat : "yy-mm-dd",
            changeYear : true,
            changeMonth : true
        });
    };

    //�����Ƕ�̬�󶨵�����ֶκ���(������ʵ������function���͵�rules����ɣ�����Ϊ����ʾ���ܶ�ʹ��addField��
    var processTestField = function(e){
        if($("#addTest2").get(0).checked){
            $(".addTestTarget").show();
            validateForm.addField({
                name : 'addTestInput',
                display : '��̬��Ӳ����ֶ�',
                rules : 'required'
            });
        }else{
            $(".addTestTarget").hide();
            validateForm.deleteField('addTestInput');
        }
    };

    //�����ֻ���֤��
    var sendVerifyCode = function(e){
        var error = validateForm.validateField('phone');
        if(error.length == 0){

            //ִ�з�����֤���߼�
            alert("�ֻ���֤ͨ������ʼ������֤��");  //����ģ��һ�·�����֤��,ʵ�ʾ��Ƿ�һ��get��ajax

            var self = this,
                coverBtn = btn.disable(self),       //���ð�ť��ʵ�ַ����ǽ���ǰ��ť����һ����Ȼ�����ԭ�еİ�ť��
                count = 60,                         //�Ѵﵽ���õ�Ч�������������ڽ��ð�ť���޸İ�ť������
                timer = setInterval(function(){     //��Ҫ��������������Ǹ���ť��btn.disable�᷵�������ť����

                    $(coverBtn).html("�ѷ�����֤��(" + count-- + ")");      //��������ڲ�����������İ�ť
                                                                            //ע�⣬����޸ĺ�ť��С��ԭ����С����¶��
                    if(count < 0){
                        clearInterval(timer); 
                        btn.enable(self);
                    }
                },1000);
        }
    };


    /******* export ********/
    return {
        init : init,
        bindEvent : bindEvent
    };
})();

//run the page code
$(function(){
    page.init();
    page.bindEvent();
});

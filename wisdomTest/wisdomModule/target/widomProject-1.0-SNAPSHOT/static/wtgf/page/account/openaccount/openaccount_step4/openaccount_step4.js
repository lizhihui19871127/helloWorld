var FormValidator = require("common:widget/validate/validate.js");

//ҳ���ʼ��
function init(){

}

//ҳ��󶨷���
function bindEvent() {
    $("input[id^=bankShowKey]").click(function(){
        $('input[id^=selectedBankImg]').attr("disabled","disabled");
        $('#selectedBankImg_'+ this.value).removeAttr("disabled");
        if(typeof(dcsPageTrack)=="function"){
            dcsPageTrack("WT.si_n","���п���",true,"WT.si_x","���п���Ϣ����",true, "WT.paybank","xxx��������",true);
        }
    })

    $("input#bankShowKey:first").click();
}

//ÿ��ҳ�濽���������
$(function(){
    init();
    bindEvent();
});



var FormValidator = require("common:widget/validate/validate.js"),
    btn = require("common:widget/btn/btn.js");

//ҳ���ʼ��
function init(){
    var s = '#identityTypeSelect [value=' + window.GF_VIEWINFO.identityType+']';
    $('#identityTypeSelectText').text($(s).text());
}

//ҳ��󶨷���
function bindEvent() {
    $("#logintrade").click(function(){
        btn.disable($("#logintrade"),{
            color:          '#FFFFFF',
            setBtnLoad:     false
        });
        $.ajax({
            type: "post",
            url: "/main/login",
            data: {
                "logonType": $('#logonType').val(),
                "identityType": $('#identityType').val(),
                "identityNo": $('#identityNo').val(),
                "tradePassword": $('#tradePassword').val(),
                "autoLoginFlag":$('#autoLoginFlag').val()
            },
            success: function (msg) {
                //btn.enable($("#logintrade"));
                $.ajax({
                    type: "post",
                    url: "/main/account/openaccount/openaccount_clean",
                    data: {},
                    success: function (msg) {
                        window.location.href="/main/main";
                    }
                });
            }
        });
    });

}

//ÿ��ҳ�濽���������
$(function(){
    addWebtrends();
    init();
    bindEvent();
});

//ҳ��Ƕ��
function addWebtrends(){
    window.WTjson = {
        "WT.si_n":"���п���",
        "WT.si_x":"�󿨳ɹ�",
        "WT.paybank":""
    }
}



var FormValidator = require("common:widget/validate/validate.js"),
    btn = require("common:widget/btn/btn.js");

//页面初始化
function init(){
    var s = '#identityTypeSelect [value=' + window.GF_VIEWINFO.identityType+']';
    $('#identityTypeSelectText').text($(s).text());
}

//页面绑定方法
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

//每个页面拷贝这个方法
$(function(){
    addWebtrends();
    init();
    bindEvent();
});

//页面嵌码
function addWebtrends(){
    window.WTjson = {
        "WT.si_n":"银行卡绑定",
        "WT.si_x":"绑卡成功",
        "WT.paybank":""
    }
}



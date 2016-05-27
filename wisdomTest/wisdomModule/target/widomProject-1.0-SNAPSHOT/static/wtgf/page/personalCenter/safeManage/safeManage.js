var util = require("common:widget/util/util.js"),
    modal = require("wtgf:widget/modal/modal.js");
var main =(function(){
    var _init = function(){

    };
    var bindEvent = function(){
        $("#changeWelcomeword").click(changeWelcomeword);
        $(".toInput").click(function(){
            $(this).hide();
            var txt_select=$(this).siblings('p');
            txt_select.hide();
            var saveNode=$(this).siblings('.save');
            var cancelNode=$(this).siblings('.cancel');
            saveNode.show();
            cancelNode.show();

            var input_select=$(this).siblings('.change_this_txt');
            input_select.show();
            input_select.focus();
        });

        $(".cancel").click(function(event) {
            $(this).hide();
            var saveNode=$(this).siblings('.save');
            saveNode.hide();
            var toInput=$(this).siblings('.toInput');
            toInput.show();
            var txt_select=$(this).siblings('p');
            txt_select.show();
            var input_select =$(this).siblings('.change_this_txt');
            input_select.hide();
        });
    }
    return{
        init:_init,
        bindEvent:bindEvent
    }
})();

$(function(){
    main.init();
    main.bindEvent();
});

//修改预留验证信息
function changeWelcomeword() {
    var welcomeword = $('#welcomeWord').val();
    if(welcomeword == ""){
        modal.showModal("预留验证信息不能为空!");
    }else{
        $.ajax({
            type: "post",
            url: "/main/personalCenter/changeWelcomeword",
            async: false,
            data: {"welcomeword": welcomeword},
            success: function (msg) {
                var msgJson = msg;
                if (!msgJson.issuccess) {
                    //验证失败
                    modal.showModal(msgJson.returnmsg);
                } else {
                    window.location.href="/main/personalCenter/toSafeManage";
                }
            }
        });
    }
}

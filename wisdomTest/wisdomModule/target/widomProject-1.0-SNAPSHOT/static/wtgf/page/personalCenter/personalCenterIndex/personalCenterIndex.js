var util = require("common:widget/util/util.js"),
    btn = require("common:widget/btn/btn.js"),
    datepicker = require("common:widget/datepicker/datepicker.js"),
    validateCheck = require("wtgf:widget/validateCheck/validateCheck.js");
    modal = require("wtgf:widget/modal/modal.js");
var main =(function(){
    var _init = function(){
        $("#validDate").datepicker({
            dateFormat : "yy-mm-dd",
            changeYear : true,
            changeMonth : true,
            yearRange : "c-0:c+20"
        });
        $("#validDate").attr("readonly","readonly");
        $('#validDate').css({ 'cursor':'default'});
    };
    var bindEvent = function(){
        $("#updateIdentityNo").click(updateIdentityNo);
        $("#changeCertValidDate").click(changeCertValidDate);
        $("#changeEmailAddress").click(changeEmailAddress);
        $("#closeMobilePhone").click(closeMobilePhone);
        $("#changeAddressInfo").click(changeAddressInfo);
        $(".toInput").click(function(event) {
            var txt_select=$(this).parents('div').siblings('p');
            var _inputHide=$(this).parents('div').siblings('._inputHide');
            var input_select = _inputHide.find(".change_this_txt");
            var saveNode=$(this).siblings('.save');
            var cancelNode=$(this).siblings('.cancel');
            var cancelAddress=$(this).siblings('.cancelAddress');
            txt_select.hide();
            _inputHide.show();
            saveNode.show();
            cancelNode.show();
            cancelAddress.show();
            input_select.show();
            $(this).hide();
            if(!(input_select.hasClass('short_input'))){
                input_select.focus();
            }
            if($(this).hasClass('xiugai_dizhi')){
                $(".addressDiv").show();
                $("span.city-picker-span").show();
                $("#addressDetail").show();
            }else{
                var txt=txt_select.text();
                input_select.val(txt);
            }
            $("#yjyx").attr("checked",false);
        });

        $(".cancel").click(function(event) {
            var saveNode=$(this).siblings('.save');
            var toInput=$(this).siblings('.toInput');
            saveNode.hide();
            $(this).hide();
            toInput.show();
            var txt_select=$(this).parents('div').siblings('p');
            txt_select.show();
            var _inputHide=$(this).parents('div').siblings('._inputHide');
            _inputHide.hide();
            var input_select = _inputHide.find(".change_this_txt");
            input_select.hide();
        });

        $(".cancelAddress").click(function(event) {
            var saveNode=$(this).siblings('.save');
            var toInput=$(this).siblings('.toInput');
            saveNode.hide();
            $(this).hide();
            toInput.show();
            var txt_select=$(this).parents('div').siblings('p');
            txt_select.show();
            var input_select=$(".addressDiv").find("input");
            if((input_select.hasClass('short_input'))){
                var citySelect = $(this).parents('div').siblings('.city-picker-span');
                citySelect.hide();
                $(".addressDiv").hide();
            }
            input_select.hide();
        });

        //永久有效
        $("#yjyx").click(function(){
            if($('#yjyx').prop("checked")){
                $("#validDate").val("2999-01-01");
            }else{
                $("#validDate").val("");
            }
        });
    };
    return{
        init:_init,
        bindEvent:bindEvent
    }
})();

$(function(){
    main.init();
    main.bindEvent();
});

//升级15位证件号码到18位
function updateIdentityNo() {
    $.ajax({
        type: "post",
        url: "/main/personalCenter/updateIdentityNo",
        async: false,
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                modal.showModal(msgJson.returnmsg);
            } else {
                window.location.href="/main/personalCenter/index";
            }
        }
    });
}

//修改证件有效期
function changeCertValidDate(){
    var validDate = $("#validDate").val();
    var msg = validateCheck.checkDate($("#validDate").val(),$("#certificateNo").val(),$("#certificateType").val());
    if(msg != ""){
        modal.showModal(msg);
    }else{
        validDate = validDate.replace(new RegExp("-","gm"),"");
        $.ajax({
            type: "post",
            url: "/main/personalCenter/changeCertValidDate",
            data:{"certValidDate":validDate},
            success: function (msg) {
                var msgJson = msg;
                if (!msgJson.issuccess) {
                    modal.showModal(msgJson.returnmsg);
                } else {
                    window.location.href="/main/personalCenter/index";
                }
            }
        });
    }
}

//修改邮箱地址
function changeEmailAddress(){
    var emailAddress = $("#emailAddress").val();
    $.ajax({
        type: "post",
        url: "/main/personalCenter/changeEmailAddress",
        data:{"emailAddress":emailAddress},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                modal.showModal(msgJson.returnmsg);
            } else {
                window.location.href="/main/personalCenter/index";
            }
        }
    });
}

//关闭手机账户名
function closeMobilePhone(){
    $.ajax({
        type: "get",
        url: "/main/onePassport/closeMobileNo",
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                modal.showModal(msgJson.returnmsg);
            } else {
                modal.showModal(msgJson.returnMsg);
            }
        }
    });
}

//修改地址
function changeAddressInfo(){
    var addressDetail = $("#addressDetail").val();
    if(addressDetail == null || addressDetail == ""){
        modal.showModal("详细地址不能为空!");
    }else{
        var title = $(".title").text();
        if(title == ""){
            modal.showModal("请选择省/市/区!");
            return false;
        }
        var districtList = $(".city-picker-span").find(".title").find(".select-item");
        var count = 0;
        var districtNo= "";
        for(var selectItem in districtList){
            if(count < 3){
                var value = districtList[selectItem].dataset.count;
                var dataCode = districtList[selectItem].dataset.code;
                if(value == "province"){
                    $("#province").val(dataCode);
                }else if(value == "city"){
                    $("#cityno").val(dataCode);
                }else if(value == "district"){
                    $("#districtno").val(dataCode);
                    districtNo = dataCode;
                }

            }else{
                break;
            }
            count ++;
        }

        $.ajax({
            type: "post",
            url: "/main/account/bindCard/getZipCode?districtNo="+districtNo,
            async:false,
            success: function (msg) {
                $("#zipno").val(msg.zipCode);
                var addressPre = $(".title").text().replace(new RegExp("/",'gm'),'');
                $("#address").val(addressPre+$("#addressDetail").val());
            }
        });
        var provinceNo = $("#province").val();
        var cityNo = $("#cityno").val();
        var countyNo = $("#districtno").val();
        var address = $("#address").val();
        var postCode = $("#zipno").val();
        $.ajax({
            type: "post",
            url: "/main/personalCenter/changeAddressInfo",
            data:{"provinceNo":provinceNo,"cityNo":cityNo,"countyNo":countyNo,"address":address,"postCode":postCode},
            async:false,
            success: function (msg) {
                var msgJson = msg;
                if (!msgJson.issuccess) {
                    modal.showModal(msgJson.returnmsg);
                } else {
                    window.location.href="/main/personalCenter/index";
                }
            }
        });
    }
}

var util = require("common:widget/util/util.js"),
    datepicker = require("common:widget/datepicker/datepicker.js"),
    juicer = require("common:widget/juicer/juicer.js"),
    dialog = require("common:widget/dialog/dialog.js"),
    btn = require("common:widget/btn/btn.js"),
    menuCookie = require("wtgf:widget/menuCookie/menuCookie.js"),
    numberUpper = require("common:widget/numberUpper/numberUpper.js");
var main = (function(){
    var _init = function(){
        menuCookie.cookie.setMenu("r1","c11");
        $.ajaxSetup({ cache: false });
        initData();
    };

    var bindEvent = function(){
        $("#amount").change(function(){
            var _obj = $("#amount").val();
            var flag = checkMoney(_obj);
            if(flag){
                $("#bigMoney").html(numberUpper.use.ChangeShareToUpper(_obj));
                $("#checkTips").html("");
            }else{
                $("#checkTips").html("<font color='red'>购买金额格式不对!</font>");
            }
        });
        $('#amount').keyup(function () {
            var _obj = $("#amount").val();
            _obj = _obj.replace(/[^\d|.]/g,'');
            if(_obj != ""){
                var flag = checkMoney(_obj);
                if(flag){
                    $("#bigMoney").html(numberUpper.use.ChangeShareToUpper(_obj));
                }
            }else{
                $("#bigMoney").html("");
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
    addWebtrends();
});

//页面嵌码
function addWebtrends(){
    window.WTjson = {
        "WT.si_n":"钱袋子充值",
        "WT.si_x":"输入金额"
    }
}

function checkMoney(obj){
    var flag = false;
    var reg = /^([1-9][\d]{0,12}|0)(\.[\d]{1,2})?$/;
    if(reg.test(obj)){
        flag = true;
    }else{
        flag = false;
    }
    return flag;
}

function submitFrm(){
    var _obj = $("#amount").val();
    var minValue = $("#minValue").val();
    var maxValueByDay = $("#maxValueByDay").val();
    if(checkMoney(_obj)){
        if(minValue != "" && minValue != null){
            if(parseFloat(_obj)<parseFloat(minValue)){
                $("#showInfoMsg").html("购买金额不能低于最小金额限制。");
                $("#modal0").modal("show");
                return false;
            }
        }
        if(maxValueByDay != "" && maxValueByDay != null){
            if(parseFloat(_obj)>parseFloat(maxValueByDay*10000)){
                $("#showInfoMsg").html("购买金额不能大于当日最大金额限制。");
                $("#modal0").modal("show");
                return false;
            }
        }
    }else{
        $("#showInfoMsg").html("请检查购买金额是否输入正确。");
        $("#modal0").modal("show");
        return false;
    }
    $("#toPay").attr("disabled","disabled");
    $('#toPay').css("background","grey");
    $('#toPay').css("border","0px");
}

function initData(){
    var _obj = $("#amount").val();
    if(_obj != null && _obj != undefined && _obj != ""){
        $("#bigMoney").html(numberUpper.use.ChangeShareToUpper(_obj));
    }
}


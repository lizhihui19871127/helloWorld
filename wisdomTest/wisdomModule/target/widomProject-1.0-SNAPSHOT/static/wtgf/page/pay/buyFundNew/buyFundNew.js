var util = require("common:widget/util/util.js"),
    datepicker = require("common:widget/datepicker/datepicker.js"),
    juicer = require("common:widget/juicer/juicer.js"),
    dialog = require("common:widget/dialog/dialog.js"),
    btn = require("common:widget/btn/btn.js"),
    numberUpper = require("common:widget/numberUpper/numberUpper.js"),
    listUtil = require("common:widget/listUtil/listUtil.js"),
    menuCookie = require("wtgf:widget/menuCookie/menuCookie.js"),
    mapUtil = require("common:widget/mapUtil/mapUtil.js");
var id = "";
var $containerPay = $('.container-pay');
var content = "";
var showFlag = 0;//0：不展示；1：展示
var main = (function(){
    var _init = function(){
        menuCookie.cookie.setMenu("r2","c28");
        $.ajaxSetup({ cache: false });
        initData();
    };

    var bindEvent = function(){

        // 单只基金-收费方式
        $containerPay.on('click', '.in-radio', function(){
            $(this).addClass('active').siblings('.in-radio').removeClass('active');
            $(this).find("input").prop('checked',true);
        });

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

        $("#leverCheckBox").click(function(){
            if ($('#leverCheckBox').prop('checked')) {
                $('#toPay').removeAttr('disabled');
                $('#toPay').css("background","#DF5412");
            }else{
                $('#toPay').attr('disabled', 'disabled');
                $('#toPay').css("background","grey");
                $('#toPay').css("border","0px");
            }
        });

        $(".payType").click(function(){
            var payType = $('#frm input[name="payType"]:checked ').val();
            var fundCode = $("#fundCode").val();
            if(fundCode != null && fundCode != "" && fundCode != undefined){
                getLimit(fundCode,payType);
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

function initData(){
    var _obj = $("#amount").val();
    var payType = $('#frm input[name="payType"]:checked ').val();
    if(payType == "" || payType == undefined){
        $("#payType3").prop('checked',true);
        $("#payType3").parent().addClass("active");
        payType = "C";//默认选择C类收费
    }
    if(_obj != null && _obj != undefined && _obj != ""){
        $("#bigMoney").html(numberUpper.use.ChangeShareToUpper(_obj));
    }
    var fundCode = $("#fundCode").val();
    var fundName = $("#fundName").val();
    if(fundCode != null && fundCode != undefined && fundCode != ""){
        $("#foundsName").val(fundName);
        setReedomDate(fundCode);
        //进行风险判断
        processCheckFundLevel();
    }
    else{
        $("#payType3").prop('checked',true);
        $("#payType3").parent().addClass("active");
    }
}

//判断限额
function getLimit(fundCode,payType){
    $.ajax({
        type: "get",
        url: "/main/fund/"+fundCode+"/buyLimit?shareType="+payType,
        success: function (data) {
            if(data.issuccess){
                var minValue = data.minValue;
                var maxValueByDay = data.maxValueByDay;
                if(minValue == null || minValue == "" || minValue == undefined){
                    $("#limitShow").css("display","none");
                    $("#dayLimitShow").css("display","none");
                    $("#minValue").html("");
                    $("#maxValueByDay").html("");
                }else{
                    $("#limitShow").css("display","");
                    $("#minValue").html(minValue);
                }
                if(maxValueByDay == null || maxValueByDay == "" || maxValueByDay == undefined){
                    $("#dayLimitShow").css("display","none");
                    $("#maxValueByDay").html("");
                }else{
                    $("#dayLimitShow").css("display","");
                    $("#maxValueByDay").html(maxValueByDay);
                }
            }else{
                $("#showInfoMsg").html("获取基金支付限额失败，请稍后重试。");
                $("#limitShow").css("display","none");
                $("#dayLimitShow").css("display","none");
                $("#modal0").modal("show");
                $('#toPay').attr('disabled', 'disabled');
                $('#toPay').css("background","grey");
                $('#toPay').css("border","0px");
            }
        }
    });
}

//进行风险评测判断
function processCheckFundLevel(){
    var riskLevel = $("#riskLevel").val();
    if(riskLevel == null || riskLevel == undefined || riskLevel == ""){
        //没有进行过风险评测
        $("#showLever").css("display","none");
        $('#leverCheckBox').prop('checked',false);
        $("#showInfoMsg").html("<a href='/account/showsubject.jsp'>尚未风险评测</a>");
        $("#modal0").modal("show");
        $('#toPay').attr('disabled', 'disabled');
        $('#toPay').css("background","grey");
        $('#toPay').css("border","0px");
    }else{
        var fundCode = $("#fundCode").val();
        $.ajax({
            type: "get",
            url: "/main/fund/"+fundCode+"/fundLevel",
            success: function (msg) {
                if(msg.issuccess){
                    var riskLevelInt = $("#riskLevelInt").val();
                    if(riskLevelInt == "" || parseInt(riskLevelInt) < parseInt(msg.fundLevel)){
                        var fundLevelShow = msg.fundLevelShow;
                        $('#leverCheckBox').prop('checked',false);
                        $("#showLever").css("display","");
                        $("#lever").html("您所购买的基金风险等级[" + fundLevelShow + "]不符合你的风险承受能力["
                            + riskLevel + "]");
                        $('#toPay').attr('disabled', 'disabled');
                        $('#toPay').css("background","grey");
                        $('#toPay').css("border","0px");
                    }else{
                        $("#showLever").css("display","none");
                        $('#toPay').removeAttr('disabled');
                        $('#toPay').css("background","#DF5412");
                    }
                }else{
                    $("#showInfoMsg").html("获取基金风险等级失败，请稍后重试。");
                    $("#modal0").modal("show");
                    $('#toPay').attr('disabled', 'disabled');
                    $('#toPay').css("background","grey");
                    $('#toPay').css("border","0px");
                }
            }
        });
    }
}

function submitFrm(){
    var _obj = $("#amount").val();
    var minValue = $("#minValue").html();
    var maxValueByDay = $("#maxValueByDay").html();
    var payType = $('#frm input[name="payType"]:checked ').val();
    var fundCode = $("#fundCode").val();
    if(fundCode == ""){
        $("#showInfoMsg").html("请选择一只基金。");
        $("#modal0").modal("show");
        return false;
    }

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
    window.location.href="/main/order?amount="+_obj+"&fundCode="+fundCode+"&shareType="+payType;
}

//依赖基金选择器加载完以后执行
function initFunction(){
    var fundCode = $("#fundCode").val();
    if(fundCode != null && fundCode != "" && fundCode != undefined){
        var shareTypeShow = $(".founds-search-list").find("li");
        var payType = "C";
        for(var i=0;i<shareTypeShow.length;i++){
            var shareTypeValue = shareTypeShow[i];
            var code = shareTypeValue.firstChild.innerHTML;
            if(code == fundCode){
                var shareType = shareTypeValue.lastChild.innerHTML;
                resetShareTypeShow(shareType);
                //重新选择基金后，如果有C类收费，默认选择C类收费，没有就前收费
                if(shareType.indexOf("C") != -1){
                    $("#payType3").prop('checked',true);
                    $("#payType3").parent().addClass("active");
                    $("#payType1").parent().removeClass("active");
                    $("#payType2").parent().removeClass("active");
                }else{
                    payType = "A";
                    $("#payType1").prop('checked',true);
                    $("#payType1").parent().addClass("active");
                    $("#payType2").parent().removeClass("active");
                    $("#payType3").parent().removeClass("active");
                }
                var fundName = shareTypeValue.childNodes[1].innerHTML;
                $("#fundName").val(fundName);
                $("#foundsName").val(fundName);
                getLimit(fundCode,payType);
                break;
            }
        }
    }
}

//选中基金后
function selectFund(obj){
    var fundCode = $.trim(obj.find('.code').text());
    var fundName = $.trim(obj.find('.name').text());
    var shareType = $.trim(obj.find('.shareType').text());
    obj.parents('.in-founds-choose').find('input:eq(0)').val(fundCode);
    obj.parents('.in-founds-choose').find('input:eq(1)').val(fundName);
    $("#fundName").val(fundName);
    resetShareTypeShow(shareType);
    //重新选择基金后，如果有C类收费，默认选择C类收费，没有就前收费
    if(shareType.indexOf("C") != -1){
        $("#payType3").prop('checked',true);
        $("#payType3").parent().addClass("active");
        $("#payType1").parent().removeClass("active");
        $("#payType2").parent().removeClass("active");
    }else{
        $("#payType1").prop('checked',true);
        $("#payType1").parent().addClass("active");
        $("#payType2").parent().removeClass("active");
        $("#payType3").parent().removeClass("active");
    }
    //风险等级
    processCheckFundLevel();
    setReedomDate(fundCode);
    //查询限额
    var payType = $('#frm input[name="payType"]:checked ').val();
    getLimit(fundCode,payType);
}

function setReedomDate(fundCode){
    if(fundCode == "000037" || fundCode == "270046" || fundCode == "000038" || fundCode == "270047"){
        //查看赎回日期
        $.ajax({
            type: "get",
            url: "/main/fund/"+fundCode+"/redeemDate",
            success: function (msg) {
                $("#orderTime").html(msg.requestDate);
                $("#redeemTime").html(msg.redeemDate);
                $("#_qdzTip").css("display","");
            }
        });
    }else{
        $("#_qdzTip").css("display","none");
    }
}

//重置收费方式展示
function resetShareTypeShow(shareType){
    //重置收费方式
    $("#payType1Label").css("display","none");
    $("#payType2Label").css("display","none");
    $("#payType3Label").css("display","none");
    $("#shareTypeC").css("display","none");
    if(shareType != null && shareType != "" && shareType != undefined){
        if(shareType.indexOf("A") != -1){
            $("#payType1Label").css("display","");
        }
        if(shareType.indexOf("B") != -1){
            $("#payType2Label").css("display","");
        }
        if(shareType.indexOf("C") != -1){
            $("#payType3Label").css("display","");
            $("#shareTypeC").css("display","");
        }
    }
}


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
var showFlag = 0;//0����չʾ��1��չʾ
var main = (function(){
    var _init = function(){
        menuCookie.cookie.setMenu("r2","c28");
        $.ajaxSetup({ cache: false });
        initData();
    };

    var bindEvent = function(){

        // ��ֻ����-�շѷ�ʽ
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
                $("#checkTips").html("<font color='red'>�������ʽ����!</font>");
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
        payType = "C";//Ĭ��ѡ��C���շ�
    }
    if(_obj != null && _obj != undefined && _obj != ""){
        $("#bigMoney").html(numberUpper.use.ChangeShareToUpper(_obj));
    }
    var fundCode = $("#fundCode").val();
    var fundName = $("#fundName").val();
    if(fundCode != null && fundCode != undefined && fundCode != ""){
        $("#foundsName").val(fundName);
        setReedomDate(fundCode);
        //���з����ж�
        processCheckFundLevel();
    }
    else{
        $("#payType3").prop('checked',true);
        $("#payType3").parent().addClass("active");
    }
}

//�ж��޶�
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
                $("#showInfoMsg").html("��ȡ����֧���޶�ʧ�ܣ����Ժ����ԡ�");
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

//���з��������ж�
function processCheckFundLevel(){
    var riskLevel = $("#riskLevel").val();
    if(riskLevel == null || riskLevel == undefined || riskLevel == ""){
        //û�н��й���������
        $("#showLever").css("display","none");
        $('#leverCheckBox').prop('checked',false);
        $("#showInfoMsg").html("<a href='/account/showsubject.jsp'>��δ��������</a>");
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
                        $("#lever").html("��������Ļ�����յȼ�[" + fundLevelShow + "]��������ķ��ճ�������["
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
                    $("#showInfoMsg").html("��ȡ������յȼ�ʧ�ܣ����Ժ����ԡ�");
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
        $("#showInfoMsg").html("��ѡ��һֻ����");
        $("#modal0").modal("show");
        return false;
    }

    if(checkMoney(_obj)){
        if(minValue != "" && minValue != null){
            if(parseFloat(_obj)<parseFloat(minValue)){
                $("#showInfoMsg").html("������ܵ�����С������ơ�");
                $("#modal0").modal("show");
                return false;
            }
        }
        if(maxValueByDay != "" && maxValueByDay != null){
            if(parseFloat(_obj)>parseFloat(maxValueByDay*10000)){
                $("#showInfoMsg").html("������ܴ��ڵ�����������ơ�");
                $("#modal0").modal("show");
                return false;
            }
        }
    }else{
        $("#showInfoMsg").html("���鹺�����Ƿ�������ȷ��");
        $("#modal0").modal("show");
        return false;
    }
    $("#toPay").attr("disabled","disabled");
    $('#toPay').css("background","grey");
    $('#toPay').css("border","0px");
    window.location.href="/main/order?amount="+_obj+"&fundCode="+fundCode+"&shareType="+payType;
}

//��������ѡ�����������Ժ�ִ��
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
                //����ѡ�����������C���շѣ�Ĭ��ѡ��C���շѣ�û�о�ǰ�շ�
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

//ѡ�л����
function selectFund(obj){
    var fundCode = $.trim(obj.find('.code').text());
    var fundName = $.trim(obj.find('.name').text());
    var shareType = $.trim(obj.find('.shareType').text());
    obj.parents('.in-founds-choose').find('input:eq(0)').val(fundCode);
    obj.parents('.in-founds-choose').find('input:eq(1)').val(fundName);
    $("#fundName").val(fundName);
    resetShareTypeShow(shareType);
    //����ѡ�����������C���շѣ�Ĭ��ѡ��C���շѣ�û�о�ǰ�շ�
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
    //���յȼ�
    processCheckFundLevel();
    setReedomDate(fundCode);
    //��ѯ�޶�
    var payType = $('#frm input[name="payType"]:checked ').val();
    getLimit(fundCode,payType);
}

function setReedomDate(fundCode){
    if(fundCode == "000037" || fundCode == "270046" || fundCode == "000038" || fundCode == "270047"){
        //�鿴�������
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

//�����շѷ�ʽչʾ
function resetShareTypeShow(shareType){
    //�����շѷ�ʽ
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


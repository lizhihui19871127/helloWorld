var util = require("common:widget/util/util.js"),
    datepicker = require("common:widget/datepicker/datepicker.js"),
    juicer = require("common:widget/juicer/juicer.js"),
    dialog = require("common:widget/dialog/dialog.js"),
    btn = require("common:widget/btn/btn.js"),
    numberUpper = require("common:widget/numberUpper/numberUpper.js"),
    listUtil = require("common:widget/listUtil/listUtil.js"),
    menuCookie = require("wtgf:widget/menuCookie/menuCookie.js"),
    mapUtil = require("common:widget/mapUtil/mapUtil.js");
var productTypeList = new Array();
var findProductCodeList = new Array();
var findProductNameList = new Array();
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

        // ����ȫ���¼�,�رջ���ѡ����
        $(document).click(function () {
            $("#search-in-Box").hide();
            $("#search-select-Box").hide();
        });

        $("#foundsName").click(function(e){
            var fundName = $("#foundsName").val();
            if(fundName == ""){
                $("#search-select-Box").show();
                $(this).parent().find('.founds-search-btn').show();
                $("#search-in-Box").hide();
            }else{
                var funds = findProduct();
                var html1 = loadSerarchIn(funds,"");
                html1 = html1.replace(new RegExp("search-in-Box","gm"),"");
                $("#search-in-Box").html(html1);
                $("#search-in-Box").show();
                $(this).parent().find('.founds-search-in').show();
                $("#search-select-Box").hide();
            }
            e.stopPropagation();
        });

        $('#search-in-Box').click(function (e) {
            //���onclick�Ĺ���
            $("#search-in-Box").show();
            // ֹͣ�¼�����
            e.stopPropagation();
        });

        $('#search-select-Box').click(function (e) {
            //���onclick�Ĺ���
            $("#search-select-Box").show();
            // ֹͣ�¼�����
            e.stopPropagation();
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
    addWebtrends();
});

//ҳ��Ƕ��
function addWebtrends(){
    window.WTjson = {
        "WT.si_n":"�������깺",
        "WT.si_x":"������"
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
    //���ػ���ѡ����
    loadFundSelecter();
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
    if(!existeFund()){
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
//���ػ���ѡ����
function loadFundSelecter(){
    $.ajax({
        type: "post",
        url:"/main/tradeMain/products",
        data: null,
        success: function (data) {
            var retCode = data.retCode;
            if(retCode == "0000"){
                var funds = data.funds;
                //�������������б�
                var html1 = loadSerarchIn(funds,"");
                var html2 = foundsSelectCreatFun(funds);
                $("#search-select-Box").hide();
                $("#search-in-Box").hide();
                content = html1+html2;
                /*
                 *	����ѡ�������б�
                 */
                $containerPay.find('.cz-item .in-founds-txt').each(function(){
                    foundsSelectFun($(this));
                });
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
            }else{
                $("#foundsName").val("����ѡ������ȡʧ�ܣ����Ժ����ԡ�");
                $('#toPay').attr('disabled', 'disabled');
                $('#toPay').css("background","grey");
                $('#toPay').css("border","0px");
            }
        }
    });
}

// ����ѡ��������
function foundsSelectFun(inputObj){
    var $containerPay = inputObj.parent();
    $containerPay.append(content);

    // ����ѡ�������б�-������ȡ����
    $containerPay.on('focus', 'input', function(e){
        var fundName = $("#foundsName").val();
        if(fundName == ""){
            $("#search-select-Box").show();
            $(this).parent().find('.founds-search-btn').show();
            $("#search-in-Box").hide();
        }else{
            var funds = findProduct();
            var html1 = loadSerarchIn(funds,"");
            html1 = html1.replace(new RegExp("search-in-Box","gm"),"");
            $("#search-in-Box").html(html1);
            $("#search-in-Box").show();
            $(this).parent().find('.founds-search-in').show();
            $("#search-select-Box").hide();
        }
    });

    // ����ѡ�������б�-�����ʧȥ����
//    $containerPay.on('blur', 'input', function(){
//        setTimeout(function(){
//            $("#search-in-Box").hide();
//        },200);
//    });

    // ����ѡ�������б�-�������������
    $containerPay.on('keyup', '.in-founds-txt', function(){
        var fundName = $("#foundsName").val();
        if(fundName == ""){
            $("#search-select-Box").show();
            $(this).parent().find('.founds-search-btn').show();
            $("#search-in-Box").hide();
        }else{
            var funds = findProduct();
            var fundProduct = $("#foundsName").val();
            var html1 = loadSerarchIn(funds,fundProduct);
            html1 = html1.replace(new RegExp("search-in-Box","gm"),"");
            $("#search-in-Box").html(html1);
            $("#search-in-Box").show();
            $(this).parent().find('.founds-search-in').show();
            $("#search-select-Box").hide();
        }
    });

    // ����ѡ�������б�-���չ����ť
    $containerPay.on('click', '.btn-open-founds', function(){
        $("#search-select-Box").toggle();
        $(this).parent().find('.founds-search-btn').show();
        return false;
    });

    // ����ѡ�������б�-�����л�
    $containerPay.on('click', '.founds-search-nav a', function(){
        $("#search-select-Box").show();
        $(this).parent().find('.founds-search-btn').show();
        var Idx = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $(this).parents('.founds-search-box').find('.founds-search-list ul').eq(Idx).addClass('active').siblings().removeClass('active');
        return false;
    });

    // ����ѡ�������б�-ѡ�л���
    $containerPay.on('click', '.founds-search-box li', function(){
        var fundCode = $.trim($(this).find('.code').text());
        var fundName = $.trim($(this).find('.name').text());
        var shareType = $.trim($(this).find('.shareType').text());
        $(this).parents('.in-founds-choose').find('input:eq(0)').val(fundName);
        $(this).parents('.in-founds-choose').find('input:eq(1)').val(fundCode);
        $(this).parents('.in-founds-choose').find('input:eq(2)').val(fundName);
        $("#search-select-Box").hide();
        $("#search-in-Box").hide();
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
        return false;
    });
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

function loadSerarchIn(funds,searchContent){
    var html = [];
    //�������������б�
    html.push('<div id="search-in-Box">');
    html.push('<div class="founds-search-box founds-search-in">');
    html.push(' <div class="founds-search-list" id="searchListDiv" style="max-height: 230px;overflow-y: auto;"');
    html.push('     <ul class="active" style="max-height: none;overflow-y: hidden;">');
    for(var i=0;i < funds.length;i++){
        var fundInfo = funds[i];
        if(fundInfo.fundSupport020 || fundInfo.fundSupport022){
            html.push('<li>');
            if(searchContent != "" && searchContent.indexOf(" ") == -1){
                //��Ҫ������ʾ
                var fundCode = fundInfo.fundCode;
                var fundName = fundInfo.fundName;
                fundCode = fundCode.replace(new RegExp(searchContent,"gm"),"<span color='blue'>"+searchContent+"</span>");
                fundName = fundName.replace(new RegExp(searchContent,"gm"),"<span color='blue'>"+searchContent+"</span>");
                html.push('<p class="code">'+fundCode+'</p>');
                html.push('<p class="name">'+fundName+'</p>');
            }else{
                html.push('<p class="code">'+fundInfo.fundCode+'</p>');
                html.push('<p class="name">'+fundInfo.fundName+'</p>');
            }
            html.push('<p class="shareType" style="display: none">'+fundInfo.shareType+'</p>');
            html.push('</li>');
        }
    }
    html.push('</ul>');
    html.push(' </div>');
    html.push('</div>');
    html.push('</div>');
    return html.join('');
}

// ����ѡ��������-����
function foundsSelectCreatFun(funds){
    var html = [];
    for(var i=0;i < funds.length;i++){
        var fundInfo = funds[i];
        //���ػ�������б�
        mapUtil.use.put(findProductCodeList,fundInfo.fundCode,fundInfo);
        mapUtil.use.put(findProductNameList,fundInfo.fundName,fundInfo);
        if(mapUtil.use.containsKey(productTypeList,fundInfo.categoryName)){
            //������ڣ��ͼӽ�ԭ���ķ�������
            var list  = mapUtil.use.get(productTypeList,fundInfo.categoryName);
            listUtil.use.add(list,fundInfo);
        }else{
            var productInfo = [];
            listUtil.use.add(productInfo,fundInfo);
            mapUtil.use.put(productTypeList,fundInfo.categoryName,productInfo);
        }
    }
    var productTypeSize = productTypeList.length;
    var widthTemp = 82*productTypeSize + "px";
    html.push('<div id="search-select-Box">');
    html.push('<div class="founds-search-box founds-search-btn" style="width:'+widthTemp+'">');
    html.push(' <div class="founds-search-nav">');
    for(var key in productTypeList){
        if(key == 0){
            html.push('<a class="active" href="javascript:void(0);">'+productTypeList[key].key+'</a>');
        }else{
            html.push('<a href="javascript:void(0);">'+productTypeList[key].key+'</a>');
        }
    }
    html.push(' </div>');
    html.push(' <div class="founds-search-list">');
    for(var key in productTypeList){
        if(key == 0){
            html.push('<ul class="active">');
        }else{
            html.push('<ul>');
        }
        for(var productN in productTypeList[key].value){
            var product = (productTypeList[key].value)[productN];
            if(product.fundSupport020 || product.fundSupport022){
                html.push('<li>');
                html.push('<p class="code">'+product.fundCode+'</p>');
                html.push('<p class="name">'+product.fundName+'</p>');
                html.push('<p class="shareType" style="display: none">'+product.shareType+'</p>');
                html.push('</li>');
            }
        }
        html.push('</ul>');
    }
    html.push(' </div>');
    html.push('</div>');
    html.push('</div>');
    return html.join('');
};

/**
 * ���ݻ��������߻�������ģ������������Ϣ
 */
function findProduct(){
    var fund = [];
    var fundProduct = $("#foundsName").val();
    for(var key in findProductCodeList){
        //���ջ����������
        var keyInfo = findProductCodeList[key].key;
        if(keyInfo.indexOf(fundProduct) != -1){
            var fundInfo = findProductCodeList[key].value;
            fund.push(fundInfo);
        }
    }
    if(fundProduct != null && fundProduct != ""){
        //���ջ�����������
        for(var key in findProductNameList){
            var keyInfo = findProductNameList[key].key;
            if(keyInfo.indexOf(fundProduct) != -1){
                var fundInfo = findProductCodeList[key].value;
                fund.push(fundInfo);
            }
        }
    }
    return fund;
}

function existeFund(){
    var flag = false;
    var fundProduct = $("#foundsName").val();
    if(fundProduct != null && fundProduct != ""){
        //���ջ�����������
        for(var key in findProductNameList){
            var keyInfo = findProductNameList[key].key;
            if(keyInfo == fundProduct){
                flag = true;
                break;
            }else{
                continue;
            }
        }
    }
    return flag;
}

/**
 * ���ð�ť�û�
 * @param obj
 */
function setBtnDisabled(obj){
    $(obj).attr('disabled', 'disabled');
    $(obj).css("background","grey");
    $(obj).css("border","0px");
}

function enableBtn(obj){
    $(obj).removeAttr('disabled');
    $(obj).css("background","#DF5412");
}

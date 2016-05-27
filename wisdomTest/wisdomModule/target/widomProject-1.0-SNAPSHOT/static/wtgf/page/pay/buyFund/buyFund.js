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

        // 捕获全局事件,关闭基金选择器
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
            //完成onclick的工作
            $("#search-in-Box").show();
            // 停止事件传递
            e.stopPropagation();
        });

        $('#search-select-Box').click(function (e) {
            //完成onclick的工作
            $("#search-select-Box").show();
            // 停止事件传递
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

//页面嵌码
function addWebtrends(){
    window.WTjson = {
        "WT.si_n":"基金认申购",
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
    //加载基金选择器
    loadFundSelecter();
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
    if(!existeFund()){
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
//加载基金选择器
function loadFundSelecter(){
    $.ajax({
        type: "post",
        url:"/main/tradeMain/products",
        data: null,
        success: function (data) {
            var retCode = data.retCode;
            if(retCode == "0000"){
                var funds = data.funds;
                //加载搜索内容列表
                var html1 = loadSerarchIn(funds,"");
                var html2 = foundsSelectCreatFun(funds);
                $("#search-select-Box").hide();
                $("#search-in-Box").hide();
                content = html1+html2;
                /*
                 *	基金选择下拉列表
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
            }else{
                $("#foundsName").val("基金选择器获取失败，请稍后重试。");
                $('#toPay').attr('disabled', 'disabled');
                $('#toPay').css("background","grey");
                $('#toPay').css("border","0px");
            }
        }
    });
}

// 基金选择下拉框
function foundsSelectFun(inputObj){
    var $containerPay = inputObj.parent();
    $containerPay.append(content);

    // 基金选择下拉列表-输入框获取焦点
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

    // 基金选择下拉列表-输入框失去焦点
//    $containerPay.on('blur', 'input', function(){
//        setTimeout(function(){
//            $("#search-in-Box").hide();
//        },200);
//    });

    // 基金选择下拉列表-输入框正在输入
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

    // 基金选择下拉列表-点击展开按钮
    $containerPay.on('click', '.btn-open-founds', function(){
        $("#search-select-Box").toggle();
        $(this).parent().find('.founds-search-btn').show();
        return false;
    });

    // 基金选择下拉列表-类型切换
    $containerPay.on('click', '.founds-search-nav a', function(){
        $("#search-select-Box").show();
        $(this).parent().find('.founds-search-btn').show();
        var Idx = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $(this).parents('.founds-search-box').find('.founds-search-list ul').eq(Idx).addClass('active').siblings().removeClass('active');
        return false;
    });

    // 基金选择下拉列表-选中基金
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
        return false;
    });
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

function loadSerarchIn(funds,searchContent){
    var html = [];
    //加载搜索内容列表
    html.push('<div id="search-in-Box">');
    html.push('<div class="founds-search-box founds-search-in">');
    html.push(' <div class="founds-search-list" id="searchListDiv" style="max-height: 230px;overflow-y: auto;"');
    html.push('     <ul class="active" style="max-height: none;overflow-y: hidden;">');
    for(var i=0;i < funds.length;i++){
        var fundInfo = funds[i];
        if(fundInfo.fundSupport020 || fundInfo.fundSupport022){
            html.push('<li>');
            if(searchContent != "" && searchContent.indexOf(" ") == -1){
                //需要高亮显示
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

// 基金选择下拉框-生成
function foundsSelectCreatFun(funds){
    var html = [];
    for(var i=0;i < funds.length;i++){
        var fundInfo = funds[i];
        //加载基金分类列表
        mapUtil.use.put(findProductCodeList,fundInfo.fundCode,fundInfo);
        mapUtil.use.put(findProductNameList,fundInfo.fundName,fundInfo);
        if(mapUtil.use.containsKey(productTypeList,fundInfo.categoryName)){
            //如果存在，就加进原来的分类里面
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
 * 根据基金代码或者基金名称模糊搜索基金信息
 */
function findProduct(){
    var fund = [];
    var fundProduct = $("#foundsName").val();
    for(var key in findProductCodeList){
        //按照基金代码搜索
        var keyInfo = findProductCodeList[key].key;
        if(keyInfo.indexOf(fundProduct) != -1){
            var fundInfo = findProductCodeList[key].value;
            fund.push(fundInfo);
        }
    }
    if(fundProduct != null && fundProduct != ""){
        //按照基金名称搜索
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
        //按照基金名称搜索
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
 * 设置按钮置灰
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

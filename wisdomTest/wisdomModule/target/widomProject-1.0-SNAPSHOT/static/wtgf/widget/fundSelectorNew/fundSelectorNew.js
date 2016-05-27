define('wtgf:widget/fundSelectorNew/fundSelectorNew.js', function(require, exports, module){ var util = require("common:widget/util/util.js"),
    datepicker = require("common:widget/datepicker/datepicker.js"),
    juicer = require("common:widget/juicer/juicer.js"),
    dialog = require("common:widget/dialog/dialog.js"),
    btn = require("common:widget/btn/btn.js"),
    listUtil = require("common:widget/listUtil/listUtil.js"),
    menuCookie = require("wtgf:widget/menuCookie/menuCookie.js"),
    mapUtil = require("common:widget/mapUtil/mapUtil.js");
var productTypeList = new Array();
var findProductCodeList = new Array();
var findProductNameList = new Array();
var id = "";
var content = "";
var main = (function(){
    var _init = function(){
        //加载基金选择器
        loadFundSelecter();
    };

    var bindEvent = function(){
        // 捕获全局事件,关闭基金选择器
        $(document).click(function () {
            $("#searchInBox").hide();
            $("#searchSelectBox").hide();
        });

        //框框体显示，防止滚动时被全局click事件覆盖
        $('#searchInBox').click(function (e) {
            //完成onclick的工作
            $("#searchInBox").show();
            // 停止事件传递
            e.stopPropagation();
        });

        //框框体显示，防止滚动时被全局click事件覆盖
        $('#searchSelectBox').click(function (e) {
            //完成onclick的工作
            $("#searchSelectBox").show();
            // 停止事件传递
            e.stopPropagation();
        });

        //点击事件
        $("#fundName").click(function(e){
            viewData("");
            e.stopPropagation();
        });

        //焦点获取
        $("#fundName").focus(function(){
            viewData("");
        });

        // 基金选择下拉列表-输入框正在输入
        $("#fundName").keyup(function(){
            var fundProduct = $("#fundName").val();
            viewData(fundProduct);
        });

        // 基金选择下拉列表-类型切换
        $("#navTypeList").on('click', 'a', function(){
            $("#searchSelectBox").show();
            $(this).parent().find('.founds-search-btn').show();
            var Idx = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $(this).parents('.founds-search-box').find('.founds-search-list ul').eq(Idx).addClass('active').siblings().removeClass('active');
            return false;
        });

        // 基金选择下拉列表-选中基金
        $("#foundsSearchList").on('click', 'li', function(){
            $("#searchSelectBox").hide();
            $("#searchInBox").hide();
            selectFund($(this));
            return false;
        });

        // 基金选择下拉列表-选中基金
        $("#searchInBoxUl").on('click', 'li', function(){
            $("#searchSelectBox").hide();
            $("#searchInBox").hide();
            selectFund($(this));
            return false;
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
                loadSerarchIn(funds,"");
                foundsSelectCreatFun(funds);
                $("#searchSelectBox").hide();
                $("#searchInBox").hide();
                initFunction();
            }else{
                $("#fundName").val("基金选择器获取失败，请稍后重试。");
            }
        }
    });
}

//搜索，并且高亮显示
function loadSerarchIn(funds,searchContent){
    var html = "";
    //加载搜索内容列表
    for(var i=0;i < funds.length;i++){
        var fundInfo = funds[i];
        if(fundInfo.fundSupport020 || fundInfo.fundSupport022){
            html += "<li>"
            if(searchContent != "" && searchContent.indexOf(" ") == -1){
                //需要高亮显示
                var fundCode = fundInfo.fundCode;
                var fundName = fundInfo.fundName;
                fundCode = fundCode.replace(new RegExp(searchContent,"gm"),"<span color='blue'>"+searchContent+"</span>");
                fundName = fundName.replace(new RegExp(searchContent,"gm"),"<span color='blue'>"+searchContent+"</span>");
                html += "<p class='code'>"+fundCode+"</p>";
                html += "<p class='name'>"+fundName+"</p>";
            }else{
                html += "<p class='code'>"+fundInfo.fundCode+"</p>";
                html += "<p class='name'>"+fundInfo.fundName+"</p>";
            }
            html += "<p class='shareType' style='display: none'>"+fundInfo.shareType+"</p>";
            html += "</li>"
        }
    }
    $("#searchInBoxUl").html(html);
}

// 基金选择下拉框-生成
function foundsSelectCreatFun(funds){
    var html = "";
    var navHtml = "";
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
    for(var key in productTypeList){
        if(key == 0){
            navHtml += "<a class='active' href='javascript:void(0);'>"+productTypeList[key].key+"</a>";
        }else{
            navHtml += "<a href='javascript:void(0);'>"+productTypeList[key].key+"</a>";
        }
    }
    $("#navTypeList").html(navHtml);

    for(var key in productTypeList){
        if(key == 0){
            html += "<ul class='active'>";
        }else{
            html += "<ul>";
        }
        for(var productN in productTypeList[key].value){
            var product = (productTypeList[key].value)[productN];
            if(product.fundSupport020 || product.fundSupport022){
                html += "<li>";
                html += "<p class='code'>"+product.fundCode+"</p>";
                html += "<p class='name'>"+product.fundName+"</p>";
                html += "<p class='shareType' style='display: none'>"+product.shareType+"</p>";
                html += "</li>";
            }
        }
        html += "</ul>";
    }
    $("#foundsSearchList").html(html);
}

/**
 * 根据基金代码或者基金名称模糊搜索基金信息
 */
function findProduct(){
    var fund = [];
    var fundProduct = $("#fundName").val();
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

//展示基金选择器数据
function viewData(fundProduct){
    var fundName = $("#fundName").val();
    if(fundName == ""){
        $("#searchSelectBox").show();
        $(this).parent().find('.founds-search-btn').show();
        $("#searchInBox").hide();
    }else{
        var funds = findProduct();
        loadSerarchIn(funds,fundProduct);
        $("#searchInBox").show();
        $(this).parent().find('.founds-search-in').show();
        $("#searchSelectBox").hide();
    }
} 
});
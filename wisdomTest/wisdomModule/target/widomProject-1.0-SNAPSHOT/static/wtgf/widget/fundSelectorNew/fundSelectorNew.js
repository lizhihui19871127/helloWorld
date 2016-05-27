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
        //���ػ���ѡ����
        loadFundSelecter();
    };

    var bindEvent = function(){
        // ����ȫ���¼�,�رջ���ѡ����
        $(document).click(function () {
            $("#searchInBox").hide();
            $("#searchSelectBox").hide();
        });

        //�������ʾ����ֹ����ʱ��ȫ��click�¼�����
        $('#searchInBox').click(function (e) {
            //���onclick�Ĺ���
            $("#searchInBox").show();
            // ֹͣ�¼�����
            e.stopPropagation();
        });

        //�������ʾ����ֹ����ʱ��ȫ��click�¼�����
        $('#searchSelectBox').click(function (e) {
            //���onclick�Ĺ���
            $("#searchSelectBox").show();
            // ֹͣ�¼�����
            e.stopPropagation();
        });

        //����¼�
        $("#fundName").click(function(e){
            viewData("");
            e.stopPropagation();
        });

        //�����ȡ
        $("#fundName").focus(function(){
            viewData("");
        });

        // ����ѡ�������б�-�������������
        $("#fundName").keyup(function(){
            var fundProduct = $("#fundName").val();
            viewData(fundProduct);
        });

        // ����ѡ�������б�-�����л�
        $("#navTypeList").on('click', 'a', function(){
            $("#searchSelectBox").show();
            $(this).parent().find('.founds-search-btn').show();
            var Idx = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $(this).parents('.founds-search-box').find('.founds-search-list ul').eq(Idx).addClass('active').siblings().removeClass('active');
            return false;
        });

        // ����ѡ�������б�-ѡ�л���
        $("#foundsSearchList").on('click', 'li', function(){
            $("#searchSelectBox").hide();
            $("#searchInBox").hide();
            selectFund($(this));
            return false;
        });

        // ����ѡ�������б�-ѡ�л���
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
                loadSerarchIn(funds,"");
                foundsSelectCreatFun(funds);
                $("#searchSelectBox").hide();
                $("#searchInBox").hide();
                initFunction();
            }else{
                $("#fundName").val("����ѡ������ȡʧ�ܣ����Ժ����ԡ�");
            }
        }
    });
}

//���������Ҹ�����ʾ
function loadSerarchIn(funds,searchContent){
    var html = "";
    //�������������б�
    for(var i=0;i < funds.length;i++){
        var fundInfo = funds[i];
        if(fundInfo.fundSupport020 || fundInfo.fundSupport022){
            html += "<li>"
            if(searchContent != "" && searchContent.indexOf(" ") == -1){
                //��Ҫ������ʾ
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

// ����ѡ��������-����
function foundsSelectCreatFun(funds){
    var html = "";
    var navHtml = "";
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
 * ���ݻ��������߻�������ģ������������Ϣ
 */
function findProduct(){
    var fund = [];
    var fundProduct = $("#fundName").val();
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

//չʾ����ѡ��������
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
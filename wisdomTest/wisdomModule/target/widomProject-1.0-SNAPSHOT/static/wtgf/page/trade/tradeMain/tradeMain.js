var util = require("common:widget/util/util.js"),
    datepicker = require("common:widget/datepicker/datepicker.js"),
    juicer = require("common:widget/juicer/juicer.js"),
    dialog = require("common:widget/dialog/dialog.js"),
    btn = require("common:widget/btn/btn.js"),
    listUtil = require("common:widget/listUtil/listUtil.js"),
    mapUtil = require("common:widget/mapUtil/mapUtil.js");
var seminarsList = [];
var productTypeList = new Array();
var findProductCodeList = new Array();
var findProductNameList = new Array();
var main = (function(){
    var _init = function(){
        loadAdvProduct();
        loadProducts();
    };

    var bindEvent = function(){
        var $containerPay = $('.container-pay');

        // 订单首页-自选产品-类型切换
        $containerPay.on('mouseenter', '.table-nav-list a', function(){
            $("#productInfoList").css("display","");
            $("#findProductList").css("display","none");
            var Idx = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $containerPay.find('.item-table-main .table-box').eq(Idx).addClass('active').siblings().removeClass('active');
        });

        $("#fundProduct").keyup(function(){
            findProduct();
        });

        //绑定排序点击事件
        $(".pay-main .item-table").on('click','.sortkey',sortInfo);
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

/**
 * 加载优选产品
 */
function loadAdvProduct(){
    $("#yxProduct").html("数据加载中，请稍后......");
    $.ajax({
        type: "post",
        url: "/gff/api/seminar_fund.vir",
        data: {"sign":"6F84BC2642F3FC69BB1F6E58CB9CD323","market":"91","app_version":"1.5","app_channel":"NETNO_ANDROID_GFAPP","device_info":"ios"},
        success: function (data) {
            var data = eval('(' + data + ')');
            var retCode = data.RETCODE;
            if(retCode == "0000"){
                //返回成功
                var seminars = data.seminars;
                var index = 0;
                if(seminars != null && seminars.length > 0){
                    for(var i = 0;i < seminars.length;i++){
                        var seminarInfo = seminars[i];
                        var seminar_funds = seminarInfo.seminar_funds;
                        if(seminar_funds != null && seminar_funds.length > 0){
                            var seminar_fundsInfo = seminar_funds[0];
                            if(seminar_fundsInfo.fund_code == "000509" || seminar_fundsInfo.fund_name == "广发钱袋子"){
                                continue;
                            }else{
                                index++;
                                if(index == 4){
                                    break;
                                }else{
                                    listUtil.use.add(seminarsList,seminarInfo);
                                }
                            }
                        }
                    }
                }
                var contentHtml = "";
                var index = 0;
                for (var seminarsKey in seminarsList){
                    var seminarsValue = seminarsList[seminarsKey];
                    var seminar_funds = seminarsValue.seminar_funds;
                    if(seminar_funds != null && seminar_funds.length > 0){
                        for(var j =0;j < seminar_funds.length;j++){
                            var seminar_fundsInfo = seminar_funds[j];
                            if(seminar_fundsInfo.fund_code == "000509" || seminar_fundsInfo.fund_name == "广发钱袋子"){
                                continue;
                            }else{
                                index++;
                                if(index == 4){
                                    break;
                                }else{
                                    var content = "<li>";
                                    content += "<div class='title'>";
                                    content += "<p>"+seminar_fundsInfo.fund_desc+"</p>";
                                    content += "<h3><a href='http://www.gffunds.com.cn/funds/?"+seminar_fundsInfo.fund_code+"' target='_blank'>"+seminar_fundsInfo.fund_name+"</a></h3>";
                                    //防止基金介绍信息内容多，页面错乱
                                    if(seminar_fundsInfo.fund_desc.length>22){
                                        content += "<p class='tag' style='margin-top:20px'>"+seminarsValue.ser_name+"</p>";
                                    }else{
                                        content += "<p class='tag'>"+seminarsValue.ser_name+"</p>";
                                    }
                                    content += "</div>";
                                    //防止基金介绍信息内容多，页面错乱
                                    if(seminar_fundsInfo.fund_desc.length>22){
                                        content += "<div class='type' style='margin-top:-20px'>";
                                    }else{
                                        content += "<div class='type'>";
                                    }
                                    var fundType = seminar_fundsInfo.fund_type;
                                    var fundTypeName = getFundTypeName(fundType);
                                    content += "<p>"+fundTypeName+"</p>";
                                    content += "<p>现已成交<em>"+seminar_fundsInfo.num+"</em>笔</p></div>";
                                    //防止产品名称太长，页面有点现实不好的问题
                                    if(seminar_fundsInfo.fund_name.length > 8){
                                        content += "<div class='data' style='right:0px'>";
                                    }else{
                                        content += "<div class='data'>";
                                    }
                                    var color = "#D45317";
                                    if(seminar_fundsInfo.ror.indexOf("-")!=-1){
                                        color = "green";
                                    }
                                    content += "<p><em style='color:"+color+"'>"+seminar_fundsInfo.ror+"%</em></p>";
                                    content += "<p class='txt'>"+seminar_fundsInfo.ror_name+"</p></div>";
                                    content += "<div class='btn2'>";
                                    content += "<a class='skins-btn' href='/trade/BuyAction.do?method=buyPre&businCode=022&fundCode="+seminar_fundsInfo.fund_code+"'>购买</a></div>";
                                    content += "</li>";
                                    contentHtml += content;
                                }
                            }
                        }
                    }
                }
                $("#yxProduct").html(contentHtml);
            }
        }
    });
}

/**
 * 加载所有的自选产品
 */
function loadProducts(){
    $("#fundProduct").hide();
    $("#productInfoList").html("数据加载中，请稍后......");
    $.ajax({
        type: "post",
        url:"/main/tradeMain/products",
        data: null,
        success: function (data) {
            var retCode = data.retCode;
            if(retCode == "0000"){
                var funds = data.funds;
                for(var i=0;i < funds.length;i++){
                    var fundInfo = funds[i];
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
                var contentHtml = "";
                var productContentHtml = "";
                for(var key in productTypeList){
                    var content = "";
                    var productContent = "";
                    if(key == 0){
                        content += "<a class='skins-btn active' href='javascript:void(0);'>"+productTypeList[key].key+"</a>";
                        productContent += "<div class='table-box active'>";
                    }else{
                        content += "<a class='skins-btn' href='javascript:void(0);'>"+productTypeList[key].key+"</a>";
                        productContent += "<div class='table-box'>";
                    }
                    productContent += "<div class='table-box-link'></div>";
                    productContent += "<table><tr>";
                    productContent += "<th>基金代码</th>";
                    productContent += "<th>基金名称</th>";
                    if(productTypeList[key].key == "货币型" || productTypeList[key].key == "理财型"){
                        productContent += "<th>万份收益（元）</th>";
                        productContent += "<th class='sortkey' dtype='F'>七日年化收益率<span style='width: 3px'>&nbsp;<img src='/static/wtgf/img/disorderly.png' style='width: 10px;height: 15px' alt='' /></th>";
                    }else{
                        productContent += "<th>单位净值</th>";
                        productContent += "<th class='sortkey' dtype='F'>日涨跌<span style='width: 3px'>&nbsp;<img src='/static/wtgf/img/disorderly.png' style='width: 10px;height: 15px' alt='' /></th>";
                        productContent += "<th class='sortkey' dtype='F'>今年以来收益率<span style='width: 3px'>&nbsp;<img src='/static/wtgf/img/disorderly.png' style='width: 10px;height: 15px' alt='' /></th>";
                    }
                    productContent += "<th>操作</th></tr>";
                    for(var productN in productTypeList[key].value){
                        var product = (productTypeList[key].value)[productN];
                        productContent += showProduct(product,productTypeList[key].key);
                    }
                    productContent += "</table></div>";
                    contentHtml += content;
                    productContentHtml += productContent;
                }
                $("#categoryType").html(contentHtml);
                $("#productInfoList").html(productContentHtml);
                $("#fundProduct").show();
            }
        }
    });
}

/**
 * 获取类别下的所有基金
 * @param productTypeList
 * @param key
 * @returns {string}
 */
function showProduct(product,key){
    var productContent = "";
    var noShow = "--";
    if(product.fundStatus == "10" || product.fundStatus == "3"){
        //基金终止，不显示
    }else{
        productContent += "<tr>";
        productContent += "<td>"+product.fundCode+"</td>";
        productContent += "<td><a href='http://www.gffunds.com.cn/funds/?"+product.fundCode+"' target='_blank' style='color:#0061cc'>"+product.fundName+"</a></td>";
        if(key == "货币型" || key == "理财型"){
            if(product.unitYield == "" && product.navDate == ""){
                productContent += "<td><p class='num'>"+noShow+"</p></td>";
            }else{
                var date = product.navDate==""?"":product.navDate.substring(0,4)+"."+product.navDate.substring(4,6)+"."+product.navDate.substring(6);
                productContent += "<td><p class='num'>"+(product.unitYield==""?noShow:product.unitYield)+"</p><p class='date'>"+(product.navDate==""?noShow:date)+"</p></td>";

            }
            var yearlyROE7 = "";
            if(product.yearlyROE7 == ""){
                yearlyROE7 = noShow;
            }else{
                yearlyROE7 = product.yearlyROE7+"%";
            }
            productContent += "<td><span class='red'>"+yearlyROE7+"</span></td>";
        }else{
            if(product.navUnit == "" && product.navDate == ""){
                productContent += "<td><p class='num'>"+noShow+"</p></td>";
            }else{
                var date = product.navDate==""?"":product.navDate.substring(0,4)+"."+product.navDate.substring(4,6)+"."+product.navDate.substring(6);
                productContent += "<td><p class='num'>"+(product.navUnit==""?noShow:product.navUnit)+"</p><p class='date'>"+(product.navDate==""?noShow:date)+"</p></td>";
            }
            var dayIncrementRate = "";
            var color = "red";
            if(product.dayIncrementRate == ""){
                dayIncrementRate = noShow;
            }else{
                if(product.dayIncrementRate.indexOf("-")!=-1){
                    color = "green";
                }
                dayIncrementRate = product.dayIncrementRate+"%";
            }
            productContent += "<td><span class='"+color+"'>"+dayIncrementRate+"</span></td>";
            var yieldThisy = "";
            var color = "red";
            if(product.yieldThisy == ""){
                yieldThisy = noShow;
            }else{
                if(product.yieldThisy.indexOf("-")!=-1){
                    color = "green";
                }
                yieldThisy = product.yieldThisy+"%";
            }
            productContent += "<td><span class='"+color+"'>"+yieldThisy+"</span></td>";
        }
        productContent += "<td>";
        if(product.fundStatus == "9"){
            productContent += "封闭期";
        }else if(product.fundSupport020 || product.fundSupport022 || product.fundSupport090){
            if(product.fundSupport020){
                productContent += "<a href='/trade/BuyAction.do?method=buyPre&businCode=020&fundCode="+product.fundCode+"' class='skins-btn'>认购</a>&nbsp;&nbsp;";
            }else if(product.fundSupport022){
                productContent += "<a href='/trade/BuyAction.do?method=buyPre&businCode=022&fundCode="+product.fundCode+"' class='skins-btn'>申购</a>&nbsp;&nbsp;";
            }
            if(product.fundSupport090){
                productContent += "<a href='/trade/FixTradeAction.do?method=editFundPlan&fundCode="+product.fundCode+"' class='skins-btn2' style='color:#ef7638'>定投</a>";
            }
        }else{
            productContent += "暂停交易";
        }
        productContent += "</td></tr>";
    }
    return productContent;
}

/**
 * 根据fundType获取基金类型名称
 * @param fundType
 * @returns {string}
 */
function getFundTypeName(fundType){
    var fundTypeName = "";
    if(fundType == "0"){
        fundTypeName = "股票型";
    }else if(fundType == "1"){
        fundTypeName = "债券型";
    }else if(fundType == "2"){
        fundTypeName = "货币型";
    }else if(fundType == "3"){
        fundTypeName = "ETF型";
    }else if(fundType == "4"){
        fundTypeName = "混合型";
    }else if(fundType == "21"){
        fundTypeName = "类货币基金型";
    }else if(fundType == "5"){
        fundTypeName = "QDII型";
    }else if(fundType == "6"){
        fundTypeName = "保本型";
    }else if(fundType == "7"){
        fundTypeName = "专户型";
    }
    return fundTypeName;
}

/**
 * 根据基金代码或者基金名称模糊搜索基金信息
 */
function findProduct(){
    $("#findProductList").html("");
    $("#productInfoList").css("display","none");
    $(".table-nav-list a").siblings().removeClass('active');
    var fundProduct = $("#fundProduct").val();
    var num1 = 0;//非货币型基金个数
    var num2 = 0;//货币型基金个数
    var title1 = "";//非货币型标题
    var title2 = "";//货币型标题
    var temp;
    var content = "";
    temp = "<div class='table-box active'>";
    temp += "<div class='table-box-link'></div>";
    temp += "<table><tr>";
    temp += "<th>基金代码</th>";
    temp += "<th>基金名称</th>";
    title1 += temp+"<th>单位净值</th>";
    title1 += "<th class='sortkey' dtype='F'>日涨跌<span style='width: 3px'>&nbsp;<img src='/static/wtgf/img/disorderly.png' style='width: 10px;height: 15px' alt='' /></th>";
    title1 += "<th class='sortkey' dtype='F'>今年以来收益率<span style='width: 3px'>&nbsp;<img src='/static/wtgf/img/disorderly.png' style='width: 10px;height: 15px' alt='' /></th>";
    title1 += "<th style='width:230px'>操作</th></tr>";

    title2 += temp+"<th>万份收益（元）</th>";
    title2 += "<th class='sortkey' dtype='F'>七日年化收益率<span style='width: 3px'>&nbsp;<img src='/static/wtgf/img/disorderly.png' style='width: 10px;height: 15px' alt='' /></th>";
    title2 += "<th style='width:230px'>操作</th></tr>";

    for(var key in findProductCodeList){
        //按照基金代码搜索
        var keyInfo = findProductCodeList[key].key;
        if(keyInfo.indexOf(fundProduct) != -1){
            if(findProductCodeList[key].value.categoryName == "货币型" || findProductCodeList[key].value.categoryName == "理财型"){
                title2 += showProduct(findProductCodeList[key].value,"货币型");
                num2++;
            }else{
                title1 += showProduct(findProductCodeList[key].value,"");
                num1++;
            }
        }
    }
    if(fundProduct != null && fundProduct != ""){
        //按照基金名称搜索
        for(var key in findProductNameList){
            var keyInfo = findProductNameList[key].key;
            if(keyInfo.indexOf(fundProduct) != -1){
                if(findProductNameList[key].value.categoryName == "货币型" || findProductNameList[key].value.categoryName == "理财型"){
                    title2 += showProduct(findProductNameList[key].value,"货币型");
                    num2++;
                }else{
                    title1 += showProduct(findProductNameList[key].value,"");
                    num1++;
                }
            }
        }
    }
    if(num2 != 0){
        $("#findProductList").html(title2);
    }
    if(num1 != 0){
        $("#findProductList").html($("#findProductList").html()+title1);
    }
    $("#findProductList").css("display","");
}
//排序
var sortInfo = function() {
    var target = $(this);
    var sortedby = target.attr("sortedby");
    var datatype = target.attr("dtype");
    if (datatype == "")
        return;
    if (typeof sortedby == "undefined" || sortedby == "")
        sortedby = "-";//默认降序
    else if (sortedby == "+")
        sortedby = "-";
    else
        sortedby = "+";
    target.attr("sortedby",sortedby);
    //标题行
    var titlerow = target.parent("tr");
    //获取单元格在标题中的位置
    var idx = titlerow.find("th").index(target);
    //获取需要排序的行
    var rows = target.parents("table").find("tr:not(.exclude)").not(titlerow);

    if (sortedby == "+"){
        titlerow.find("th").not(idx).find("img").attr("src","/static/wtgf/img/disorderly.png");
        titlerow.find("th").eq(idx).find("img").attr("src","/static/wtgf/img/positive.png");
    }else{
        titlerow.find("th").not(idx).find("img").attr("src","/static/wtgf/img/disorderly.png");
        titlerow.find("th").eq(idx).find("img").attr("src","/static/wtgf/img/reverse.png");
    }
    //开始排序
    var temp = titlerow;
    var est = null;
    var length = rows.length;
    for (var i = 0; i < length; i++) {
        //每次选出数组中最大或最小的行插入到当前值的后面
        est = $(rows[0]);
        var estval = est.find("td").eq(idx).text();
        if (datatype == "F"){}
            estval = (estval == "" || estval == "--") ? 0.00 : parseFloat(estval.replace("%",""));
        for (var l = 1; l < rows.length; l++) {
            var lobj = $(rows[l]);
            var lval = lobj.find("td").eq(idx).text();
            if (datatype == "F")
                lval = (lval == "" || lval == "--") ? 0.00 : parseFloat(lval.replace("%",""));
            if (sortedby == "+" && lval < estval) {
                est = lobj;
                estval = lval;
            } else if (sortedby == "-" && lval > estval) {
                est = lobj;
                estval = lval;
            }
        }
        //找到当前最大或最小的那一行以后，把这一行插入到表格已排序行的末尾，再从集合中删除此元素
        est.insertAfter(temp);
        temp = est;
        rows = rows.not(est);
    }
};
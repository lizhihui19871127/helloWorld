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

        // ������ҳ-��ѡ��Ʒ-�����л�
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

        //���������¼�
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
 * ������ѡ��Ʒ
 */
function loadAdvProduct(){
    $("#yxProduct").html("���ݼ����У����Ժ�......");
    $.ajax({
        type: "post",
        url: "/gff/api/seminar_fund.vir",
        data: {"sign":"6F84BC2642F3FC69BB1F6E58CB9CD323","market":"91","app_version":"1.5","app_channel":"NETNO_ANDROID_GFAPP","device_info":"ios"},
        success: function (data) {
            var data = eval('(' + data + ')');
            var retCode = data.RETCODE;
            if(retCode == "0000"){
                //���سɹ�
                var seminars = data.seminars;
                var index = 0;
                if(seminars != null && seminars.length > 0){
                    for(var i = 0;i < seminars.length;i++){
                        var seminarInfo = seminars[i];
                        var seminar_funds = seminarInfo.seminar_funds;
                        if(seminar_funds != null && seminar_funds.length > 0){
                            var seminar_fundsInfo = seminar_funds[0];
                            if(seminar_fundsInfo.fund_code == "000509" || seminar_fundsInfo.fund_name == "�㷢Ǯ����"){
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
                            if(seminar_fundsInfo.fund_code == "000509" || seminar_fundsInfo.fund_name == "�㷢Ǯ����"){
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
                                    //��ֹ���������Ϣ���ݶ࣬ҳ�����
                                    if(seminar_fundsInfo.fund_desc.length>22){
                                        content += "<p class='tag' style='margin-top:20px'>"+seminarsValue.ser_name+"</p>";
                                    }else{
                                        content += "<p class='tag'>"+seminarsValue.ser_name+"</p>";
                                    }
                                    content += "</div>";
                                    //��ֹ���������Ϣ���ݶ࣬ҳ�����
                                    if(seminar_fundsInfo.fund_desc.length>22){
                                        content += "<div class='type' style='margin-top:-20px'>";
                                    }else{
                                        content += "<div class='type'>";
                                    }
                                    var fundType = seminar_fundsInfo.fund_type;
                                    var fundTypeName = getFundTypeName(fundType);
                                    content += "<p>"+fundTypeName+"</p>";
                                    content += "<p>���ѳɽ�<em>"+seminar_fundsInfo.num+"</em>��</p></div>";
                                    //��ֹ��Ʒ����̫����ҳ���е���ʵ���õ�����
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
                                    content += "<a class='skins-btn' href='/trade/BuyAction.do?method=buyPre&businCode=022&fundCode="+seminar_fundsInfo.fund_code+"'>����</a></div>";
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
 * �������е���ѡ��Ʒ
 */
function loadProducts(){
    $("#fundProduct").hide();
    $("#productInfoList").html("���ݼ����У����Ժ�......");
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
                        //������ڣ��ͼӽ�ԭ���ķ�������
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
                    productContent += "<th>�������</th>";
                    productContent += "<th>��������</th>";
                    if(productTypeList[key].key == "������" || productTypeList[key].key == "�����"){
                        productContent += "<th>������棨Ԫ��</th>";
                        productContent += "<th class='sortkey' dtype='F'>�����껯������<span style='width: 3px'>&nbsp;<img src='/static/wtgf/img/disorderly.png' style='width: 10px;height: 15px' alt='' /></th>";
                    }else{
                        productContent += "<th>��λ��ֵ</th>";
                        productContent += "<th class='sortkey' dtype='F'>���ǵ�<span style='width: 3px'>&nbsp;<img src='/static/wtgf/img/disorderly.png' style='width: 10px;height: 15px' alt='' /></th>";
                        productContent += "<th class='sortkey' dtype='F'>��������������<span style='width: 3px'>&nbsp;<img src='/static/wtgf/img/disorderly.png' style='width: 10px;height: 15px' alt='' /></th>";
                    }
                    productContent += "<th>����</th></tr>";
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
 * ��ȡ����µ����л���
 * @param productTypeList
 * @param key
 * @returns {string}
 */
function showProduct(product,key){
    var productContent = "";
    var noShow = "--";
    if(product.fundStatus == "10" || product.fundStatus == "3"){
        //������ֹ������ʾ
    }else{
        productContent += "<tr>";
        productContent += "<td>"+product.fundCode+"</td>";
        productContent += "<td><a href='http://www.gffunds.com.cn/funds/?"+product.fundCode+"' target='_blank' style='color:#0061cc'>"+product.fundName+"</a></td>";
        if(key == "������" || key == "�����"){
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
            productContent += "�����";
        }else if(product.fundSupport020 || product.fundSupport022 || product.fundSupport090){
            if(product.fundSupport020){
                productContent += "<a href='/trade/BuyAction.do?method=buyPre&businCode=020&fundCode="+product.fundCode+"' class='skins-btn'>�Ϲ�</a>&nbsp;&nbsp;";
            }else if(product.fundSupport022){
                productContent += "<a href='/trade/BuyAction.do?method=buyPre&businCode=022&fundCode="+product.fundCode+"' class='skins-btn'>�깺</a>&nbsp;&nbsp;";
            }
            if(product.fundSupport090){
                productContent += "<a href='/trade/FixTradeAction.do?method=editFundPlan&fundCode="+product.fundCode+"' class='skins-btn2' style='color:#ef7638'>��Ͷ</a>";
            }
        }else{
            productContent += "��ͣ����";
        }
        productContent += "</td></tr>";
    }
    return productContent;
}

/**
 * ����fundType��ȡ������������
 * @param fundType
 * @returns {string}
 */
function getFundTypeName(fundType){
    var fundTypeName = "";
    if(fundType == "0"){
        fundTypeName = "��Ʊ��";
    }else if(fundType == "1"){
        fundTypeName = "ծȯ��";
    }else if(fundType == "2"){
        fundTypeName = "������";
    }else if(fundType == "3"){
        fundTypeName = "ETF��";
    }else if(fundType == "4"){
        fundTypeName = "�����";
    }else if(fundType == "21"){
        fundTypeName = "����һ�����";
    }else if(fundType == "5"){
        fundTypeName = "QDII��";
    }else if(fundType == "6"){
        fundTypeName = "������";
    }else if(fundType == "7"){
        fundTypeName = "ר����";
    }
    return fundTypeName;
}

/**
 * ���ݻ��������߻�������ģ������������Ϣ
 */
function findProduct(){
    $("#findProductList").html("");
    $("#productInfoList").css("display","none");
    $(".table-nav-list a").siblings().removeClass('active');
    var fundProduct = $("#fundProduct").val();
    var num1 = 0;//�ǻ����ͻ������
    var num2 = 0;//�����ͻ������
    var title1 = "";//�ǻ����ͱ���
    var title2 = "";//�����ͱ���
    var temp;
    var content = "";
    temp = "<div class='table-box active'>";
    temp += "<div class='table-box-link'></div>";
    temp += "<table><tr>";
    temp += "<th>�������</th>";
    temp += "<th>��������</th>";
    title1 += temp+"<th>��λ��ֵ</th>";
    title1 += "<th class='sortkey' dtype='F'>���ǵ�<span style='width: 3px'>&nbsp;<img src='/static/wtgf/img/disorderly.png' style='width: 10px;height: 15px' alt='' /></th>";
    title1 += "<th class='sortkey' dtype='F'>��������������<span style='width: 3px'>&nbsp;<img src='/static/wtgf/img/disorderly.png' style='width: 10px;height: 15px' alt='' /></th>";
    title1 += "<th style='width:230px'>����</th></tr>";

    title2 += temp+"<th>������棨Ԫ��</th>";
    title2 += "<th class='sortkey' dtype='F'>�����껯������<span style='width: 3px'>&nbsp;<img src='/static/wtgf/img/disorderly.png' style='width: 10px;height: 15px' alt='' /></th>";
    title2 += "<th style='width:230px'>����</th></tr>";

    for(var key in findProductCodeList){
        //���ջ����������
        var keyInfo = findProductCodeList[key].key;
        if(keyInfo.indexOf(fundProduct) != -1){
            if(findProductCodeList[key].value.categoryName == "������" || findProductCodeList[key].value.categoryName == "�����"){
                title2 += showProduct(findProductCodeList[key].value,"������");
                num2++;
            }else{
                title1 += showProduct(findProductCodeList[key].value,"");
                num1++;
            }
        }
    }
    if(fundProduct != null && fundProduct != ""){
        //���ջ�����������
        for(var key in findProductNameList){
            var keyInfo = findProductNameList[key].key;
            if(keyInfo.indexOf(fundProduct) != -1){
                if(findProductNameList[key].value.categoryName == "������" || findProductNameList[key].value.categoryName == "�����"){
                    title2 += showProduct(findProductNameList[key].value,"������");
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
//����
var sortInfo = function() {
    var target = $(this);
    var sortedby = target.attr("sortedby");
    var datatype = target.attr("dtype");
    if (datatype == "")
        return;
    if (typeof sortedby == "undefined" || sortedby == "")
        sortedby = "-";//Ĭ�Ͻ���
    else if (sortedby == "+")
        sortedby = "-";
    else
        sortedby = "+";
    target.attr("sortedby",sortedby);
    //������
    var titlerow = target.parent("tr");
    //��ȡ��Ԫ���ڱ����е�λ��
    var idx = titlerow.find("th").index(target);
    //��ȡ��Ҫ�������
    var rows = target.parents("table").find("tr:not(.exclude)").not(titlerow);

    if (sortedby == "+"){
        titlerow.find("th").not(idx).find("img").attr("src","/static/wtgf/img/disorderly.png");
        titlerow.find("th").eq(idx).find("img").attr("src","/static/wtgf/img/positive.png");
    }else{
        titlerow.find("th").not(idx).find("img").attr("src","/static/wtgf/img/disorderly.png");
        titlerow.find("th").eq(idx).find("img").attr("src","/static/wtgf/img/reverse.png");
    }
    //��ʼ����
    var temp = titlerow;
    var est = null;
    var length = rows.length;
    for (var i = 0; i < length; i++) {
        //ÿ��ѡ��������������С���в��뵽��ǰֵ�ĺ���
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
        //�ҵ���ǰ������С����һ���Ժ󣬰���һ�в��뵽����������е�ĩβ���ٴӼ�����ɾ����Ԫ��
        est.insertAfter(temp);
        temp = est;
        rows = rows.not(est);
    }
};
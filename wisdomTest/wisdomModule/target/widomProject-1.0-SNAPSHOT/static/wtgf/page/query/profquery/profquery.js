var util = require("common:widget/util/util.js");

var genProfRow = function(prof,isfoot) {
    if (typeof(prof) == "undefined" || prof == null)
        return "";
    var lastDayPro = prof.lastDayPro,lastWeekPro = prof.lastWeekPro,lastMonthPro = prof.lastMonthPro,
        last3MonthPro = prof.last3MonthPro,last6MonthPro = prof.last6MonthPro,lastYearPro = prof.lastYearPro,
        thisYearPro = prof.thisYearPro,totalPro = prof.totalPro,lastDayRate = prof.lastDayRate,
        lastWeekRate = prof.lastWeekRate,lastMonthRate = prof.lastMonthRate,last3MonthRate = prof.last3MonthRate,
        last6MonthRate = prof.last6MonthRate,lastYearRate = prof.lastYearRate,thisYearRate = prof.thisYearRate,
        totalRate = prof.totalRate;
    var row = "";
    if (isfoot == true) {
        row += "<tfoot><tr fundCode='"+prof.fundCode+"' lastDayPro='"+getStr(lastDayPro)+"' lastWeekPro='"+getStr(lastWeekPro)+"' lastMonthPro='"+getStr(lastMonthPro)+"' last3MonthPro='"+getStr(last3MonthPro)+"' " +
            "last6MonthPro='"+getStr(last6MonthPro)+"' lastYearPro='"+getStr(lastYearPro)+"' thisYearPro='"+getStr(thisYearPro)+"' totalPro='"+getStr(totalPro)+"' " +
            "lastDayRate='"+getStr(lastDayRate)+"' lastWeekRate='"+getStr(lastWeekRate)+"' lastMonthRate='"+getStr(lastMonthRate)+"' last3MonthRate='"+getStr(last3MonthRate)+"' " +
            "last6MonthRate='"+getStr(last6MonthRate)+"' lastYearRate='"+getStr(lastYearRate)+"' thisYearRate='"+getStr(thisYearRate)+"' totalRate='"+getStr(totalRate)+"' " +
            " class='profdetailtr proftotal exclude'><td>合计</td><td>--</td>";
    } else {
        row += "<tr fundCode='"+prof.fundCode+"' lastDayPro='"+getStr(lastDayPro)+"' lastWeekPro='"+getStr(lastWeekPro)+"' lastMonthPro='"+getStr(lastMonthPro)+"' last3MonthPro='"+getStr(last3MonthPro)+"' " +
            "last6MonthPro='"+getStr(last6MonthPro)+"' lastYearPro='"+getStr(lastYearPro)+"' thisYearPro='"+getStr(thisYearPro)+"' totalPro='"+getStr(totalPro)+"' " +
            "lastDayRate='"+getStr(lastDayRate)+"' lastWeekRate='"+getStr(lastWeekRate)+"' lastMonthRate='"+getStr(lastMonthRate)+"' last3MonthRate='"+getStr(last3MonthRate)+"' " +
            "last6MonthRate='"+getStr(last6MonthRate)+"' lastYearRate='"+getStr(lastYearRate)+"' thisYearRate='"+getStr(thisYearRate)+"' totalRate='"+getStr(totalRate)+"' ";
        if (prof.endVal == null || prof.endVal == "--" || parseFloat(prof.endVal) <= 0) {
            row += " class='profdetailtr hide' isZero='true' ";
        } else {
            row += " class='profdetailtr' ";
        }
        row += "><td>"+getStr(prof.fundCode)+"</td>"
            + "<td>"+getStr(prof.fundName)+"</td>";
    }
    row += "<td><span class='black'>"+util.number.format(prof.endVal,2)+"</span></td>"
        //默认显示最近一天的收益
        + "<td><span class='"+getClass(lastDayPro)+"'>"+util.number.format(getStr(lastDayPro),2)+"</span></td>"
        + "<td><span class='"+getClass(lastDayRate)+"'>"+getStr(lastDayRate)+"</span></td>";
    if (isfoot == true) {
        row += "</tr></tfoot>";
    } else {
        row += "</tr>";
    }
    return row;
};

var genTotalRow = function(prof, moneytype) {
    if (typeof(prof) == "undefined" || prof == null)
        return "";
    var tval = prof.endVal;
    if (typeof(tval) == "undefined" || tval == null || tval == "") {
        tval = "0.00";
    }
    var row = "<tr><td><span class='black'>"+moneytype+"</span></td>" +
        "<td><span class='black'>"+util.number.format(tval,2)+"</span></td>" +
        "<td><span class='"+getClass(prof.lastDayPro)+"'>"+util.number.format(getStr(prof.lastDayPro),2)+"</span></td>" +
        "<td><span class='"+getClass(prof.lastDayRate)+"'>"+getStr(prof.lastDayRate)+"</span></td>" +
        "<td><span class='"+getClass(prof.totalPro)+"'>"+util.number.format(getStr(prof.totalPro),2)+"</span></td>" +
        "<td><span class='"+getClass(prof.totalRate)+"'>"+getStr(prof.totalRate)+"</span></td></tr>";
    return row;
};

var getStr = function(v) {
    if (typeof(v) == "undefined" || v == null)
        return "0.00";
    return v.toString();
};

var getClass = function(v) {
    if (typeof(v) == "undefined" || v == null || v == "--")
        return "black";
    var f = parseFloat(v);
    if (v >= 0)
        return "orange";
    else
        return "green";
};

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
    //开始排序
    var temp = titlerow;
    var est = null;
    var length = rows.length;

   // titlerow.find("th").eq(idx).find("img").attr("src","/static/wtgf/img/disorderly.png");

    if (sortedby == "+"){
        titlerow.find("th").not(idx).find("img").attr("src","/static/wtgf/img/disorderly.png");
        titlerow.find("th").eq(idx).find("img").attr("src","/static/wtgf/img/positive.png");

    }else{
        titlerow.find("th").not(idx).find("img").attr("src","/static/wtgf/img/disorderly.png");
        titlerow.find("th").eq(idx).find("img").attr("src","/static/wtgf/img/reverse.png");

    }

    for (var i = 0; i < length; i++) {
        //每次选出数组中最大或最小的行插入到当前值的后面
        est = $(rows[0]);
        var estval = est.find("td").eq(idx).text();
        if (datatype == "F")
            estval = (estval == "" || estval == "--") ? 0.0 : parseFloat(estval.replace(",",""));
        for (var l = 1; l < rows.length; l++) {
            var lobj = $(rows[l]);
            var lval = lobj.find("td").eq(idx).text();
            if (datatype == "F")
                lval = (lval == "" || lval == "--") ? 0.0 : parseFloat(lval.replace(",",""));
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

$(function() {
    //关闭ajax缓存
    $.ajaxSetup({cache:false});
    $.get("/main/profitdetail/query", function(returnobj) {
        if (typeof(returnobj) == "undefined" || returnobj == null) {
            alert("获取客户收益信息失败，请稍后重试！");
            return;
        }
        if (typeof(returnobj.issuccess) != "boolean" || returnobj.issuccess == false) {
            alert(returnobj.returnmsg);
            return;
        }
        var allProfInfo = returnobj.data;
        if (typeof(allProfInfo) == "undefined" || allProfInfo == null)
            return;
        var allFunds = "";
        var cnyTotalProf = allProfInfo.cnyTotalProf;//人民币总收益
        if (typeof(cnyTotalProf) != "undefined" && cnyTotalProf != null) {
            $(".totalProf table").append(genTotalRow(cnyTotalProf,"￥"));
        }
        var usdTotalProf = allProfInfo.usdTotalProf;//美元总收益
        if (typeof(usdTotalProf) != "undefined" && usdTotalProf != null) {
            $(".totalProf table").append(genTotalRow(usdTotalProf,"$"));
        }
        //钱袋子收益明细
        var allFunds = "";
        var walletProf = allProfInfo.walletProfs;
        if (typeof(walletProf) != "undefined" && walletProf != null && walletProf.length > 0) {
            for (var i in walletProf) {
                var wprof = walletProf[i];
                $(".walletPorf table").append(genProfRow(wprof, false));
                var fundCode = wprof.fundCode;
                var fundName = wprof.fundName;
                if (allFunds.indexOf(fundCode) < 0) {
                    allFunds += "," + fundCode;
                    $(".fundslt>ul>li:last").before("<li><span class='n'>"+fundCode+"</span><span class='t'>"+fundName+"</span></li>");
                }
            }
            $(".walletPorf tr").show().removeAttr("isZero");
        }
        //普通基金收益明细
        var normalProf = allProfInfo.normalProfs;
        if (typeof(normalProf) != "undefined" && normalProf != null && normalProf.length > 0) {
            for (var i in normalProf) {
                var nprof = normalProf[i];
                $(".normalProf table").append(genProfRow(nprof, false));
                var fundCode = nprof.fundCode;
                var fundName = nprof.fundName;
                if (allFunds.indexOf(fundCode) < 0) {
                    allFunds += "," + fundCode;
                    $(".fundslt>ul>li:last").before("<li><span class='n'>"+fundCode+"</span><span class='t'>"+fundName+"</span></li>");
                }
            }
            //普通基金收益合计
            var normalTotalPro = allProfInfo.normalTotalProf;
            if (typeof(normalTotalPro) != "undefined" && normalTotalPro != null) {
                $(".normalProf table").append(genProfRow(normalTotalPro, true));
            }
            if ($(".normalProf table tr:hidden").length > 0) {
                $(".normalProf .showzero").parent().show();
            }
//            queryShow(".normalProf");
        }
        //高端理财收益明细
        var specialProf = allProfInfo.specialProfs;
        if (typeof(specialProf) != "undefined" && specialProf != null && specialProf.length > 0) {
            for (var i in specialProf) {
                var sprof = specialProf[i];
                $(".specialProf table").append(genProfRow(sprof, false));
                var fundCode = sprof.fundCode;
                var fundName = sprof.fundName;
                if (allFunds.indexOf(fundCode) < 0) {
                    allFunds += "," + fundCode;
                    $(".fundslt>ul>li:last").before("<li><span class='n'>"+fundCode+"</span><span class='t'>"+fundName+"</span></li>");
                }
            }
            $(".specialProf").show();
            //高端理财收益合计
            var specialTotalPro = allProfInfo.specialTotalProf;
            if (typeof(specialTotalPro) != "undefined" && specialTotalPro != null) {
                $(".specialProf table").append(genProfRow(specialTotalPro, true));
            }
            if ($(".specialProf table tr:hidden").length > 0) {
                $(".specialProf .showzero").parent().show();
            }
        }
        //美元基金收益明细
        var usdProf = allProfInfo.usdProfs;
        if (typeof(usdProf) != "undefined" && usdProf != null && usdProf.length > 0) {
            for (var i in usdProf) {
                var usdprof = usdProf[i];
                $(".usdProf table").append(genProfRow(usdprof, false));
                var fundCode = usdprof.fundCode;
                var fundName = usdprof.fundName;
                if (allFunds.indexOf(fundCode) < 0) {
                    allFunds += "," + fundCode;
                    $(".fundslt>ul>li:last").before("<li><span class='n'>"+fundCode+"</span><span class='t'>"+fundName+"</span></li>");
                }
            }
            $(".usdProf").show();
            //美元基金收益合计
            var usdTotalPro = allProfInfo.usdTotalProf;
            if (typeof(usdTotalPro) != "undefined" && usdTotalPro != null) {
                $(".usdProf table").append(genProfRow(usdTotalPro, true));
            }
            if ($(".usdProf table tr:hidden").length > 0) {
                $(".usdProf .showzero").parent().show();
            }
        }
    });

    //显示或隐藏资产为0的收益信息
    $(".showzero").on("click",function(){
        var etarget = $(this);
        var isThisShown = etarget.attr("isshown");
        if (isThisShown == "false") {
            etarget.parents(".zc-item-table").find("tr[isZero]").show();
            etarget.html("隐藏持有份额为0的基金");
            etarget.attr("isshown","true");
        } else {
            etarget.parents(".zc-item-table").find("tr[isZero]").hide();
            etarget.html("显示持有份额为0的基金");
            etarget.attr("isshown","false");
        }
    });

    // 持仓查询-顶部查询
    var $zhcxHead = $('.zhcx-head');

    $zhcxHead.on('click', 'input', function(){
        $zhcxHead.find('.in-txt-sub').hide();

        $(this).parent().find('.in-txt-sub').show();

        return false;
    });

    $zhcxHead.on('click', '.in-txt-sub li', function(){
        var txt = $(this).find('.t').text();
        var val = $(this).find(".n").text();
        $(this).parents('label').find('.in-txt').val(txt);
        $(this).parents("label").find(".in-val").val(val);
        $(this).parents('.in-txt-sub').hide();

    });

    $('body').on('click', function(){
        $(this).find('.in-txt-sub1').hide();
        $(this).find('.in-txt-sub').hide();
    });


    $zhcxHead.on('click', 'input', function(){
        $zhcxHead.find('.in-txt-sub1').hide();

        $(this).parent().find('.in-txt-sub1').show();

        return false;
    });

    $zhcxHead.on('click', '.in-txt-sub1 li', function(){
        var txt = $(this).find('.t').text();
        var val = $(this).find(".n").text();
        $(this).parents('label').find('.in-txt').val(txt);
        $(this).parents("label").find(".in-val").val(val);
        $(this).parents('.in-txt-sub1').hide();

    });

    $('body').on('click', function(){
        $(this).find('.in-txt-sub1').hide();
    });

    $(".skins-btn").on("click", function() {
        //先还原所有已经显示的份额为0的行
        $(".vip-zc-main table tr[isZero='true']").hide();
        $(".showzero").attr("isshown","false");
        $(".show-more a").text("显示持有份额为0的基金");
        var fundCode = $(".fundCodeIpt").val();
        var period = $(".periodIpt").val();
        if (fundCode == "" || fundCode == "all") {
            $(".zc-item-table tr").not("[isZero='true']").show();
        } else {
            $(".profdetailtr:not(.proftotal)[fundCode!='" + fundCode + "']").hide();
            $(".profdetailtr:not(.proftotal)[fundCode='" + fundCode + "']").show();
        }
        var periodName = $(".periodslt span:contains('"+period+"')").next("span").text();
        var finalAssets=0;
        var yieldMont=0;
        var recentEarn=0;
        if (period != "total") periodName += "收益（元）"
        else periodName += "（元）";
        $(".profdetailtable").each(function(){
            var etarget = $(this);
            etarget.find("th:eq(3)").text(periodName);
            etarget.find(".profdetailtr").each(function(){
                var item = $(this);

                var pro = item.attr(period + "Pro");
                var rate = item.attr(period + "Rate");
                var clazz = "orange";
                if (parseFloat(pro) < 0) {
                    clazz = "green";
                }
                item.find("td:eq(3)").html("<span class='"+clazz+"'>"+pro+"</span>");
                item.find("td:eq(4)").html("<span class='"+clazz+"'>"+rate+"</span>");
                return true;
            });
            return true;
        });
//        queryShow(".normalProf");
//        queryShow(".specialProf");
//        queryShow(".usdProf");

       /* $(".normalProf .profdetailtable tr:visible").each(function(){
            var etarget = $(this);

            if(etarget.find("th:eq(0)").text()!="基金代码" && etarget.find("td:eq(0)").text()!="合计" ){
                finalAssets+=parseFloat(etarget.find("td:eq(2)").text().replace(",",""));
                yieldMont+=parseFloat(etarget.find("td:eq(3)").text().replace(",",""));
                recentEarn+=parseFloat(etarget.find("td:eq(4)").text().replace(",",""));
            }

        });
        var clazz = "orange";
        if (parseFloat(finalAssets) < 0) {
            clazz = "green";
        }

        $(".normalProf tfoot tr").find("td:eq(2)").html("<span class='black'>"+util.number.format(finalAssets,2)+"</span>");
        clazz = "orange";
        if (parseFloat(yieldMont) < 0) {
            clazz = "green";
        }
        $(".normalProf tfoot tr").find("td:eq(3)").html("<span class='"+clazz+"'>"+util.number.format(yieldMont,2)+"</span>");
        clazz = "orange";
        if (parseFloat(recentEarn) < 0) {
            clazz = "green";
        }
        $(".normalProf tfoot tr").find("td:eq(4)").html("<span class='"+clazz+"'>"+util.number.format(recentEarn,2)+"</span>");*/


    });


    //绑定排序点击事件
    $(".sortkey").on("click", sortInfo);
});

function goToWalletMain() {
    document.cookie = "row=r1;path=/";
    document.cookie = "col=c10;path=/";
    window.location.href = '/wallet/WalletDetailAction.do?method=index';
}
/**var queryShow = function(className) {

    var finalAssets=0;
    var yieldMont=0;
    var recentEarn=0;

    $(className+" .profdetailtable tr:visible").each(function(){
        var etarget = $(this);

        if(etarget.find("th:eq(0)").text().indexOf("基金代码")==-1 && etarget.find("td:eq(0)").text().indexOf("合计")==-1 ){

            finalAssets+=parseFloat(etarget.find("td:eq(2)").text().replace(",",""));
            yieldMont+=parseFloat(etarget.find("td:eq(3)").text().replace(",",""));
            recentEarn+=parseFloat(etarget.find("td:eq(4)").text().replace(",",""));
        }

    });

    var clazz = "orange";
    if (finalAssets < 0) {
        clazz = "green";
    }

    $(className+" tfoot tr").find("td:eq(2)").html("<span class='black'>"+util.number.format(finalAssets,2)+"</span>");
    clazz = "orange";
    if (yieldMont< 0) {
        clazz = "green";
    }
    $(className+" tfoot tr").find("td:eq(3)").html("<span class='"+clazz+"'>"+util.number.format(yieldMont,2)+"</span>");
    clazz = "orange";
    if (recentEarn < 0) {
        clazz = "green";
    }
    var fundCode = $(".fundCodeIpt").val();
    if(fundCode=="all"){
        $(className+" tfoot tr").find("td:eq(4)").html("<span class='"+clazz+"'>"+util.number.format(yieldMont*100/finalAssets,2)+"</span>");
    }else{
        $(className+" tfoot tr").find("td:eq(4)").html("<span class='"+clazz+"'>"+util.number.format(recentEarn,2)+"</span>");
    }

}*/

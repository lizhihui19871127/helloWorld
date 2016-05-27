var util = require("common:widget/util/util.js");

//fundtype 1-钱袋子，2-普通基金，3-短期理财，4-高端理财，5-美元基金
var genHoldRow = function(json,fundtype) {
    if (!json || json == null)
        return "";
    var row = "<tr fundCode='"+json.fundCode+"' agencyName='"+json.agencyName+"'>";
    row += "<td>"+json.fundCode+"</td>";
    row += "<td>"+json.fundName+"</td>";
    row += "<td>"+json.agencyName+"</td>";
    row += "<td>"+json.capitalName+"</td>"
    row += "<td>"+json.shareTypeShow+"</td>";
    row += "<td>"+json.divMethodShow+"</td>";
    row += "<td>"+util.number.format(json.totalShare,2)+"</td>";
    if (fundtype == 3) {
        row += "<td>"+json.regDate+"</td>";
        row += "<td>"+json.endDate+"</td>";
    } else {
        row += "<td>"+util.number.format(json.availShare,2)+"</td>";
        row += "<td>"+json.nav+"</td>";
    }
    if (fundtype != 4 && fundtype != 5)
        row += "<td>"+json.noIncome+"</td>";
    if (fundtype == 3)
        row += "<td>"+json.nav+"</td>";
    row += "<td>"+util.number.format(json.totalVal,2)+"</td>";
    row += "</tr>";
    return row;
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

$(function(){
    //关闭ajax缓存
    $.ajaxSetup({cache:false});
    $.get("/main/sharedetail/query", function(returnobj) {
        if (typeof(returnobj) == "undefined" || returnobj == null)
            return;
        if (returnobj.issuccess == false) {
            alert(returnobj.returnmsg);
            return;
        }
        var allAssetsInfo = returnobj.data;
        if (typeof(allAssetsInfo) == "undefined" || allAssetsInfo == null)
            return;
        var allFunds = "";
        var allAgency = "";
        //钱袋子持仓明细
        var walletHolds = allAssetsInfo.walletHoldsDetail;
        if (typeof(walletHolds) == "undefined" || walletHolds == null || walletHolds.length == 0) {
            $(".walletholdsdetail table").append("<tr><td colspan='11' style='text-align:center;'>暂无数据！</td></tr>");
        } else {
            for (var i in walletHolds) {
                var holdinfo = walletHolds[i];
                if (typeof(holdinfo) == "undefined" || holdinfo == null)
                    continue;
                var row = genHoldRow(holdinfo, 1);
                $(".walletholdsdetail table").append(row);
                var fundCode = holdinfo.fundCode;
                var fundName = holdinfo.fundName;
                var agencyName = holdinfo.agencyName;
                if (allFunds.indexOf(fundCode) < 0) {
                    allFunds += "," + fundCode;
                    $(".fundslt>ul>li:last").before("<li><span class='n'>"+fundCode+"</span><span class='t'>"+fundName+"</span></li>");
                }
                if (allAgency.indexOf(agencyName) < 0) {
                    allAgency += "|" + agencyName;
                    $(".agencyslt>ul>li:last").before("<li><span class='n hide'>"+agencyName+"</span><span class='t'>"+agencyName+"</span></li>");
                }
            }
        }
        //其他普通基金持仓明细
        var normalHolds = allAssetsInfo.normalHoldsDetail;
        if (typeof(normalHolds) == "undefined" || normalHolds == null || normalHolds.length == 0) {
            $(".normalholdsdetail table").append("<tr><td colspan='11' style='text-align:center;'>暂无数据！</td></tr>");
        } else {
            for (var i in normalHolds) {
                var holdinfo = normalHolds[i];
                if (!holdinfo || holdinfo == null)
                    continue;
                var row = genHoldRow(holdinfo, 2);
                $(".normalholdsdetail table").append(row);
                var fundCode = holdinfo.fundCode;
                var fundName = holdinfo.fundName;
                var agencyName = holdinfo.agencyName;
                if (allFunds.indexOf(fundCode) < 0) {
                    allFunds += "," + fundCode;
                    $(".fundslt>ul>li:last").before("<li><span class='n'>"+fundCode+"</span><span class='t'>"+fundName+"</span></li>");
                }
                if (allAgency.indexOf(agencyName) < 0) {
                    allAgency += "|" + agencyName;
                    $(".agencyslt>ul>li:last").before("<li><span class='n hide'>"+agencyName+"</span><span class='t'>"+agencyName+"</span></li>");
                }
            }
        }
        //短期理财产品持仓明细
        var shortHolds = allAssetsInfo.shortHoldsDetail;
        if (typeof(shortHolds) == "undefined" || shortHolds == null || shortHolds.length == 0) {
            //donothing
        } else {
            for (var i in shortHolds) {
                var holdinfo = shortHolds[i];
                if (!holdinfo || holdinfo == null)
                    continue;
                var row = genHoldRow(holdinfo, 3);
                $(".shortholdsdetail table").append(row);
                var fundCode = holdinfo.fundCode;
                var fundName = holdinfo.fundName;
                var agencyName = holdinfo.agencyName;
                if (allFunds.indexOf(fundCode) < 0) {
                    allFunds += "," + fundCode;
                    $(".fundslt>ul>li:last").before("<li><span class='n'>"+fundCode+"</span><span class='t'>"+fundName+"</span></li>");
                }
                if (allAgency.indexOf(agencyName) < 0) {
                    allAgency += "|" + agencyName;
                    $(".agencyslt>ul>li:last").before("<li><span class='n hide'>"+agencyName+"</span><span class='t'>"+agencyName+"</span></li>");
                }
            }
            $(".shortholdsdetail").show();
        }
        //高端理财持仓明细
        var specialHolds = allAssetsInfo.specialHoldsDetail;
        if (typeof(specialHolds) == "undefined" || specialHolds == null || specialHolds.length == 0) {
            //donothing
        } else {
            for (var i in specialHolds) {
                var holdinfo = specialHolds[i];
                if (!holdinfo || holdinfo == null)
                    continue;
                var row = genHoldRow(holdinfo, 4);
                $(".specialholdsdetail table").append(row);
                var fundCode = holdinfo.fundCode;
                var fundName = holdinfo.fundName;
                var agencyName = holdinfo.agencyName;
                if (allFunds.indexOf(fundCode) < 0) {
                    allFunds += "," + fundCode;
                    $(".fundslt>ul>li:last").before("<li><span class='n'>"+fundCode+"</span><span class='t'>"+fundName+"</span></li>");
                }
                if (allAgency.indexOf(agencyName) < 0) {
                    allAgency += "|" + agencyName;
                    $(".agencyslt>ul>li:last").before("<li><span class='n hide'>"+agencyName+"</span><span class='t'>"+agencyName+"</span></li>");
                }
            }
            $(".specialholdsdetail").show();
        }
        //人民币总资产
        if (typeof(allAssetsInfo.totalCnyVal) != "undefined" && allAssetsInfo.totalCnyVal != null)
            $(".totalcnyval").html(util.number.format(allAssetsInfo.totalCnyVal,2));

        //美元基金持仓明细
        var usdHolds = allAssetsInfo.usdHoldsDetail;
        if (typeof(usdHolds) == "undefined" || usdHolds == null || usdHolds.length == 0) {
            //donothing
        } else {
            for (var i in usdHolds) {
                var holdinfo = usdHolds[i];
                if (!holdinfo || holdinfo == null)
                    continue;
                var row = genHoldRow(holdinfo, 5);
                $(".usdholdsdetail table").append(row);
                var fundCode = holdinfo.fundCode;
                var fundName = holdinfo.fundName;
                var agencyName = holdinfo.agencyName;
                if (allFunds.indexOf(fundCode) < 0) {
                    allFunds += "," + fundCode;
                    $(".fundslt>ul>li:last").before("<li><span class='n'>"+fundCode+"</span><span class='t'>"+fundName+"</span></li>");
                }
                if (allAgency.indexOf(agencyName) < 0) {
                    allAgency += "|" + agencyName;
                    $(".agencyslt>ul>li:last").before("<li><span class='n hide'>"+agencyName+"</span><span class='t'>"+agencyName+"</span></li>");
                }
            }
            $(".usdholdsdetail").show();
        }
        if (typeof(allAssetsInfo.totalUsdVal) != "undefined" && allAssetsInfo.totalUsdVal != null)
            $(".totalusdval").html(util.number.format(allAssetsInfo.totalUsdVal,2));
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
        $(this).find('.in-txt-sub').hide();
    });

    $(".qbtn").on("click", function() {
        var fundCode = $(".fundCodeIpt").val();
        var agencyName = $(".agencyNameIpt").val();
        var allRows = $(".vip-zc-main:visible tr[fundCode][agencyName]");
        var selectRows = allRows;
        if (fundCode != "" && fundCode != "all") {
            selectRows = selectRows.filter("[fundCode='" + fundCode + "']");
        }
        if (agencyName != "" && agencyName != "all") {
            selectRows = selectRows.filter("[agencyName='" + agencyName + "']");
        }
        allRows.not(selectRows).hide();
        selectRows.show();
    });

    //绑定排序点击事件
    $(".sortkey").on("click", sortInfo);
});

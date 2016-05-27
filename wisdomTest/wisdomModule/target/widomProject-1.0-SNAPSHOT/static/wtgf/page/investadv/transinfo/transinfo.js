
$(function () {
    var util = require("common:widget/util/util.js");
    var moment = require("common:widget/moment/moment.js");
    var datepicker = require("common:widget/datepicker/datepicker.js");
    var dateFormat = "yymmdd";
    var newfundrow = '<tr><td><input type="checkbox" class="delchk"></td><td></td><td><input type="text" class="trandetail_fundcode" name="fundCode" value=""></td><td></td>'+
            '<td><label class="opertext">买入</label><input type="hidden" name="operType" class="operType" value="3"></td><td>0%</td><td>0%</td>'+
            '<td><input type="text" name="newPercent" class="newPercent" value="">%</td>' +
            '<td><input type="text" name="operBalance" class="operBalance" value="" readonly="readonly">元</td></tr>';

    $("#start_data").datepicker({
        dateFormat : dateFormat,
        changeYear : true,
        changeMonth : true});
    $("#over_data").datepicker({
        dateFormat : dateFormat,
        changeYear : true,
        changeMonth : true});

    var dc_detail = $(".dc_detail");


    $(".dcfa_msg tr.can_choose td:not('.last_td')").click(function (event) {
        $(this).parent().addClass('selected').siblings('tr').removeClass('selected');
    });
    $(".bottom_btn span.del").click(function (event) {
        $(".account-main .dc_msg tr.selected").remove();
    });
    /*调仓新增  下拉选择*/
    $(".dc_new_add .jijin dt").click(function (event) {
        $(this).siblings('dd').slideToggle();
        $(this).toggleClass('up');
    });
    /*被选的调仓方案*/
    $(".dc_new_add .add .jijin dd").click(function (event) {
        $(this).toggleClass('chose');
    });
    /*右上角关闭弹出*/
    $(".pop_main .js-pop-close").click(closePopDetail);
    /*关闭调仓新增*/
    $(".dc_new_add .pop_main .bottom_btn .cancel").click(closePopDetail);
    $(".dc_new_add .pop_main .bottom_btn .keep").click(closePopDetail);
    /*生成指令弹出*/
    $(".sc_zhiling").click(function (event) {
        $(".create_instruction").fadeIn();
    });
    $(".dc_detail_content .zhiling").click(function (event) {
        $(this).parents('.dc_detail').fadeOut('fast', function () {
            $(".create_instruction").fadeIn(200);
        });
    });
    /*删除所选调仓方案*/
    $(".account-cz-main .bottom_btn.click .del").click(function (event) {
        var rowslt = $(".dcfa_msg table tr.selected");
        if (rowslt.length == 0) {
            alert("请先选择要删除的调仓方案！");
            return false;
        }
        if (!rowslt.hasClass("can_delete")) {
            alert("不能删除有效的调仓方案！");
            return false;
        }
        if (confirm("确定要删除选定的调仓方案吗？") == '1') {
            $.ajax({
                type: "post",
                url: "/main/investadv/deleteTrans",
                data: {advid:$("#advid").val(), transid:rowslt.find("td[hide-transid]").attr("hide-transid")},
                cache: false,
                success: function (data) {
                    if (data.returncode == "0000") {
                        rowslt.remove();
                        alert("调仓方案删除成功！");
                    } else {
                        alert("调仓方案删除失败！" + data.returnmsg);
                    }
                },
                error: function () {
                    alert("删除调仓方案发生未知异常，请稍后重试或联系我们的客服人员，给您带来的不便深表歉意！");
                }
            })
        }
    });
    /*弹出调仓明细*/
    $(".account-cz-main .bottom_btn.click .xiugai").click(function (event) {
        dc_detail.fadeIn();
    });
    $(".account-cz-main .bottom_btn.click .new_add").click(function (event) {
        dc_detail.fadeIn();
    });
    //创建新的调仓方案
    $(".new_add").click(function() {
        $.ajax({
            type: "post",
            url: "createTransPre",
            data: {advid:$("#advid").val()},
            cache: false,
            success: function (data) {
                dc_detail.html(data);
                dc_detail.fadeIn();
            }
        });
    });
    //显示调仓明细，如果是当天的，还提供编辑
    $(".tiaocangmx").click(function (event) {
        var transId = $(this).closest("td").attr("hide-transid");
        var advId = $("#advid").val();
        $.ajax({
            type: "post",
            url: "transPlanDetail",
            data: {advid: advId, transid: transId},
            cache: false,
            success: function (data) {
                dc_detail.html(data);
                dc_detail.fadeIn();
            }
        });
    });
    /*关闭调仓明细，打开调仓新增*/
    $(".dc_detail .dc_detail_content .new_add").click(function (event) {
        closePopDetail();
        $(".dc_new_add").fadeIn("200");
    });
    $(".dc_detail .bottom_btn .close").click(closePopDetail);

    function queryHoldInfo(advid, callBack){
        $.ajax({
            type: "post",
            url: "holdsInfo",
            data: {"fundcode": $("#fundCode").val()},
            success: function (data) {
                if (data.errno != '00000') {
                    alert("对不起，查询失败，请稍后再试！");
                } else {
                    if(callBack){
                        callBack(data.transPlanDetails);
                    }
                }

            }
        });
    }

    //加载基金选择器
    var finishLoadFund = false;
    var fundSltHtml = '<div id="fundselectdiv" class="fundselectdiv"><ul></ul></div>';
    $("body").append(fundSltHtml);
    var fundSltUl = $("#fundselectdiv>ul");
    $.ajax({
        url:"/main/common/fof/allfunds",
        method:"get",
        cache:false,
        async:false,
        success:function(data) {
            if (data == null || data.allFunds == null)
                return;
            var errorMsg = data.errormsg;
            if (errorMsg != undefined && errorMsg != "") {
                alert("系统加载基金信息时发生异常，请刷新页面重试！");
                return;
            }
            var allFunds = data.allFunds;
            for (var i = 0; i < allFunds.length; i++) {
                var fundInfo = allFunds[i];
                fundSltUl.append('<li fundCode="'+fundInfo.fundCode+'" fundType="'+fundInfo.fundType+'" fundTypeShow="'+fundInfo.fundTypeShow+'" fundName="'+fundInfo.fundName+'">'+fundInfo.fundCode + '|' + fundInfo.fundName + '</li>');
            }
            finishLoadFund = true;
        }
    });

    function closePopDetail() {
        $("#fundselectdiv").hide().appendTo("body").find("li").show();
        dc_detail.fadeOut();
    }

    //检查表单
    function checkTransDetailForm() {
        var totalPercent = 0;
        var allrows = $(".dc_detail_content tr:gt(0)");
        for (var i = allrows.length - 1; i >= 0; i--) {
            var row = $(allrows[i]);
            var fundCode = row.find(".trandetail_fundcode").val();
            //检查成分基金是否存在
            if (fundCode == "") {
                return "基金不可为空，请选择需要添加的基金！";
            }
            if ($("#fundselectdiv li[fundCode='"+fundCode+"']").length == 0) {
                return "不存在基金代码为" + fundCode + "的基金，请重新选择！";
            }
            //检查新资产占比的格式正确性
            var newpercent = row.find(".newPercent").val();
            if (newpercent == undefined || newpercent == "") {
                return "新资产占比不可为空！";
            }
            newpercent = parseFloat(newpercent) / 100;
            if (isNaN(newpercent) || newpercent < 0 || newpercent > 1)
                return "新资产占比格式非法，请输入0.1-100之间精确度为小数点后一位的数字！";

            //钱袋子占比至少要达到0.4%
            if (fundCode == myWalletCode && newpercent < 0.004) {
                return "钱袋子基金的资产占比不可小于0.4%";
            }
            for (var j = 0; j < curHoldsList.length; j++) {
                var fhold = curHoldsList[j];
                if (fhold.fundCode == fundCode) {
                    //检查成分基金的资产占比是否超出了可调范围
                    var origpercent = parseFloat(fhold.curPercent);
                    var availpercent = parseFloat(fhold.availPercent);
                    if (origpercent < 0 || isNaN(origpercent) || availpercent < 0 || isNaN(availpercent))
                        return "客户持仓比例信息存在错误，请刷新页面后重试或者联系我们的客服人员！";
                    if (newpercent < util.number.subtract(origpercent, availpercent))
                        return "基金" + fundCode + "的新资产占比超出了可操作的范围，新资产占比不可小于旧资产占比-可用资产占比！";
                }
            }
            totalPercent = util.number.add(totalPercent, newpercent);
        }
        //检查成分基金的资产总占比是否为100%
        if (totalPercent > 1) {
            return "各基金资产的总占比超过了100%，请适当调低部分基金的资产占比以使总占比为100%！";
        } else if (totalPercent < 1) {
            return "各基金资产的总占比不足100%，请适当调高部分基金的资产占比以使总占比为100%！";
        }
        return null;
    }

    //构建表单数据的json对象
    function buildFormData() {
        //开始制作表单并走ajax提交
        var formval = {"advid": $("#advidipt").val()};
        if ($("#transidipt").length > 0) {
            formval.transid = $("#transidipt").val();
        }
        if ($("#transaliasipt").length > 0) {
            formval.transalias = $("#transaliasipt").val();
        }
        if ($("#transreasonipt").length > 0) {
            formval.transreason = $("#transreasonipt").val();
        }
        formval.validflag = $("#validflag").val();
        var allFunds = $(".dc_detail_content .item_table tr:gt(0)");
        for (var i = 0; i < allFunds.length; i++) {
            var row = $(allFunds[i]);
            formval["translst["+i+"].fundCode"] = row.find(".trandetail_fundcode").val();
            formval["translst["+i+"].operType"] = row.find(".operType").val();
            formval["translst["+i+"].newPercent"] = row.find(".newPercent").val();
        }
        return formval;
    }

    //添加调仓明细编辑页面的各种绑定事件
    //选中调仓明细里的行
//    dc_detail.on('click','.item_table tr',function() {
//       $(this).toggleClass("trselected");
//    });
    //删除选中的行
    dc_detail.on('click','.del',function () {
        var selectedrow = $(this).parents("form").find(".item_table :checked").closest("tr");
        if (selectedrow.length == 0) {
            alert("请先选择要删除的基金！直接点击列表行即可！");
            return false;
        } else {
            for (var i = 0; i < selectedrow.length; i++) {
                var fundCode = $(selectedrow[i]).find(".trandetail_fundcode").val();
                for (var j = 0; j < curHoldsList.length; j++) {
                    var hold = curHoldsList[j];
                    if (fundCode == hold.fundCode) {
                        alert("不可删除当前所持有的基金，如想卖出该基金，可以将新资产占比设定为0%！");
                        return false;
                    }
                }
            }
            $("#fundselectdiv").hide().appendTo("body").find("li").show();
            selectedrow.remove();
        }
    });
    //新增行
    dc_detail.on('click','.new_add',function () {
        $(this).parents("form").find(".item_table tbody").append(newfundrow);
    });
    //关闭编辑中的POP页
    dc_detail.on('click','.close,.js-pop-close',function() {
        if ($(this).hasClass("editclose")) {
            if (confirm("关闭将会丢弃所有已编辑内容，确定要这样做吗？") != '1') {
                return false;
            }
        }
        closePopDetail();
    });
    //提交之前重新给表里的输入框取名
    dc_detail.on('click','.keep',function () {
        if (confirm("确定要提交吗？") == '0') {
            return false;
        }
        var returnmsg = checkTransDetailForm();
        if (returnmsg != null) {
            alert(returnmsg);
            return false;
        }

        //准备数据然后进行ajax提交
        $.ajax({
            url: "/main/investadv/editTransPlan",
            type: "POST",
            data: buildFormData(),
            async: false,
            cache: false,
            success: function(data) {
                if (data != null && data != undefined) {
                    if (data.errormsg != undefined && data.errormsg != null && data.errormsg != "") {
                        alert("保存调仓方案信息失败！错误信息：" + data.errormsg);
                    } else {
                        confirm("保存调仓方案信息成功！");
                        location.reload(true);
                    }
                } else {
                    alert("没有收到调仓方案的保存结果信息，请稍后重试！");
                }
            },
            error: function() {
                alert("保存调仓方案信息失败，请稍后重试或联系我们的客服人员！");
            }
        });
    });
    //检查新资产占比的输入合法性
    dc_detail.on("keyup", ".newPercent", function() {
        if ($(this).val() == "")
            return false;
        var newpercent = parseFloat($(this).val());
        if (isNaN(newpercent) || newpercent != 0 && (newpercent < 0.1 || newpercent > 100)) {
            $(this).val("");
            alert("新资产占比不是0.1-100之间的有效数字");
            return false;
        }
    }).on("blur", ".newPercent", function(){
        if ($(this).val() == "")
            return false;
        var tr = $(this).closest("tr");
        var fundCode = tr.find(".trandetail_fundcode").val();
        if (fundCode == "") {
            $(this).val("");
            alert("请先选择所要操作的基金再填写资产占比！");
            return false;
        }
        var newpercent = parseFloat($(this).val())/100;
        if (isNaN(newpercent) || newpercent != 0 && (newpercent < 0.001 || newpercent > 1)) {
            $(this).val("");
            alert("新资产占比不是0.1-100之间的有效数字");
            return false;
        }
        $(this).val(util.number.format(newpercent * 100,1));
        var origpercent = 0;
        if (fundCode == myWalletCode && newpercent < 0.004) {
            alert("钱袋子基金的资产占比不可小于0.4%");
            $(this).val("");
            return false;
        }
        for (var j = 0; j < curHoldsList.length; j++) {
            var fhold = curHoldsList[j];
            if (fhold.fundCode == fundCode) {
                //检查成分基金的资产占比是否超出了可调范围
                origpercent = parseFloat(fhold.curPercent);
                var availpercent = parseFloat(fhold.availPercent);
                if (origpercent < 0 || isNaN(origpercent) || availpercent < 0 || isNaN(availpercent)) {
                    alert("客户持仓比例信息存在错误，请刷新页面后重试或者联系我们的客服人员！");
                    return false;
                }
                if (newpercent < util.number.subtract(origpercent, availpercent)) {
                    alert("基金" + fundCode + "的新资产占比超出了可操作的范围，新资产占比不可小于旧资产占比-可用资产占比！");
                    return false;
                }
            }
        }
        tr.find(".operBalance").val(util.number.format(util.number.subtract(newpercent, origpercent) * totalBalance,2));
        if (origpercent == 0) {
            tr.find(".opertext").text("买入");
            tr.find(".operType").val("3");
        } else if (newpercent == 0) {
            tr.find(".opertext").text("卖出");
            tr.find(".operType").val("4");
        } else if (newpercent > origpercent) {
            tr.find(".opertext").text("增持");
            tr.find(".operType").val("0");
        } else if (newpercent < origpercent) {
            tr.find(".opertext").text("减持");
            tr.find(".operType").val("1");
        } else if (newpercent = origpercent) {
            tr.find(".opertext").text("保持");
            tr.find(".operType").val("2");
        }
    });
    //点击基金输入框弹出基金选择器
    dc_detail.on('focus','.trandetail_fundcode:not(.curholds)', function(e) {
        var ipt = $(e.target);
        //将基金选择器移动到挨着发生点击事件的输入框
        ipt.after($("#fundselectdiv"));
        $("#fundselectdiv").css("left", ipt.position().left + 'px').css("top", (ipt.position().top + ipt.height() + 4) + 'px');
        var iptval = ipt.val();
        if (iptval != "") {
            $("#fundselectdiv li").each(function() {
                if ($(this).text().indexOf(iptval) < 0)
                    $(this).hide();
                else
                    $(this).show();
            });
        } else {
            $("#fundselectdiv li").show();
        }
        $("#fundselectdiv").slideDown();
    }).on('blur','.trandetail_fundcode:not(.curholds)', function() {
        $("#fundselectdiv").slideUp();
    }).on('keyup','.trandetail_fundcode:not(.curholds)', function(e){
        var iptVal = $(this).val();
        $("#fundselectdiv li").each(function() {
            if ($(this).text().indexOf(iptVal) < 0)
                $(this).hide();
            else
                $(this).show();
        });
    });

    $("#fundselectdiv").on("mouseenter","li", function() {
        $(this).css('background-color', '#000077').css('color', 'white');
    }).on("mouseleave","li", function () {
        $(this).css('background-color', '#FFFFFF').css('color', '#000000');
    }).on("click","li", function() {
        var li = $(this);
        var fundTypeShow = li.attr("fundTypeShow");
        var fundName = li.attr("fundName");
        var fundCode = li.attr("fundCode");
        var tr = li.closest("tr");
        tr.find(".trandetail_fundcode").val(fundCode);
        tr.find("td:eq(1)").text(fundTypeShow);
        tr.find("td:eq(3)").text(fundName);
        $("#fundselectdiv").slideUp();
    });

    $("#transreset_btn").on("click", function(){
        var now = new Date();
        $("#over_data").val(util.date.format(now, "yyyyMMdd"));
        var month = now.getMonth();
        var year = now.getFullYear();
        if (month == 0) {
            month = 11;
            year -= 1;
        } else {
            month -= 1;
        }
        now.setFullYear(year);
        now.setMonth(month);
        $("#start_data").val(util.date.format(now, "yyyyMMdd"));
        $("#stateFilterCode").val("");
        $("form.dcfa_msg").submit();
    });
});


$(function () {
    var util = require("common:widget/util/util.js");
    var moment = require("common:widget/moment/moment.js");
    var datepicker = require("common:widget/datepicker/datepicker.js");
    var dateFormat = "yymmdd";
    var newfundrow = '<tr><td><input type="checkbox" class="delchk"></td><td></td><td><input type="text" class="trandetail_fundcode" name="fundCode" value=""></td><td></td>'+
            '<td><label class="opertext">����</label><input type="hidden" name="operType" class="operType" value="3"></td><td>0%</td><td>0%</td>'+
            '<td><input type="text" name="newPercent" class="newPercent" value="">%</td>' +
            '<td><input type="text" name="operBalance" class="operBalance" value="" readonly="readonly">Ԫ</td></tr>';

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
    /*��������  ����ѡ��*/
    $(".dc_new_add .jijin dt").click(function (event) {
        $(this).siblings('dd').slideToggle();
        $(this).toggleClass('up');
    });
    /*��ѡ�ĵ��ַ���*/
    $(".dc_new_add .add .jijin dd").click(function (event) {
        $(this).toggleClass('chose');
    });
    /*���Ͻǹرյ���*/
    $(".pop_main .js-pop-close").click(closePopDetail);
    /*�رյ�������*/
    $(".dc_new_add .pop_main .bottom_btn .cancel").click(closePopDetail);
    $(".dc_new_add .pop_main .bottom_btn .keep").click(closePopDetail);
    /*����ָ���*/
    $(".sc_zhiling").click(function (event) {
        $(".create_instruction").fadeIn();
    });
    $(".dc_detail_content .zhiling").click(function (event) {
        $(this).parents('.dc_detail').fadeOut('fast', function () {
            $(".create_instruction").fadeIn(200);
        });
    });
    /*ɾ����ѡ���ַ���*/
    $(".account-cz-main .bottom_btn.click .del").click(function (event) {
        var rowslt = $(".dcfa_msg table tr.selected");
        if (rowslt.length == 0) {
            alert("����ѡ��Ҫɾ���ĵ��ַ�����");
            return false;
        }
        if (!rowslt.hasClass("can_delete")) {
            alert("����ɾ����Ч�ĵ��ַ�����");
            return false;
        }
        if (confirm("ȷ��Ҫɾ��ѡ���ĵ��ַ�����") == '1') {
            $.ajax({
                type: "post",
                url: "/main/investadv/deleteTrans",
                data: {advid:$("#advid").val(), transid:rowslt.find("td[hide-transid]").attr("hide-transid")},
                cache: false,
                success: function (data) {
                    if (data.returncode == "0000") {
                        rowslt.remove();
                        alert("���ַ���ɾ���ɹ���");
                    } else {
                        alert("���ַ���ɾ��ʧ�ܣ�" + data.returnmsg);
                    }
                },
                error: function () {
                    alert("ɾ�����ַ�������δ֪�쳣�����Ժ����Ի���ϵ���ǵĿͷ���Ա�����������Ĳ������Ǹ�⣡");
                }
            })
        }
    });
    /*����������ϸ*/
    $(".account-cz-main .bottom_btn.click .xiugai").click(function (event) {
        dc_detail.fadeIn();
    });
    $(".account-cz-main .bottom_btn.click .new_add").click(function (event) {
        dc_detail.fadeIn();
    });
    //�����µĵ��ַ���
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
    //��ʾ������ϸ������ǵ���ģ����ṩ�༭
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
    /*�رյ�����ϸ���򿪵�������*/
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
                    alert("�Բ��𣬲�ѯʧ�ܣ����Ժ����ԣ�");
                } else {
                    if(callBack){
                        callBack(data.transPlanDetails);
                    }
                }

            }
        });
    }

    //���ػ���ѡ����
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
                alert("ϵͳ���ػ�����Ϣʱ�����쳣����ˢ��ҳ�����ԣ�");
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

    //����
    function checkTransDetailForm() {
        var totalPercent = 0;
        var allrows = $(".dc_detail_content tr:gt(0)");
        for (var i = allrows.length - 1; i >= 0; i--) {
            var row = $(allrows[i]);
            var fundCode = row.find(".trandetail_fundcode").val();
            //���ɷֻ����Ƿ����
            if (fundCode == "") {
                return "���𲻿�Ϊ�գ���ѡ����Ҫ��ӵĻ���";
            }
            if ($("#fundselectdiv li[fundCode='"+fundCode+"']").length == 0) {
                return "�����ڻ������Ϊ" + fundCode + "�Ļ���������ѡ��";
            }
            //������ʲ�ռ�ȵĸ�ʽ��ȷ��
            var newpercent = row.find(".newPercent").val();
            if (newpercent == undefined || newpercent == "") {
                return "���ʲ�ռ�Ȳ���Ϊ�գ�";
            }
            newpercent = parseFloat(newpercent) / 100;
            if (isNaN(newpercent) || newpercent < 0 || newpercent > 1)
                return "���ʲ�ռ�ȸ�ʽ�Ƿ���������0.1-100֮�侫ȷ��ΪС�����һλ�����֣�";

            //Ǯ����ռ������Ҫ�ﵽ0.4%
            if (fundCode == myWalletCode && newpercent < 0.004) {
                return "Ǯ���ӻ�����ʲ�ռ�Ȳ���С��0.4%";
            }
            for (var j = 0; j < curHoldsList.length; j++) {
                var fhold = curHoldsList[j];
                if (fhold.fundCode == fundCode) {
                    //���ɷֻ�����ʲ�ռ���Ƿ񳬳��˿ɵ���Χ
                    var origpercent = parseFloat(fhold.curPercent);
                    var availpercent = parseFloat(fhold.availPercent);
                    if (origpercent < 0 || isNaN(origpercent) || availpercent < 0 || isNaN(availpercent))
                        return "�ͻ��ֱֲ�����Ϣ���ڴ�����ˢ��ҳ������Ի�����ϵ���ǵĿͷ���Ա��";
                    if (newpercent < util.number.subtract(origpercent, availpercent))
                        return "����" + fundCode + "�����ʲ�ռ�ȳ����˿ɲ����ķ�Χ�����ʲ�ռ�Ȳ���С�ھ��ʲ�ռ��-�����ʲ�ռ�ȣ�";
                }
            }
            totalPercent = util.number.add(totalPercent, newpercent);
        }
        //���ɷֻ�����ʲ���ռ���Ƿ�Ϊ100%
        if (totalPercent > 1) {
            return "�������ʲ�����ռ�ȳ�����100%�����ʵ����Ͳ��ֻ�����ʲ�ռ����ʹ��ռ��Ϊ100%��";
        } else if (totalPercent < 1) {
            return "�������ʲ�����ռ�Ȳ���100%�����ʵ����߲��ֻ�����ʲ�ռ����ʹ��ռ��Ϊ100%��";
        }
        return null;
    }

    //���������ݵ�json����
    function buildFormData() {
        //��ʼ����������ajax�ύ
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

    //��ӵ�����ϸ�༭ҳ��ĸ��ְ��¼�
    //ѡ�е�����ϸ�����
//    dc_detail.on('click','.item_table tr',function() {
//       $(this).toggleClass("trselected");
//    });
    //ɾ��ѡ�е���
    dc_detail.on('click','.del',function () {
        var selectedrow = $(this).parents("form").find(".item_table :checked").closest("tr");
        if (selectedrow.length == 0) {
            alert("����ѡ��Ҫɾ���Ļ���ֱ�ӵ���б��м��ɣ�");
            return false;
        } else {
            for (var i = 0; i < selectedrow.length; i++) {
                var fundCode = $(selectedrow[i]).find(".trandetail_fundcode").val();
                for (var j = 0; j < curHoldsList.length; j++) {
                    var hold = curHoldsList[j];
                    if (fundCode == hold.fundCode) {
                        alert("����ɾ����ǰ�����еĻ������������û��𣬿��Խ����ʲ�ռ���趨Ϊ0%��");
                        return false;
                    }
                }
            }
            $("#fundselectdiv").hide().appendTo("body").find("li").show();
            selectedrow.remove();
        }
    });
    //������
    dc_detail.on('click','.new_add',function () {
        $(this).parents("form").find(".item_table tbody").append(newfundrow);
    });
    //�رձ༭�е�POPҳ
    dc_detail.on('click','.close,.js-pop-close',function() {
        if ($(this).hasClass("editclose")) {
            if (confirm("�رս��ᶪ�������ѱ༭���ݣ�ȷ��Ҫ��������") != '1') {
                return false;
            }
        }
        closePopDetail();
    });
    //�ύ֮ǰ���¸�����������ȡ��
    dc_detail.on('click','.keep',function () {
        if (confirm("ȷ��Ҫ�ύ��") == '0') {
            return false;
        }
        var returnmsg = checkTransDetailForm();
        if (returnmsg != null) {
            alert(returnmsg);
            return false;
        }

        //׼������Ȼ�����ajax�ύ
        $.ajax({
            url: "/main/investadv/editTransPlan",
            type: "POST",
            data: buildFormData(),
            async: false,
            cache: false,
            success: function(data) {
                if (data != null && data != undefined) {
                    if (data.errormsg != undefined && data.errormsg != null && data.errormsg != "") {
                        alert("������ַ�����Ϣʧ�ܣ�������Ϣ��" + data.errormsg);
                    } else {
                        confirm("������ַ�����Ϣ�ɹ���");
                        location.reload(true);
                    }
                } else {
                    alert("û���յ����ַ����ı�������Ϣ�����Ժ����ԣ�");
                }
            },
            error: function() {
                alert("������ַ�����Ϣʧ�ܣ����Ժ����Ի���ϵ���ǵĿͷ���Ա��");
            }
        });
    });
    //������ʲ�ռ�ȵ�����Ϸ���
    dc_detail.on("keyup", ".newPercent", function() {
        if ($(this).val() == "")
            return false;
        var newpercent = parseFloat($(this).val());
        if (isNaN(newpercent) || newpercent != 0 && (newpercent < 0.1 || newpercent > 100)) {
            $(this).val("");
            alert("���ʲ�ռ�Ȳ���0.1-100֮�����Ч����");
            return false;
        }
    }).on("blur", ".newPercent", function(){
        if ($(this).val() == "")
            return false;
        var tr = $(this).closest("tr");
        var fundCode = tr.find(".trandetail_fundcode").val();
        if (fundCode == "") {
            $(this).val("");
            alert("����ѡ����Ҫ�����Ļ�������д�ʲ�ռ�ȣ�");
            return false;
        }
        var newpercent = parseFloat($(this).val())/100;
        if (isNaN(newpercent) || newpercent != 0 && (newpercent < 0.001 || newpercent > 1)) {
            $(this).val("");
            alert("���ʲ�ռ�Ȳ���0.1-100֮�����Ч����");
            return false;
        }
        $(this).val(util.number.format(newpercent * 100,1));
        var origpercent = 0;
        if (fundCode == myWalletCode && newpercent < 0.004) {
            alert("Ǯ���ӻ�����ʲ�ռ�Ȳ���С��0.4%");
            $(this).val("");
            return false;
        }
        for (var j = 0; j < curHoldsList.length; j++) {
            var fhold = curHoldsList[j];
            if (fhold.fundCode == fundCode) {
                //���ɷֻ�����ʲ�ռ���Ƿ񳬳��˿ɵ���Χ
                origpercent = parseFloat(fhold.curPercent);
                var availpercent = parseFloat(fhold.availPercent);
                if (origpercent < 0 || isNaN(origpercent) || availpercent < 0 || isNaN(availpercent)) {
                    alert("�ͻ��ֱֲ�����Ϣ���ڴ�����ˢ��ҳ������Ի�����ϵ���ǵĿͷ���Ա��");
                    return false;
                }
                if (newpercent < util.number.subtract(origpercent, availpercent)) {
                    alert("����" + fundCode + "�����ʲ�ռ�ȳ����˿ɲ����ķ�Χ�����ʲ�ռ�Ȳ���С�ھ��ʲ�ռ��-�����ʲ�ռ�ȣ�");
                    return false;
                }
            }
        }
        tr.find(".operBalance").val(util.number.format(util.number.subtract(newpercent, origpercent) * totalBalance,2));
        if (origpercent == 0) {
            tr.find(".opertext").text("����");
            tr.find(".operType").val("3");
        } else if (newpercent == 0) {
            tr.find(".opertext").text("����");
            tr.find(".operType").val("4");
        } else if (newpercent > origpercent) {
            tr.find(".opertext").text("����");
            tr.find(".operType").val("0");
        } else if (newpercent < origpercent) {
            tr.find(".opertext").text("����");
            tr.find(".operType").val("1");
        } else if (newpercent = origpercent) {
            tr.find(".opertext").text("����");
            tr.find(".operType").val("2");
        }
    });
    //�����������򵯳�����ѡ����
    dc_detail.on('focus','.trandetail_fundcode:not(.curholds)', function(e) {
        var ipt = $(e.target);
        //������ѡ�����ƶ������ŷ�������¼��������
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

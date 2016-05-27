var $ = require("common:widget/jquery/jquery.js"),
    XYTipsWindow = require("common:widget/XYTipsWindow/XYTipsWindow.js"),
    util = require("common:widget/util/util.js"),
    btn = require("common:widget/btn/btn.js"),
    modal = require("wtgf:widget/modal/modal.js");
var verifyToken = "";
var nIntervId;
var secondCount = 90;
//��֤��
var validateForm = null;
var smsVFCodeTipsObj;
var goToBindMobile = false;
var openAccount;
var addMobileNo;
var bankMain = $(".bank-main");

var main = (function(){
    //�ر�ajax����
    $.ajaxSetup({cache:false});
    var BANNER_URL = "/include/includebanner.html?date="+new Date();

    var _init = function(){

        //��ʾ�����
        if(window.GF_VIEWINFO.activityUrl){
            XYTipsWindow({
                ___title : "",
                ___content : "url:get?" + window.GF_VIEWINFO.activityUrl + "?date=" + new Date(),
                ___width : "606",
                ___height: "580",
                ___showTitle : true
            });
        }
        //����banner
        $.ajax({
            type : "get",
            url : BANNER_URL,
            dataType : "html",
            success : function(msg){
                $("#banner").html(msg);
            }
        });
        //������Ѷ
        var showLeavl = window.GF_VIEWINFO.showLeavl || '1';
        $.get("/main/bulletin/query?showLeavl=" + showLeavl,function(data){
            if(data){
                var info = data.info,
                    infoListStr = "",
                    act = data.act,
                    actListStr = "";
                
                for(var i = 0,len = info.length; i < len;i ++){
                    infoListStr += "<li><a href='" + info[i].url + "'><span class='t'>" + info[i].title + "</span><span class='d'>" + info[i].startDate + "</span></a></li>";
                }
                for(var i = 0,len = act.length; i < len; i ++){
                    actListStr += "<li><a href='" + act[i].url + "'><span class='t'>" + act[i].title + "</span><span class='d'>" + act[i].startDate + "</span></a></li>";
                }
                $(".news-left .news-list").html(infoListStr);
                $(".news-right .news-list").html(actListStr);
            }
        });
        //�����ʲ���Ϣ
        var date = Date.parse(new Date()); 
        $.get("/main/shareinfo/query?v=" + date,function(data){
            if(data){
                if (data.issuccess == false) {
                    alert(data.returnmsg);
                    return;
                }
                var allAssetsInfo = data.data;
                if (typeof(allAssetsInfo) == "undefined" || allAssetsInfo == null) {
                    alert("��ȡ�ͻ��ʲ���Ϣʧ�ܣ����Ժ����ԣ�")
                    return;
                }
                $(".totalval").html(util.number.format(allAssetsInfo.totalVal,2));

                if(parseFloat(allAssetsInfo.lastProfit)>=0){
                    $(".lastprof").html("<span class='orange'>"+util.number.format(allAssetsInfo.lastProfit,2)+"</span>");
                }else{
                    $(".lastprof").html("<span class='green'>"+util.number.format(allAssetsInfo.lastProfit,2)+"</span>");
                }

                if (allAssetsInfo.profDate && allAssetsInfo.profDate != null)
                    $(".profdate").html("(" + allAssetsInfo.profDate + ")");
                if (allAssetsInfo.usdVal && allAssetsInfo.usdVal != null && parseFloat(allAssetsInfo.usdVal) > 0) {
                    $(".usdval").html(util.number.format(allAssetsInfo.usdVal,2));
                    if (allAssetsInfo.usdLastProf && allAssetsInfo.usdLastProf != null)
                        $(".usdlastprof").html(util.number.format(allAssetsInfo.usdLastProf,2));
                    if (allAssetsInfo.usdProfDate && allAssetsInfo.usdProfDate != null)
                        $(".usdprofdate").html("(" + allAssetsInfo.usdProfDate + ")");
                    $(".usdassetdl").show();
                }
                $(".walletval").html(util.number.format(allAssetsInfo.walletVal,2));
//                $(".walletprof").html(util.number.format(allAssetsInfo.walletProf,2));
                $(".normalval").html(util.number.format(allAssetsInfo.normalVal,2));
                if (allAssetsInfo.specialVal && allAssetsInfo.specialVal != null && parseFloat(allAssetsInfo.specialVal) > 0) {
                    $(".specialval").html(util.number.format(allAssetsInfo.specialVal,2));
                    $("#financialassets").show();
                }
                //Ǯ���ӳֲ���ϸ
                var walletHolds = allAssetsInfo.walletHoldsDetail;
                if (typeof(walletHolds) == "undefined" || walletHolds == null || walletHolds.length == 0) {
                    $(".walletholdsdetail table").append("<tr><td colspan='10' style='text-align:center;'>�������ݣ�</td></tr>");
                } else {
                    for (var i in walletHolds) {
                        var holdinfo = walletHolds[i];
                        if (!holdinfo || holdinfo == null)
                            continue;
                        var row = genHoldRow(holdinfo, 1);
                        $(".walletholdsdetail table").append(row);
                    }
                }
                //������ͨ����ֲ���ϸ
                var normalHolds = allAssetsInfo.normalHoldsDetail;
                if (typeof(normalHolds) == "undefined" || normalHolds == null || normalHolds.length == 0) {
                    $(".normalholdsdetail table").append("<tr><td colspan='10' style='text-align:center;'>�������ݣ�</td></tr>");
                } else {
                    for (var i in normalHolds) {
                        var holdinfo = normalHolds[i];
                        if (typeof(holdinfo)  == "undefined" || holdinfo == null)
                            continue;
                        var row = genHoldRow(holdinfo, 2);
                        $(".normalholdsdetail table").append(row);
                    }
                }
                //������Ʋ�Ʒ�ֲ���ϸ
                var shortHolds = allAssetsInfo.shortHoldsDetail;
                if (typeof(shortHolds) == "undefined" || shortHolds == null || shortHolds.length == 0) {
                    //donothing
                } else {
                    for (var i in shortHolds) {
                        var holdinfo = shortHolds[i];
                        if (typeof(holdinfo) == "undefined" || holdinfo == null)
                            continue;
                        var row = genHoldRow(holdinfo, 3);
                        $(".shortholdsdetail table").append(row);
                    }
                    $(".shortholdsdetail").show();
                }
                //�߶���Ƴֲ���ϸ
                var specialHolds = allAssetsInfo.specialHoldsDetail;
                if (typeof(specialHolds) == "undefined" || specialHolds == null || specialHolds.length == 0) {
                    //donothing
                } else {
                    for (var i in specialHolds) {
                        var holdinfo = specialHolds[i];
                        if (typeof(holdinfo) == "undefined" || holdinfo == null)
                            continue;
                        var row = genHoldRow(holdinfo, 4);
                        $(".specialholdsdetail table").append(row);
                    }
                    $(".specialholdsdetail").show();
                }
                //��������ʲ�
                if (typeof(allAssetsInfo.totalVal) != "undefined" && allAssetsInfo.totalVal != null)
                    $(".totalcnyval").html(util.number.format(allAssetsInfo.totalVal,2));

                //��Ԫ����ֲ���ϸ
                var usdHolds = allAssetsInfo.usdHoldsDetail;
                if (typeof(usdHolds) == "undefined" || usdHolds == null || usdHolds.length == 0) {
                    //donothing
                } else {
                    for (var i in usdHolds) {
                        var holdinfo = usdHolds[i];
                        if (typeof(holdinfo) == "undefined" || holdinfo == null)
                            continue;
                        var row = genHoldRow(holdinfo, 5);
                        $(".usdholdsdetail table").append(row);
                    }
                    $(".usdholdsdetail").show();
                }
                if (typeof(allAssetsInfo.usdVal) != "undefined" && allAssetsInfo.usdVal != null)
                    $(".totalusdval").html(util.number.format(allAssetsInfo.usdVal,2));
            }else{
                $(".totalval").html('0.00Ԫ');
                $(".mainInfo-assets .value-wallet").html('0.00Ԫ');
                $(".mainInfo-assets .value-others").html('0.00Ԫ');
            }
        });
        //��;������ʾ
        $.get("/main/delegate/onroaddele/query",function(returnobj) {
            if (typeof(returnobj) == "undefined" || returnobj == null){
                return;
            }
            if (typeof(returnobj.issuccess) != "undefined" && returnobj.issuccess == true) {
                var ordeles = returnobj.data;
                if (typeof(ordeles) == "undefined" || ordeles == null || ordeles.length == 0) {
                    return;
                }
                $(".ordelenum").html(ordeles.length);

                if(ordeles.length>5){

                   $(".meg-list-main").css({"padding":"15px 40px","overflow-y":"scroll","overflow-x":"hidden;"});

                }
                for (var i in ordeles) {
                    var dele = ordeles[i];
                    var msg = "<li><em style='font-weight: bold'>"+dele.businName+"</em>"
                        + "<span>"+dele.dspMsg+"</span>"
                        + "</li>";
                    $(".meg-list-main ul").append(msg);
                }
                $(".zhcx-meg").show();
            }
        },"json");

        //��;��������¼���
        var $zhcxMeg = $('.zhcx-meg');
        $zhcxMeg.on('click', '.info', function(){
            $zhcxMeg.find('.zhcx-meg-list').show();
            return false;
        }).on('click', '.meg-list-btn a', function(){
            $zhcxMeg.find('.zhcx-meg-list').hide();
            return false;
        });

        //���������¼�
        $(".sortkey").on("click", sortInfo);
    };

    var bindEvent = function(){

        $("#openAccount").click(function(){
            if(validatePasswordForm()){
                //��ֱ���û�����ͨһ��ͨ
                $("#errorTips").hide();
                btn.setDisabled($("#openAccount"));
                $.ajax({
                    type: "post",
                    url: "/main/onePassport/openAccount",
                    data: {"loginPwd":$("#loginPwd").val()},
                    success: function (data) {
                        btn.setEnabled($("#openAccount"));
                        if (data.issuccess != true) {
                            $("#errorTips").html(data.returnmsg);
                            $("#errorTips").show();
                        }else{
                            openAccount = 0;
                            $("#modal1_1").hide();
                            $("#modal1_2").show();
                        }
                    }
                });
            }
        });

        $("#notGoBindMobile").click(function(){
            //��ʱ�����ֻ��˻���
            $("#modal1_2").hide();
        });

        $("#goBindMobile").click(function(){
            //ȥ���ֻ��˻���
            goToBindMobile = true;
            $("#modal1_2").hide();
            $("#modal2_1").show();
        });

        $("#verifyCodeBtn").click(function(){
            //���Ͷ�����֤��
            smsVFCodeBtnClick();
        });

        $("#addMobileNoBtn").click(function(){
            if(validateAddAccountMobileForm()){
                //ȷ����ͨ�ֻ��˻���
                $("#errorTips2").hide();
                btn.setDisabled($("#addMobileNoBtn"));
                $.ajax({
                    type: "post",
                    url: "/main/onePassport/addMobileNo",
                    data: {"mobileNo":$("#mobilePhone").val(),"verifyCode":$("#verifyCodeView").val()},
                    success: function (data) {
                        btn.setEnabled($("#addMobileNoBtn"));
                        if (data.issuccess != true) {
                            $("#errorTips2").html(data.returnmsg);
                            $("#errorTips2").show();
                        }else{
                            addMobileNo = 0;
                            $("#modal2_1").hide();
                            $("#mobilePhoneView").html($("#mobilePhone").val());
                            $("#modal2_2").show();
                        }
                    }
                });
            }
        });

        $("#addAccountMobileSuccess").click(function(){
            //�ɹ���ɿ�ͨ�ֻ��˻���
            $("#modal2_2").hide();
        });

        //�ݲ�����
        $("#closeTips").click(function(){
            util.cookie.set("closeTips",1);
            $("#modal2_1").hide();
        });

        // �رյ�����
        bankMain.on('click', '.js-pop-close', function(){
            $(this).parents('.pop').fadeOut();
        });
    };

    return {
        init : _init,
        bindEvent:bindEvent
    }
})();

/**
 *
 * @param json
 * @param fundtype 1-Ǯ���ӣ�2-��ͨ����3-������ƣ�4-�߶���ƣ�5-��Ԫ����
 * @returns {string}
 */
var genHoldRow = function(json,fundtype) {
    if (!json || json == null)
        return "";
    var row = "<tr>"
    row += "<td>"+json.fundCode+"</td>";
    row += "<td>"+json.fundName+"</td>";
    row += "<td>"+json.agencyName+"</td>";
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
        //�ҵ���ǰ������С����һ���Ժ󣬰���һ�в��뵽����������е�ĩβ���ٴӼ�����ɾ����Ԫ��
        est.insertAfter(temp);
        temp = est;
        rows = rows.not(est);
    }
};

$(function(){
    if(!window.GF_VIEWINFO.goUrl){
        main.init();
    }
    main.bindEvent();
    //����Ƿ���Ҫ��ͨһ��ͨ
    checkOnePassport();
});

//ͳ�Ƶ�½��ص�ʱ��
window.onload = function(){
    var from = util.queryString.get()['from'];
    if(!from || from != 'login'){
        return;
    }
    var mainPageTime = (new Date()).getTime() - window.GF_VIEWINFO.pageInitTime,
        mainControllerBeginTime = parseInt(util.cookie.get('mainControllerBeginTime')),
        loginPageTime = util.cookie.get("loginPageTime"),
        loginTime = util.cookie.get("loginTime");

    if(!mainControllerBeginTime || !loginPageTime || !loginTime){
        return;    
    }

    var mainTime = window.GF_VIEWINFO.pageInitTime - mainControllerBeginTime;

    $.post("/main/timeWatch",{
        'loginPageTime' : loginPageTime,
        'loginTime' : loginTime,
        'mainTime' : mainTime,
        'mainPageTime' : mainPageTime
    });

    //�������cookie
    util.cookie.set("mainControllerBeginTime","");
    util.cookie.set("loginPageTime","");
    util.cookie.set("loginTime","");
};

function goToWalletMain() {
    document.cookie = "row=r1;path=/";
    document.cookie = "col=c10;path=/";
    window.location.href = '/wallet/WalletDetailAction.do?method=index';
}

//���Ͷ�����֤��
function smsVFCodeBtnClick() {
    var telPhoneRegex = /^1\d{10}$/;
    var mobilePhone = $("#mobilePhone").val();
    if(mobilePhone == null || util.string.trim(mobilePhone) == ""){
        $("#errorTips2").html("�ֻ����벻��Ϊ�ա�");
        $("#errorTips2").show();
        return;
    }else if(!telPhoneRegex.test(mobilePhone)){
        $("#errorTips2").html("�ֻ������ʽ���ԣ����������롣");
        $("#errorTips2").show();
        return;
    }
    $("#errorTips2").hide();
    $("#errorTips2").html("");
    smsVFCodeTipsObj = btn.disable($("#verifyCodeBtn"),{
        color:          '#C0C0C0',     //disable���������ɫ
        height:'28px',
        setBtnLoad:     false        //�Ƿ���ʾLoading��gifͼƬ
    });
    $.ajax({
        type: "post",
        url: "/main/register/verifyCode",
        data: {"mobilePhone":$('#mobilePhone').val()},
        success: function (msg) {
            var msgJson = msg;
            if (!msgJson.issuccess) {
                //����ʧ��
                $("#errorTips2").html(msgJson.returnmsg);
                btn.enable($("#getValidCode"));
            } else {
                $("#verifyCodeMsg").show();
                verifyToken = "1";
                $("#verifyToken").val(verifyToken);
                $(smsVFCodeTipsObj).html('��'+(secondCount--)+'������»�ȡ��');
                nIntervId = setInterval(CountDown, 1000);
            }
        }
    });
}

//����90�뵹��ʱ
function CountDown(){
    $(smsVFCodeTipsObj).html('��'+secondCount+'������»�ȡ��');
    if(--secondCount<0){
        clearCountDown();
    }
}
//�������90�뵹��ʱ����
function clearCountDown(){
    btn.enable($("#verifyCodeBtn"));
    if(smsVFCodeTipsObj != undefined){
        $(smsVFCodeTipsObj).html('');
    }
    clearInterval(nIntervId);
    secondCount = 90;
}

/**
 * ��鴿ֱ���û���ͨһ��ͨ��
 * @returns {boolean}
 */
function validatePasswordForm(){
    var alphaDashRegex = /^[a-z0-9_\-]+$/i;
    var loginPwd = $("#loginPwd").val();
    var loginPwdAgain = $("#loginPwdAgain").val();
    if(loginPwd == null || util.string.trim(loginPwd) == ""){
        $("#errorTips").html("���õĵ�¼���벻��Ϊ�ա�");
        $("#errorTips").show();
        return false;
    }else if(loginPwdAgain == null || util.string.trim(loginPwdAgain) == ""){
        $("#errorTips").html("ȷ�ϵ�¼���벻��Ϊ�ա�");
        $("#errorTips").show();
        return false;
    }else if(loginPwd != loginPwdAgain){
        $("#errorTips").html("���õĵ�¼�����ȷ�����벻һ�£����顣");
        $("#errorTips").show();
        return false;
    }else if(loginPwd.length<6){
        $("#errorTips").html("���õĵ�¼��������6λ��");
        $("#errorTips").show();
    }else if(!alphaDashRegex.test(loginPwd)){
        $("#errorTips").html("���õĵ�¼�����ʽ���ԣ����������롣");
        $("#errorTips").show();
    }else{
        $("#errorTips").hide();
        return true;
    }
}

/**
 * ��鿪ͨ�ֻ��˻�����
 * @returns {boolean}
 */
function validateAddAccountMobileForm(){
    var telPhoneRegex = /^1\d{10}$/;
    var numericRegex = /^[0-9]+$/;
    var mobilePhone = $("#mobilePhone").val();
    var verifyCodeView = $("#verifyCodeView").val();
    if(mobilePhone == null || util.string.trim(mobilePhone) == ""){
        $("#errorTips2").html("�ֻ����벻��Ϊ�ա�");
        $("#errorTips2").show();
//        $("#modal").show();
        return false;
    }else if(numericRegex == null || util.string.trim(verifyCodeView) == ""){
        $("#errorTips2").html("������֤�벻��Ϊ�ա�");
        $("#errorTips2").show();
        return false;
    }else if(!telPhoneRegex.test(mobilePhone)){
        $("#errorTips2").html("�ֻ������ʽ���ԣ����������롣");
        $("#errorTips2").show();
    }else if(!numericRegex.test(verifyCodeView)){
        $("#errorTips2").html("������֤���ʽ���ԣ����������롣");
        $("#errorTips2").show();
    }else if(verifyToken != 1) {
        $("#errorTips2").html("���ȡ�ֻ���֤�롣");
        $("#errorTips2").show();
    }else{
        $("#errorTips2").hide();
        return true;
    }
}

//����Ƿ���Ҫ��ͨһ��ͨ
function checkOnePassport(){
    //�ж��Ƿ���Ҫ��ͨһ��ͨ
    openAccount = $("#openAccountValue").val();
    addMobileNo = $("#addMobileNoValue").val();
    $("#nameView").html($("#nameValue").val());
    var gender = $("#genderValue").val();
    if(gender == 1){
        $("#gender").html("����");
    }else{
        $("#gender").html("Ůʿ");
    }
    if(openAccount == 1){
        $("#modal1_1").show();
    }else if(addMobileNo == 1) {
        var closeTips = util.cookie.get("closeTips");
        if(closeTips != 1){
            $("#modal2_1").show();
        }
    }
}
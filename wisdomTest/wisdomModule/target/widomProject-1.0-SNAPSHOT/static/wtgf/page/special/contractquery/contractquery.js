var util = require("common:widget/util/util.js");



$(function(){
        init();
        bindEvent();
    }
);

function init(){


    $.post("/main/special/qrycontractinfo",null,function(result){
        if(result.errno=="00000"){
            //加载完成
            if(result.data.length>0){
               $("#contract").show();
                var checkdiv="";

                for (var i = 0; i < result.data.length; i++) {
                    if(undefined== result.data[i].auditflag || null==result.data[i].auditflag || ''==result.data[i].auditflag || '0'==result.data[i].auditflag ){
                        checkdiv="待核对";
                    }else if('1'==result.data[i].auditflag){
                        checkdiv="核对通过";
                    }else if('2'==result.data[i].auditflag){
                        checkdiv="核对需补证<span class='wenHao'><div class='tishikuang'><em></em>提示内容提示内容提示内容提示内容提示内容</div></span>";
                    }

                    var date=result.data[i].updatetime.split(" ");

                    //alert(util.date.parse(result.data[i].managermodifydate);
                    $('<tr><td>'+result.data[i].fundcode+'｜'+result.data[i].fundname+'</td><td>'+util.number.format(result.data[i].balance,2)+'</td>' +
                        '<td>'+date[0]+'<br />'+date[1]+'</td><td>'+checkdiv+'</td><td>'+result.data[i].managermodifydate+'</td><td>'+result.data[i].custodmodifydate+'</td>' +
                        '<td class="butt"><span class="yqsxy yqsxy_pop" data-contracturl="'+result.data[i].contracturl+'" data-riskwarnurl="'+result.data[i].riskwarnurl+'" data-signagreeurl="'+result.data[i].signagreeurl+'">已签署协议</span>' +
                        '<span class="qspz qspz_pop" data-fundcode="'+result.data[i].fundcode+'" data-fundname="'+result.data[i].fundname+'" data-balance="'+result.data[i].balance+'" data-updatetime="'+result.data[i].updatetime+'" data-auditflag="'+result.data[i].auditflag +'"  data-custodmodifydate="'+result.data[i].custodmodifydate+'" data-managermodifydate="'+result.data[i].managermodifydate+'" data-contracturl="'+result.data[i].contracturl+'" data-riskwarnurl="'+result.data[i].riskwarnurl+
                        '" data-signagreeurl="'+result.data[i].signagreeurl+'" data-mobile="'+result.data[i].mobile+'" data-address="'+result.data[i].address+'" data-customname='+result.data[i].customname+' data-identityno='+result.data[i].identityno+' >签署凭证</span></td></tr>').appendTo("#myaseets");


                }
                /*已签署协议弹框*/
                $(".yqsxy_pop").click(function(event) {
                    $("#contracthref").attr("href","/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath="+$(this).data("contracturl"));
                    $("#contracthref").html("《"+$(this).data("contracturl").substring($(this).data("contracturl").lastIndexOf('\\')+1,$(this).data("contracturl").length).split("_")[0]+"》");

                    $("#contracthref").attr("href","/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath="+$(this).data("contracturl"));
                    $("#riskwarnhref").attr("href","/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath="+$(this).data("riskwarnurl"));

                    $("#signagreehref").attr("href","/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath="+$(this).data("signagreeurl"));
                    $("html,body").css({
                        overflow: 'hidden'
                    });
                    $(".qianxie_pop").css({
                        display: 'block'
                    });

                });
                /*签署凭证弹框*/

                $(".qspz_pop").click(function(event) {
                    $("#mycert").empty();
                    if(undefined== $(this).data("auditflag") || null==$(this).data("auditflag") || ''==$(this).data("auditflag") || '0'==$(this).data("auditflag") ){
                        checkdiv="待核对";
                    }else if('1'==$(this).data("auditflag")){
                        checkdiv="核对通过";
                    }else if('2'==$(this).data("auditflag")){
                        checkdiv="核对需补证";
                    }
                    $(' <tr>' +
                        '<th>委托人姓名</th>' +
                        '<th>委托人证件号码</th>' +
                        '<th>委托人联系方式</th>' +
                        '<th>委托人联系地址</th>' +
                        '<th>产品代码</th>' +
                        '<th>产品名称</th>' +
                        '<th>交易金额</th>' +
                        '<th>合同类型</th>' +
                        '<th>签署内容</th>' +
                        '<th>合同签署时间</th>' +
                        '<th>合同状态</th>' +
                        '<th>管理人<br />审核通过时间</th>' +
                        '<th>托管人<br />审核通过时间</th></tr><tr>' +
                        '<td>'+$(this).data("customname")+'</td>' +
                        '<td>'+$(this).data("identityno")+'</td>' +
                        '<td>'+$(this).data("mobile")+'</td>' +
                        '<td>'+$(this).data("address")+'</td>' +
                        '<td>'+$(this).data("fundcode")+'</td>' +
                        '<td>'+$(this).data("fundname")+'</td>' +
                        '<td>'+util.number.format($(this).data("balance"),2)+'</td>' +
                        '<td>电子合同</td>' +
                        '<td id="downDiv" ><a href="/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath='+$(this).data("contracturl")+'">《'+$(this).data("contracturl").substring($(this).data("contracturl").lastIndexOf('\\')+1,$(this).data("contracturl").length).split("_")[0]+'》</a><br/><a href="/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath='+$(this).data("riskwarnurl")+'">《产品风险揭示书》</a><br/><a href="/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath='+$(this).data("signagreeurl")+'">《电子签名约定书》</a></td>' +
                        '<td id="showDiv" style="display: none">《'+$(this).data("contracturl").substring($(this).data("contracturl").lastIndexOf('\\')+1,$(this).data("contracturl").length).split("_")[0]+'》<br/>《产品风险揭示书》<br/>《电子签名约定书》</td>' +
                       // '<td><a href="/GF/contract/download?filePath='+$(this).data("contracturl")+'">《'+$(this).data("contracturl").substring($(this).data("contracturl").lastIndexOf('\\')+1,$(this).data("contracturl").length).split("_")[0]+'》<br/></a><a href="/GF/contract/download?filePath='+$(this).data("riskwarnurl")+'">《产品风险揭示书》</a><br/><a href="/GF/contract/download?filePath='+$(this).data("signagreeurl")+'">《电子签名约定书》</a></td>' +
                        '<td>'+$(this).data("updatetime").split(" ")[0]+'<br />'+$(this).data("updatetime").split(" ")[1]+'</td>' +
                        '<td>'+checkdiv+'</td>' +
                        '<td>'+$(this).data("managermodifydate")+'</td>' +
                        '<td>'+$(this).data("custodmodifydate")+'</td>' +
                        '</tr>').appendTo("#mycert")
                    $("html,body").css({
                        overflow: 'hidden'
                    });
                    $(".qianspz_pop").css({
                        display: 'block'
                    });
                });



            }else{
                $("#contract").hide();
            }
        }else{
            $("#contract").hide();
        }

    });

}

function bindEvent(){
    /*关闭弹窗*/
    $(".pop .close_pop").click(function(event) {
        $(this).parents(".pop").parent().css({
            display: 'none'
        });
        $("html,body").css({
            overflow: 'auto'
        });
    });
    $(".pointer").click(function(event){
        $("#showDiv").show();
        $("#downDiv").hide();
        document.body.innerHTML=$(".pop_content_in").html();
        window.print();
    });
}




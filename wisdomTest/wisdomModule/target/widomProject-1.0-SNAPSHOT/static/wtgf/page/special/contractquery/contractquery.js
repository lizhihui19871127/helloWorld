var util = require("common:widget/util/util.js");



$(function(){
        init();
        bindEvent();
    }
);

function init(){


    $.post("/main/special/qrycontractinfo",null,function(result){
        if(result.errno=="00000"){
            //�������
            if(result.data.length>0){
               $("#contract").show();
                var checkdiv="";

                for (var i = 0; i < result.data.length; i++) {
                    if(undefined== result.data[i].auditflag || null==result.data[i].auditflag || ''==result.data[i].auditflag || '0'==result.data[i].auditflag ){
                        checkdiv="���˶�";
                    }else if('1'==result.data[i].auditflag){
                        checkdiv="�˶�ͨ��";
                    }else if('2'==result.data[i].auditflag){
                        checkdiv="�˶��貹֤<span class='wenHao'><div class='tishikuang'><em></em>��ʾ������ʾ������ʾ������ʾ������ʾ����</div></span>";
                    }

                    var date=result.data[i].updatetime.split(" ");

                    //alert(util.date.parse(result.data[i].managermodifydate);
                    $('<tr><td>'+result.data[i].fundcode+'��'+result.data[i].fundname+'</td><td>'+util.number.format(result.data[i].balance,2)+'</td>' +
                        '<td>'+date[0]+'<br />'+date[1]+'</td><td>'+checkdiv+'</td><td>'+result.data[i].managermodifydate+'</td><td>'+result.data[i].custodmodifydate+'</td>' +
                        '<td class="butt"><span class="yqsxy yqsxy_pop" data-contracturl="'+result.data[i].contracturl+'" data-riskwarnurl="'+result.data[i].riskwarnurl+'" data-signagreeurl="'+result.data[i].signagreeurl+'">��ǩ��Э��</span>' +
                        '<span class="qspz qspz_pop" data-fundcode="'+result.data[i].fundcode+'" data-fundname="'+result.data[i].fundname+'" data-balance="'+result.data[i].balance+'" data-updatetime="'+result.data[i].updatetime+'" data-auditflag="'+result.data[i].auditflag +'"  data-custodmodifydate="'+result.data[i].custodmodifydate+'" data-managermodifydate="'+result.data[i].managermodifydate+'" data-contracturl="'+result.data[i].contracturl+'" data-riskwarnurl="'+result.data[i].riskwarnurl+
                        '" data-signagreeurl="'+result.data[i].signagreeurl+'" data-mobile="'+result.data[i].mobile+'" data-address="'+result.data[i].address+'" data-customname='+result.data[i].customname+' data-identityno='+result.data[i].identityno+' >ǩ��ƾ֤</span></td></tr>').appendTo("#myaseets");


                }
                /*��ǩ��Э�鵯��*/
                $(".yqsxy_pop").click(function(event) {
                    $("#contracthref").attr("href","/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath="+$(this).data("contracturl"));
                    $("#contracthref").html("��"+$(this).data("contracturl").substring($(this).data("contracturl").lastIndexOf('\\')+1,$(this).data("contracturl").length).split("_")[0]+"��");

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
                /*ǩ��ƾ֤����*/

                $(".qspz_pop").click(function(event) {
                    $("#mycert").empty();
                    if(undefined== $(this).data("auditflag") || null==$(this).data("auditflag") || ''==$(this).data("auditflag") || '0'==$(this).data("auditflag") ){
                        checkdiv="���˶�";
                    }else if('1'==$(this).data("auditflag")){
                        checkdiv="�˶�ͨ��";
                    }else if('2'==$(this).data("auditflag")){
                        checkdiv="�˶��貹֤";
                    }
                    $(' <tr>' +
                        '<th>ί��������</th>' +
                        '<th>ί����֤������</th>' +
                        '<th>ί������ϵ��ʽ</th>' +
                        '<th>ί������ϵ��ַ</th>' +
                        '<th>��Ʒ����</th>' +
                        '<th>��Ʒ����</th>' +
                        '<th>���׽��</th>' +
                        '<th>��ͬ����</th>' +
                        '<th>ǩ������</th>' +
                        '<th>��ͬǩ��ʱ��</th>' +
                        '<th>��ͬ״̬</th>' +
                        '<th>������<br />���ͨ��ʱ��</th>' +
                        '<th>�й���<br />���ͨ��ʱ��</th></tr><tr>' +
                        '<td>'+$(this).data("customname")+'</td>' +
                        '<td>'+$(this).data("identityno")+'</td>' +
                        '<td>'+$(this).data("mobile")+'</td>' +
                        '<td>'+$(this).data("address")+'</td>' +
                        '<td>'+$(this).data("fundcode")+'</td>' +
                        '<td>'+$(this).data("fundname")+'</td>' +
                        '<td>'+util.number.format($(this).data("balance"),2)+'</td>' +
                        '<td>���Ӻ�ͬ</td>' +
                        '<td id="downDiv" ><a href="/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath='+$(this).data("contracturl")+'">��'+$(this).data("contracturl").substring($(this).data("contracturl").lastIndexOf('\\')+1,$(this).data("contracturl").length).split("_")[0]+'��</a><br/><a href="/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath='+$(this).data("riskwarnurl")+'">����Ʒ���ս�ʾ�顷</a><br/><a href="/main/1Qw2nbvcGFjkfdSxL/extra/download?filePath='+$(this).data("signagreeurl")+'">������ǩ��Լ���顷</a></td>' +
                        '<td id="showDiv" style="display: none">��'+$(this).data("contracturl").substring($(this).data("contracturl").lastIndexOf('\\')+1,$(this).data("contracturl").length).split("_")[0]+'��<br/>����Ʒ���ս�ʾ�顷<br/>������ǩ��Լ���顷</td>' +
                       // '<td><a href="/GF/contract/download?filePath='+$(this).data("contracturl")+'">��'+$(this).data("contracturl").substring($(this).data("contracturl").lastIndexOf('\\')+1,$(this).data("contracturl").length).split("_")[0]+'��<br/></a><a href="/GF/contract/download?filePath='+$(this).data("riskwarnurl")+'">����Ʒ���ս�ʾ�顷</a><br/><a href="/GF/contract/download?filePath='+$(this).data("signagreeurl")+'">������ǩ��Լ���顷</a></td>' +
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
    /*�رյ���*/
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




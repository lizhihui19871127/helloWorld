// JavaScript Document �ֻ�������֤js
//���ֻ�������,�������뼰�������ļ��ײ�
function aqgj_bdsj_showDiv()
{
    var aqgj_Outer = document.getElementById('aqgj_Outer');
    var aqgj_divbox = document.getElementById('aqgj_divbox');
    aqgj_Outer.style.width = (Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth)) + "px";
    aqgj_Outer.style.height = (Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)) + "px";
    aqgj_Outer.style.display = 'block';
    aqgj_divbox.style.display = 'block';
}

function aqgj_bdsj_closeDiv()
{
    var aqgj_Outer = document.getElementById('aqgj_Outer');
    var aqgj_divbox = document.getElementById('aqgj_divbox');
    aqgj_Outer.style.display = 'none';
    aqgj_divbox.style.display = 'none';
}

//���ƶ�����֤���񵯳���,�������뼰�������ļ��ײ�
function aqgj_bdsj_showDzfw()
{
    var aqgj_Outer = document.getElementById('aqgj_Outer');
    var aqgj_dzfwbox = document.getElementById('aqgj_dzfwbox');
    aqgj_Outer.style.width = (Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth)) + "px";
    aqgj_Outer.style.height = (Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)) + "px";
    aqgj_Outer.style.display = 'block';
    aqgj_dzfwbox.style.display = 'block';
}

function aqgj_bdsj_closeDzfw()
{
    var aqgj_Outer = document.getElementById('aqgj_Outer');
    var aqgj_dzfwbox = document.getElementById('aqgj_dzfwbox');
    aqgj_Outer.style.display = 'none';
    aqgj_dzfwbox.style.display = 'none';
}

//���·��͵�����60�뵹��ʱ
var countdown = 60;

function settime(val)
{

    if (countdown == 0)
    {
        val.removeAttribute("disabled");
        val.innerHTML = "���·���";
        countdown = 60;
        return null;
    }
    else
    {
        val.setAttribute("disabled", true);
        val.innerHTML = "���·���(" + countdown + ")";
        countdown--;
        var aqgj_divbox_p1 = document.getElementById('aqgj_divbox_p1');
        aqgj_divbox_p1.style.display = 'none';
        var aqgj_divbox_p2 = document.getElementById('aqgj_divbox_p2');
        aqgj_divbox_p2.style.display = 'block';

        var aqgj_divbox_a1 = document.getElementById('aqgj_divbox_a1');
        aqgj_divbox_a1.style.display = 'inline';

        var aqgj_divbox_p4 = document.getElementById('aqgj_divbox_p4');
        aqgj_divbox_p4.style.display = 'block';
    }

    setTimeout(function ()
               {
                   settime(val)
               }, 1000)

}
//�ֻ�������֤
function yzMobile(obj)
{
    if (!mobileyz.test(obj.value))
    {
        alert("������Ϸ����ֻ��ţ�");
        obj.value = "�����������ֻ�����";
    } else
    {
        //��֤�ɹ�
    }
}

//������֤
function yzDx(obj)
{
    if (obj.value.length > 8)
    {
        alert("��������Ч���ֻ���̬�룡");
        obj.value = "";
    }
    else if (!dxpattern.test(obj.value))
    {
        alert("������Ϸ����ֻ���̬�룡");
        obj.value = "";
    }
    else
    {
        //��֤�ɹ�
    }
}
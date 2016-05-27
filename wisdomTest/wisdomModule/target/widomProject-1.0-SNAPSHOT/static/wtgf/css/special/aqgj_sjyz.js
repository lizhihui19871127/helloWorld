// JavaScript Document 手机短信验证js
//绑定手机弹出框,弹出代码及内容在文件底部
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

//定制短信验证服务弹出框,弹出代码及内容在文件底部
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

//重新发送到短信60秒倒计时
var countdown = 60;

function settime(val)
{

    if (countdown == 0)
    {
        val.removeAttribute("disabled");
        val.innerHTML = "重新发送";
        countdown = 60;
        return null;
    }
    else
    {
        val.setAttribute("disabled", true);
        val.innerHTML = "重新发送(" + countdown + ")";
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
//手机号码验证
function yzMobile(obj)
{
    if (!mobileyz.test(obj.value))
    {
        alert("请输入合法的手机号！");
        obj.value = "请输入您的手机号码";
    } else
    {
        //验证成功
    }
}

//短信验证
function yzDx(obj)
{
    if (obj.value.length > 8)
    {
        alert("请输入有效的手机动态码！");
        obj.value = "";
    }
    else if (!dxpattern.test(obj.value))
    {
        alert("请输入合法的手机动态码！");
        obj.value = "";
    }
    else
    {
        //验证成功
    }
}
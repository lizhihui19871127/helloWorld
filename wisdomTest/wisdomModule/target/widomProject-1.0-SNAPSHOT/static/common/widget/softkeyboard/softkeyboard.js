define('common:widget/softkeyboard/softkeyboard.js', function(require, exports, module){ //   window.attachEvent("onload", board);
window.board=function() {
    password1 = null;
    initCalc();
	window.softkeyboard = document.getElementById("softkeyboard");
}

window.password1;
window.CapsLockValue = 0;
window.checkSoftKey;
window.pIsPWD = false;
window.pTip;
window.ps = null;
window.setVariables=function() {
    tablewidth = 630;
    tableheight = 20;
    if (navigator.appName == "Netscape") {
        horz = ".left";
        vert = ".top";
        docStyle = "document.";
        styleDoc = "";
        innerW = "window.innerWidth";
        innerH = "window.innerHeight";
        offsetX = "window.pageXOffset";
        offsetY = "window.pageYOffset";
    }
    else {
        horz = ".pixelLeft";
        vert = ".pixelTop";
        docStyle = "";
        styleDoc = ".style";
        innerW = "document.body.clientWidth";
        innerH = "document.body.clientHeight";
        offsetX = "document.body.scrollLeft";
        offsetY = "document.body.scrollTop";
    }
}
window.checkLocation=function() {
    if (checkSoftKey) {
        objectXY = "softkeyboard";
        var availableX = eval(innerW);
        var availableY = eval(innerH);
        var currentX = eval(offsetX);
        var currentY = eval(offsetY);
        x = availableX - tablewidth + currentX;
        y = currentY;
        evalMove();
    }
    setTimeout("checkLocation()", 0);
}
window.evalMove=function() {
    eval(docStyle + objectXY + styleDoc + vert + "=" + y);
}
self.onError = null;
currentX = currentY = 0;
whichIt = null;
lastScrollX = 0;
lastScrollY = 0;
NS = (document.layers) ? 1 : 0;
IE = (document.all) ? 1 : 0;
window.heartBeat=function() {
    if (IE) {
        diffY = document.body.scrollTop;
        diffX = document.body.scrollLeft;
    }
    if (NS) {
        diffY = self.pageYOffset;
        diffX = self.pageXOffset;
    }
    if (diffY != lastScrollY) {
        percent = .1 * (diffY - lastScrollY);
        if (percent > 0) percent = Math.ceil(percent);
        else percent = Math.floor(percent);
        if (IE) document.all.softkeyboard.style.pixelTop += percent;
        if (NS) document.softkeyboard.top += percent;
        lastScrollY = lastScrollY + percent;
    }
    if (diffX != lastScrollX) {
        percent = .1 * (diffX - lastScrollX);
        if (percent > 0) percent = Math.ceil(percent);
        else percent = Math.floor(percent);
        if (IE) document.all.softkeyboard.style.pixelLeft += percent;
        if (NS) document.softkeyboard.left += percent;
        lastScrollX = lastScrollX + percent;
    }
}
window.checkFocus=function(x, y) {
    stalkerx = document.softkeyboard.pageX;
    stalkery = document.softkeyboard.pageY;
    stalkerwidth = document.softkeyboard.clip.width;
    stalkerheight = document.softkeyboard.clip.height;
    if ((x > stalkerx && x < (stalkerx + stalkerwidth)) && (y > stalkery && y < (stalkery + stalkerheight))) return true;
    else return false;
}
window.grabIt=function(e) {
    checkSoftKey = false;
    if (IE) {
        whichIt = event.srcElement;
        while (whichIt.id != null && whichIt.id.indexOf("softkeyboard") == -1) {
            whichIt = whichIt.parentElement;
            if (whichIt == null) {
                return true;
            }
        }
        if (whichIt.style != null) {
            whichIt.style.pixelLeft = whichIt.offsetLeft;
            whichIt.style.pixelTop = whichIt.offsetTop;
        }
        currentX = (event.clientX + document.body.scrollLeft);
        currentY = (event.clientY + document.body.scrollTop);
    }
    else {
        window.captureEvents(Event.MOUSEMOVE);
        if (checkFocus(e.pageX, e.pageY)) {
            whichIt = document.softkeyboard;
            StalkerTouchedX = e.pageX - document.softkeyboard.pageX;
            StalkerTouchedY = e.pageY - document.softkeyboard.pageY;
        }
    }
    return true;
}

window.moveIt=function(e) {
    // u
    //    if ( whichIt == null )
    //    {
    //        return false;
    //    }
    //    if ( IE )
    //    {
    //        if ( whichIt.style != null )
    //        {
    //            newX = (event.clientX + document.body.scrollLeft);
    //            newY = (event.clientY + document.body.scrollTop);
    //            distanceX = (newX - currentX);
    //            distanceY = (newY - currentY);
    //            currentX = newX;
    //            currentY = newY;
    //            whichIt.style.pixelLeft += distanceX;
    //            whichIt.style.pixelTop += distanceY;
    //            if ( whichIt.style.pixelTop < document.body.scrollTop ) whichIt.style.pixelTop = document.body.scrollTop;
    //            if ( whichIt.style.pixelLeft < document.body.scrollLeft ) whichIt.style.pixelLeft = document.body.scrollLeft;
    //            if ( whichIt.style.pixelLeft > document.body.offsetWidth - document.body.scrollLeft - whichIt.style.pixelWidth - 20 ) whichIt.style.pixelLeft = document.body.offsetWidth - whichIt.style.pixelWidth - 20;
    //            if ( whichIt.style.pixelTop > document.body.offsetHeight + document.body.scrollTop - whichIt.style.pixelHeight - 5 ) whichIt.style.pixelTop = document.body.offsetHeight + document.body.scrollTop - whichIt.style.pixelHeight - 5;
    //            event.returnValue = false;
    //        }
    //    }
    //    else
    //    {
    //        whichIt.moveTo(e.pageX - StalkerTouchedX, e.pageY - StalkerTouchedY);
    //        if ( whichIt.left < 0 + self.pageXOffset ) whichIt.left = 0 + self.pageXOffset;
    //        if ( whichIt.top < 0 + self.pageYOffset ) whichIt.top = 0 + self.pageYOffset;
    //        if ( (whichIt.left + whichIt.clip.width) >= (window.innerWidth + self.pageXOffset - 17) ) whichIt.left = ((window.innerWidth + self.pageXOffset) - whichIt.clip.width) - 17;
    //        if ( (whichIt.top + whichIt.clip.height) >= (window.innerHeight + self.pageYOffset - 17) ) whichIt.top = ((window.innerHeight + self.pageYOffset) - whichIt.clip.height) - 17;
    //        return false;
    //    }
    //    return false;
}
window.dropIt=function() {
    whichIt = null;
    if (NS) window.releaseEvents(Event.MOUSEMOVE);
    return true;
}
if (NS) {
    window.captureEvents(Event.MOUSEUP | Event.MOUSEDOWN);
    window.onmousedown = grabIt;
    window.onmousemove = moveIt;
    window.onmouseup = dropIt;
}
if (IE) {
    //document.onmousedown = grabIt;
    document.attachEvent("onmousedown", grabIt)
    //document.onmousemove = moveIt;
    document.attachEvent("onmousemove", moveIt)
    //document.onmouseup = dropIt;
    document.attachEvent("onmouseup", dropIt)
}


//var lettercolorbg="#ECF8F6";
//var numcolorbg="#CAE4B6";
//var inputcolor="#C6E3B1";
var style1 = "<style>";
style1 += ".btn_letter {BORDER: 1px solid #7AB7DA; padding:1 1 1 1;FONT-SIZE: 14px;CURSOR: hand; width:25px; height:20px;FILTER: progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr=#ffffff, EndColorStr=#DDDCDC);background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#DDDCDC));background: -moz-linear-gradient(top, #ffffff, #DDDCDC);}";
style1 += ".btn_num {BORDER: 1px solid #7AB7DA;width:25px;FONT-SIZE: 14px; CURSOR: hand;height:20px; FILTER: progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr=#ffffff, EndColorStr=#AADF55);background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#AADF55));background: -moz-linear-gradient(top, #ffffff, #AADF55);}";
//DDDCDC AADF55 上面二处调颜色
style1 += ".table_title {FILTER: progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr=#B2DEF7, EndColorStr=#7AB7DA); background: -webkit-gradient(linear, left top, left bottom, from(#B2DEF7), to(#7AB7DA));height:26px;padding-top: 3px;background: -moz-linear-gradient(top, #B2DEF7, #7AB7DA);}";
style1 += ".btn_input {BORDER: 1px solid #7AB7DA;FONT-SIZE: 14px; FILTER: progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr=#ffffff, EndColorStr=#C3DAF5);CURSOR: hand;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#C3DAF5));background: -moz-linear-gradient(top, #ffffff, #C3DAF5);}";
style1 += "</style>";
document.write(style1);

document.write("<DIV align=\"center\" id=\"softkeyboard\" name=\"softkeyboard\" style=\"position:absolute; left:0px; top:0px; width:400px;z-index:10001;overflow:hidden;display:none\">" +
        "<table id=\"CalcTable\" width=\"\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style='background:#B2DEF7'>" +
        "<FORM id=Calc name=Calc action=\"\" method=post autocomplete=\"off\">" +
        "<tr>" +
        "<td class=\"table_title\" title=\"尊敬的客户：为了保证网上交易安全,建议使用密码输入器输入密码!\" align=\"center\" bgcolor=\"\" style=\"cursor: default;height:30\">" +
        "<INPUT type=hidden value=\"\" name=password><INPUT type=hidden value=ok name=action2><font style=\"font-weight:bold; font-size:12px; color:#075BC3\">广发基金网上交易平台</font>" +
        "<INPUT id=useKey class=\"btn_letter\" type=button value=\"使用键盘输入\" onclick=\"password1.readOnly=0;password1.focus();closekeyboard();password1.value='';\" style='float: right;margin-right:1px;vertical-align: middle;width: 98px;font-size: 12px;'>" +
        "</td></tr>" +
    /*第一行*/
        "<tr align=\"center\"><td align=\"center\">" +
        "<table align=\"center\" width=\"%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">" +
        "<tr align=\"left\" valign=\"middle\">" +
        "<td><input type=button value=\" ~ \" name=\"button_number0\" class=\"btn_num\"></td>" +
        "<td><input type=button value=\" ! \" name=\"button_number1\" class=\"btn_num\"></td>" +
        "<td><input type=button  value=\" @ \" name=\"button_number2\" class=\"btn_num\"></td>" +
        "<td><input type=button value=\" $ \" name=\"button_number4\" class=\"btn_num\"></td>" +
        "<td><input type=button value=\" % \" name=\"button_number5\" class=\"btn_num\"></td>" +
        "<td><input type=button value=\" ^ \" name=\"button_number6\" class=\"btn_num\"></td>" +
        "<td><input type=button value=\" & \" name=\"button_number7\" class=\"btn_num\"></td>" +
        "<td><input type=button value=\" * \" name=\"button_number8\" class=\"btn_num\"></td>" +
        "<td><input type=button value=\" ( \" name=\"button_number9\" class=\"btn_num\"></td>" +
        "<td><input type=button value=\" ) \" name=\"button_number10\" class=\"btn_num\"></td>" +
        "<td><input type=button value=\" _ \" name=\"button_number11\" class=\"btn_num\"></td>" +
        "<td><input type=button value=\" + \" name=\"button_number12\" class=\"btn_num\"></td>" +
    //               "<td><input type=button value=\" | \" name=\"button_number13\" class=\"btn_num\"></td>" +
        "<td colspan=\"1\" rowspan=\"2\"><input name=\"button10\" class=\"btn_letter\" type=button value=\" 退格\" onclick=\"setpassvalue();\"  onDblClick=\"setpassvalue();\" style=\"width:100px;height:42px\"></td>" +
        "</tr>" +
    /*第二行*/
        "<tr align=\"left\" valign=\"middle\">" +
        "<td><input type=button value=\" ` \" name=\"button_number14\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" 1 \" name=\"button_number15\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" 2 \" name=\"button_number16\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" 3 \" name=\"button_number17\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" 4 \" name=\"button_number18\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" 5 \" name=\"button_number19\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" 6 \" name=\"button_number20\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" 7 \" name=\"button_number21\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" 8 \" name=\"button_number22\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" 9 \" name=\"button_number23\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" 0 \" name=\"button_number24\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" - \" name=\"button_number25\" class=\"btn_letter\"></td>" +
    //               "<td><input type=button value=\" \\ \" name=\"button_number27\" class=\"btn_letter\"></td>" +
        "<td></td>" +
        "</tr>" +
    /*第三行*/
        "<tr align=\"left\" valign=\"middle\">" +
        "<td><input type=button value=\" q \" name=\"buttonq\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" w \" name=\"buttonw\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" e \" name=\"buttone\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" r \" name=\"buttonr\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" t \" name=\"buttont\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" y \" name=\"buttony\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" u \" name=\"buttonu\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" i \" name=\"buttoni\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" o \" name=\"buttono\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" p \" name=\"buttonp\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" { \" name=\"buttonO\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" } \" name=\"buttonA\" class=\"btn_letter\"></td>" +
    //               "<td><input type=button value=\" [ \" name=\"buttonB\"></td>" +
    //               "<td><input type=button value=\" ] \" name=\"buttonC\"></td>" +
        "<td><input name=\"button9\" type=button class=\"btn_letter\" onClick=\"capsLockText();setCapsLock();\" onDblClick=\"capsLockText();setCapsLock();\" value=\"切换大/小写\" style=\"width:100px;\"></td>" +
        "</tr>" +
    /*第四行*/
        "<tr align=\"left\" valign=\"middle\">" +
        "<td><input type=button value=\" a \" name=\"buttona\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" s \" name=\"buttons\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" d \" name=\"buttond\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" f \" name=\"buttonf\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" g \" name=\"buttong\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" h \" name=\"buttonh\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" j \" name=\"buttonj\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" k \"  name=\"buttonk\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" l \"  name=\"buttonl\" class=\"btn_letter\" /></td>" +
        "<td><input name=\"buttonD\" type=button value=\" : \" class=\"btn_letter\"></td>" +
    //               "<td><input name=\"buttonE\" type=button value=\" &quot; \"></td>"+
        "<td><input name=\"buttonF\" type=button value=\" ; \" class=\"btn_letter\"></td>" +
   "<td><input name=\"button_number27\" type=button value=\" # \" class=\"btn_letter\"></td>" +
    //               "<td><input name=\"buttonG\" type=button value=\" ' \"></td>" +
        "<td rowspan=\"2\" >" +
        "<input name=\"button12\" type=button class=\"btn_input\" onclick=\"OverInput();\" value=\"   确定  \" style=\"width:100px;height:42px\"></td>" +
        "</tr>" +
    /*第五行*/
        "<tr align=\"left\" valign=\"middle\">" +
        "<td><input type=button value=\" z \" name=\"buttonz\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" x \" name=\"buttonx\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" c \" name=\"buttonc\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" v \" name=\"buttonv\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" b \" name=\"buttonb\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" n \" name=\"buttonn\" class=\"btn_letter\" /></td>" +
        "<td><input type=button value=\" m \" name=\"buttonm\" class=\"btn_letter\" /></td>" + /*
 "<td><input type=button value=\" &lt; \" name=\"buttonH\"></td>" +
 "<td><input type=button value=\" &gt; \" name=\"buttonI\"></td>" +*/
        "<td><input type=button value=\" ? \" name=\"buttonJ\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" , \" name=\"buttonK\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" . \" name=\"buttonM\" class=\"btn_letter\"></td>" +
        "<td><input type=button value=\" = \" name=\"buttonQ\" class=\"btn_letter\"></td>" +
    //               "<td><input type=button value=\" / \" name=\"buttonN\"></td>" +
        "</tr>" +

        "</table>" +
        "</td>" +
        "</FORM>" +
        "</tr>" +
        "</table>" +
        "</DIV>");

window.Calc = document.getElementById("Calc");
window.softkeyboard = document.getElementById("softkeyboard");

window.addValue=function(newValue) {
    if (CapsLockValue == 0) {
        var str = Calc.password.value;
        if (str.length < password1.maxLength) {
            Calc.password.value += newValue;
        }
        if (str.length <= password1.maxLength) {
            password1.value = Calc.password.value;
            pspassword1();
        }
    }
    else {
        var str = Calc.password.value;
        if (str.length < password1.maxLength) {
            //Calc.password.value += newValue.toUpperCase();
            Calc.password.value += newValue;
        }
        if (str.length <= password1.maxLength) {
            password1.value = Calc.password.value;
            pspassword1();
        }
    }
}

window.setpassvalue=function() {
    var longnum = Calc.password.value.length;
    var num
    num = Calc.password.value.substr(0, longnum - 1);
    Calc.password.value = num;
    var str = Calc.password.value;
    password1.value = Calc.password.value;
    pspassword1();
}

window.OverInput=function() {
    var str = Calc.password.value;
    password1.value = Calc.password.value;
    pspassword1();
    closekeyboard();
    Calc.password.value = "";
    password1.readOnly = 1;
}

window.closekeyboard=function(theForm) {
    softkeyboard.style.display = "none";
    if (null != unhideSelect) {
        unhideSelect();
    }
}

window.showkeyboard=function() {
    randomFlagButton();
    randomNumberButton();
    randomThreeButton();
    randomOneButton();
    randomTwoButton();
    randomLetterButton();
    var th = password1;
    var ttop = th.offsetTop;
    var thei = th.clientHeight;
    var tleft = th.offsetLeft;
    var ttyp = th.type;
    while (th = th.offsetParent) {
        ttop += th.offsetTop;
        tleft += th.offsetLeft;
    }
    softkeyboard.style.top = ttop + thei + 5 + "px";
    softkeyboard.style.left = tleft - 75 + "px";
    softkeyboard.style.display = "block";
    password1.readOnly = 1;
    password1.blur();
    document.getElementById("useKey").focus();
    if (null != hideSelect) {
        hideSelect();
    }
}

window.setCapsLock=function() {
    if (CapsLockValue == 0) {
        CapsLockValue = 1
    }
    else {
        CapsLockValue = 0
    }
}
window.setCalcborder=function() {
//        document.getElementById("CalcTable").style.border = "1px solid #B5ADF1";
}
//window.setHead=function()
//{
//        document.getElementById("CalcTable").style.backgroundColor = "#B5ADF1";
//}
window.setCalcButtonBg=function() {
    for (var i = 0; i < Calc.elements.length; i++) {
//        if (Calc.elements[i].type == "button" && Calc.elements[i].bgtype != "1")
//        {
//            if (Calc.elements[i].bgtype == "2")
//            {
//                Calc.elements[i].className = "btn_num";
//            }
//            else
//            {
//                if (Calc.elements[i].name != "button92" && Calc.elements[i].name != "button12")
//                {
//                    Calc.elements[i].className = "btn_letter";
//                }
//
//                if (Calc.elements[i].name == "button12")
//                {
//                    Calc.elements[i].className = "btn_input"
//                }
//                //
//                //    {
//                //        Calc.elements[i].className="btn_input";
//                //    }
//            }
        var str1 = Calc.elements[i].value;
        str1 = $.trim(str1);
        if (str1.length == 1) {
        }
        var thisButtonValue = Calc.elements[i].value;
        thisButtonValue = $.trim(thisButtonValue);
        if (thisButtonValue.length == 1) {
            Calc.elements[i].onclick =
                    function () {
                        var thisButtonValue = this.value;
                        thisButtonValue = thisButtonValue.trim();
                        thisButtonValue = jiamiMimaKey(thisButtonValue);
                        addValue(thisButtonValue);
                    }
            Calc.elements[i].ondblclick =
                    function () {
                        var thisButtonValue = this.value;
                        thisButtonValue = thisButtonValue.trim();
                        thisButtonValue = jiamiMimaKey(thisButtonValue);
                        addValue(thisButtonValue);
                    }
        }
//        }
    }

}

window.initCalc=function() {
    setCalcborder();
//    setHead();
    setCalcButtonBg();
}
window.board();
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
var capsLockFlag;
capsLockFlag = true;
window.capsLockText=function() {
    if (capsLockFlag) {
        for (var i = 0; i < Calc.elements.length; i++) {
            var char = Calc.elements[i].value;
            var char = char.trim()
            if (Calc.elements[i].type == "button" && char >= "a" && char <= "z" && char.length == 1) {
                Calc.elements[i].value = " " + String.fromCharCode(char.charCodeAt(0) - 32) + " "
            }
        }
    }
    else {
        for (var i = 0; i < Calc.elements.length; i++) {
            var char = Calc.elements[i].value;
            var char = char.trim()
            if (Calc.elements[i].type == "button" && char >= "A" && char <= "Z" && char.length == 1) {
                Calc.elements[i].value = " " + String.fromCharCode(char.charCodeAt(0) + 32) + " "
            }
        }
    }
    capsLockFlag = !capsLockFlag;
}


window.randomTwoButton=function() {
    var a = new Array(2);
    a[0] = ":";
    //    a[1] = "\"";
    a[1] = ";";
    //    a[3] = "'";

    var randomNum;
    var times = 2;
    for (var i = 0; i < 2; i++) {
        randomNum = parseInt(Math.random() * 2);
        var tmp = a[0];
        a[0] = a[randomNum];
        a[randomNum] = tmp;
    }
    Calc.buttonD.value = " " + a[0] + " ";
    //    Calc.buttonE.value = " " + a[1] + " ";
    Calc.buttonF.value = " " + a[1] + " ";
    //    Calc.buttonG.value = " " + a[3] + " ";
}
window.randomThreeButton=function() {
    var a = new Array(4);
    a[0] = "?";
    a[1] = ",";
    a[2] = ".";
    a[3] = "=";
    //    a[3] = "/";

    var randomNum;
    var times = 4;
    for (var i = 0; i < 4; i++) {
        randomNum = parseInt(Math.random() * 4);
        var tmp = a[0];
        a[0] = a[randomNum];
        a[randomNum] = tmp;
    }
    Calc.buttonJ.value = " " + a[0] + " ";
    Calc.buttonK.value = " " + a[1] + " ";
    Calc.buttonM.value = " " + a[2] + " ";
    Calc.buttonQ.value = " " + a[3] + " ";
    //    Calc.buttonN.value = " " + a[3] + " ";
}


window.randomOneButton=function() {
    var a = new Array(2);
    a[0] = "{";
    a[1] = "}";
    //    a[2] = "[";
    //    a[3] = "]";

    var randomNum;
    var times = 4;
    for (var i = 0; i < 2; i++) {
        randomNum = parseInt(Math.random() * 2);
        var tmp = a[0];
        a[0] = a[randomNum];
        a[randomNum] = tmp;
    }
    Calc.buttonO.value = " " + a[0] + " ";
    Calc.buttonA.value = " " + a[1] + " ";
    //    Calc.buttonB.value = " " + a[2] + " ";
    //    Calc.buttonC.value = " " + a[3] + " ";
}


window.randomFlagButton=function() {
    var a = new Array(12);
    a[0] = "~";
    a[1] = "!";
    a[2] = "@";
    //    a[3] = "#";
    a[3] = "$";
    a[4] = "%";
    a[5] = "^";
    a[6] = "&";
    a[7] = "*";
    a[8] = "(";
    a[9] = ")";
    a[10] = "_";
    a[11] = "+";
    //    a[12] = "|";

    var randomNum;
    var times = 13;
    for (var i = 0; i < 12; i++) {
        randomNum = parseInt(Math.random() * 12);
        var tmp = a[0];
        a[0] = a[randomNum];
        a[randomNum] = tmp;
    }
    Calc.button_number0.value = " " + a[0] + " ";
    Calc.button_number1.value = " " + a[1] + " ";
    Calc.button_number2.value = " " + a[2] + " ";
    //    Calc.button_number3.value = " " + a[3] + " ";
    Calc.button_number4.value = " " + a[3] + " ";
    Calc.button_number5.value = " " + a[4] + " ";
    Calc.button_number6.value = " " + a[5] + " ";
    Calc.button_number7.value = " " + a[6] + " ";
    Calc.button_number8.value = " " + a[7] + " ";
    Calc.button_number9.value = " " + a[8] + " ";
    Calc.button_number10.value = " " + a[9] + " ";
    Calc.button_number11.value = " " + a[10] + " ";
    Calc.button_number12.value = " " + a[11] + " ";
    //    Calc.button_number13.value = " " + a[12] + " ";

}

window.randomNumberButton=function() {
    var a = new Array(12);
    a[0] = "`";
    a[1] = 1;
    a[2] = 2;
    a[3] = 3;
    a[4] = 4;
    a[5] = 5;
    a[6] = 6;
    a[7] = 7;
    a[8] = 8;
    a[9] = 9;
    a[10] = 0;
    a[11] = "-";
    //    a[12] = "=";
    //    a[13] = "\\";

    var randomNum;
    var times = 13;
    for (var i = 0; i < 12; i++) {
        randomNum = parseInt(Math.random() * 12);
        var tmp = a[0];
        a[0] = a[randomNum];
        a[randomNum] = tmp;
    }


    Calc.button_number14.value = " " + a[0] + " ";
    Calc.button_number15.value = " " + a[1] + " ";
    Calc.button_number16.value = " " + a[2] + " ";
    Calc.button_number17.value = " " + a[3] + " ";
    Calc.button_number18.value = " " + a[4] + " ";
    Calc.button_number19.value = " " + a[5] + " ";
    Calc.button_number20.value = " " + a[6] + " ";
    Calc.button_number21.value = " " + a[7] + " ";
    Calc.button_number22.value = " " + a[8] + " ";
    Calc.button_number23.value = " " + a[9] + " ";
    Calc.button_number24.value = " " + a[10] + " ";
    Calc.button_number25.value = " " + a[11] + " ";
    //    Calc.button_number26.value = " " + a[12] + " ";
    //    Calc.button_number27.value = " " + a[13] + " ";
}


window.randomLetterButton=function() {
    var a = new Array(26);
    a[0] = "a";
    a[1] = "b";
    a[2] = "c";
    a[3] = "d";
    a[4] = "e";
    a[5] = "f";
    a[6] = "g";
    a[7] = "h";
    a[8] = "i";
    a[9] = "j";
    a[10] = "k";
    a[11] = "l";
    a[12] = "m";
    a[13] = "n";
    a[14] = "o";
    a[15] = "p";
    a[16] = "q";
    a[17] = "r";
    a[18] = "s";
    a[19] = "t";
    a[20] = "u";
    a[21] = "v";
    a[22] = "w";
    a[23] = "x";
    a[24] = "y";
    a[25] = "z";
    var randomNum;
    var times = 26;
    for (var i = 0; i < 26; i++) {
        randomNum = parseInt(Math.random() * 26);
        var tmp = a[0];
        a[0] = a[randomNum];
        a[randomNum] = tmp;
    }

    Calc.buttona.value = " " + a[0] + " ";
    Calc.buttonb.value = " " + a[1] + " ";
    Calc.buttonc.value = " " + a[2] + " ";
    Calc.buttond.value = " " + a[3] + " ";
    Calc.buttone.value = " " + a[4] + " ";
    Calc.buttonf.value = " " + a[5] + " ";
    Calc.buttong.value = " " + a[6] + " ";
    Calc.buttonh.value = " " + a[7] + " ";
    Calc.buttoni.value = " " + a[8] + " ";
    Calc.buttonj.value = " " + a[9] + " ";
    Calc.buttonk.value = " " + a[10] + " ";
    Calc.buttonl.value = " " + a[11] + " ";
    Calc.buttonm.value = " " + a[12] + " ";
    Calc.buttonn.value = " " + a[13] + " ";
    Calc.buttono.value = " " + a[14] + " ";
    Calc.buttonp.value = " " + a[15] + " ";
    Calc.buttonq.value = " " + a[16] + " ";
    Calc.buttonr.value = " " + a[17] + " ";
    Calc.buttons.value = " " + a[18] + " ";
    Calc.buttont.value = " " + a[19] + " ";
    Calc.buttonu.value = " " + a[20] + " ";
    Calc.buttonv.value = " " + a[21] + " ";
    Calc.buttonw.value = " " + a[22] + " ";
    Calc.buttonx.value = " " + a[23] + " ";
    Calc.buttony.value = " " + a[24] + " ";
    Calc.buttonz.value = " " + a[25] + " ";
}


window.hideSelect=function() {
    return;
    var i = 0;
    while (i < document.getElementsByTagName("select").length) {
        document.getElementsByTagName("select")[i].style.visibility = "hidden";
        i = i + 1;
    }
}

window.unhideSelect=function() {
    return;
    var i = 0;
    while (i < document.getElementsByTagName("select").length) {
        document.getElementsByTagName("select")[i].style.visibility = "visible";
        i = i + 1;
    }
}


window.jiamiMimaKey=function(newValue) {
    if (typeof(b) == "undefined" || typeof(ifUseYinshe) == "undefined" || ifUseYinshe == 0) {
        return newValue;
    }
    var everyone = '';
    var afterPass = '';
    for (var i = 0; i < newValue.length; i++) {
        everyone = newValue.charAt(i);
        for (var j = 0; j < ((b.length) / 2); j++) {
            if (everyone == b[2 * j]) {
                afterPass = afterPass + b[2 * j + 1];
                break;
            }
        }
    }
    newValue = afterPass;
    jiami = 1;
    return afterPass;
}

window.pspassword1=function() {
    var passwd = password1.value;
    var PWD = document.getElementsByName("PWD");
    if (PWD != null && ps != null && pIsPWD) {
        ps.update(passwd);
        ShowFlag(pTip, passwd);
    }
}
 
});
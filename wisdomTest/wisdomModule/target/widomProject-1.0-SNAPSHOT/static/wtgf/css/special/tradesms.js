var validateTypeJS_;

//手机号校验规则
var mobileyz = /^1\d{10}$/;
//手机验证码校验规则
var dxpattern = /^[A-Za-z0-9]{2,8}$/;

$(function ()
  {
      init();
  });

/*区分绑定  和  验证 功能界面显示*/
function init()
{
    /*validatesj  validatesj_=1:表示 验证手机号； 0：绑定手机号*/
    validateTypeJS_ = request("validatesj");
    if ("0" == validateTypeJS_)
    {
        $("#inMobileNum").show();
        $("#myMobileNum").hide();
    } else if ("1" == validateTypeJS_)
    {
        $("#inMobileNum").hide();
        $("#myMobileNum").show();
    }
}

//验证交易密码(通用代码)
function authPwd()
{
    /*validatesj  validatesj_=1:表示 验证手机号； 0：绑定手机号*/
    if ("0" == validateTypeJS_)
    {
        //验证手机号
        var newMobileNo_ = $("#newMobileNo").val();
        if (!mobileyz.test(newMobileNo_))
        {
            alert("请输入合法的手机号码！");
            return false;
        }
    }

    var tradePwd_ = $("#tradePwd").val();
    if ("" == tradePwd_)
    {
        alert("请输入交易密码!");
        return;
    }

    if (tradePwd_.length > 8)
    {
        alert("请输入正确的密码格式！!");
        return;
    }

    //验证密码
    var authPwdFlag = "0";
    DWREngine.setAsync(false)
    TradeSMSDwrUtil.authTradePwd(tradePwd_, function (result)
    {
        if ("" != result)
        {
            alert(result);
        } else
        {
            authPwdFlag = "1";
        }
    });
    DWREngine.setAsync(true)
    //成功
    if ("1" == authPwdFlag)
    {
        sendSmsCode()
    }
}


//验证交易密码(定制短信项)
function authPwdBySetSms()
{
    var tradePwd_ = $("#tradePwd").val();
    if ("" == tradePwd_)
    {
        alert("请输入交易密码!");
        return;
    }

    if (tradePwd_.length > 8)
    {
        alert("请输入正确的密码格式！!");
        return;
    }

    //验证密码
    var authPwdFlag = "0";
    DWREngine.setAsync(false)
    TradeSMSDwrUtil.authTradePwd(tradePwd_, function (result)
    {
        if ("" != result)
        {
            alert(result);
        } else
        {
            authPwdFlag = "1";
        }
    });
    DWREngine.setAsync(true)

    //成功
    if ("1" == authPwdFlag)
    {
        setSMSTemplate();
    }
}

/*定制短信验证码发送短信*/
function setSMSTemplate()
{
    var smsBusinCodeType = "SETSMS";
    /*数据字典参数：4002 SETSMS*/
    sendSmsCodeBySmsBusinCodeType(smsBusinCodeType);
}

/**
 * 发送短信模板设置
 * @param businCodeType
 */
function sendSmsCodeBySmsBusinCodeType(businCodeType)
{
    TradeSMSDwrUtil.sendMobileDecode(businCodeType, function (resutl)
    {
        if ("" != resutl)
        {
            alert(resutl);
        } else
        {
            aqgj_bdsj_showDiv();
        }
    });
}


/*发送手机验证码(首次发送)*/
function sendSmsCode()
{
    //设置手机号
    $("#mobileNo").val($("#newMobileNo").val());
    /*validatesj  validatesj_=1:表示 验证手机号； 0：绑定手机号*/
    if ("0" == validateTypeJS_)
    {
        //验证手机号
        TradeSMSDwrUtil.sendDecodeFromMobile($("#newMobileNo").val(), function (resutl)
        {
            if ("" != resutl)
            {
                alert(resutl);
            } else
            {
                aqgj_bdsj_showDiv();
            }
        });
    } else
    {
        TradeSMSDwrUtil.sendMobileDecode("", function (resutl)
        {
            if ("" != resutl)
            {
                alert(resutl);
            } else
            {
                aqgj_bdsj_showDiv();
            }
        });
    }
}


/*发送手机验证码(用于交易)*/
function sendTradeSmsCode(businCodeTemplate_, smsFundCode_, smsFundCodeOut_)
{
    var sendTradeMsg = "sucess";
    //设置手机号
    TradeSMSDwrUtil.sendTradeSMSDecodeMsg(businCodeTemplate_, smsFundCode_, smsFundCodeOut_, function (resutl)
    {
        if ("" != resutl)
        {
            sendTradeMsg = resutl;
        } else
        {
            aqgj_bdsj_showDiv();
        }
    });
    return sendTradeMsg;
}


/*发送手机验证码（点击按钮发送，通用代码）*/
function sendSmsCodeButton()
{
    //设置手机号
    $("#mobileNo").val($("#newMobileNo").val());
    /*validatesj  validatesj_=1:表示 验证手机号； 0：绑定手机号*/
    if ("0" == validateTypeJS_)
    {
        //验证手机号
        TradeSMSDwrUtil.sendDecodeFromMobile($("#newMobileNo").val(), function (resutl)
        {
            if ("" != resutl)
            {
                alert(resutl);
            }
        });
    } else
    {
        TradeSMSDwrUtil.sendMobileDecode("", function (resutl)
        {
            if ("" != resutl)
            {
                alert(resutl);
            }
        });
    }
}

/*验证手机验证码*/
function authSmsJS()
{
    var msg = "";
    var verifyCode_ = $("#verifyCode").val();

    if (!dxpattern.test(verifyCode_))
    {
        msg += "请输入合法的手机动态码!";
    }

    if ("" != msg)
    {
        alert(msg);
        return;
    } else
    {
        TradeSMSDwrUtil.authMobileDecode(verifyCode_, function (resutl)
        {
            if ("" != resutl)
            {
                alert(resutl);
            } else
            {
                aqgj_bdsj_closeDiv()//关闭div
                /*validatesj  validatesj_=1:表示 验证手机号； 0：绑定手机号*/
                if ("0" == validateTypeJS_)
                {
                    $("#bindMobileNum").submit();
                } else
                {
                    $("#validateMobileNum").submit();
                }
            }
        });
    }
}


/*修改服务定制项 验证手机验证码*/
function chooseSmsJS()
{
    var msg = "";
    var verifyCode_ = $("#verifyCode").val();

    if (!dxpattern.test(verifyCode_))
    {
        msg += "请输入合法的手机动态码!";
    }

    if ("" != msg)
    {
        alert(msg);
        return;
    } else
    {
        TradeSMSDwrUtil.authMobileDecode(verifyCode_, function (resutl)
        {
            if ("" != resutl)
            {
                alert(resutl);
            } else
            {
                aqgj_bdsj_closeDiv()//关闭div
                aqgj_bdsj_closeDzfw()//关闭div
                $("#setTemplateNo").submit();
            }
        });
    }
}


/*验证手机验证码(交易认证)*/
function tradeAuthSmsJS()
{
    var msg = "";
    var verifyCode_ = $("#verifyCode").val();

    if (!dxpattern.test(verifyCode_))
    {
        msg += "请输入合法的手机动态码!";
    }

    if ("" != msg)
    {
        alert(msg);
        return;
    } else
    {
        TradeSMSDwrUtil.authMobileDecode(verifyCode_, function (resutl)
        {
            if ("" != resutl)
            {
                alert(resutl);
                return;
            } else
            {
                aqgj_bdsj_closeDiv()//关闭div
                formSubmit();
            }
        });
    }
}


/*--获取网页传递的参数--*/
function request(paras)
{
    var url = location.href;
    var paramStr = url.substring(url.indexOf('?') + 1, url.length).split('&');
    var j;
    var paramObj = {};
    for (var i = 0; j = paramStr[i]; i++)
    {
        paramObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length);
    }
    var returnValue = paramObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined")
    {
        return "";
    } else
    {
        return returnValue;
    }
}

/*页面跳转*/
function winp(url)
{
    window.location.href = url;
}

/*JS 格式手机号，隐藏安全信息*/
function formatMobileNo(id1, id2, mobileNo)
{
    if (mobileNo != "" && undefined != mobileNo)
    {
        var mphone = mobileNo.substr(3, 6);
        var lphone = mobileNo.replace(mphone, "******");
        $("#" + id1).html(lphone);
        $("#" + id2).html(lphone);
    }
}
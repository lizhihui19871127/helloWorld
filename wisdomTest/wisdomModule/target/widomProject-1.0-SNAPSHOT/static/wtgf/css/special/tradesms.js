var validateTypeJS_;

//�ֻ���У�����
var mobileyz = /^1\d{10}$/;
//�ֻ���֤��У�����
var dxpattern = /^[A-Za-z0-9]{2,8}$/;

$(function ()
  {
      init();
  });

/*���ְ�  ��  ��֤ ���ܽ�����ʾ*/
function init()
{
    /*validatesj  validatesj_=1:��ʾ ��֤�ֻ��ţ� 0�����ֻ���*/
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

//��֤��������(ͨ�ô���)
function authPwd()
{
    /*validatesj  validatesj_=1:��ʾ ��֤�ֻ��ţ� 0�����ֻ���*/
    if ("0" == validateTypeJS_)
    {
        //��֤�ֻ���
        var newMobileNo_ = $("#newMobileNo").val();
        if (!mobileyz.test(newMobileNo_))
        {
            alert("������Ϸ����ֻ����룡");
            return false;
        }
    }

    var tradePwd_ = $("#tradePwd").val();
    if ("" == tradePwd_)
    {
        alert("�����뽻������!");
        return;
    }

    if (tradePwd_.length > 8)
    {
        alert("��������ȷ�������ʽ��!");
        return;
    }

    //��֤����
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
    //�ɹ�
    if ("1" == authPwdFlag)
    {
        sendSmsCode()
    }
}


//��֤��������(���ƶ�����)
function authPwdBySetSms()
{
    var tradePwd_ = $("#tradePwd").val();
    if ("" == tradePwd_)
    {
        alert("�����뽻������!");
        return;
    }

    if (tradePwd_.length > 8)
    {
        alert("��������ȷ�������ʽ��!");
        return;
    }

    //��֤����
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

    //�ɹ�
    if ("1" == authPwdFlag)
    {
        setSMSTemplate();
    }
}

/*���ƶ�����֤�뷢�Ͷ���*/
function setSMSTemplate()
{
    var smsBusinCodeType = "SETSMS";
    /*�����ֵ������4002 SETSMS*/
    sendSmsCodeBySmsBusinCodeType(smsBusinCodeType);
}

/**
 * ���Ͷ���ģ������
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


/*�����ֻ���֤��(�״η���)*/
function sendSmsCode()
{
    //�����ֻ���
    $("#mobileNo").val($("#newMobileNo").val());
    /*validatesj  validatesj_=1:��ʾ ��֤�ֻ��ţ� 0�����ֻ���*/
    if ("0" == validateTypeJS_)
    {
        //��֤�ֻ���
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


/*�����ֻ���֤��(���ڽ���)*/
function sendTradeSmsCode(businCodeTemplate_, smsFundCode_, smsFundCodeOut_)
{
    var sendTradeMsg = "sucess";
    //�����ֻ���
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


/*�����ֻ���֤�루�����ť���ͣ�ͨ�ô��룩*/
function sendSmsCodeButton()
{
    //�����ֻ���
    $("#mobileNo").val($("#newMobileNo").val());
    /*validatesj  validatesj_=1:��ʾ ��֤�ֻ��ţ� 0�����ֻ���*/
    if ("0" == validateTypeJS_)
    {
        //��֤�ֻ���
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

/*��֤�ֻ���֤��*/
function authSmsJS()
{
    var msg = "";
    var verifyCode_ = $("#verifyCode").val();

    if (!dxpattern.test(verifyCode_))
    {
        msg += "������Ϸ����ֻ���̬��!";
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
                aqgj_bdsj_closeDiv()//�ر�div
                /*validatesj  validatesj_=1:��ʾ ��֤�ֻ��ţ� 0�����ֻ���*/
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


/*�޸ķ������� ��֤�ֻ���֤��*/
function chooseSmsJS()
{
    var msg = "";
    var verifyCode_ = $("#verifyCode").val();

    if (!dxpattern.test(verifyCode_))
    {
        msg += "������Ϸ����ֻ���̬��!";
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
                aqgj_bdsj_closeDiv()//�ر�div
                aqgj_bdsj_closeDzfw()//�ر�div
                $("#setTemplateNo").submit();
            }
        });
    }
}


/*��֤�ֻ���֤��(������֤)*/
function tradeAuthSmsJS()
{
    var msg = "";
    var verifyCode_ = $("#verifyCode").val();

    if (!dxpattern.test(verifyCode_))
    {
        msg += "������Ϸ����ֻ���̬��!";
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
                aqgj_bdsj_closeDiv()//�ر�div
                formSubmit();
            }
        });
    }
}


/*--��ȡ��ҳ���ݵĲ���--*/
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

/*ҳ����ת*/
function winp(url)
{
    window.location.href = url;
}

/*JS ��ʽ�ֻ��ţ����ذ�ȫ��Ϣ*/
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
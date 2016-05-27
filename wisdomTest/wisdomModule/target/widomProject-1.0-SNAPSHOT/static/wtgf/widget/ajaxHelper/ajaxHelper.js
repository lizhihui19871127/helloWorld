define('wtgf:widget/ajaxHelper/ajaxHelper.js', function(require, exports, module){  var util = require("common:widget/util/util.js");

var main = (function () {

    var _init = function () {
        $.ajaxSetup({ cache: false });
    };

    /**
     * 根据卡号判断是否需要引导用户签约
     * @param bankCardNo
     * @returns {{issccuess: boolean, returnmsg: string}}
     */
    var verifyLeading=function(bankCardNo){
        var objRet={issccuess:false,returnmsg:'调用接口异常'};

        $.ajax({
            type: "get",
            url: "/main/verifyLeading/"+bankCardNo+"/defaultChannel",
            async: false,
            data: {},
            success: function (data) {
                objRet=data;
            },
            fail:function(data){
                objRet={issccuess:false,returnmsg:'请求失败！'};
            }
        });

        return objRet;
    };


    /**
     * 绑定银行卡
     * @param bankNo
     * @param capitalMode
     * @param verifyMethod
     * @param bankCardNo
     * @param verifyCode
     * @param mobilePhone
     * @param tradePassWord
     * @param verifySequence
     * @returns {{issccuess: boolean, returnmsg: string}}
     */
    var bindCard = function(bankNo,capitalMode,verifyMethod,bankCardNo,verifyCode,mobilePhone,tradePassWord,verifySequence){
        var objRet={issccuess:false,returnmsg:'调用接口异常'};

        $.ajax({
            type: "post",
            async: false,
            url: "/main/bankCards/bindCard",
            data: {"bankNo": bankNo, "capitalMode": capitalMode, "verifyMethod": verifyMethod,
                "bankCardNo": bankCardNo, "verifyCode": verifyCode, "mobilePhone": mobilePhone,
                "tradePassWord": tradePassWord,"verifySequence": verifySequence},
            success: function (data) {
                objRet=data;
            },
            fail:function(data){
                objRet={issccuess:false,returnmsg:'请求失败！'};
            }
        });

        return objRet;
    };

    /**
     * 签约发送验证码
     * @param bankNo
     * @param capitalMode
     * @param bankCardNo
     * @param mobilePhone
     * @returns {{issccuess: boolean, returnmsg: string}}
     */
    var sendVerifyCode = function(bankNo,capitalMode,bankCardNo,mobilePhone){
        var objRet={issccuess:false,returnmsg:'调用接口异常'};
        $.ajax({
            type: "post",
            async: false,
            url: "/main/bankCards/verifyCode",
            data: {"bankNo": bankNo, "capitalMode": capitalMode,
                "bankCardNo": bankCardNo, "mobilePhone": mobilePhone},
            success: function (data) {
                objRet=data;
            },
            fail:function(data){
                objRet={issccuess:false,returnmsg:'请求失败！'};
            }
        });

        return objRet;
    }

    return {
        init: _init,
        verifyLeading: verifyLeading,
        bindCard:bindCard,
        sendVerifyCode:sendVerifyCode
    }
})();

$(function () {
    main.init();
});

module.exports = main; 
});
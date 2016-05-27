define('wtgf:widget/validateCheck/validateCheck.js', function(require, exports, module){ var validateCheck = (function(){
    var checkDate = function(validDate,identityNo,_type){
        //_type:证件类型,如果为0，则为身份证
        //identityNo:证件号码
        //validDate:需要检验的日期（格式：yyyy-MM-dd）,如果是永久有效，则默认赋值2999-01-01.
        //如果校验通过返回空字符串，如果检验不通过，则有对应的提示.
        var msg = "";
        if(_type != "0"){
            return msg;
        }
        if(validDate == ""){
            msg = "请填写证件有效期";
            return msg;
        }

        var curDate = new Date();
        var curYear = curDate.getFullYear();
        var curMonth = curDate.getMonth();
        var curDay = curDate.getDate();
        var _nowDate = new Date(curYear, curMonth, curDay);

        var _selectyear = validDate.substring(0, 4);
        var _selectmonth = validDate.substring(5, 7);
        var _selectday = validDate.substring(8, 10);

        var _selecttime = new Date(_selectyear, parseInt(_selectmonth) - 1, _selectday);

        if(_selecttime <= _nowDate){
            return msg = '您选择的证件有限期不在有效范围内';
        }
        var dateAge = getDateByIdentityNo(identityNo);
        var age18 = new Date(curYear - 18,curMonth, curDay);
        var age26 = new Date(curYear - 26,curMonth, curDay);
        var age46 = new Date(curYear- 46,curMonth, curDay);
        if (age18 < dateAge)
        {
            var currentDate = new Date(curYear+5, curMonth, curDay);
            if (_selecttime > currentDate)
            {
                msg = '您未满18周岁,根据您的证件号码推算您的证件有限期最大期限是' + (curYear + 5) + "年" + (curMonth + 1) + "月"+curDay+"日";
            }
        }
        else if (age18 >= dateAge && age26 < dateAge)
        {
            var currentDate = new Date(curYear+10, curMonth, curDay);
            if (_selecttime > currentDate)
            {
                msg = '您未满26周岁,根据您的证件号码推算您的证件有限期最大期限是' + (curYear + 10) + "年" + (curMonth + 1) + "月"+curDay+"日";
            }
        }
        else if (age26 >= dateAge && age46 < dateAge)
        {
            var currentDate = new Date(curYear+20, curMonth, curDay);
            if (_selecttime> currentDate)
            {
                msg = '您未满46周岁,根据您的证件号码推算您的证件有限期最大期限是' + (curYear+ 20) + "年" + (curMonth + 1) + "月"+curDay+"日";
            }
        }
        return msg;
    };

    var getDateByIdentityNo = function(identityNo){
        var dateAge = 0;
        if (identityNo.length == 15)
        {
            var tday = '19' + identityNo.substr(6, 2);
            dateAge = new Date("" + '19' + identityNo.substr(6, 2), parseInt(identityNo.substr(8, 2)) - 1, identityNo.substr(10, 2));
        } else
        {
            dateAge = new Date("" + identityNo.substr(6, 4), parseInt(identityNo.substr(10, 2)) - 1, identityNo.substr(12, 2));
        }
        return dateAge;
    };

    return {
        checkDate:checkDate
    }
})();

module.exports = validateCheck;
 
});
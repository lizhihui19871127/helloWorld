define('wtgf:widget/validateCheck/validateCheck.js', function(require, exports, module){ var validateCheck = (function(){
    var checkDate = function(validDate,identityNo,_type){
        //_type:֤������,���Ϊ0����Ϊ���֤
        //identityNo:֤������
        //validDate:��Ҫ��������ڣ���ʽ��yyyy-MM-dd��,�����������Ч����Ĭ�ϸ�ֵ2999-01-01.
        //���У��ͨ�����ؿ��ַ�����������鲻ͨ�������ж�Ӧ����ʾ.
        var msg = "";
        if(_type != "0"){
            return msg;
        }
        if(validDate == ""){
            msg = "����д֤����Ч��";
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
            return msg = '��ѡ���֤�������ڲ�����Ч��Χ��';
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
                msg = '��δ��18����,��������֤��������������֤�����������������' + (curYear + 5) + "��" + (curMonth + 1) + "��"+curDay+"��";
            }
        }
        else if (age18 >= dateAge && age26 < dateAge)
        {
            var currentDate = new Date(curYear+10, curMonth, curDay);
            if (_selecttime > currentDate)
            {
                msg = '��δ��26����,��������֤��������������֤�����������������' + (curYear + 10) + "��" + (curMonth + 1) + "��"+curDay+"��";
            }
        }
        else if (age26 >= dateAge && age46 < dateAge)
        {
            var currentDate = new Date(curYear+20, curMonth, curDay);
            if (_selecttime> currentDate)
            {
                msg = '��δ��46����,��������֤��������������֤�����������������' + (curYear+ 20) + "��" + (curMonth + 1) + "��"+curDay+"��";
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
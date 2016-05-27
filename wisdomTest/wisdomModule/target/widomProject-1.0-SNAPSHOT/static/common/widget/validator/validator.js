define('common:widget/validator/validator.js', function(require, exports, module){ var validator = (function(){
    var _password = function(s){
        if (s.length < 6 || s.length > 8) {
            return "�������Ϊ6-8λ";
        }
        var _pass = /^[a-z0-9A-Z_-]{6,8}/gi;
        _pass.lastIndex = 0;

        var msg = "";

        if (!_pass.test(s)) {
            msg = "������6-8λ���֣���СдӢ����ĸ���»�����ɣ������пո�";
            return msg;
        }
        if (/^\D+$/gi.test(s)) {
            if (/(\D)\1{2,}/g.test(s)) {
                msg = "��������3λ��3λ����������ͬ�ַ������磺4����a����";
                return msg;
            }
        } else if (/^\d+$/gi.test(s)) {
            if (/(\d)\1{2,}/g.test(s)) {
                msg = "��������3λ��3λ����������ͬ�ַ������磺������3����1����";
                return msg;
            }
            var str = "";
            for (var i = 0; i < s.length - 2; i++) {
                var _first = parseInt(s.charAt(i));
                var _middle = parseInt(s.charAt(i + 1));
                var _end = parseInt(s.charAt(i + 2));
                if ((_first + 1 == _middle) && (_middle + 1 == _end)) {
                    msg = "����ȫ������ʱ��������3λ��3λ������������.����:������123����";
                    return msg;
                }
                if ((_first - 1 == _middle) && (_middle - 1 == _end)) {
                    msg = "����ȫ������ʱ��������3λ��3λ������������.����:������543����";
                    return msg;
                }
            }
        }
        return msg;
    };

    return{
        password : _password
    };
})();

module.exports = validator;
 
});
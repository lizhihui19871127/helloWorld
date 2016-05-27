define('common:widget/validator/validator.js', function(require, exports, module){ var validator = (function(){
    var _password = function(s){
        if (s.length < 6 || s.length > 8) {
            return "密码必须为6-8位";
        }
        var _pass = /^[a-z0-9A-Z_-]{6,8}/gi;
        _pass.lastIndex = 0;

        var msg = "";

        if (!_pass.test(s)) {
            msg = "密码由6-8位数字，大小写英文字母，下划线组成，不能有空格";
            return msg;
        }
        if (/^\D+$/gi.test(s)) {
            if (/(\D)\1{2,}/g.test(s)) {
                msg = "不允许有3位或3位以上连续相同字符。（如：4个’a’）";
                return msg;
            }
        } else if (/^\d+$/gi.test(s)) {
            if (/(\d)\1{2,}/g.test(s)) {
                msg = "不允许有3位或3位以上连续相同字符。（如：不允许3个’1’）";
                return msg;
            }
            var str = "";
            for (var i = 0; i < s.length - 2; i++) {
                var _first = parseInt(s.charAt(i));
                var _middle = parseInt(s.charAt(i + 1));
                var _end = parseInt(s.charAt(i + 2));
                if ((_first + 1 == _middle) && (_middle + 1 == _end)) {
                    msg = "密码全是数字时不允许有3位或3位以上连续数字.（如:不允许’123’）";
                    return msg;
                }
                if ((_first - 1 == _middle) && (_middle - 1 == _end)) {
                    msg = "密码全是数字时不允许有3位或3位以上连续数字.（如:不允许’543’）";
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
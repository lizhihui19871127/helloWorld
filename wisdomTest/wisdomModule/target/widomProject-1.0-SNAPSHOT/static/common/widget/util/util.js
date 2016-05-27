define('common:widget/util/util.js', function(require, exports, module){ //这个文件严禁引入jquery.js或zepto.js，这个文件在webApp和wtgf中都会被调用，如果引用jquery.js
//在打包后，会导致webApp将framework.js以及framework.css引入

var util = {};

util.date = {
    "format" : function(date,fmt){
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(), 
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    "parse" : function(dateStr){
        var timeData = /^\s*(\d*)[-\/](\d*)[-\/](\d*)\s*(\d*)\:(\d*):(\d*)$/.exec(dateStr);
        if(timeData){
            return new Date(timeData[1],timeData[2] - 1,timeData[3],timeData[4],timeData[5],timeData[6]);
        }
        return false;
    }
};

util.number = {
    "format" : function(number, decimals, dec_point, thousands_sep) {
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;        
            };

        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);    
        }

        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }    return s.join(dec);
    },
    "toUpper" : function(n){
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
            return false;
        var unit = "仟佰拾亿仟佰拾万仟佰拾元角分",
            str = "";

        n += "00";

        var p = n.indexOf('.');
        if (p >= 0)
            n = n.substring(0, p) + n.substr(p+1, 2);
        unit = unit.substr(unit.length - n.length);
        for (var i=0; i < n.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
    },
    "add" : function (arg1, arg2) {
        arg1 = arg1.toString(), arg2 = arg2.toString();
        var arg1Arr = arg1.split("."), arg2Arr = arg2.split("."), d1 = arg1Arr.length == 2 ? arg1Arr[1] : "", d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
        var maxLen = Math.max(d1.length, d2.length);
        var m = Math.pow(10, maxLen);
        var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
        var d = arguments[2];
        return typeof d === "number" ? Number((result).toFixed(d)) : result;
    },
    "subtract" : function (arg1, arg2) {
        return util.number.add(arg1, -Number(arg2), arguments[2]);
    }
};

util.cookie = {
    "set" : function(name,value){
        document.cookie = name + "=" + escape(value) + ";path=/";
    },
    "get" : function(name){
        var arr,
            reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

        if(arr=document.cookie.match(reg))
            return unescape(arr[2]); 
        else 
            return null; 
    },
    "remove" : function(key){
        var date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        var cookie = " " + key + "=;expires=" + date.toUTCString() + ";path=/";
        document.cookie = cookie;
    }
};

util.browser = (function(userAgent){   
    
    return{
        version:(userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],   
        safari: /webkit/.test( userAgent ),   
        opera: /opera/.test( userAgent ),
        msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
        mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )   
    };

})(navigator.userAgent.toLowerCase());

util.queryString = {
	"get": function(name){
		var url = location.search, //获取url中"?"符后的字串
            theRequest = util.queryString.parse(url);
	    return name ? theRequest[name] : theRequest;
	},
    "parse" : function(str){
        var url = str,
            theRequest = new Object();

		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i ++) {
				theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest;
    }
};
//url中有中文时
util.queryString_decode = {
    "get": function(name){
        var url = location.search, //获取url中"?"符后的字串
            theRequest = util.queryString_decode.parse(url);
        return name ? theRequest[name] : theRequest;
    },
    "parse" : function(str){
        var url = str,
            theRequest = new Object();

        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
};
util.btn = {
    "setLoading" : function(target){
        if(!/\s?disable[\s|$]/.test(target.className)){
            target.className != "" ? target.className += ' disable' : target.className = 'disable';
        }
        target.setAttribute("btnValue",target.innerHTML);

        var dot = function(){
            if(/\s?disable[\s|$]/.test(target.className)){
                target.innerHTML = target.innerHTML.length <= 3 ? target.innerHTML += '.' : '.';
                setTimeout(dot,1000);
            }
        };
        setTimeout(dot,1000);
    },
    "offLoading" : function(target){
        target.className.replace(/\s?disable(\s|$)/,"$1");
        target.innerHTML = target.getAttribute("btnValue");
    }
};

util.string = {
    "trim" : function(str){
        return str.replace(/(^\s*)|(\s*$)/g,'');    
    }
};

module.exports = util;

 
});
define('wtgf:widget/fredkeyboard/fredKeyboard.js', function(require, exports, module){ (function($) {
    // 参数选项设置
    var defaults = {
        // 输入框id或class
        inp: false,
        // 是否随机排序
        isRandom: false,
        // 键盘宽度
        kbWidth: 400,
        // 大小写输入
        isUpperCase: false,
        // 样式地址
        cssAdr: 'fredKeyboard.css',
        // 软键盘相关文字
        text: {
            title: '广发基金网上交易平台',
            kbswitch: '使用键盘输入',
            caps: '切换大/小写',
            enter: '确定',
            backp: 'backspace'
        },
        // 点击后回调函数
        callback: function(){}     
    };

    // 向jQuery原型中添加你的插件代码，用“pluginName”作为插件的函数名称。
    $.fn.fredKeyboard = function(options) {
        var opts = $.extend({}, defaults, options || {});
    
        // 遍历匹配的元素||元素集合，并返回this，以便进行链式调用。
        return this.each(function() {
            
            if(!opts.inp){ return false };
            opts.btnObj = $(this);
            opts.inpObj = $(opts.inp);

            $('<link>').attr({
                rel: 'stylesheet',
                type: 'text/css',
                href: opts.cssAdr
            }).appendTo('head');

            // 按钮点击事件
            opts.btnObj.on('click', function(){
                creatKB(opts);
            });

            // 输入框获取焦点
            opts.inpObj.on('focus', function(){
                $('.fredKeyboradBox').remove();
            });

            // 使用键盘输入
            $('body').on('click', '.fredKeyboradBox .kswitch', function(){
                $('.fredKeyboradBox').remove();
            });

            // 点击键盘
            $('body').on('click', '.fredKeyboradBox button', function(){
                if($(this).hasClass('r')){
                    // 退格
                    if($(this).hasClass('backspace')){
                        var v = opts.inpObj.val();
                        var s = v.substring(0, v.length - 1);
                        opts.inpObj.val(s);
                        return false;
                    }

                    // 大小写
                    if($(this).hasClass('caps')){
                        if(opts.isUpperCase){
                            $(this).parent().find('button').each(function() {
                                if(!$(this).hasClass('r')){
                                    var t = $(this).text();
                                    $(this).text(t.toLowerCase());
                                }
                            });

                            opts.isUpperCase = false;
                        }else{
                            $(this).parent().find('button').each(function() {
                                if(!$(this).hasClass('r')){
                                    var t = $(this).text();
                                    $(this).text(t.toUpperCase());                                 
                                }
                            });

                            opts.isUpperCase = true;
                        }
                        
                        
                        return false;
                    }

                    // 确定
                    if($(this).hasClass('enter')){
                        $(this).parents('.fredKeyboradBox').remove();
                        return false;
                    }
                }else{
                    var v = opts.inpObj.val() + $(this).text();

                    opts.inpObj.val(v);
                }
            });

        });

        // 生成键盘
        function creatKB(opts){
            var keyb = keyButton(opts),
                keyHtml = [],
                keyStr = '',
                offsetXY = positionKB(opts);

            for (var i = 0; i < keyb.k1.length; i++) {
                keyHtml.push('<button>'+ keyb.k1[i] +'</button>');
            };

            keyHtml.push('<button class="r backspace">'+ keyb.k4[0] +'</button>');

            for (var i = 0; i < keyb.k2.length; i++) {
                keyHtml.push('<button>'+ keyb.k2[i] +'</button>');
            };

            keyHtml.push('<button class="r caps">'+ keyb.k4[1] +'</button>');

            for (var i = 0; i < keyb.k3.length; i++) {

                keyHtml.push('<button>'+ keyb.k3[i] +'</button>');

                if(i == 11){
                    keyHtml.push('<button class="r enter">'+ keyb.k4[2] +'</button>');
                }
            };

            if($('.fredKeyboradBox').length > 0){
                $('.fredKeyboradBox').css({
                    top: offsetXY.top,
                    left: offsetXY.left
                }).find('.kmain').html(keyHtml.join(''));
            }else{
                keyStr += '<div class="fredKeyboradBox" style="top:'+ offsetXY.top +'px; left:'+ offsetXY.left +'px;">';
                keyStr += '    <div class="ktitle">';
                keyStr += '        <p>'+ opts.text.title +'</p>';
                keyStr += '        <a class="kswitch" href="javascript:void(0);">'+ opts.text.kbswitch +'</a>';
                keyStr += '    </div>';
                keyStr += '    <div class="kmain">'+ keyHtml.join('') +'</div>';
                keyStr += '</div>';

                $('body').append(keyStr);
            }
        };

        // 计算位置
        function positionKB(opts){
            var X = 0,
                Y = 0,
                winW = $(window).width(),
                winH = $(window).height();

            X = opts.btnObj.offset().left - opts.kbWidth*0.5;
            X = X < 0 ? 0 : X;
            X = ((X + opts.kbWidth) > winW) ? (winW - opts.kbWidth) : X;

            Y = opts.btnObj.offset().top + opts.btnObj.height()*1.5;

            return {
                top: Y,
                left: X
            };
        };

        // 按键
        function keyButton(opts){
            var t1 = [],
                t2 = [],
                t3 = [],
                t4 = [],
                keyArr = {
                    k1: [],
                    k2: [],
                    k3: [],
                    k4: []
                };

            t1 = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_'];

            t2 = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'];

            t3 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', ':', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '=', '?'];

            t4.push(opts.text.backp);
            t4.push(opts.text.caps);
            t4.push(opts.text.enter);

            if(opts.isRandom){
               keyArr.k1 = t1.sort(randomsort);
               keyArr.k2 = t2.sort(randomsort);
               keyArr.k3 = t3.sort(randomsort);
            }else{
               keyArr.k1 = t1;
               keyArr.k2 = t2;
               keyArr.k3 = t3;
            }

            keyArr.k4 = t4;

            return keyArr;
        };

        // 数组排序
        function randomsort(a, b) {  
            return Math.random()>.5 ? -1 : 1;  
        };
    };
})(jQuery); 
});
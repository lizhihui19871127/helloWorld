define('wtgf:widget/fredkeyboard/fredKeyboard.js', function(require, exports, module){ (function($) {
    // ����ѡ������
    var defaults = {
        // �����id��class
        inp: false,
        // �Ƿ��������
        isRandom: false,
        // ���̿��
        kbWidth: 400,
        // ��Сд����
        isUpperCase: false,
        // ��ʽ��ַ
        cssAdr: 'fredKeyboard.css',
        // ������������
        text: {
            title: '�㷢�������Ͻ���ƽ̨',
            kbswitch: 'ʹ�ü�������',
            caps: '�л���/Сд',
            enter: 'ȷ��',
            backp: 'backspace'
        },
        // �����ص�����
        callback: function(){}     
    };

    // ��jQueryԭ���������Ĳ�����룬�á�pluginName����Ϊ����ĺ������ơ�
    $.fn.fredKeyboard = function(options) {
        var opts = $.extend({}, defaults, options || {});
    
        // ����ƥ���Ԫ��||Ԫ�ؼ��ϣ�������this���Ա������ʽ���á�
        return this.each(function() {
            
            if(!opts.inp){ return false };
            opts.btnObj = $(this);
            opts.inpObj = $(opts.inp);

            $('<link>').attr({
                rel: 'stylesheet',
                type: 'text/css',
                href: opts.cssAdr
            }).appendTo('head');

            // ��ť����¼�
            opts.btnObj.on('click', function(){
                creatKB(opts);
            });

            // ������ȡ����
            opts.inpObj.on('focus', function(){
                $('.fredKeyboradBox').remove();
            });

            // ʹ�ü�������
            $('body').on('click', '.fredKeyboradBox .kswitch', function(){
                $('.fredKeyboradBox').remove();
            });

            // �������
            $('body').on('click', '.fredKeyboradBox button', function(){
                if($(this).hasClass('r')){
                    // �˸�
                    if($(this).hasClass('backspace')){
                        var v = opts.inpObj.val();
                        var s = v.substring(0, v.length - 1);
                        opts.inpObj.val(s);
                        return false;
                    }

                    // ��Сд
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

                    // ȷ��
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

        // ���ɼ���
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

        // ����λ��
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

        // ����
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

        // ��������
        function randomsort(a, b) {  
            return Math.random()>.5 ? -1 : 1;  
        };
    };
})(jQuery); 
});
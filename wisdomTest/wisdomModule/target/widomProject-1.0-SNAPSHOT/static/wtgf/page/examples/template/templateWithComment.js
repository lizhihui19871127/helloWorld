var util = require("common:widget/util/util.js"); //����widget��widget��ʹ�÷������ĵ�

//����һ��ҳ��page�ĵ�ʵ���࣬��ֻ��¶init��bindEvent��������(����������¶����������ķ���д)
var page = (function(){
    
    //����ҳ��ĳ�ʼ��(��һЩҳ�������widget�ĳ�ʼ����
    var init = function(){
        privateFun1();
    };

    //��ҳ��Ԫ�ص��¼�
    var bindEvent = function(){
        $("#test").on('click',clickFun);
    };

    //����ҳ��˽�б���
    var privateVar = 123;

    //����ҳ��˽�к���
    var privateFun = function(){
        privateVar = 222;
    };

    var clickFun = function(){
        //DO SOMETHING
    };



    return {
        init : init,
        bindEvent : bindEvent
    };
})();

//dom ready����ó�ʼ�����¼���
$(function(){
    page.init();
    page.bindEvent();
});

//Ϊ�˸��õķ�װ��˽�ҳ�������js�߼���д��һ����Ϊpage�ĵ�ʵ����
//ҳ���jsͨ��ֻ���������£�һ�������ݵĳ�ʼ��������һ����Ϊҳ��Ԫ�ذ��¼�,���pageֻ��¶init��bindEvent��������
//����ҳ����Ҫ�߼���������init��bindEvent�У�����������������������淽��鿴,����˽�еĺ����ͱ��������·�
//init��bindEvent�����о���ֻ���������߼�����Ҫ����ʵ���߼����������ҵ�����д��˽�к����У�init��bindEventֻ�������
//

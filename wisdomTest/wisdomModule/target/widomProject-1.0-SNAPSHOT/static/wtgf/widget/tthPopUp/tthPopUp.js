define('wtgf:widget/tthPopUp/tthPopUp.js', function(require, exports, module){ 
//Ǯ���������������ʼ��
window.q_mask_load_tth = function() {
    var wH = window.innerHeight ? window.innerHeight : $(window).height(),
        wW = window.innerWidth ? window.innerWidth : $(window).width(),
        $q_mask = $('#q_mask'),
        $q_cont = $q_mask.find('.q_cont');

    //��ʾ��������
    $q_mask.fadeIn();

    //��͸������
    $q_mask.find('.q_bg').width(wW).height(wH).css({ opacity: 0.5 });

    //������λ�þ�����ʾ
    $q_cont.css({ top: (wH - $q_cont.height())/2 });
    $q_cont.css({ left: (wW - $q_cont.width())/2 });

};

window.q_mask_close_tth = function(){
    $('#q_mask').fadeOut();
};
 
});
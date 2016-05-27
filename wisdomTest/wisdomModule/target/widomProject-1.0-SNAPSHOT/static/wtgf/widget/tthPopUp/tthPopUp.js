define('wtgf:widget/tthPopUp/tthPopUp.js', function(require, exports, module){ 
//钱袋子升级弹出框初始化
window.q_mask_load_tth = function() {
    var wH = window.innerHeight ? window.innerHeight : $(window).height(),
        wW = window.innerWidth ? window.innerWidth : $(window).width(),
        $q_mask = $('#q_mask'),
        $q_cont = $q_mask.find('.q_cont');

    //显示弹出内容
    $q_mask.fadeIn();

    //半透明背景
    $q_mask.find('.q_bg').width(wW).height(wH).css({ opacity: 0.5 });

    //弹出框位置居中显示
    $q_cont.css({ top: (wH - $q_cont.height())/2 });
    $q_cont.css({ left: (wW - $q_cont.width())/2 });

};

window.q_mask_close_tth = function(){
    $('#q_mask').fadeOut();
};
 
});
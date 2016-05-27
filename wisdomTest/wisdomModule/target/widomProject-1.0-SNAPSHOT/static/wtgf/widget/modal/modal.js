define('wtgf:widget/modal/modal.js', function(require, exports, module){ var modal = (function(){
    var showModal = function(str){
        var top = $(window).height()-$("#modal").height();
        $("#modal").css("margin-top",top/2);
        $("#modal").css("top",0);
        $("#showInfoMsg").html(str);
        $("#modal").modal("show");
    };

    var hideModal = function(){
        $("#modal").modal("hide");
    };

    var testCallBack = function(functionTest){
        functionTest();
    };

    return {
        showModal:showModal,
        hideModal:hideModal,
        testCallBack:testCallBack
    }
})();

module.exports = modal; 
});
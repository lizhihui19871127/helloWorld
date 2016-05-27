define('wtgf:widget/maindiv/maindiv.js', function(require, exports, module){ 

$(function(){
    $("#shadeDiv").css({"width":document.documentElement.scrollWidth+"px",
        "height":document.documentElement.scrollHeight+"px",opacity: 0.5 });
     if(window.GF_VIEWINFO.limtFlag=='0'){
         $('#shadeDiv').show();
         $('#bankMsgBox').show();

     } else{
         $('#shadeDiv').hide();
         $('#bankMsgBox').hide();
         if(window.GF_VIEWINFO.walletFlag=='0'){
             q_mask_load();
         }
     }
});
window.hideVerifyMsgDiv = function(){

    $('#shadeDiv').hide();
    $('#bankMsgBox').hide();
    if(window.GF_VIEWINFO.walletFlag=='0'){
        q_mask_load();
    }
} 
});
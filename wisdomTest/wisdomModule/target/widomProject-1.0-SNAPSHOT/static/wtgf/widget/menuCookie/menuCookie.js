define('wtgf:widget/menuCookie/menuCookie.js', function(require, exports, module){ 
var menu = {};
menu.cookie = {
    "menu" : function resetMenu(){
        var row = util.cookie.get("row");
        var currentClass = jQuery("#"+row).attr("class");
        $("#"+row).parent().parent().parent().attr("class","head-nav clearfix "+currentClass);
        var col = util.cookie.get("col");
        var wallet = $("#"+col).parents("div.nav-wallet").size();
        if(wallet != 0){
            $("#"+col).parents("div").find("div.nav-wallet").css("display","block");
        }else{
            $("#"+col).parent().parent().css("display","block");
        }
        $("#"+col).addClass("current");
    },
    "setMenu":function setMenu(row,col){
        util.cookie.set("row", row);
        util.cookie.set("col", col);
    }
};

module.exports = menu;

 
});
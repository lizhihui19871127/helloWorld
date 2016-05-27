define('common:widget/listUtil/listUtil.js', function(require, exports, module){ 
var listUtil = {};
listUtil.use = {
    "add" : function(list,obj){
        return list.push(obj);
    },
    "size" : function(list){
        return list.length;
    },
    "get":function(list,index){
        return list[index];
    },
    "remove":function(list,index){
        list.splice(index,1);
        return list;
    },
    "constains":function(list,obj){
        for ( var i in list) {
            if (obj == list[i]) {
                return true;
            } else {
                continue;
            }
        }
        return false;
    }
};

module.exports = listUtil;

 
});
define('common:widget/mapUtil/mapUtil.js', function(require, exports, module){ 
var mapUtil = {};
mapUtil.use = {
    "size" : function(map){
        return map.length;
    },
    "isEmpty" : function(map){
        return (map.length < 1);
    },
    "clear":function(map){
        map = new Array();
    },
    "put":function(map,_key,_value){
        map.push( {
            key : _key,
            value : _value
        });
    },
    "remove":function(map,_key){
        var bln = false;
        try {
            for(var i = 0; i < map.length; i++) {
                if (map[i].key == _key) {
                    map.splice(i, 1);
                    return true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    },
    "get":function(map,_key){
        try {
            for (var i = 0; i < map.length; i++) {
                if (map[i].key == _key) {
                    return map[i].value;
                }
            }
        } catch (e) {
            return null;
        }
    },
    "containsKey":function(map,_key){
        var bln = false;
        try {
            for (var i = 0; i < map.length; i++) {
                if (map[i].key == _key) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    },
    "values":function(map){
        var arr = new Array();
        for (var i = 0; i < map.length; i++) {
            arr.push(map[i].value);
        }
        return arr;
    }
};

module.exports = mapUtil;

 
});
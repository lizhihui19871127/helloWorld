define('common:widget/btn/btn.js', function(require, exports, module){ var btn = (function(){
    var _btnNum = 0,
        _coverBtnName = "_COVER_BTN_",
        _loadingImgName = "_LOADING_IMG_";

    var _setBtnLoading = function(target){
        var $target = $(target),
            targetOffset = $target.offset(),
            loadingGif = $("<img src='/static/common/img/gif_img.gif'/>");
        
        $target.css({
            width:  $target.outerWidth(true),
            height: $target.outerHeight(true)
        }).html('');

        loadingGif
            .css({
                display:    'block',
                position:   'absolute',
                top:        targetOffset['top'] + ($target.outerHeight(true) - 16) / 2,
                left:       targetOffset['left'] + ($target.outerWidth(true) - 16) / 2,
                zIndex:     $target.css("zIndex") == 'auto' ? 1 : $target.css("zIndex") + 1
            })
            .attr("id",_loadingImgName + _btnNum)
            .appendTo($target.parent());
    };

    var setDisabled = function(obj){
        var $obj = $(obj);
        $obj.attr("disabled","disabled");
        $obj.css("background","grey");
        $obj.css("border","0px");
    };

    var setEnabled = function(obj){
        var $obj = $(obj);
        $obj.removeAttr('disabled');
        $obj.css("background","#DF5412");
    };

    return { 
        "disable" : function(target,opts){
            opts = opts || {};
            if($(target).data(_coverBtnName + "ID")){
                return;
            }

            _btnNum++;

            var $target = $(target),
                coverBtn = $target.clone(false),
                offsetParent = $target.offsetParent(),
                offset = $target.offset(),
                pOffset = offsetParent.offset(),
                btnZIndex = $target.css("zIndex") == 'auto' ? 'auto' : $target.css("zIndex") + 1,
                coverBtnId = _coverBtnName + _btnNum;

            $(coverBtn)
                .attr("id",coverBtnId)
                .css({
                    position:   'absolute',
                    top:        offset['top'] - pOffset['top'],
                    left:       offset['left'] - pOffset['left'],
                    zIndex:     btnZIndex,
                    color :     opts.color || '#ccc',
                    cursor:     'default'
                }).appendTo($target.parent());

            $target.data(_coverBtnName + "ID",_btnNum);

            if(true === opts.setBtnLoad){
                _setBtnLoading(coverBtn);
            }
            return coverBtn;
        },  
        "enable" : function(target){
            var $target = $(target),
                btnNum = $target.data(_coverBtnName + "ID");

            if(!btnNum){
                return;
            }

            $('#' + _coverBtnName + btnNum).remove();
            $('#' + _loadingImgName + btnNum).remove();
            $(target).removeData(_coverBtnName + "ID");
        },
        "setDisabled":setDisabled,
        "setEnabled":setEnabled
    };
})();

module.exports = btn;
 
});
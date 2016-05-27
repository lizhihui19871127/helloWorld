define('wtgf:widget/fundSelector/fundSelector.js', function(require, exports, module){ var $ = require("common:widget/jquery/jquery.js"),
    juicer = require("common:widget/juicer/juicer.js"),
    util = require("common:widget/util/util.js"),
    gs = require("common:widget/gs/gs.js");

//为了同时在新旧框架下都能方便使用基金选择器，因此将整个基金选择器的dom结构使用模板引擎juicer生成
//而不使用velocity模板声明dom结构
//感觉可能会有万恶、顽固的小白IE6使用者，所以做了一些IE6的兼容方案，很恶心

var fundSelector = (function(){
    var _triggerTarget = null,
        _fundData = null,
        _selectCallBack = null,
        _beforeShow = null,
        _afterShow = null,
        _onHide = null,
        _delayBuild = null,
        _selectorDom = null,
        _selectorId = "",
        _fundTypeNameMap = {
            "newFund" : "新发基金",
            "curFund" : "货币型",
            "bondFund" : "债券型",
            "mixFund" : "混合型",
            "stockFund" : "股票型"
        },
        _isSearchShow = false,
        _searchResultContainer = $('<div class="fs-searchResult"></div>'),
        _searchBarWidth = 165,
        _cover = $('<div class="cover"></div>'),
        _templateStr = [
            "<div id='!{selectorId}' class='fs'>",
                "<table>",
                    "<tr><td colspan='4' class='fs-header'>",
                        "<div><h1>选择基金产品</h1>",
                        "<p><input type='text' class='fs-searcher' placeholder='输入基金代码/基金名称'/></p></div>", 
                    "</td></tr>",
                    "<% var index = 0,trFlag = 0;%>",
                    "{@if fundList.newFund && fundList.newFund.length > 0}",
                        "<% var trFlag=1;%>",
                    "{@/if}",
                    "{@each fundList as fundType,fundTypeName}",
                        "{@if fundType.length > 0}",
                        "{@if index % 2 == trFlag || fundTypeName == 'newFund'}<tr>{@/if}",
                        "<td class='fs-typeName'><span>!{fundTypeName|typeName2Cn}</span></td>",
                        "<td class='fs-typeList !{fundTypeName}'{@if fundTypeName=='newFund'} colspan='3'{@/if}>",
                            "<div class='typeList-wrapper'><ul>",
                            "{@each fundType as fundItem,i}",
                                "<li>",
                                    "<input type='hidden' name='fis-fundType' id='!{fundItem.fundcode}_type' value='!{fundItem.fundtype.enumItemValue}'/>",
                                    "<input type='radio' name='fs-fund' id='fsFund_!{fundTypeName}_!{i}' value='!{fundTypeName}_!{i}'/>&nbsp;",
                                    "<label for='fsFund_!{fundTypeName}_!{i}'>!{fundItem.fundname}{@if fundItem.isWallet=='1'}<b>（钱袋子账户）</b>{@/if}</label>",
                                "</li>",
                            "{@/each}",
                        "</ul></div>",
                        "{@if fundType.length > 6}",
                            "<p><a href='javascript:void(0)' class='more' data-typename='!{fundTypeName}'>更多产品</a></p>",
                        "{@/if}",
                        "</td>",
                        "{@if index % 2 != trFlag}</tr>{@/if}",
                        "<%index++;%>",
                        "{@/if}",
                    "{@/each}",
                    "{@if applyRank && applyRank.length > 0}",
                        "<tr><td colspan='4'>",
                            "<div class='rankList'>",
                                "<h1>申购排行榜<span>（注：最近5个交易日申购排行）</span></h1><ul>",
                                    "{@each applyRank as item,index}",
                                        "<%var i = parseInt(index) + 1;%>",
                                        "<li>",
                                            "<input type='radio' name='fs-fund' id='rankList_applyRank_!{i}' value='!{item.fundTypeName}_!{item.index}'>&nbsp;<label for='rankList_applyRank_!{i}'>!{item.fundname}</label><p class='rankList-rankNum rankNum_!{i}'>!{i}</p><div class='rankList-rankLine rankLine_!{i}'></div>", 
                                        "</li>",
                                    "{@/each}",
                                "</ul>",
                            "</div>",
                        "</td></tr>",
                    "{@/if}",
                    "{@if fixRank && fixRank.length > 0}",
                        "<tr><td colspan='4'>",
                            "<div class='rankList'>",
                                "<h1>定投排行榜<span>（最近五个交易日签约定投协议金额排行）</span></h1><ul>",
                                    "{@each fixRank as item,index}",
                                        "<%var i = parseInt(index) + 1;%>",
                                        "<li>",
                                            "<input type='radio' name='fs-fund' id='rankList_fixRank_!{i}' value='!{item.fundTypeName}_!{item.index}'>&nbsp;<label for='rankList_fixRank_!{i}'>!{item.fundname}</label><p class='rankList-rankNum rankNum_!{i}'>!{i}</p><div class='rankList-rankLine rankLine_!{i}'></div>", 
                                        "</li>",
                                    "{@/each}",
                                "</ul>",
                            "</div>",
                        "</td></tr>",
                    "{@/if}",
                "</table>",
            "</div>"
        ].join(""),
        _searchResultTpl = [
            "<ul>",
                "<% var length=resultList.length; %>",
                "{@each resultList as item,i}",
                    "<li{@if i == length - 1} class='noBorder'{@/if}>",
                        "<input type='radio' name='fs-fund' id='fsFund_!{item.fundTypeName}_!{item.index}' value='!{item.fundTypeName}_!{item.index}'/>&nbsp;",
                        "<label for='fsFund_!{item.fundTypeName}_!{item.index}'>!{item.fundname}</label>",
                    "</li>",
                "{@/each}",
            "</ul>"
        ].join("");

    //构建整个基金选择器
    var _buildSelector = function(){
        if(_selectorDom){
            return _selectorDom;
        }
        //初始化juicer自定义函数
        _initJuicerFun();

        //在编译模板之前，先将newFund类型的基金放到最上面，以便显示在第一个
        if(_fundData.fundList['newFund']){
            var tmp = { "newFund" : _fundData.fundList['newFund'] };
            delete _fundData.fundList['newFund'];
            $.extend(tmp,_fundData.fundList);
            _fundData.fundList = tmp;
        }

        var htmlStr = juicer(_templateStr,{
            selectorId : _selectorId,
            fundList : _fundData.fundList,
            applyRank : _fundData.applyRank,
            fixRank : _fundData.fixRank
        });

        _selectorDom = $(htmlStr);

        //bind the click event
        $(_selectorDom).click(_domClick); //把选择事件挂载在最外层，减少事件挂载
        $(_selectorDom).find("a.more").click(_expandFundType);
        $(_selectorDom).find("input.fs-searcher").click(_searcherFocus).blur(_searcherBlur).keyup(_search);
    };

    var _domClick = function(e){
        if($(e.target).attr('name') == 'fs-fund'){
            var fundInfo = $(e.target).val().split('_'),
                fundType = fundInfo[0],
                index = fundInfo[1];

            _selectFund(fundType,index);
        }
    };

    //基金选择事件
    var _selectFund = function(fundType,index){
        _hideSelector(function(){
            _selectCallBack && _selectCallBack(_fundData.fundList[fundType][index]); 
        });        
    };

    var _getFundInfo = function(word,totalMatch){
        var fundList = _fundData.fundList,
            searchResult = [],
            _match = (function(_totalMatch){
               if(_totalMatch){
                   return function(srcWord,searchWord){
                       return srcWord == searchWord;
                   };
               }else{
                   return function(srcWord,searchWord){
                       return srcWord.indexOf(searchWord) != -1;
                   };
               }
            })(totalMatch);


        for(var fundTypeName in fundList){
            //if(fundTypeName == 'newFund'){
             //   continue;
            //}   
            var fundTypeList = fundList[fundTypeName];
            for(var i = 0,len = fundTypeList.length; i < len; i ++){
                if(fundTypeList[i] && (_match(fundTypeList[i].fundname,word) || _match(fundTypeList[i].fundcode,word))){
                    searchResult.push({
                        fundTypeName : fundTypeName,
                        fundname : fundTypeList[i].fundname,
                        index : i 
                    }); 
                }   
            }   
        }
        return searchResult;
    };

    var _search = function(){
        var searchInput = $(_selectorDom).find("input.fs-searcher"),
            fundList = _fundData.fundList,
            searchResult = [],
            searchWord = searchInput.val();

        if(searchWord == "" || searchWord == "广" || searchWord == "广发"){
            if(_isSearchShow){
                _hideSearchResult();
            }
            return;
        }

        searchResult = _getFundInfo(searchWord);

        if(searchResult.length){
            var resultListStr = juicer(_searchResultTpl,{
                resultList : searchResult
            });
        }else{
            var resultListStr = "<p>--没有找到结果--</p>";
        }

        _searchResultContainer.html(resultListStr);

        if(!_isSearchShow){
            _showCover();
            _showSearchResult();
        }
    };

    var _showSearchResult = function(){
        var searchInput = $(_selectorDom).find("input.fs-searcher");

        var position = searchInput.parent().position();
        $(_searchResultContainer).css({
            opacity : 0,
            display : 'block',
            top : position.top + 35, 
            left : position.left + 1, //去掉一个像素是因为有边框
            width : searchInput.parent().outerWidth()
        }); 

        gs.TweenLite.to(_searchResultContainer,0.3,{
            autoAlpha : 1    
        }); 

        _isSearchShow = true;
    };

    var _hideSearchResult = function(){
        gs.TweenLite.to(_searchResultContainer,0.3,{
            autoAlpha : 0
        });
        _isSearchShow = false;
    };

    //搜索框点击事件
    var _searcherFocus = function(){
        var searchInput = $(_selectorDom).find("input.fs-searcher"),
            searcherContainer = searchInput.parent();

        //保存当前长度，以便blur事件中能够使用
        searchInput.data("oriWidth",searchInput.width());

        gs.TweenLite.to(searchInput,0.3,{
            width : _searchBarWidth,
            onComplete : function(){
                if(searchInput.val() != ""){
                    _search();        
                }
            }
        });
    };

    //搜索框失去焦点事件
    var _searcherBlur = function(){
        var searcherInput = $(_selectorDom).find("input.fs-searcher"),
            searcherContainer = searcherInput.parent();

        gs.TweenLite.to(searcherInput,0.3,{
            width : searcherInput.data("oriWidth")
        }); 

        _hideCover();
        _hideSearchResult();
    };

    //显示更多产品
    var _expandFundType = function(e){
        var target = e.target,
            fundTypeName = $(target).data('typename'),
            typeListTd = _selectorDom.find("td." + fundTypeName),
            typeListWrapper = typeListTd.find(".typeList-wrapper"),
            typeList = typeListWrapper.find("ul"),
            posTop = typeListWrapper.position()['top'],
            oriHeight = typeListWrapper.height() + posTop,
            listHeight = 0;


        //for ie6
        /*
        if('undefined' == typeof(document.body.style.maxHeight)){
            typeListTd.css("zIndex",2);
            typeListWrapper.css("width",typeListTd.outerWidth());
        }
        */
        //for ie6,ie7
        if(util.browser.msie){
            typeListTd.css("zIndex",2);
            typeListWrapper.css("width",typeListTd.outerWidth());
        }

        typeListWrapper.addClass("expand");

        typeList.css({
            paddingTop : posTop,
            paddingBottom : posTop
        });

        listHeight = typeList.outerHeight();

        //显示遮盖层
        _showCover(); 
        
        gs.TweenLite.to(typeListWrapper,0.3,{
            boxShadow : "0px 0px 7px #666",
            height : listHeight
        });

        $(_cover).one("click",function(e){
            _hideExpandFundType(fundTypeName,oriHeight);
            e.stopPropagation();
        });
        
        //取消事件的冒泡，避免上面那个one("click")事件被捕获并执行
        e.stopPropagation();
    };

    var _hideExpandFundType = function(fundTypeName,oriHeight){
        var typeListTd = _selectorDom.find("td." + fundTypeName),
            typeListWrapper = typeListTd.find(".typeList-wrapper"),
            typeList = typeListWrapper.find("ul");

        //for ie6
        /*
        if('undefined' == typeof(document.body.style.maxHeight)){
            typeListTd.css("zIndex","");
            typeListWrapper.css("width","100%");
        }
        */
        if(util.browser.msie){
            typeListTd.css("zIndex","");
            typeListWrapper.css("width","100%");
        }

        gs.TweenLite.to(typeListWrapper,0.3,{
            boxShadow : "0px 0px 0px #000",
            height : oriHeight,
            onComplete : function(){
                typeList.css({
                    paddingTop : 0,
                    paddingBottom : 0
                });
                typeListWrapper.removeClass("expand");
            }
        });

        _hideCover(); 
    };

    var _showCover = function(){
        //for ie8
        _selectorDom.get(0).style.filter = "";
        //for ie6
        _cover.css("height",_selectorDom.height());

        _selectorDom.append(_cover);
        
        gs.TweenLite.to(_cover.get(0),0.3,{
            css : {
                opacity : 0.7
            }
        });
    };

    var _hideCover = function(){
        gs.TweenLite.to(_cover,0.3,{
            opacity : 0,
            onComplete : function(){
                _cover.remove();
            }
        });
    };

    var _showSelector = function(e){
        if(_beforeShow){
            _beforeShow();
        }
        if(!_selectorDom){
            _buildSelector();
        }
        if(!$("#" + _selectorId).length){
            $("body").append($(_selectorDom));
        }

        var centerLeft = ($(window).width() - $(_selectorDom).width()) / 2 + $(window).scrollLeft(),
            centerTop = ($(window).height() - $(_selectorDom).height()) / 2 + $(window).scrollTop();

        $(_selectorDom).css({
            left : centerLeft,
            top : centerTop + 30
        });


        //初始化元素样式
        var searcher = $(_selectorDom).find("input.fs-searcher");
        $(_selectorDom).append(_searchResultContainer);

        gs.TweenLite.to($(_selectorDom).get(0),0.5,{
            css : {
                top : centerTop,
                autoAlpha : 1
            },
            ease : gs.easing.Quint.easeOut
        });

        $(document).click(_autoHideSelector);
        e.stopPropagation();
        if(_afterShow){
            _afterShow();
        }
    };

    var _hideSelector = function(callback){
        var centerTop = ($(window).height() - $(_selectorDom).height()) / 2,
            callback = callback ? callback : function(){};

        gs.TweenLite.to($(_selectorDom).get(0),0.3,{
            css : { 
                top : centerTop + 30,
                autoAlpha : 0,
            },  
            ease : gs.easing.Quint.easeOut,
            onComplete : function(){
                _onHide();
                callback();
            }
        });

        $(_cover).trigger("click");

        $(document).off("click",_autoHideSelector);
    };

    var _autoHideSelector = function(e){
        if(_selectorDom && _selectorDom.css("display") == 'block' && !$.contains(_selectorDom.get(0),e.target)){
            _hideSelector();
        }
    };

    var _initJuicerFun = function(){
        juicer.register('typeName2Cn',function(typeName){
            return _fundTypeNameMap[typeName];
        });
    };

    var _initRankData = function(){
        var applyRank = _fundData.applyRank || [],
            fixRank = _fundData.fixRank || [],
            _applyRank = [],
            _fixRank = [];

        for(var i = 0,len = applyRank.length; i < len; i ++){
            var matches = _getFundInfo(applyRank[i].fundcode,true);
            if(matches.length > 0){
                _applyRank.push(matches[0]); 
            }
        }

        _fundData.applyRank = _applyRank;

        for(var i = 0,len = fixRank.length; i < len; i  ++){
            var matches = _getFundInfo(fixRank[i].fundcode,true);
            if(matches.length > 0){
                _fixRank.push(matches[0]); 
            }
        }
        _fundData.fixRank = _fixRank;
    };

    /**
     * 基金选择器初始化入口
     * @param opts 初始化所需的变量
     * @example:
     * opts : {
     *      target : obj,   触发基金选择器的元素（一般为input）（必须）
     *      data : {
     *          fundList : [],  基金列表信息（必须）
     *          applyRank : [], 申购排行（可选）
     *          fixRank : []    定投排行（可选） 
     *      }
     *      callback : function(){},     用户选择基金后的回调函数（可选）
     *      delayBuild : boolean,        是否延迟构建dom结构（可选,默认false）
     *      selectorId : string          基金选择器的id（默认为fundSelector）
     * }
     */
    var _init = function(opts){
        if(!opts.target || !opts.data || !opts.data.fundList){
            return false;
        }

        //init param
        _triggerTarget = opts.target;
        _fundData = opts.data;
        _selectCallBack = opts.callback ? opts.callback : function(){};

        _beforeShow = opts.beforeShow ? opts.beforeShow : function(){};
        _afterShow = opts.afterShow ? opts.afterShow : function(){};
        _onHide = opts.onHide ? opts.onHide : function(){};

        _delayBuild = opts.delayBuild ? opts.delayBuild : false;
        _selectorId = opts.selectorId ? opts.selectorId : "fundSelector";
        //处理排行榜数据（由于后端提供的排行榜数据缺少必要的producttype，因此需要进行处理
        _initRankData();

        //init event
        $(_triggerTarget).click(_showSelector);
        

        //build the dom
        _delayBuild && _buildSelector();
    };

    return {
        init : _init
    };
})();

module.exports = fundSelector;
 
});
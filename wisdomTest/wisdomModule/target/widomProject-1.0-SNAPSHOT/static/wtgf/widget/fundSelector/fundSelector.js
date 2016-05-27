define('wtgf:widget/fundSelector/fundSelector.js', function(require, exports, module){ var $ = require("common:widget/jquery/jquery.js"),
    juicer = require("common:widget/juicer/juicer.js"),
    util = require("common:widget/util/util.js"),
    gs = require("common:widget/gs/gs.js");

//Ϊ��ͬʱ���¾ɿ���¶��ܷ���ʹ�û���ѡ��������˽���������ѡ������dom�ṹʹ��ģ������juicer����
//����ʹ��velocityģ������dom�ṹ
//�о����ܻ��������̵�С��IE6ʹ���ߣ���������һЩIE6�ļ��ݷ������ܶ���

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
            "newFund" : "�·�����",
            "curFund" : "������",
            "bondFund" : "ծȯ��",
            "mixFund" : "�����",
            "stockFund" : "��Ʊ��"
        },
        _isSearchShow = false,
        _searchResultContainer = $('<div class="fs-searchResult"></div>'),
        _searchBarWidth = 165,
        _cover = $('<div class="cover"></div>'),
        _templateStr = [
            "<div id='!{selectorId}' class='fs'>",
                "<table>",
                    "<tr><td colspan='4' class='fs-header'>",
                        "<div><h1>ѡ������Ʒ</h1>",
                        "<p><input type='text' class='fs-searcher' placeholder='����������/��������'/></p></div>", 
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
                                    "<label for='fsFund_!{fundTypeName}_!{i}'>!{fundItem.fundname}{@if fundItem.isWallet=='1'}<b>��Ǯ�����˻���</b>{@/if}</label>",
                                "</li>",
                            "{@/each}",
                        "</ul></div>",
                        "{@if fundType.length > 6}",
                            "<p><a href='javascript:void(0)' class='more' data-typename='!{fundTypeName}'>�����Ʒ</a></p>",
                        "{@/if}",
                        "</td>",
                        "{@if index % 2 != trFlag}</tr>{@/if}",
                        "<%index++;%>",
                        "{@/if}",
                    "{@/each}",
                    "{@if applyRank && applyRank.length > 0}",
                        "<tr><td colspan='4'>",
                            "<div class='rankList'>",
                                "<h1>�깺���а�<span>��ע�����5���������깺���У�</span></h1><ul>",
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
                                "<h1>��Ͷ���а�<span>��������������ǩԼ��ͶЭ�������У�</span></h1><ul>",
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

    //������������ѡ����
    var _buildSelector = function(){
        if(_selectorDom){
            return _selectorDom;
        }
        //��ʼ��juicer�Զ��庯��
        _initJuicerFun();

        //�ڱ���ģ��֮ǰ���Ƚ�newFund���͵Ļ���ŵ������棬�Ա���ʾ�ڵ�һ��
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
        $(_selectorDom).click(_domClick); //��ѡ���¼�����������㣬�����¼�����
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

    //����ѡ���¼�
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

        if(searchWord == "" || searchWord == "��" || searchWord == "�㷢"){
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
            var resultListStr = "<p>--û���ҵ����--</p>";
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
            left : position.left + 1, //ȥ��һ����������Ϊ�б߿�
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

    //���������¼�
    var _searcherFocus = function(){
        var searchInput = $(_selectorDom).find("input.fs-searcher"),
            searcherContainer = searchInput.parent();

        //���浱ǰ���ȣ��Ա�blur�¼����ܹ�ʹ��
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

    //������ʧȥ�����¼�
    var _searcherBlur = function(){
        var searcherInput = $(_selectorDom).find("input.fs-searcher"),
            searcherContainer = searcherInput.parent();

        gs.TweenLite.to(searcherInput,0.3,{
            width : searcherInput.data("oriWidth")
        }); 

        _hideCover();
        _hideSearchResult();
    };

    //��ʾ�����Ʒ
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

        //��ʾ�ڸǲ�
        _showCover(); 
        
        gs.TweenLite.to(typeListWrapper,0.3,{
            boxShadow : "0px 0px 7px #666",
            height : listHeight
        });

        $(_cover).one("click",function(e){
            _hideExpandFundType(fundTypeName,oriHeight);
            e.stopPropagation();
        });
        
        //ȡ���¼���ð�ݣ����������Ǹ�one("click")�¼�������ִ��
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


        //��ʼ��Ԫ����ʽ
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
     * ����ѡ������ʼ�����
     * @param opts ��ʼ������ı���
     * @example:
     * opts : {
     *      target : obj,   ��������ѡ������Ԫ�أ�һ��Ϊinput�������룩
     *      data : {
     *          fundList : [],  �����б���Ϣ�����룩
     *          applyRank : [], �깺���У���ѡ��
     *          fixRank : []    ��Ͷ���У���ѡ�� 
     *      }
     *      callback : function(){},     �û�ѡ������Ļص���������ѡ��
     *      delayBuild : boolean,        �Ƿ��ӳٹ���dom�ṹ����ѡ,Ĭ��false��
     *      selectorId : string          ����ѡ������id��Ĭ��ΪfundSelector��
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
        //�������а����ݣ����ں���ṩ�����а�����ȱ�ٱ�Ҫ��producttype�������Ҫ���д���
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
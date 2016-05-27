define('common:widget/jquery/jquery-autoCitys-plugin-v1.js', function(require, exports, module){ 
(function($){
	var AutoCitys = {};
	var options = {};

	$.extend(AutoCitys , {
		init : function(){

			options.divMain = $('<div/>').addClass('city-con').hide().appendTo('body');
			options.closeBar = $('<b/>').addClass('close');
			options.dragBar = $('<h3/>').append('«Î—°‘Ò≥« –').append('<b class="bl"></b><b class="br"></b>').append(options.closeBar);
			options.divMain.append(options.dragBar);
			options.divHtml = '<div class="city-one"></div>';

		},
		doSelect : function(){

			AutoCitys.getProvinceHtml();

			options.divMain.dialog({
				dragBar : options.dragBar,
				closeButton : options.closeBar,
				closeCallBack : function(){
					if(options.divProvince)options.divProvince.remove();
					if(options.divCity)options.divCity.remove();
					if(options.divDistrict)options.divDistrict.remove();
					options.provinceId = null;
					options.cityId = null;
					options.districtId = null;
				}
			});
		},
		getProvinceHtml : function(){
			var ol = $('<ol/>');
			var _sort = {};
			for(var o in options.province){
				var ul = $('<ul/>');
				for(var oo in options.province[o]){
					var p = options.province[o][oo];
					var li = $('<li/>').addClass('ul-li').append('<span title="'+p.name+'">'+p.name+'</span>').data('map',p).appendTo(ul);
					//var _label = $('<label/>').append('<span>'+p.name+'</span>').data('map',p)
					//$('<label/>').addClass('clickLi').append('<span>'+p.name+'</span>').data('map',p).appendTo(li);
					li.click(function(){
						var _data = $(this).data('map');
						options.curProvince = _data;
						AutoCitys.getCityHtml(_data.id);
					}).hover(function(){$(this).css({'background-color':'#f9d2bb'})},function(){$(this).css({'background-color':'#fff'})});
				}
				_sort[o] = ul;
			}
			for(var o in options.cityConfig){
				if(!_sort[o]){
					continue;
				}
				var li = $('<li/>').addClass('ol-li').appendTo(ol);
				$('<label/>').addClass('title').append(options.cityConfig[o]).appendTo(li);
				li.append(_sort[o]);
			}
			options.divProvince = $(options.divHtml).append(ol).appendTo(options.divMain);
		},
		getCityHtml : function(id){
			if(options.provinceId==id)return;
			options.provinceId = id;
			options.cityId = null;
			options.districtId = null
			if(options.divCity)options.divCity.remove();
			if(options.divDistrict)options.divDistrict.remove();
			if(options.city[id] && options.city[id].length>0){
				var ul = $('<ul/>');
				for(var o in options.city[id]){
					var c = options.city[id][o];
					//var _input = $('<input id="J_c_'+c.id+'" type="radio" value="'+c.id+'" name="J_city">').data('map',c);
					var li = $('<li/>').addClass('ul-li').append('<span title="'+c.name+'">'+c.name+'</span>').data('map',c).appendTo(ul);
					//$('<label for="J_c_'+c.id+'"></label>').append(_input).append('<span>'+c.name+'</span>').appendTo(li);
					li.click(function(){
						var _data = $(this).data('map');
						options.curCity = _data;
						AutoCitys.getDistrictHtml(_data.id);
					}).hover(function(){$(this).css({'background-color':'#f9d2bb'})},function(){$(this).css({'background-color':'#fff'})})
				}
				options.divProvince.remove();
				options.divCity = $(options.divHtml).append(ul).appendTo(options.divMain);
			}else{
				AutoCitys.initResult();
			}
		},
		getDistrictHtml : function(id){
			if(options.districtId==id)return;
			options.cityId = id;
			options.districtId = null;
			if(options.divDistrict)options.divDistrict.remove();
			if(options.district[id] && options.district[id].length>0){
				var ul = $('<ul/>');
				for(var o in options.district[id]){
					var d = options.district[id][o];
					//var _input = $('<input id="J_d_'+d.id+'" type="radio" value="'+d.id+'" name="J_district">').data('map',d);
					var li = $('<li/>').addClass('ul-li').append('<span title="'+d.name+'">'+d.name+'</span>').data('map',d).appendTo(ul);
					//$('<label for="J_d_'+d.id+'"></label>').append(_input).append('<span>'+d.name+'</span>').appendTo(li);
					li.click(function(){
						var _data = $(this).data('map');
						options.districtId = _data.id;
						options.curDistrict = _data;
						AutoCitys.initResult();
					}).hover(function(){$(this).css({'background-color':'#f9d2bb'})},function(){$(this).css({'background-color':'#fff'})})
				}
				options.divCity.remove();
				options.divDistrict = $(options.divHtml).append(ul).appendTo(options.divMain);
			}else{
				AutoCitys.initResult();
			}
		},
		initResult : function(){
			var _data = {};
			$.extend(_data,
				{
					province : options.provinceId ? options.curProvince : null,
					city : options.cityId ? options.curCity : null,
					district : options.districtId ? options.curDistrict : null
				});
			if(options.divProvince)options.divProvince.remove();
			if(options.divCity)options.divCity.remove();
			if(options.divDistrict)options.divDistrict.remove();
			options.provinceId = null;
			options.cityId = null;
			options.districtId = null;
			options.divMain.cancelDialog();
			options.callback(_data);
		}
	})
	$.extend($.fn,{
		selectCitys : function(setting){

			var opt = $.extend({
				url : null,
				callback : null
				},setting);
			var _this = $(this);

            if(!opt.data){
                return false;
            }

           // var data = eval('('+opt.data+')');

			//var data = opt.data;
            $.extend(options,{
				cityConfig : opt.cityConfig ? opt.cityConfig : {},
				province : opt.province ? opt.province : {},
                city : opt.data.city ? opt.data.city : {},
                district : opt.data.district ? opt.data.district : {},
                callback : opt.callback ? opt.callback : function(){}
            });

            AutoCitys.init();
            _this.focus(function(){

                AutoCitys.doSelect();
            });
		}
	})
})(jQuery) 
});
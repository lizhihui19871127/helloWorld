$(function(){
	$(".dcfa_msg tr.can_choose td:not('.last_td')").click(function(event) {
		$(this).parent().addClass('selected').siblings('tr').removeClass('selected');
	});
	$(".bottom_btn span.del").click(function(event) {
		$(".account-main .dc_msg tr.selected").remove();
	});
	/*调仓新增  下拉选择*/
	$(".dc_new_add .jijin dt").click(function(event) {
		$(this).siblings('dd').slideToggle();
		$(this).toggleClass('up');
	});
	/*被选的调仓方案*/
	$(".dc_new_add .add .jijin dd").click(function(event) {
		$(this).toggleClass('chose');
	});
	/*右上角关闭弹出*/
	$(".pop_main .js-pop-close").click(function(event) {
		$(this).parents(".undisplay").fadeOut();
	});
	/*关闭调仓新增*/
	$(".dc_new_add .pop_main .bottom_btn .cancel").click(function(event) {
		$(this).parents(".undisplay").fadeOut();
	});
	$(".dc_new_add .pop_main .bottom_btn .keep").click(function(event) {
		$(this).parents(".undisplay").fadeOut();
	});
	/*生成指令弹出*/
	$(".sc_zhiling").click(function(event) {
		$(".create_instruction").fadeIn();
	});
	$(".dc_detail_content .zhiling").click(function(event) {
		$(this).parents('.dc_detail').fadeOut('fast', function() {
			$(".create_instruction").fadeIn(200);
		});
	});
	/*删除所选调仓方案*/
	$(".account-cz-main .bottom_btn.click .del").click(function(event) {
		$(".dcfa_msg table tr.selected").remove();
	});
	/*弹出调仓明细*/
	$(".account-cz-main .bottom_btn.click .xiugai").click(function(event) {
		$(".dc_detail").fadeIn();
	});
	$(".account-cz-main .bottom_btn.click .new_add").click(function(event) {
		$(".dc_detail").fadeIn();
	});
	$(".tiaocangmx").click(function(event) {
		$(".dc_detail").fadeIn();
	});
	/*关闭调仓明细，打开调仓新增*/
	$(".dc_detail .dc_detail_content .new_add").click(function(event) {
		$(".dc_detail").fadeOut('fast', function() {
			$(".dc_new_add").fadeIn("200");
		});
	});
	$(".dc_detail .bottom_btn .close").click(function(event) {
		$(".dc_detail").fadeOut();
	});
});



// 基金选择下拉框
function foundsSelectFun(inputObj){
	var $containerPay = inputObj.parent(),
		// foundsSelectCreatFun方法写在html页面中，避免乱码
		boxHtml = foundsSelectCreatFun();

	$containerPay.append(boxHtml);

	// 判断选择基金是输入内容还是点击展开
	var isFoundsChoose = false;

	// 基金选择下拉列表-输入框获取焦点
	$containerPay.on('focus', 'input', function(){
		var boxClass = isFoundsChoose ? '.founds-search-btn' : '.founds-search-in';

		$(this).parent().find(boxClass).show().siblings('.founds-search-box').hide();
	})

	// 基金选择下拉列表-输入框失去焦点
	$containerPay.on('blur', 'input', function(){
		var $this = $(this);

		setTimeout(function(){
			isFoundsChoose = false;
			$this.parent().find('.btn-open-founds').removeClass('btn-close-founds');
			$this.parent().find('.founds-search-box').hide();
		},200);
	});

	// 基金选择下拉列表-输入框正在输入
	$containerPay.on('input propertychange', 'input', function(){
		isFoundsChoose = false;
		$(this).parent().find('.btn-open-founds').removeClass('btn-close-founds');
		$(this).parent().find('.founds-search-in').show().siblings('.founds-search-box').hide();

		// console.log($(this).val());
	});


	// 基金选择下拉列表-点击展开按钮
	$containerPay.on('click', '.btn-open-founds', function(){
		if(isFoundsChoose){
			isFoundsChoose = false;
			$(this).parent().find('.founds-search-btn').hide();
		}else{
			isFoundsChoose = true;

			$(this).addClass('btn-close-founds').parent().find('input').focus();
		}

		return false;
	});

	// 基金选择下拉列表-类型切换
	$containerPay.on('mouseenter', '.founds-search-nav a', function(){
		var Idx = $(this).index();

		$(this).addClass('active').siblings().removeClass('active');

		$(this).parents('.founds-search-box').find('.founds-search-list ul').eq(Idx).addClass('active').siblings().removeClass('active');

		return false;
	});

	// 基金选择下拉列表-选中基金
	$containerPay.on('click', '.founds-search-box li', function(){
		var txt = $.trim($(this).find('.code').text()) + ' ' + $.trim($(this).find('.name').text());

		console.log(txt);
		$(this).parents('.in-founds-choose').find('input').val(txt);

		return false;
	});	
}
$(function(){
	$(".dcfa_msg tr.can_choose td:not('.last_td')").click(function(event) {
		$(this).parent().addClass('selected').siblings('tr').removeClass('selected');
	});
	$(".bottom_btn span.del").click(function(event) {
		$(".account-main .dc_msg tr.selected").remove();
	});
	/*��������  ����ѡ��*/
	$(".dc_new_add .jijin dt").click(function(event) {
		$(this).siblings('dd').slideToggle();
		$(this).toggleClass('up');
	});
	/*��ѡ�ĵ��ַ���*/
	$(".dc_new_add .add .jijin dd").click(function(event) {
		$(this).toggleClass('chose');
	});
	/*���Ͻǹرյ���*/
	$(".pop_main .js-pop-close").click(function(event) {
		$(this).parents(".undisplay").fadeOut();
	});
	/*�رյ�������*/
	$(".dc_new_add .pop_main .bottom_btn .cancel").click(function(event) {
		$(this).parents(".undisplay").fadeOut();
	});
	$(".dc_new_add .pop_main .bottom_btn .keep").click(function(event) {
		$(this).parents(".undisplay").fadeOut();
	});
	/*����ָ���*/
	$(".sc_zhiling").click(function(event) {
		$(".create_instruction").fadeIn();
	});
	$(".dc_detail_content .zhiling").click(function(event) {
		$(this).parents('.dc_detail').fadeOut('fast', function() {
			$(".create_instruction").fadeIn(200);
		});
	});
	/*ɾ����ѡ���ַ���*/
	$(".account-cz-main .bottom_btn.click .del").click(function(event) {
		$(".dcfa_msg table tr.selected").remove();
	});
	/*����������ϸ*/
	$(".account-cz-main .bottom_btn.click .xiugai").click(function(event) {
		$(".dc_detail").fadeIn();
	});
	$(".account-cz-main .bottom_btn.click .new_add").click(function(event) {
		$(".dc_detail").fadeIn();
	});
	$(".tiaocangmx").click(function(event) {
		$(".dc_detail").fadeIn();
	});
	/*�رյ�����ϸ���򿪵�������*/
	$(".dc_detail .dc_detail_content .new_add").click(function(event) {
		$(".dc_detail").fadeOut('fast', function() {
			$(".dc_new_add").fadeIn("200");
		});
	});
	$(".dc_detail .bottom_btn .close").click(function(event) {
		$(".dc_detail").fadeOut();
	});
});



// ����ѡ��������
function foundsSelectFun(inputObj){
	var $containerPay = inputObj.parent(),
		// foundsSelectCreatFun����д��htmlҳ���У���������
		boxHtml = foundsSelectCreatFun();

	$containerPay.append(boxHtml);

	// �ж�ѡ��������������ݻ��ǵ��չ��
	var isFoundsChoose = false;

	// ����ѡ�������б�-������ȡ����
	$containerPay.on('focus', 'input', function(){
		var boxClass = isFoundsChoose ? '.founds-search-btn' : '.founds-search-in';

		$(this).parent().find(boxClass).show().siblings('.founds-search-box').hide();
	})

	// ����ѡ�������б�-�����ʧȥ����
	$containerPay.on('blur', 'input', function(){
		var $this = $(this);

		setTimeout(function(){
			isFoundsChoose = false;
			$this.parent().find('.btn-open-founds').removeClass('btn-close-founds');
			$this.parent().find('.founds-search-box').hide();
		},200);
	});

	// ����ѡ�������б�-�������������
	$containerPay.on('input propertychange', 'input', function(){
		isFoundsChoose = false;
		$(this).parent().find('.btn-open-founds').removeClass('btn-close-founds');
		$(this).parent().find('.founds-search-in').show().siblings('.founds-search-box').hide();

		// console.log($(this).val());
	});


	// ����ѡ�������б�-���չ����ť
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

	// ����ѡ�������б�-�����л�
	$containerPay.on('mouseenter', '.founds-search-nav a', function(){
		var Idx = $(this).index();

		$(this).addClass('active').siblings().removeClass('active');

		$(this).parents('.founds-search-box').find('.founds-search-list ul').eq(Idx).addClass('active').siblings().removeClass('active');

		return false;
	});

	// ����ѡ�������б�-ѡ�л���
	$containerPay.on('click', '.founds-search-box li', function(){
		var txt = $.trim($(this).find('.code').text()) + ' ' + $.trim($(this).find('.name').text());

		console.log(txt);
		$(this).parents('.in-founds-choose').find('input').val(txt);

		return false;
	});	
}
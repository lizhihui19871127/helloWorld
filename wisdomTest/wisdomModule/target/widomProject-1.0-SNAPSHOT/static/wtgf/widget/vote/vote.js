define('wtgf:widget/vote/vote.js', function(require, exports, module){ // 20131213 Ǯ��������

$(function(){
	$(window).load(function(){
		//Ǯ���� - �ſ��߶�
		$("#tabsltpanel li").click(function(){
			$('#main_container').height($('#q_table').height() + $('.q_num').height());
		});
		
		$('#showmask .q_showpclose').click(function(){
			$('#showmask').hide();
		});
		
		//������ʾ
		$('.iknow').click(function(){
			$('.q_tpage_notice').fadeOut();
		});
	});
	
	//�������߱仯
//	$(window).on('resize',function() {
//		q_mask_load();
//	});

});

//Ǯ���������������ʼ��
window.q_mask_load = function() {
	var wH = window.innerHeight ? window.innerHeight : $(window).height(),
	wW = window.innerWidth ? window.innerWidth : $(window).width(),
	$q_mask = $('#q_mask'),
	$q_cont = $q_mask.find('.q_cont');

	//��ʾ��������
	$q_mask.fadeIn();

	//��͸������
	$q_mask.find('.q_bg').width(wW).height(wH).css({ opacity: 0.5 });


	//������λ�þ�����ʾ
	$q_cont.css({ top: (wH - $q_cont.height())/2 });
	$q_cont.css({ left: (wW - $q_cont.width())/2 });

};

window.q_mask_close = function(){
	$('#q_mask').fadeOut();
};

window.upgradeToNewWallet = function(){
	if(!confirm("�װ����û���Ǯ����������ݶ�T+1�ղ��ܽ��п�����ء��깺����Ȳ������������������ʽ��������������ʱ�䡣��ȷ��������")){
		return;
	} else {
		$("#upgradeBtn").attr("disabled", true);
		WalletProcessDwrUtil.upgradeToNewWallet(function(msg){
			if (msg != null && msg == "success"){
				alert("��ϲ���ѳɹ�������Ǯ���ӣ�");
				document.location.reload();
				
			} else {
				q_mask_close();
				alert(msg);
			}
			$("#upgradeBtn").attr("disabled", false);
		});
	}
}
// 20131213 Ǯ��������

$(function(){
	$(window).load(function(){
		//Ǯ���� - �ſ��߶�
		$("#tabsltpanel li").click(function(){
			$('#main_container').height($('#q_table').height() + $('.q_num').height());
		});
		
		$('#showmask .q_showpclose').click(function(){
			$('#showmask').hide();
		});
		
		//������ʾ
		$('.iknow').click(function(){
			$('.q_tpage_notice').fadeOut();
		});
	});
	
	//�������߱仯
//	$(window).on('resize',function() {
//		q_mask_load();
//	});

});

$("#tjinfo").click(function() {
    $("#tjinfo").css("disabled","disabled");
	var t = $("#voteType").val(),
	e = $('input:radio[name="voteResult"]:checked').val(),
	i = $("#mobile").val();
	if (null == i || "" == i) return void alert("����д�ֻ����룡");
	if (11 != i.length) return void alert("�ֻ�����λ������,���������롣");
	var n = $("#dateType").val();
	$.ajax({
		type: "post",
		data: {
			voteType: t,
			voteResult: e,
			mobile: i,
			dateType: n
		},
		url: "/main/vote/vote",
		success: function(data) {
            if(data.isSuccess){
                alert("�𾴵Ŀͻ������ѳɹ��ύ����л���Ĳ��룡"),
                $("#q_mask").fadeOut();
            }else{
                alert("�Բ������緱æ�����Ժ���ͶƱ��"),
                $("#q_mask").fadeOut();
            }
		}
	})
});

//Ǯ���������������ʼ��
window.q_mask_load = function() {
	var wH = window.innerHeight ? window.innerHeight : $(window).height(),
	wW = window.innerWidth ? window.innerWidth : $(window).width(),
	$q_mask = $('#q_mask'),
	$q_cont = $q_mask.find('.q_cont');

	//��ʾ��������
	$q_mask.fadeIn();

	//��͸������
	$q_mask.find('.q_bg').width(wW).height(wH).css({ opacity: 0.5 });


	//������λ�þ�����ʾ
	$q_cont.css({ top: (wH - $q_cont.height())/2 });
	$q_cont.css({ left: (wW - $q_cont.width())/2 });

};

window.q_mask_close = function(){
	$('#q_mask').fadeOut();
};

window.upgradeToNewWallet = function(){
	if(!confirm("�װ����û���Ǯ����������ݶ�T+1�ղ��ܽ��п�����ء��깺����Ȳ������������������ʽ��������������ʱ�䡣��ȷ��������")){
		return;
	} else {
		$("#upgradeBtn").attr("disabled", true);
		WalletProcessDwrUtil.upgradeToNewWallet(function(msg){
			if (msg != null && msg == "success"){
				alert("��ϲ���ѳɹ�������Ǯ���ӣ�");
				document.location.reload();
				
			} else {
				q_mask_close();
				alert(msg);
			}
			$("#upgradeBtn").attr("disabled", false);
		});
	}
}
 
});
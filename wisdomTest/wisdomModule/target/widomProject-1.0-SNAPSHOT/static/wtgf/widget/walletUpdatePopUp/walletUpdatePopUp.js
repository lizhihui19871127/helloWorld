define('wtgf:widget/walletUpdatePopUp/walletUpdatePopUp.js', function(require, exports, module){ // 20131213 钱袋子升级

$(function(){
	$(window).load(function(){
		//钱袋子 - 撑开高度
		$("#tabsltpanel li").click(function(){
			$('#main_container').height($('#q_table').height() + $('.q_num').height());
		});
		
		$('#showmask .q_showpclose').click(function(){
			$('#showmask').hide();
		});
		
		//收起提示
		$('.iknow').click(function(){
			$('.q_tpage_notice').fadeOut();
		});
	});
	
	//浏览器宽高变化
//	$(window).on('resize',function() {
//		q_mask_load();
//	});

});

//钱袋子升级弹出框初始化
window.q_mask_load = function() {
	var wH = window.innerHeight ? window.innerHeight : $(window).height(),
	wW = window.innerWidth ? window.innerWidth : $(window).width(),
	$q_mask = $('#q_mask'),
	$q_cont = $q_mask.find('.q_cont');

	//显示弹出内容
	$q_mask.fadeIn();

	//半透明背景
	$q_mask.find('.q_bg').width(wW).height(wH).css({ opacity: 0.5 });


	//弹出框位置居中显示
	$q_cont.css({ top: (wH - $q_cont.height())/2 });
	$q_cont.css({ left: (wW - $q_cont.width())/2 });

};

window.q_mask_close = function(){
	$('#q_mask').fadeOut();
};

window.upgradeToNewWallet = function(){
	if(!confirm("亲爱的用户，钱袋子升级后份额T+1日才能进行快速赎回、申购基金等操作，请您根据自身资金需求合理安排升级时间。您确认升级吗？")){
		return;
	} else {
		$("#upgradeBtn").attr("disabled", true);
		WalletProcessDwrUtil.upgradeToNewWallet(function(msg){
			if (msg != null && msg == "success"){
				alert("恭喜你已成功升级新钱袋子！");
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
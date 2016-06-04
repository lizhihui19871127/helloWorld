package webmvct.common;

public class Test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		//没有参数
//		String message = Test.getMessageShow("该用户暂未登录。",null);
		//只有一个参数
//		String[] paras = {"李智慧"};
//		String message = Test.getMessageShow("该用户{0}暂未登录。",paras);
		//有两个参数
//		String[] paras = {"李智慧","sucess!!!!!"};
//		String message = Test.getMessageShow("该用户{0}暂未登录，测试数据为:{1}。",paras);
		//多个参数
//		String[] paras = {"登录测试","李智慧","sucess!!!!!"};
//		String message = Test.getMessageShow("{0}-该用户{1}暂未登录，测试数据为:{2}。",paras);
		//可重复多个测试数据
		String[] paras = {"登录测试","李智慧","sucess!!!!!"};
		String message = Test.getMessageShow("{0}{1}-该用户{1}暂未登录，测试{1}数据为:{2}。",paras);
		System.out.println(message);
	}
	
	/**
	 * 对配置文件，错误展示信息，进行参数填充。
	 * @param message
	 * @param paras
	 * @return
	 */
	public static String getMessageShow(String message,String[] paras){
		if(paras != null && paras.length > 0){
			for(int i = 0;i < paras.length;i ++){
				message = message.replaceAll("\\{"+i+"\\}", paras[i]);
			}
		}
		return message;
	}

}

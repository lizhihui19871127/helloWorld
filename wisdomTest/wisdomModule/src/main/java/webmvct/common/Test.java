package webmvct.common;

public class Test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		//û�в���
//		String message = Test.getMessageShow("���û���δ��¼��",null);
		//ֻ��һ������
//		String[] paras = {"���ǻ�"};
//		String message = Test.getMessageShow("���û�{0}��δ��¼��",paras);
		//����������
//		String[] paras = {"���ǻ�","sucess!!!!!"};
//		String message = Test.getMessageShow("���û�{0}��δ��¼����������Ϊ:{1}��",paras);
		//�������
//		String[] paras = {"��¼����","���ǻ�","sucess!!!!!"};
//		String message = Test.getMessageShow("{0}-���û�{1}��δ��¼����������Ϊ:{2}��",paras);
		//���ظ������������
		String[] paras = {"��¼����","���ǻ�","sucess!!!!!"};
		String message = Test.getMessageShow("{0}{1}-���û�{1}��δ��¼������{1}����Ϊ:{2}��",paras);
		System.out.println(message);
	}
	
	/**
	 * �������ļ�������չʾ��Ϣ�����в�����䡣
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

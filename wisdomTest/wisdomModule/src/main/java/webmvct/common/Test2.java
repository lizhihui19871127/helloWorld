package webmvct.common;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * 根据关键字，读取配置文件，获取配置文件对应参数的值。
 * @author Administrator
 *
 */
public class Test2 {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String value = getPropertiesBean().getProperty("testKey");
		System.out.println(value);
		String value2 = getPropertiesBean().getProperty("testKey2");
		System.out.println(value2);
	}
	
	public static Properties properties;
	
	public static synchronized Properties getPropertiesBean(){
		if(properties == null){
			String filePath = "/demo.properties";
			InputStream inputStream = Test2.class.getResourceAsStream(filePath);
			try {
				properties = new Properties();
				properties.load(inputStream);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return properties;
	}
}

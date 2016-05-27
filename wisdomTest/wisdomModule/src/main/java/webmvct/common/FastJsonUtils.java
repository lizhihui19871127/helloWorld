package webmvct.common;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.Map;

/**
 * Created by zhouq on 2014/8/29.
 */
public class FastJsonUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(FastJsonUtils.class);

    public static String parseJsonFile(String FileName)
    {
        FileInputStream file=null;
        String ret="";
        try {
            file = new FileInputStream(FileName);
            ret = ConvertStream2JsonStr(file);
        } catch (FileNotFoundException e) {
            LOGGER.error(e.getMessage(),e);
            ret="";
        }finally {
            if(file!=null){
                try {
                    file.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return ret;
    }

    /**
     * ������ȡjson �ַ���
     * @param inputStream
     * @return ��ȡ�쳣����""
     */
    public static String ConvertStream2JsonStr(InputStream inputStream)
    {
        String jsonStr = "";
        // ByteArrayOutputStream�൱���ڴ������
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int len = 0;
        // ��������ת�Ƶ��ڴ��������
        try
        {
            while ((len = inputStream.read(buffer, 0, buffer.length)) != -1)
            {
                out.write(buffer, 0, len);
            }
            // ���ڴ���ת��Ϊ�ַ���
            jsonStr = new String(out.toByteArray());
        }
        catch (IOException e)
        {
            LOGGER.error(e.getMessage(),e);
            jsonStr="";
        }finally {
            if(out!=null){
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return jsonStr;
    }


    /**
     * ����jsonString
     * @param jsonString
     * @return
     */
    public static Map<String, String> parseMap(String jsonString)
    {
        //����json�ַ���
        Map<String,String> map = JSON.parseObject(jsonString,
                new TypeReference<Map<String, String>>() {
                });
       return map;
    }

}

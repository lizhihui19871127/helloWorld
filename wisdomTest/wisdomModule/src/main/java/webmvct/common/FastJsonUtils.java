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
     * 从流读取json 字符串
     * @param inputStream
     * @return 读取异常返回""
     */
    public static String ConvertStream2JsonStr(InputStream inputStream)
    {
        String jsonStr = "";
        // ByteArrayOutputStream相当于内存输出流
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int len = 0;
        // 将输入流转移到内存输出流中
        try
        {
            while ((len = inputStream.read(buffer, 0, buffer.length)) != -1)
            {
                out.write(buffer, 0, len);
            }
            // 将内存流转换为字符串
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
     * 解析jsonString
     * @param jsonString
     * @return
     */
    public static Map<String, String> parseMap(String jsonString)
    {
        //解析json字符串
        Map<String,String> map = JSON.parseObject(jsonString,
                new TypeReference<Map<String, String>>() {
                });
       return map;
    }

}
